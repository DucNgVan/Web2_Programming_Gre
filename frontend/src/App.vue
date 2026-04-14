<template>
  <div class="app-shell">
    <nav class="navbar">
      <router-link class="navbar-brand" to="/">
         Helpdesk Library
      </router-link>
      <div class="navbar-nav">
        <router-link class="nav-link" to="/">Dashboard</router-link>
        <router-link class="nav-link" to="/entries">Entries</router-link>
        <router-link class="nav-link" to="/entries/new"> New Entry</router-link>
        <router-link class="nav-link" to="/quiz"> Quiz</router-link>
        <!-- <router-link class="nav-link" to="/about">About</router-link> -->
      </div>
      <div class="navbar-spacer"></div>
      <span class="navbar-badge">COMP1842 Project</span>
    </nav>

    <main class="main-content">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </main>

    <footer class="app-footer">
      IT Helpdesk Response Library &mdash; COMP1842 Web Programming 2 &mdash; MEVN Stack
    </footer>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fafafa;
}

.navbar {
  background: #1565c0;
  color: white;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  min-width: 200px;
}

.navbar-nav {
  display: flex;
  gap: 2rem;
  flex: 1;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 0.95rem;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: white;
  border-bottom-color: white;
}

.nav-link.router-link-active {
  color: white;
  border-bottom-color: #ffeb3b;
}

.navbar-spacer {
  flex: 1;
}

.navbar-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  white-space: nowrap;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.app-footer {
  text-align: center;
  padding: 1.5rem;
  font-size: 0.8rem;
  color: #666;
  border-top: 1px solid #e0e0e0;
  background: white;
  margin-top: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
