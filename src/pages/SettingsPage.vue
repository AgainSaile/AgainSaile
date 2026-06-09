<template>
  <div class="page-content">
    <!-- 页面标题 -->
    <div class="bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl py-3 px-5 mb-3 text-white shadow-xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      <h1 class="text-2xl font-bold relative z-10 flex items-center">
        <span class="mr-2">⚙️</span>系统设置
      </h1>
      <p class="text-white/90 mt-1 relative z-10">管理家庭成员和积分类目 ✨</p>
    </div>

    <!-- 2×2 网格布局 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 左上：家庭成员 -->
      <div class="bg-white rounded-3xl shadow-lg border-2 border-purple-100 p-5 cute-card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-800 flex items-center">
            <span class="mr-2">👨‍👩‍👧‍👦</span>家庭成员
          </h3>
          <button @click="showAddChild = true" class="flex items-center text-pink-500 font-bold text-sm hover:text-pink-600 transition-colors">
            <span class="mr-1">➕</span>添加成员
          </button>
        </div>

        <!-- 孩子列表（从 store 动态加载） -->
        <div class="space-y-3">
          <!-- 家长（固定显示） -->
          <div class="flex items-center justify-between p-3 bg-blue-50 rounded-2xl border border-blue-100">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-xl mr-3">👨</div>
              <div>
                <div class="font-bold text-gray-800">爸爸</div>
                <div class="text-xs text-gray-500">管理员</div>
              </div>
            </div>
            <span class="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">👑 管理员</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-pink-50 rounded-2xl border border-pink-100">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-xl mr-3">👩</div>
              <div>
                <div class="font-bold text-gray-800">妈妈</div>
                <div class="text-xs text-gray-500">管理员</div>
              </div>
            </div>
            <span class="text-xs font-bold text-pink-600 bg-pink-100 px-2 py-1 rounded-full">👑 管理员</span>
          </div>

          <!-- 孩子动态列表 -->
          <div v-for="child in store.children" :key="child.id"
               class="flex items-center justify-between p-3 rounded-2xl border transition-all hover:shadow-md cursor-pointer"
               :class="child.avatar === '👦' ? 'bg-green-50 border-green-100' : 'bg-yellow-50 border-yellow-100'">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl mr-3"
                   :class="child.avatar === '👦' ? 'bg-green-200' : 'bg-yellow-200'">
                {{ child.avatar }}
              </div>
              <div>
                <div class="font-bold text-gray-800">{{ child.name }}</div>
                <div class="text-xs text-gray-500">孩子 · {{ child.points || 0 }} ⭐</div>
              </div>
            </div>
            <button class="text-xs font-bold text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-full transition-colors"
                    @click.stop="removeChild(child.id)">🗑️ 删除</button>
          </div>

          <!-- 空状态提示 -->
          <div v-if="store.children.length === 0" class="text-center py-8 text-gray-400">
            <div class="text-4xl mb-2">👶</div>
            <div class="text-sm">还没有添加孩子哦，点击上方"添加成员"开始吧！</div>
          </div>
        </div>
      </div>

      <!-- 右上：积分类目 -->
      <div class="bg-white rounded-3xl shadow-lg border-2 border-purple-100 p-5 cute-card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-800 flex items-center">
            <span class="mr-2">🎯</span>积分类目
          </h3>
          <button @click="showAddCategory = true" class="flex items-center text-pink-500 font-bold text-sm hover:text-pink-600 transition-colors">
            <span class="mr-1">➕</span>添加类目
          </button>
        </div>
        
        <!-- 加分项 -->
        <div class="mb-4">
          <div class="flex items-center text-green-600 font-bold text-sm mb-2">
            <span class="mr-1">☑️</span>加分项
          </div>
          <div class="space-y-2">
            <div v-for="cat in earnCategories" :key="cat.name"
                 class="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100 group">
              <div class="flex items-center">
                <span class="mr-2">{{ cat.emoji }}</span>
                <span class="text-sm text-gray-700">{{ cat.name }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="font-bold text-green-600 text-sm">+{{ cat.points }} ⭐</span>
                <button @click="removeCategory('earn', cat.name)" class="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs">✕</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 减分项 -->
        <div>
          <div class="flex items-center text-red-500 font-bold text-sm mb-2">
            <span class="mr-1">☑️</span>减分项
          </div>
          <div class="space-y-2">
            <div v-for="cat in deductCategories" :key="cat.name"
                 class="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100 group">
              <div class="flex items-center">
                <span class="mr-2">{{ cat.emoji }}</span>
                <span class="text-sm text-gray-700">{{ cat.name }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="font-bold text-red-500 text-sm">-{{ cat.points }} ⭐</span>
                <button @click="removeCategory('deduct', cat.name)" class="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs">✕</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 左下：审批设置 -->
      <div class="bg-white rounded-3xl shadow-lg border-2 border-purple-100 p-5 cute-card">
        <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span class="mr-2">⚙️</span>审批设置
        </h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-bold text-sm text-gray-800 flex items-center">
                <span class="mr-1">🛡️</span>重要变动审批
              </div>
              <div class="text-xs text-gray-500 mt-0.5">超过设定分值需要双方确认</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.requireApproval" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="font-bold text-sm text-gray-800 flex items-center">
                <span class="mr-1">📊</span>审批阈值
              </div>
              <div class="text-xs text-gray-500 mt-0.5">超过此分值触发审批</div>
            </div>
            <div class="relative">
              <select v-model="settings.approvalThreshold" class="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 pr-8 text-sm font-bold text-gray-700 focus:outline-none focus:border-pink-400">
                <option value="5">5 ⭐</option>
                <option value="10">10 ⭐</option>
                <option value="15">15 ⭐</option>
                <option value="20">20 ⭐</option>
              </select>
              <div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="font-bold text-sm text-gray-800 flex items-center">
                <span class="mr-1">⛔</span>减分自动审批
              </div>
              <div class="text-xs text-gray-500 mt-0.5">所有减分都需要确认</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.autoApproveDeductions" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- 右下：通知设置 -->
      <div class="bg-white rounded-3xl shadow-lg border-2 border-purple-100 p-5 cute-card">
        <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span class="mr-2">🔔</span>通知设置
        </h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-bold text-sm text-gray-800 flex items-center">
                <span class="mr-1">📱</span>积分变动通知
              </div>
              <div class="text-xs text-gray-500 mt-0.5">积分变动时发送通知</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.pointChangeNotification" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="font-bold text-sm text-gray-800 flex items-center">
                <span class="mr-1">⏰</span>待审批提醒
              </div>
              <div class="text-xs text-gray-500 mt-0.5">有待审批事项时提醒</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.pendingApprovalReminder" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="font-bold text-sm text-gray-800 flex items-center">
                <span class="mr-1">📊</span>每日总结
              </div>
              <div class="text-xs text-gray-500 mt-0.5">每天发送积分变动总结</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.dailySummary" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加孩子弹窗 -->
    <transition name="modal">
      <div v-if="showAddChild" class="fixed inset-0 z-[200] flex items-center justify-center p-4" @click.self="showAddChild = false">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
          <!-- 弹窗头部 -->
          <div class="bg-gradient-to-r from-green-400 to-emerald-500 p-5 text-white">
            <h3 class="text-xl font-bold flex items-center">
              <span class="mr-2">👶</span>添加孩子
            </h3>
            <p class="text-white/80 text-sm mt-1">添加一个新的家庭成员</p>
          </div>

          <!-- 弹窗内容 -->
          <div class="p-6 space-y-4">
            <!-- 名字输入 -->
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">📛 孩子的名字</label>
              <input v-model="newChild.name" type="text" placeholder="例如：小明、小红..."
                     class="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-green-400 focus:outline-none text-gray-800 font-medium transition-colors"
                     @keyup.enter="handleAddChild">
            </div>

            <!-- 头像选择 -->
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

          <!-- 弹窗底部按钮 -->
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

    <!-- 添加类目弹窗 -->
    <transition name="modal">
      <div v-if="showAddCategory" class="fixed inset-0 z-[200] flex items-center justify-center p-4" @click.self="showAddCategory = false">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
          <div class="bg-gradient-to-r from-purple-400 to-pink-500 p-5 text-white">
            <h3 class="text-xl font-bold flex items-center">
              <span class="mr-2">🎯</span>添加类目
            </h3>
            <p class="text-white/80 text-sm mt-1">添加新的积分类目</p>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">📝 类目名称</label>
              <input v-model="newCategory.name" type="text" placeholder="例如：帮奶奶捶背..."
                     class="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-gray-800 font-medium transition-colors">
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">🎭 图标</label>
              <div class="grid grid-cols-8 gap-2">
                <button v-for="emoji in categoryEmojis" :key="emoji"
                        @click="newCategory.emoji = emoji"
                        class="w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all hover:scale-110 border-2"
                        :class="newCategory.emoji === emoji ? 'border-purple-500 bg-purple-50 scale-110' : 'border-gray-200 hover:border-purple-300'">
                  {{ emoji }}
                </button>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">⭐ 分值</label>
                <input v-model.number="newCategory.points" type="number" min="1" max="100" placeholder="5"
                       class="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-gray-800 font-medium">
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">📌 类型</label>
                <select v-model="newCategory.type" class="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-gray-800 font-medium">
                  <option value="earn">➕ 加分</option>
                  <option value="deduct">➖ 减分</option>
                </select>
              </div>
            </div>
          </div>

          <div class="p-5 bg-gray-50 flex space-x-3">
            <button @click="showAddCategory = false"
                    class="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition-colors">
              取消
            </button>
            <button @click="handleAddCategory"
                    :disabled="!newCategory.name.trim() || !newCategory.points"
                    class="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              ✅ 添加类目
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { usePointsStore } from '../stores/points'
import { supabase } from '../lib/supabase'

const store = usePointsStore()

// 设置项
const settings = ref({
  requireApproval: true,
  approvalThreshold: 10,
  autoApproveDeductions: true,
  pointChangeNotification: true,
  pendingApprovalReminder: true,
  dailySummary: false
})

// ====== 添加孩子 ======
const showAddChild = ref(false)
const newChild = reactive({ name: '', avatar: '👦' })
const avatarOptions = ['👦', '👧', '🧒', '👶', '🧑', '🦸', '👨‍🎓', '👩‍🎓', '🧙', '🦷', '🐱', '🐶']

async function handleAddChild() {
  if (!newChild.name.trim()) return
  const result = await store.addChild(newChild.name.trim(), newChild.avatar)
  if (result) {
    newChild.name = ''
    newChild.avatar = '👦'
    showAddChild.value = false
  }
}

async function removeChild(id: string) {
  if (confirm('确定要删除这个孩子吗？相关积分记录也会保留。')) {
    await supabase.from('children').delete().eq('id', id)
    await store.fetchChildren()
  }
}

// ====== 类目管理（localStorage 持久化）======
const CATEGORIES_STORAGE_KEY = 'points_categories'

const showAddCategory = ref(false)
const newCategory = reactive({ name: '', emoji: '⭐', points: 5, type: 'earn' as 'earn' | 'deduct' })
const categoryEmojis = ['📝', '🧹', '🌅', '🍽️', '💪', '🏃', '📚', '🎵', '🎨', '♻️', '🤝', '💊', '🪥', '🌙', '🎮', '📱']

// 从 localStorage 加载类目
function loadCategories() {
  try {
    const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      return {
        earn: data.earn || [],
        deduct: data.deduct || []
      }
    }
  } catch (e) {
    console.error('加载类目失败:', e)
  }
  // 默认数据
  return {
    earn: [
      { name: '完成作业', emoji: '📝', points: 5 },
      { name: '做家务', emoji: '🧹', points: 3 },
      { name: '早起', emoji: '🌅', points: 2 }
    ],
    deduct: [
      { name: '晚睡', emoji: '🌙', points: 2 },
      { name: '超时玩游戏', emoji: '🎮', points: 5 }
    ]
  }
}

// 保存类目到 localStorage
function saveCategories() {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify({
      earn: earnCategories.value,
      deduct: deductCategories.value
    }))
    // 触发自定义事件，通知其他页面更新类目
    window.dispatchEvent(new Event('categories-updated'))
  } catch (e) {
    console.error('保存类目失败:', e)
  }
}

const loaded = loadCategories()
const earnCategories = ref(loaded.earn)
const deductCategories = ref(loaded.deduct)

function handleAddCategory() {
  if (!newCategory.name.trim() || !newCategory.points) return
  const cat = { name: newCategory.name.trim(), emoji: newCategory.emoji, points: newCategory.points }
  if (newCategory.type === 'earn') {
    earnCategories.value.push(cat)
  } else {
    deductCategories.value.push(cat)
  }
  saveCategories() // 保存
  newCategory.name = ''
  newCategory.emoji = '⭐'
  newCategory.points = 5
  showAddCategory.value = false
}

function removeCategory(type: string, name: string) {
  if (type === 'earn') {
    earnCategories.value = earnCategories.value.filter((c: any) => c.name !== name)
  } else {
    deductCategories.value = deductCategories.value.filter((c: any) => c.name !== name)
  }
  saveCategories() // 保存
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
