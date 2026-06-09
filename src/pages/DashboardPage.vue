<template>
  <div class="page-content">
    <!-- 欢迎横幅 -->
    <div class="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-2xl py-3 px-5 mb-3 text-white shadow-xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10"></div>
      <div class="relative z-10">
        <h1 class="text-2xl font-bold mb-2">欢迎回来，爸爸！🎉</h1>
        <p class="text-white/90">今天也是充满正能量的一天！✨</p>
      </div>
    </div>

    <!-- 孩子卡片区域 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div v-for="child in store.children" :key="child.id"
           @click="goToPointsWithChild(child.id)"
           class="bg-white rounded-3xl shadow-lg border-2 border-pink-100 p-5 cute-card relative cursor-pointer hover:shadow-xl hover:border-pink-300 transition-all active:scale-[0.98]">
        <div class="absolute -top-3 -right-3 bg-yellow-400 text-yellow-800 rounded-full w-10 h-10 flex items-center justify-center text-lg shadow-md animate-wiggle">🏆</div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center min-w-0">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-300 to-green-500 flex items-center justify-center text-2xl shadow-md mr-3 flex-shrink-0">{{ child.avatar }}</div>
            <div class="min-w-0">
              <h3 class="text-lg font-bold text-gray-800 truncate">{{ child.name }}</h3>
              <p class="text-sm text-gray-500">当前积分</p>
            </div>
          </div>
          <div class="text-right flex-shrink-0 ml-2">
            <div class="text-3xl font-black text-pink-500">{{ child.points || 0 }}</div>
            <div class="text-xs text-gray-400">⭐ 积分</div>
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">本周获得</span>
            <span class="text-green-500 font-bold">+{{ child.week_earned || 0 }} ⭐</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">本周使用</span>
            <span class="text-red-400 font-bold">-{{ child.week_used || 0 }} ⭐</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div class="progress-shine h-3 rounded-full" :style="{ width: progressWidth(child.points || 0) + '%' }"></div>
          </div>
          <p class="text-xs text-gray-400">距离下一个目标还差 {{ Math.max(0, 300 - (child.points || 0)) }} 分 🎯</p>
        </div>
        <div class="mt-4 flex space-x-2">
          <button @click.stop="goToPointsWithChild(child.id)" class="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white py-2.5 rounded-2xl text-sm font-bold cute-btn shadow-green-200">
            <span class="mr-1">+</span>加分
          </button>
          <button @click.stop="goToPointsWithChild(child.id)" class="flex-1 bg-gradient-to-r from-red-400 to-red-500 text-white py-2.5 rounded-2xl text-sm font-bold cute-btn shadow-red-200">
            <span class="mr-1">-</span>减分
          </button>
        </div>
      </div>

      <!-- 添加孩子（可点击） -->
      <div @click="showAddChild = true"
           class="bg-white/80 rounded-3xl shadow-lg border-2 border-dashed border-gray-200 p-5 cute-card flex flex-col items-center justify-center text-gray-400 hover:text-pink-500 hover:border-pink-300 cursor-pointer transition-colors min-h-[200px] hover:bg-pink-50/30">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-3xl mb-3 animate-float">
          ➕
        </div>
        <span class="text-sm font-bold">添加孩子</span>
      </div>
    </div>

    <!-- 快速操作和统计 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- 快速操作 -->
      <div class="bg-white rounded-3xl shadow-lg border-2 border-blue-100 p-5 cute-card">
        <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span class="mr-2">🚀</span>快速操作
        </h3>
        <div class="space-y-3">
          <button @click="goToPoints" class="w-full flex items-center p-4 rounded-2xl bg-gradient-to-r from-green-50 to-green-100 text-green-700 hover:from-green-100 hover:to-green-200 transition-colors text-left cute-btn">
            <div class="w-12 h-12 rounded-xl bg-green-200 flex items-center justify-center mr-3 text-xl shadow-sm">✅</div>
            <div>
              <div class="font-bold">添加积分</div>
              <div class="text-xs opacity-75">奖励孩子的好行为</div>
            </div>
          </button>
          <button @click="goToPoints" class="w-full flex items-center p-4 rounded-2xl bg-gradient-to-r from-red-50 to-red-100 text-red-700 hover:from-red-100 hover:to-red-200 transition-colors text-left cute-btn">
            <div class="w-12 h-12 rounded-xl bg-red-200 flex items-center justify-center mr-3 text-xl shadow-sm">⚠️</div>
            <div>
              <div class="font-bold">扣除积分</div>
              <div class="text-xs opacity-75">记录需要改进的行为</div>
            </div>
          </button>
          <button @click="goToRewards" class="w-full flex items-center p-4 rounded-2xl bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 hover:from-yellow-100 hover:to-yellow-200 transition-colors text-left cute-btn">
            <div class="w-12 h-12 rounded-xl bg-yellow-200 flex items-center justify-center mr-3 text-xl shadow-sm">🎁</div>
            <div>
              <div class="font-bold">兑换奖励</div>
              <div class="text-xs opacity-75">使用积分兑换奖品</div>
            </div>
          </button>
        </div>
      </div>

      <!-- 本周统计 -->
      <div class="bg-white rounded-3xl shadow-lg border-2 border-purple-100 p-5 cute-card">
        <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span class="mr-2">📊</span>本周统计
        </h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-3 bg-green-50 rounded-2xl">
            <span class="text-gray-600 flex items-center"><span class="mr-2">📈</span>总获得积分</span>
            <span class="text-green-500 font-black text-lg">+{{ totalEarned }} ⭐</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-red-50 rounded-2xl">
            <span class="text-gray-600 flex items-center"><span class="mr-2">📉</span>总使用积分</span>
            <span class="text-red-400 font-black text-lg">-{{ totalUsed }} ⭐</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-blue-50 rounded-2xl">
            <span class="text-gray-600 flex items-center"><span class="mr-2">💰</span>净增长</span>
            <span class="text-blue-500 font-black text-lg">+{{ totalEarned - totalUsed }} ⭐</span>
          </div>
          <div class="border-t-2 border-dashed border-gray-100 pt-4">
            <div class="text-sm text-gray-500 mb-3 font-medium">🏆 最活跃类目</div>
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1.5 bg-pink-100 text-pink-600 rounded-full text-xs font-bold">📝 完成作业</span>
              <span class="px-3 py-1.5 bg-green-100 text-green-600 rounded-full text-xs font-bold">🧹 做家务</span>
              <span class="px-3 py-1.5 bg-yellow-100 text-yellow-600 rounded-full text-xs font-bold">🌅 早起</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 待审批事项 -->
      <div class="bg-white rounded-3xl shadow-lg border-2 border-yellow-100 p-5 cute-card">
        <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span class="mr-2">⏰</span>待审批事项
        </h3>
        <div class="space-y-3">
          <div v-if="store.pendingApprovalsList.length === 0" class="text-center py-6 text-gray-400">
            <div class="text-3xl mb-2">✨</div>
            <div class="text-sm">暂无待审批事项</div>
          </div>
          <div v-for="approval in store.pendingApprovalsList" :key="approval.id"
               @click="goToApproval"
               class="flex items-center p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-colors">
            <div class="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center mr-3 text-lg shadow-sm">⏳</div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-bold text-gray-800 truncate">{{ getChildName(approval.child_id) }} {{ approval.points > 0 ? '+' : '' }}{{ approval.points }}分</div>
              <div class="text-xs text-gray-500 truncate">{{ approval.category }}</div>
            </div>
            <span class="text-xs text-yellow-600 font-bold flex-shrink-0 ml-2">待确认</span>
          </div>
        </div>
        <button @click="goToApproval" class="w-full mt-4 text-pink-500 text-sm font-bold hover:text-pink-600 flex items-center justify-center">
          查看全部 <span class="ml-1">👉</span>
        </button>
      </div>
    </div>

    <!-- 添加孩子弹窗（复用设置页逻辑） -->
    <transition name="modal">
      <div v-if="showAddChild" class="fixed inset-0 z-[200] flex items-center justify-center p-4" @click.self="showAddChild = false">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
          <div class="bg-gradient-to-r from-green-400 to-emerald-500 p-5 text-white">
            <h3 class="text-xl font-bold flex items-center">
              <span class="mr-2">👶</span>添加孩子
            </h3>
            <p class="text-white/80 text-sm mt-1">添加一个新的家庭成员</p>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">📛 孩子的名字</label>
              <input v-model="newChild.name" type="text" placeholder="例如：小明、小红..."
                     class="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-green-400 focus:outline-none text-gray-800 font-medium transition-colors"
                     @keyup.enter="handleAddChild">
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">🎭 选择头像</label>
              <div class="grid grid-cols-6 gap-2">
                <button v-for="emoji in avatarOptions" :key="emoji"
                        @click="newChild.avatar = emoji"
                        class="w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all hover:scale-110 border-2"
                        :class="newChild.avatar === emoji ? 'border-green-500 bg-green-50 scale-110 shadow-md' : 'border-gray-200 hover:border-green-300 bg-white'">
                  {{ emoji }}
                </button>
              </div>
            </div>
          </div>
          <div class="p-5 bg-gray-50 flex space-x-3">
            <button @click="showAddChild = false"
                    class="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition-colors">
              取消
            </button>
            <button @click="handleAddChild"
                    :disabled="!newChild.name.trim()"
                    class="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              ✅ 添加孩子
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePointsStore } from '../stores/points'

