<template>
  <div class="page-content">
    <!-- 页面标题 -->
    <div class="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl py-3 px-5 mb-3 text-white shadow-xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      <h1 class="text-xl font-bold relative z-10 flex items-center">
        <span class="mr-2">🎁</span>奖励兑换
      </h1>
      <p class="text-white/90 text-sm relative z-10">用积分兑换心仪的奖励 ✨</p>
    </div>

    <!-- 两栏布局 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧：当前积分（含选择功能） + 兑换记录 -->
      <div class="lg:col-span-1 space-y-4">
        <!-- 当前积分（点击选择孩子） -->
        <div class="bg-white rounded-2xl shadow-lg border-2 border-yellow-100 p-4 cute-card">
          <h3 class="text-base font-bold text-gray-800 mb-3 flex items-center">
            <span class="mr-2">💰</span>当前积分（点击选择）
          </h3>
          <div v-if="store.children.length === 0" class="text-center py-4 text-gray-400 text-sm">
            暂无孩子数据
          </div>
          <div v-else class="space-y-2">
            <button
              v-for="child in store.children"
              :key="child.id"
              @click="selectedChildId = child.id"
              :class="['w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all duration-200', selectedChildId === child.id ? 'border-yellow-400 bg-yellow-50 shadow-md scale-[1.02]' : 'border-gray-100 bg-gray-50 hover:border-yellow-200']"
            >
              <div class="flex items-center">
                <span class="text-2xl mr-2">{{ child.avatar }}</span>
                <span :class="['font-bold text-sm', selectedChildId === child.id ? 'text-yellow-600' : 'text-gray-700']">{{ child.name }}</span>
              </div>
              <span :class="['font-black text-sm', selectedChildId === child.id ? 'text-yellow-500' : 'text-gray-400']">{{ child.points || 0 }} ⭐</span>
            </button>
          </div>
        </div>

        <!-- 兑换记录 -->
        <div class="bg-white rounded-2xl shadow-lg border-2 border-yellow-100 p-4 cute-card">
          <h3 class="text-base font-bold text-gray-800 mb-3 flex items-center">
            <span class="mr-2">📜</span>兑换记录
          </h3>
          <div v-if="exchangeHistory.length === 0" class="text-center py-6 text-gray-400 text-sm">
            暂无兑换记录
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="(record, index) in exchangeHistory.slice(0, 5)"
              :key="index"
              class="flex items-center p-2.5 rounded-2xl bg-yellow-50"
            >
              <span class="text-lg mr-2">🎫</span>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-xs text-gray-800 truncate">{{ getChildName(record.child_id) }} 兑换了「{{ record.category.replace('兑换：', '') }}」</div>
                <div class="text-xs text-gray-400">{{ formatDate(record.created_at) }}</div>
              </div>
              <span class="font-bold text-xs text-red-400 ml-2">-{{ Math.abs(record.points) }} ⭐</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：可兑换奖励 -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-lg border-2 border-yellow-100 p-4 cute-card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-gray-800 flex items-center">
              <span class="mr-2">🛍️</span>可兑换奖励
            </h3>
            <button @click="showAddReward = true" class="text-sm text-yellow-500 font-bold flex items-center hover:text-yellow-600">
              <span class="mr-1">✨</span>添加奖励
            </button>
          </div>

          <!-- 奖励卡片网格 -->
          <div v-if="store.rewards.length === 0" class="text-center py-12 text-gray-400">
            <div class="text-4xl mb-2">🎁</div>
            <div class="text-sm">暂无奖励，点击右上角"添加奖励"创建吧！</div>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <div
              v-for="reward in store.rewards"
              :key="reward.id"
              class="bg-gray-50 rounded-2xl p-4 border-2 border-gray-100 hover:border-yellow-300 transition-all relative group"
            >
              <!-- 奖励图标 -->
              <div class="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl mb-3">
                {{ reward.emoji || '🎁' }}
              </div>
              
              <!-- 奖励名称 -->
              <h4 class="font-bold text-gray-800 mb-1 text-sm">{{ reward.name }}</h4>
              
              <!-- 奖励描述 -->
              <p class="text-xs text-gray-500 mb-3 line-clamp-2">{{ reward.description }}</p>
              
              <!-- 库存 -->
              <div class="text-xs text-gray-400 mb-2">库存: {{ reward.stock }}</div>
              
              <!-- 积分和兑换按钮 -->
              <div class="flex items-center justify-between">
                <span class="font-black text-orange-500 text-sm">{{ reward.cost }} ⭐</span>
                <button
                  @click="handleExchange(reward)"
                  :disabled="!canExchange(reward)"
                  :class="[
                    'px-3 py-1.5 rounded-xl font-bold text-xs transition-all cute-btn flex items-center',
                    canExchange(reward)
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  ]"
                >
                  兑换 <span class="ml-1">🎁</span>
                </button>
              </div>

              <!-- 装饰性小图标 -->
              <div class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-xs shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                ✨
              </div>
            </div>

            <!-- 添加新奖励卡片 -->
            <button @click="showAddReward = true" class="bg-gray-50 rounded-2xl p-4 border-2 border-dashed border-gray-300 hover:border-yellow-300 hover:bg-yellow-50/30 transition-all flex flex-col items-center justify-center min-h-[160px] group">
              <div class="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-3xl mb-2 group-hover:scale-110 transition-transform">
                ➕
              </div>
              <span class="text-sm text-gray-400 font-medium">添加新奖励</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加奖励弹窗 -->
    <transition name="modal">
      <div v-if="showAddReward" class="fixed inset-0 z-[200] flex items-center justify-center p-4" @click.self="showAddReward = false">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
          <div class="bg-gradient-to-r from-yellow-400 to-orange-500 p-5 text-white">
            <h3 class="text-xl font-bold flex items-center">
              <span class="mr-2">🎁</span>添加奖励
            </h3>
            <p class="text-white/80 text-sm mt-1">创建一个新的可兑换奖励</p>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">📛 奖励名称</label>
              <input v-model="newReward.name" type="text" placeholder="例如：看电影、冰淇淋..."
                     class="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-yellow-400 focus:outline-none text-gray-800 font-medium transition-colors">
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">🎭 图标</label>
              <div class="grid grid-cols-8 gap-2">
                <button v-for="emoji in rewardEmojis" :key="emoji"
                        @click="newReward.emoji = emoji"
                        class="w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all hover:scale-110 border-2"
                        :class="newReward.emoji === emoji ? 'border-yellow-500 bg-yellow-50 scale-110' : 'border-gray-200 hover:border-yellow-300'">
                  {{ emoji }}
                </button>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">⭐ 所需积分</label>
                <input v-model.number="newReward.cost" type="number" min="1" placeholder="50"
                       class="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-yellow-400 focus:outline-none text-gray-800 font-medium">
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">📦 库存</label>
                <input v-model.number="newReward.stock" type="number" min="0" placeholder="99"
                       class="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-yellow-400 focus:outline-none text-gray-800 font-medium">
              </div>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">📝 描述（可选）</label>
              <input v-model="newReward.description" type="text" placeholder="简单描述一下这个奖励..."
                     class="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-yellow-400 focus:outline-none text-gray-800 font-medium transition-colors">
            </div>
          </div>
          <div class="p-5 bg-gray-50 flex space-x-3">
            <button @click="showAddReward = false"
                    class="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition-colors">
              取消
            </button>
            <button @click="handleAddReward"
                    :disabled="!newReward.name.trim() || !newReward.cost"
                    class="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              ✅ 添加奖励
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { usePointsStore } from '../stores/points'

