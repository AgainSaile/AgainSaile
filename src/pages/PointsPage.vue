<template>
  <div class="page-content">
    <!-- 页面标题 -->
    <div class="bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl py-3 px-5 mb-3 text-white shadow-xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      <h1 class="text-xl font-bold relative z-10 flex items-center">
        <span class="mr-2">⭐</span>积分管理
      </h1>
      <p class="text-white/90 text-sm relative z-10">记录孩子的日常表现 📝</p>
    </div>

    <!-- 左右两栏布局 -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- 左侧：选孩子 + 类目 + 提交 (占3列) -->
      <div class="lg:col-span-3 space-y-4">
        <!-- 选择孩子 - 横向卡片布局 -->
        <div class="bg-white rounded-2xl shadow-lg border-2 border-purple-100 p-4 cute-card">
          <h3 class="font-bold text-gray-800 mb-3 text-sm">👦 选择孩子</h3>
          <div v-if="!store.children || store.children.length === 0" class="text-center py-4 text-gray-400 text-sm">
            还没有孩子，请先在首页或设置页添加 👶
          </div>
          <div v-else class="flex gap-3 overflow-x-auto py-2 px-1">
            <button
              v-for="child in store.children"
              :key="child.id"
              @click="selectedChildId = child.id"
              :class="[
                'flex-shrink-0 px-4 py-3 rounded-2xl border-2 transition-all duration-200 text-left min-w-[100px] origin-center',
                selectedChildId === child.id
                  ? 'border-pink-400 bg-pink-50 shadow-md scale-105'
                  : 'border-gray-200 bg-white hover:border-pink-200'
              ]"
            >
              <div class="text-2xl mb-1">{{ child.avatar }}</div>
              <div :class="['font-bold text-sm', selectedChildId === child.id ? 'text-pink-600' : 'text-gray-700']">{{ child.name }}</div>
              <div :class="['text-xs mt-0.5', selectedChildId === child.id ? 'text-pink-500' : 'text-gray-400']">{{ child.points || 0 }} ⭐</div>
            </button>
          </div>
        </div>

        <!-- 加分类目 -->
        <div class="bg-white rounded-2xl shadow-lg border-2 border-green-100 p-4 cute-card">
          <h3 class="font-bold text-green-600 mb-3 text-sm flex items-center">
            <span class="mr-1">✅</span>加分
          </h3>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="(cat, index) in earnCategories"
              :key="'earn-' + index"
              @click="selectCategory(cat, 'earn')"
              :class="[
                'p-3 rounded-xl border-2 transition-all duration-200 text-center',
                selectedCategory?.name === cat.name && selectedType === 'earn'
                  ? 'border-green-400 bg-green-50 shadow-md scale-105'
                  : 'border-green-100 bg-white hover:bg-green-50'
              ]"
            >
              <div class="text-xl mb-1">{{ cat.emoji }}</div>
              <div :class="['text-xs font-bold', selectedCategory?.name === cat.name && selectedType === 'earn' ? 'text-green-600' : 'text-gray-700']">{{ cat.name }}</div>
              <div class="text-xs font-bold mt-1 text-green-500">+{{ cat.points }}</div>
            </button>
          </div>
        </div>

        <!-- 减分类目 -->
        <div class="bg-white rounded-2xl shadow-lg border-2 border-red-100 p-4 cute-card">
          <h3 class="font-bold text-red-500 mb-3 text-sm flex items-center">
            <span class="mr-1">❌</span>减分
          </h3>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="(cat, index) in useCategories"
              :key="'use-' + index"
              @click="selectCategory(cat, 'deduct')"
              :class="[
                'p-3 rounded-xl border-2 transition-all duration-200 text-center',
                selectedCategory?.name === cat.name && selectedType === 'deduct'
                  ? 'border-red-400 bg-red-50 shadow-md scale-105'
                  : 'border-red-100 bg-white hover:bg-red-50'
              ]"
            >
              <div class="text-xl mb-1">{{ cat.emoji }}</div>
              <div :class="['text-xs font-bold', selectedCategory?.name === cat.name && selectedType === 'deduct' ? 'text-red-600' : 'text-gray-700']">{{ cat.name }}</div>
              <div class="text-xs font-bold mt-1 text-red-400">-{{ cat.points }}</div>
            </button>
          </div>
        </div>

        <!-- 备注和提交 -->
        <div class="bg-white rounded-2xl shadow-lg border-2 border-yellow-100 p-4 cute-card">
          <textarea
            v-model="note"
            placeholder="添加备注（可选）..."
            class="w-full p-3 border-2 border-gray-200 rounded-xl text-sm focus:border-pink-400 focus:outline-none resize-none"
            rows="2"
          ></textarea>
          <label class="flex items-center mt-2 cursor-pointer">
            <input type="checkbox" v-model="isImportant" class="w-4 h-4 text-pink-500 rounded">
            <span class="ml-2 text-sm text-gray-600">🔴 重要积分变动（需双人确认）</span>
          </label>
          <button
            @click="handleSubmit"
            :disabled="!selectedChildId || !selectedCategory || submitting"
            :class="[
              'w-full mt-3 py-3 rounded-xl font-bold text-white transition-all duration-200',
              selectedChildId && selectedCategory && !submitting
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg active:scale-[0.98]'
                : 'bg-gray-300 cursor-not-allowed'
            ]"
          >
            {{ submitting ? '⏳ 提交中...' : '📝 提交记录' }}
          </button>
        </div>
      </div>

      <!-- 右侧：最近记录 (占2列) -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-4 cute-card sticky top-6">
          <h3 class="font-bold text-gray-800 mb-3 text-sm flex items-center justify-between">
            <span>📋 最近记录</span>
            <span class="text-xs text-gray-400">最新 {{ recentTransactions.length }} 条</span>
          </h3>
          <div class="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            <div
              v-for="tx in recentTransactions"
              :key="tx.id"
              :class="[
                'p-3 rounded-xl border-l-4 transition-all duration-200',
                tx.points >= 0 ? 'border-l-green-400 bg-green-50/50' : 'border-l-red-400 bg-red-50/50'
              ]"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-center">
                  <span class="text-lg mr-2">{{ tx.categoryEmoji }}</span>
                  <div>
                    <div class="font-bold text-sm text-gray-800">{{ tx.childName }} · {{ tx.categoryName }}</div>
                    <div class="text-xs text-gray-500 mt-0.5">{{ tx.dateStr }}</div>
                  </div>
                </div>
                <span :class="['font-bold text-sm', tx.points >= 0 ? 'text-green-600' : 'text-red-500']">
                  {{ tx.points >= 0 ? '+' : '' }}{{ tx.points }} ⭐
                </span>
              </div>
              <div v-if="tx.note" class="text-xs text-gray-500 mt-1 ml-7 bg-white/60 rounded px-2 py-1 inline-block">
                📝 {{ tx.note }}
              </div>
              <div v-if="tx.is_important" class="inline-block ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">
                🔴 重要
              </div>
            </div>
            <div v-if="recentTransactions.length === 0" class="text-center py-8 text-gray-400">
              <div class="text-3xl mb-2">📭</div>
              <div class="text-sm">暂无记录，选择孩子和类目后开始记录吧！</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePointsStore } from '../stores/points'

