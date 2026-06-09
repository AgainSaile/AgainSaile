import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export const usePointsStore = defineStore('points', () => {
  // 状态
  const children = ref<any[]>([])
  const transactions = ref<any[]>([])
  const rewards = ref<any[]>([])
  const approvals = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const totalPoints = computed(() => {
    return children.value.reduce((sum, child) => sum + (child.points || 0), 0)
  })
  
  const pendingApprovals = computed(() => {
    return approvals.value.filter(a => a.status === 'pending').length
  })
  
  const pendingApprovalsList = computed(() => approvals.value.filter(a => a.status === 'pending'))
  
  const processedApprovals = computed(() => approvals.value.filter(a => a.status !== 'pending'))

  // ====== 数据加载 ======
  
  async function fetchChildren() {
    try {
      const { data, error: err } = await supabase.from('children').select('*').order('created_at', { ascending: true })
      if (err) throw err
      children.value = data || []
    } catch (e: any) {
      console.error('加载孩子数据失败:', e.message)
    }
  }

  async function fetchRewards() {
    try {
      const { data, error: err } = await supabase.from('rewards').select('*').order('created_at', { ascending: true })
      if (err) throw err
      rewards.value = data || []
    } catch (e: any) {
      console.error('加载奖励数据失败:', e.message)
    }
  }

  async function fetchTransactions(childId?: string | number) {
    try {
      let query = supabase.from('transactions').select('*').order('created_at', { ascending: false })
      if (childId) {
        query = query.eq('child_id', childId)
      }
      const { data, error: err } = await query.limit(20)
      if (err) throw err
      transactions.value = data || []
    } catch (e: any) {
      console.error('加载记录失败:', e.message)
    }
  }

  async function fetchApprovals() {
    try {
      const { data, error: err } = await supabase.from('approvals').select('*').order('created_at', { ascending: false })
      if (err) throw err
      approvals.value = data || []
    } catch (e: any) {
      console.error('加载审批数据失败:', e.message)
    }
  }

  async function loadAllData() {
    loading.value = true
    error.value = null
    try {
      await Promise.all([fetchChildren(), fetchRewards(), fetchTransactions(), fetchApprovals()])
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // ====== 积分操作 ======

  async function addTransaction(data: { childId: string; category: string; points: number; type: string; note?: string; isImportant?: boolean }) {
    try {
      // 插入记录
      const { data: tx, error: txErr } = await supabase.from('transactions').insert({
        child_id: data.childId,
        category: data.category,
        points: data.points,
        type: data.type,
        note: data.note || '',
        is_important: data.isImportant || false
      }).select().single()
      
      if (txErr) throw txErr

      // 更新孩子积分
      const child = children.value.find(c => c.id === data.childId)
      if (child) {
        const newPoints = child.points + data.points
        const { error: updateErr } = await supabase.from('children')
          .update({ points: newPoints })
          .eq('id', data.childId)
        
        if (updateErr) throw updateErr
        
        // 更新本地状态
        child.points = newPoints
        if (data.points > 0) child.week_earned = (child.week_earned || 0) + data.points
        else child.week_used = (child.week_used || 0) + Math.abs(data.points)
      }

      // 添加到本地列表
      transactions.value.unshift(tx)

      // 重要变动自动加入审批队列
      if (data.isImportant) {
        await supabase.from('approvals').insert({
          child_id: data.childId,
          category: data.category,
          points: Math.abs(data.points),
          type: data.type,
          status: 'pending',
          submitted_by: '当前用户',
          confirmations: 1,
          note: data.note || ''
        })
        await fetchApprovals() // 刷新审批列表
      }

      return true
    } catch (e: any) {
      console.error('添加积分记录失败:', e.message)
      error.value = e.message
      return false
    }
  }

  // 兑换奖励
  async function exchangeReward(childId: string, _rewardId: string, cost: number, rewardName: string) {
    try {
      const child = children.value.find(c => c.id === childId)
      if (!child || child.points < cost) return false

      // 插入兑换记录
      await supabase.from('transactions').insert({
        child_id: childId,
        category: `兑换：${rewardName}`,
        points: -cost,
        type: 'use',
        note: '兑换奖励'
      })

      // 更新积分
      const newPoints = child.points - cost
      await supabase.from('children').update({ points: newPoints }).eq('id', childId)
      child.points = newPoints

      // 刷新记录
      await fetchTransactions(childId)
      return true
    } catch (e: any) {
      console.error('兑换奖励失败:', e.message)
      return false
    }
  }

  // 审批操作
  async function approveItem(id: string) {
    try {
      const approval = approvals.value.find(a => a.id === id)
      if (!approval) return

      // 更新审批状态
      await supabase.from('approvals').update({ status: 'approved' }).eq('id', id)

      // 如果是加分，给孩子加积分
      if (approval.type === 'earn') {
        const child = children.value.find(c => c.id === approval.child_id)
        if (child) {
          const newPoints = child.points + approval.points
          await supabase.from('children').update({ points: newPoints }).eq('id', approval.child_id)
          child.points = newPoints
          child.week_earned = (child.week_earned || 0) + approval.points
        }
      } else {
        // 扣分
        const child = children.value.find(c => c.id === approval.child_id)
        if (child) {
          const newPoints = child.points - approval.points
          await supabase.from('children').update({ points: newPoints }).eq('id', approval.child_id)
          child.points = newPoints
          child.week_used = (child.week_used || 0) + approval.points
        }
      }

      await fetchApprovals()
    } catch (e: any) {
      console.error('审批操作失败:', e.message)
    }
  }

  async function rejectItem(id: string) {
    try {
      await supabase.from('approvals').update({ status: 'rejected' }).eq('id', id)
      await fetchApprovals()
    } catch (e: any) {
      console.error('拒绝审批失败:', e.message)
    }
  }

  // 添加孩子
  async function addChild(name: string, avatar: string = '👦') {
    try {
      const { data, error: err } = await supabase.from('children').insert({
        name,
        avatar,
        points: 0,
        week_earned: 0,
        week_used: 0
      }).select().single()
      
      if (err) throw err
      await fetchChildren()
      return data
    } catch (e: any) {
      console.error('添加孩子失败:', e.message)
      return null
    }
  }

  // 添加奖励
  async function addReward(name: string, emoji: string, cost: number, description: string = '') {
    try {
      const { data, error: err } = await supabase.from('rewards').insert({
        name,
        emoji,
        cost,
        description,
        stock: 99
      }).select().single()
      
      if (err) throw err
      await fetchRewards()
      return data
    } catch (e: any) {
      console.error('添加奖励失败:', e.message)
      return null
    }
  }

  // 重置所有数据
  async function resetAllData() {
    try {
      for (const child of children.value) {
        await supabase.from('children').update({ points: 0, week_earned: 0, week_used: 0 }).eq('id', child.id)
        child.points = 0
        child.week_earned = 0
        child.week_used = 0
      }
    } catch (e: any) {
      console.error('重置数据失败:', e.message)
    }
  }

  return {
    children,
    transactions,
    rewards,
    approvals,
    loading,
    error,
    totalPoints,
    pendingApprovals,
    pendingApprovalsList,
    processedApprovals,
    loadAllData,
    fetchChildren,
    fetchRewards,
    fetchTransactions,
    fetchApprovals,
    addTransaction,
    exchangeReward,
    approveItem,
    rejectItem,
    addChild,
    addReward,
    resetAllData
  }
})