const store = usePointsStore()
const selectedChildId = ref<string>('')
const showAddReward = ref(false)
const newReward = ref({ name: '', emoji: '🎁', cost: 50, stock: 99, description: '' })
const rewardEmojis = ['🎁', '🎬', '🍦', '🎮', '📚', '🌙', '🧸', '⚽', '🎨', '🎵', '🏖️', '🍿', '🎪', '🦄', '🎯', '🏆']

// 自动选中第一个孩子
watch(() => store.children.length, (len) => {
  if (len > 0 && !selectedChildId.value) {
    selectedChildId.value = store.children[0].id
  }
})

onMounted(() => {
  if (store.children.length > 0) {
    selectedChildId.value = store.children[0].id
  }
})

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) {
    return `今天 ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
  }
  return `${d.getMonth()+1}/${d.getDate()}`
}

const exchangeHistory = computed(() => {
  return store.transactions.filter((tx: any) => tx.points < 0 && tx.category.startsWith('兑换：'))
})

function getChildName(childId: string) {
  const child = store.children.find((c: any) => c.id === childId)
  return child ? child.name : '未知'
}

function canExchange(reward: any) {
  if (!selectedChildId.value) return false
  const child = store.children.find((c: any) => c.id === selectedChildId.value)
  return child ? child.points >= reward.cost && reward.stock > 0 : false
}

async function handleExchange(reward: any) {
  if (!selectedChildId.value || !canExchange(reward)) return
  const success = await store.exchangeReward(selectedChildId.value, reward.id, reward.cost, reward.name)
  if (success) {
    // 刷新数据
    await store.fetchTransactions(selectedChildId.value)
  }
}

async function handleAddReward() {
  if (!newReward.value.name.trim() || !newReward.value.cost) return
  await store.addReward(newReward.value.name.trim(), newReward.value.emoji, newReward.value.cost, newReward.value.description)
  newReward.value = { name: '', emoji: '🎁', cost: 50, stock: 99, description: '' }
  showAddReward.value = false
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
