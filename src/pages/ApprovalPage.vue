<template>
  <div class="page-content">
    <!-- 页面标题 -->
    <div class="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl py-3 px-5 mb-3 text-white shadow-xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      <h1 class="text-2xl font-bold relative z-10">✅ 审批中心</h1>
      <p class="text-white/90 mt-1 relative z-10">重要积分变动需要双方确认 ✨</p>
    </div>

    <!-- 两栏布局 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 左侧：待审批 -->
      <div class="bg-white rounded-3xl shadow-lg border-2 border-blue-100 p-5 cute-card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-800 flex items-center">
            <span class="mr-2">⏳</span>待审批
          </h3>
          <span v-if="pendingApprovals.length > 0" class="bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full">
            {{ pendingApprovals.length }}项
          </span>
        </div>

        <div v-if="pendingApprovals.length === 0" class="text-center py-8 text-gray-400 text-sm">
          暂无待审批项目
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="item in pendingApprovals"
            :key="item.id"
            class="bg-yellow-50 rounded-2xl p-4 border-2 border-yellow-200"
          >
            <!-- 头部：头像 + 分数 + 标签 -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center">
                <div class="w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center text-2xl mr-3">
                  {{ getChildAvatar(item.childId) }}
                </div>
                <div>
                  <div class="flex items-center">
                    <span class="font-bold text-gray-800">{{ getChildName(item.childId) }}</span>
                    <span :class="['font-black ml-2', item.points > 0 ? 'text-green-500' : 'text-red-500']">
                      {{ item.points > 0 ? '+' : '' }}{{ item.points }}分
                    </span>
                    <span class="ml-1">⭐</span>
                  </div>
                  <div class="text-sm text-gray-600 mt-0.5">{{ item.description }}</div>
                </div>
              </div>
              <span :class="['text-xs font-bold px-2 py-1 rounded-full', item.points > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600']">
                {{ item.points > 0 ? '加分' : '减分' }}
              </span>
            </div>

            <!-- 申请时间 -->
            <div class="text-xs text-gray-400 mb-3">
              申请时间：{{ item.date }}
            </div>

            <!-- 审批状态 + 按钮 -->
            <div class="flex items-center justify-between">
              <div class="flex items-center text-sm text-gray-600">
                <span class="mr-1">👤</span>
                <span>{{ item.submittedBy || '爸爸' }}已同意</span>
              </div>
              <div class="flex gap-2">
                <button
                  @click="handleApprove(item.id)"
                  class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all flex items-center"
                >
                  <span class="mr-1">✅</span>同意
                </button>
                <button
                  @click="handleReject(item.id)"
                  class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-xl font-bold text-sm transition-all flex items-center"
                >
                  <span class="mr-1">❌</span>拒绝
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：审批历史 -->
      <div class="bg-white rounded-3xl shadow-lg border-2 border-blue-100 p-5 cute-card">
        <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span class="mr-2">📋</span>审批历史
        </h3>

        <div v-if="processedItems.length === 0" class="text-center py-8 text-gray-400 text-sm">
          暂无审批历史
        </div>

        <div v-else class="space-y-3">
          <!-- 已批准 -->
          <div
            v-for="item in approvedItems"
            :key="item.id"
            class="flex items-center p-3 rounded-2xl bg-green-50 border border-green-100"
          >
            <div class="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-white text-sm mr-3">
              ✅
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center">
                <span class="font-bold text-gray-800">{{ getChildName(item.childId) }}</span>
                <span class="font-bold text-green-500 ml-2">+{{ item.points }}分</span>
                <span class="ml-1">⭐</span>
              </div>
              <div class="text-xs text-gray-500">{{ item.description }}</div>
            </div>
            <span class="text-xs text-green-600 font-bold">已批准</span>
          </div>

          <!-- 已拒绝 -->
          <div
            v-for="item in rejectedItems"
            :key="item.id"
            class="flex items-center p-3 rounded-2xl bg-red-50 border border-red-100"
          >
            <div class="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center text-white text-sm mr-3">
              ❌
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center">
                <span class="font-bold text-gray-800">{{ getChildName(item.childId) }}</span>
                <span class="font-bold text-red-500 ml-2">{{ item.points }}分</span>
                <span class="ml-1">⭐</span>
              </div>
              <div class="text-xs text-gray-500">{{ item.description }}</div>
            </div>
            <span class="text-xs text-red-500 font-bold">已拒绝</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePointsStore } from '../stores/points'

const store = usePointsStore()

const pendingApprovals = computed(() => store.pendingApprovalsList)
const processedItems = computed(() => store.processedApprovals)

const approvedItems = computed(() => 
  processedItems.value.filter(item => item.status === 'approved').slice(0, 5)
)

const rejectedItems = computed(() => 
  processedItems.value.filter(item => item.status === 'rejected').slice(0, 5)
)

function getChildName(childId: number) {
  return store.children.find(c => c.id === childId)?.name || '未知'
}

function getChildAvatar(childId: string) {
  return store.children.find(c => c.id === childId)?.avatar || '👶'
}

function handleApprove(id: string) {
  store.approveItem(id)
}

function handleReject(id: string) {
  store.rejectItem(id)
}
</script>
