<template>
  <div class="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 min-h-screen">
    <!-- 顶部导航 - 彩虹风格 -->
    <nav class="bg-white/90 backdrop-blur-md shadow-lg border-b-4 border-pink-200 relative z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center">
            <div class="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mr-3 animate-float shadow-lg">
              <span class="text-xl">⭐</span>
            </div>
            <span class="font-bold text-xl bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">星星积分乐园</span>
          </div>
          <div class="hidden md:flex items-center space-x-1">
            <router-link to="/" class="nav-btn px-3 py-2 rounded-xl text-sm font-bold text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors">
              🏠 首页
            </router-link>
            <router-link to="/points" class="nav-btn px-3 py-2 rounded-xl text-sm font-bold text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors">
              ⭐ 积分
            </router-link>
            <router-link to="/rewards" class="nav-btn px-3 py-2 rounded-xl text-sm font-bold text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors">
              🎁 奖励
            </router-link>
            <router-link to="/approval" class="nav-btn px-3 py-2 rounded-xl text-sm font-bold text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors relative">
              ✅ 审批
              <span v-if="pendingApprovals > 0" class="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm font-bold">{{ pendingApprovals }}</span>
            </router-link>
            <router-link to="/settings" class="nav-btn px-3 py-2 rounded-xl text-sm font-bold text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors">
              ⚙️ 设置
            </router-link>

            <!-- 用户菜单 -->
            <div class="relative">
              <button @click="showUserMenu = !showUserMenu" class="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-pink-50 transition-colors">
                <div class="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  爸
                </div>
                <span class="text-sm font-bold text-gray-700 hidden lg:inline">爸爸</span>
                <svg class="w-4 h-4 text-gray-400 transition-transform" :class="{ 'rotate-180': showUserMenu }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- 下拉菜单 -->
              <transition name="menu">
                <div v-if="showUserMenu" class="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden z-[100]">
                  <!-- 用户信息头部 -->
                  <div class="bg-gradient-to-r from-pink-400 to-purple-500 p-4 text-white">
                    <div class="flex items-center">
                      <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold mr-3">👨</div>
                      <div>
                        <div class="font-bold">爸爸</div>
                        <div class="text-xs text-white/80">管理员</div>
                      </div>
                    </div>
                  </div>

                  <!-- 菜单项 -->
                  <div class="p-2">
                    <div class="px-3 py-2.5 hover:bg-pink-50 rounded-xl cursor-pointer transition-colors">
                      <div class="font-bold text-sm text-gray-800">👤 个人信息</div>
                      <div class="text-xs text-gray-500 mt-0.5">查看和编辑个人资料</div>
                    </div>
                    <div class="px-3 py-2.5 hover:bg-pink-50 rounded-xl cursor-pointer transition-colors">
                      <div class="font-bold text-sm text-gray-800">🏠 所属家庭</div>
                      <div class="text-xs text-gray-500 mt-0.5">小明家 · 4位成员</div>
                    </div>
                    <hr class="my-1 border-gray-100">
                    <button @click="handleLogout" class="w-full px-3 py-2.5 hover:bg-red-50 rounded-xl cursor-pointer transition-colors text-left">
                      <div class="font-bold text-sm text-red-500">🚪 退出登录</div>
                      <div class="text-xs text-red-400 mt-0.5">退出当前账号</div>
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-20">
      <router-view></router-view>
    </main>

    <!-- 移动端底部导航 - 可爱风格 -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-4 border-pink-200 z-50 h-16 shadow-lg">
      <div class="flex justify-around items-center h-full">
        <router-link to="/" :class="['flex', 'flex-col', 'items-center', 'p-2', $route.path === '/' ? 'text-pink-500' : 'text-gray-400']">
          <span class="text-xl">🏠</span>
          <span class="text-xs mt-0.5 font-bold">首页</span>
        </router-link>
        <router-link to="/points" :class="['flex', 'flex-col', 'items-center', 'p-2', $route.path === '/points' ? 'text-pink-500' : 'text-gray-400']">
          <span class="text-xl">⭐</span>
          <span class="text-xs mt-0.5 font-bold">积分</span>
        </router-link>
        <router-link to="/rewards" :class="['flex', 'flex-col', 'items-center', 'p-2', $route.path === '/rewards' ? 'text-pink-500' : 'text-gray-400']">
          <span class="text-xl">🎁</span>
          <span class="text-xs mt-0.5 font-bold">奖励</span>
        </router-link>
        <router-link to="/approval" :class="['flex', 'flex-col', 'items-center', 'p-2', 'relative', $route.path === '/approval' ? 'text-pink-500' : 'text-gray-400']">
          <span class="text-xl">✅</span>
          <span class="text-xs mt-0.5 font-bold">审批</span>
          <span v-if="pendingApprovals > 0" class="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-sm font-bold">{{ pendingApprovals }}</span>
        </router-link>
        <router-link to="/settings" :class="['flex', 'flex-col', 'items-center', 'p-2', $route.path === '/settings' ? 'text-pink-500' : 'text-gray-400']">
          <span class="text-xl">⚙️</span>
          <span class="text-xs mt-0.5 font-bold">设置</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { usePointsStore } from './stores/points'

const store = usePointsStore()
const pendingApprovals = store.pendingApprovals
const showUserMenu = ref(false)

function handleLogout() {
  showUserMenu.value = false
  // TODO: 实际退出登录逻辑（清除 token、跳转等）
  alert('退出登录功能待实现')
}

// 点击外部关闭菜单
function closeUserMenu(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.relative')) {
    showUserMenu.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', closeUserMenu)
  // 从 Supabase 加载所有数据
  await store.loadAllData()
})

onUnmounted(() => {
  document.removeEventListener('click', closeUserMenu)
})
</script>

<style scoped>
.nav-btn.router-link-active {
  color: #db2777;
  background-color: #fdf2f8;
}

.menu-enter-active,
.menu-leave-active {
  transition: all 0.2s ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