const store = usePointsStore()
const router = useRouter()

// 添加孩子弹窗
const showAddChild = ref(false)
const newChild = reactive({ name: '', avatar: '👦' })
const avatarOptions = ['👦', '👧', '🧒', '👶', '🧑', '🦸', '👨‍🎓', '👩‍🎓', '🧙', '🦷', '🐱', '🐶']

// 计算属性
const totalEarned = computed(() => {
  return store.children.reduce((sum, child) => sum + (child.week_earned || 0), 0)
})
const totalUsed = computed(() => {
  return store.children.reduce((sum, child) => sum + (child.week_used || 0), 0)
})

function progressWidth(points: number) {
  return Math.min((points / 300) * 100, 100)
}

function getChildName(childId: string) {
  const child = store.children.find(c => c.id === childId)
  return child ? child.name : '未知'
}

async function handleAddChild() {
  if (!newChild.name.trim()) return
  const result = await store.addChild(newChild.name.trim(), newChild.avatar)
  if (result) {
    newChild.name = ''
    newChild.avatar = '👦'
    showAddChild.value = false
  }
}

function goToPoints() {
  router.push('/points')
}

function goToPointsWithChild(childId: string) {
  router.push({ path: '/points', query: { childId } })
}

function goToRewards() {
  router.push('/rewards')
}

function goToApproval() {
  router.push('/approval')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9) translateY(20px);
}
</style>