const store = usePointsStore()
const route = useRoute()

const selectedChildId = ref<string>('')
const selectedCategory = ref<any>(null)
const selectedType = ref<'earn' | 'deduct' | null>(null)
const note = ref('')
const isImportant = ref(false)
const submitting = ref(false)

// 从 localStorage 加载类目
const CATEGORIES_STORAGE_KEY = 'points_categories'

function loadCategoriesFromStorage() {
  try {
    const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('加载类目失败:', e)
  }
  // 默认数据
  return {
    earn: [
      { name: '完成作业', emoji: '📝', points: 5 },
      { name: '做家务', emoji: '🧹', points: 3 },
      { name: '早起', emoji: '🌅', points: 2 },
      { name: '帮助他人', emoji: '🤝', points: 4 },
      { name: '阅读', emoji: '📚', points: 3 },
      { name: '运动锻炼', emoji: '🏃', points: 4 }
    ],
    deduct: [
      { name: '晚睡', emoji: '🌙', points: 2 },
      { name: '未完成作业', emoji: '📒', points: 5 },
      { name: '挑食', emoji: '🥦', points: 2 }
    ]
  }
}

const categoriesData = ref(loadCategoriesFromStorage())

function reloadCategories() {
  categoriesData.value = loadCategoriesFromStorage()
}

const earnCategories = computed(() => categoriesData.value.earn || [])
const useCategories = computed(() => categoriesData.value.deduct || [])

const allCategories = computed(() => [...earnCategories.value, ...useCategories.value])

onMounted(() => {
  if (route.query.childId) {
    selectedChildId.value = route.query.childId as string
  } else if (store.children && store.children.length > 0) {
    selectedChildId.value = store.children[0].id
  }
  window.addEventListener('categories-updated', reloadCategories)
})

onUnmounted(() => {
  window.removeEventListener('categories-updated', reloadCategories)
})

watch(() => store.children?.length, (len) => {
  if (len && len > 0 && !selectedChildId.value) {
    selectedChildId.value = store.children[0].id
  }
})

function selectCategory(cat: any, type: 'earn' | 'deduct') {
  if (selectedCategory.value?.name === cat.name && selectedType.value === type) {
    selectedCategory.value = null
    selectedType.value = null
  } else {
    selectedCategory.value = cat
    selectedType.value = type
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) {
    return `今天 ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
  }
  return `${d.getMonth()+1}/${d.getDate()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
}

const recentTransactions = computed(() => {
  if (!selectedChildId.value || !store.transactions) return []
  return store.transactions
    .filter((tx: any) => tx.child_id === selectedChildId.value)
    .slice(-8)
    .reverse()
    .map((tx: any) => ({
      id: tx.id,
      childName: store.children?.find((c: any) => c.id === tx.child_id)?.name || '未知',
      categoryName: tx.category,
      categoryEmoji: allCategories.value.find((c: any) => c.name === tx.category)?.emoji || '⭐',
      points: tx.points,
      dateStr: formatDate(tx.created_at),
      note: tx.note,
      is_important: tx.is_important
    }))
})

async function handleSubmit() {
  if (!selectedChildId.value || !selectedCategory.value || !selectedType.value || submitting.value) return

  submitting.value = true

  try {
    await store.addTransaction({
      childId: selectedChildId.value,
      category: selectedCategory.value.name,
      points: selectedType.value === 'earn' ? selectedCategory.value.points : -selectedCategory.value.points,
      type: selectedType.value,
      note: note.value,
      isImportant: isImportant.value
    })

    await store.fetchTransactions(selectedChildId.value)

    selectedCategory.value = null
    selectedType.value = null
    note.value = ''
    isImportant.value = false
  } finally {
    submitting.value = false
  }
}
</script>
