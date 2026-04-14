<template>
  <div>
    <div class="dashboard-header">
      <div>
        <h1>Dashboard</h1>
        <p class="subtitle">Helpdesk Response Library Overview</p>
      </div>
      <button class="btn btn-primary" @click="api.seedData()" :disabled="api.loading.value">
        Load Sample Data
      </button>
    </div>

    <div v-if="api.success.value" class="alert alert-success">{{ api.success.value }}</div>
    <div v-if="api.error.value" class="alert alert-danger">{{ api.error.value }}</div>

    <!-- Stats Row -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">{{ api.entries.value.length }}</div>
        <div class="stat-label">Total Entries</div>
      </div>
      <div class="stat-card critical">
        <div class="stat-number">{{ criticalCount }}</div>
        <div class="stat-label">Critical</div>
      </div>
      <div class="stat-card high">
        <div class="stat-number">{{ highCount }}</div>
        <div class="stat-label">High Priority</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ categoryCount }}</div>
        <div class="stat-label">Categories</div>
      </div>
    </div>

    <!-- Recent Entries -->
    <div class="card">
      <div class="card-header">
        <span class="card-title">Recent Entries</span>
        <router-link to="/entries" class="btn btn-ghost btn-sm">View all →</router-link>
      </div>
      <div v-if="api.loading.value" class="loading">Loading...</div>
      <div v-else-if="!api.entries.value.length" class="empty-state">No entries yet</div>
      <table v-else>
        <thead>
          <tr>
            <th>Issue Code</th>
            <th>Category</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in recent" :key="entry._id">
            <td><strong>{{ entry.issueCode }}</strong></td>
            <td><span class="badge">{{ entry.category }}</span></td>
            <td><span :class="priorityBadge(entry.priority)" class="badge">{{ entry.priority }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Quick Links -->
    <div class="card quick-links">
      <div class="card-header"><span class="card-title">Quick Links</span></div>
      <div class="card-body">
        <div class="links-grid">
          <router-link to="/entries" class="link-button">📋 View Entries</router-link>
          <router-link to="/entries/new" class="link-button">➕ New Entry</router-link>
          <router-link to="/quiz" class="link-button">🎯 Quiz</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useApi } from '../composable/useApi.js'

const api = useApi()

onMounted(() => {
  api.fetchEntries()
  api.clearMessages()
})

const recent = computed(() => api.entries.value.slice(0, 5))
const criticalCount = computed(() => api.entries.value.filter(e => e.priority === 'Critical').length)
const highCount = computed(() => api.entries.value.filter(e => e.priority === 'High').length)

const categoryCount = computed(() => {
  const cats = new Set()
  api.entries.value.forEach(e => cats.add(e.category))
  return cats.size
})

function priorityBadge(p) {
  return { Critical: 'badge-critical', High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' }[p] || ''
}
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

h1 {
  margin: 0;
  font-size: 2rem;
  color: #1a1a1a;
}

.subtitle {
  color: #666;
  margin-top: 0.5rem;
  font-size: 0.95rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  text-align: center;
  border-left: 4px solid #1565c0;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card.critical {
  border-left-color: #d32f2f;
}

.stat-card.high {
  border-left-color: #f57c00;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1565c0;
  line-height: 1;
}

.stat-card.critical .stat-number {
  color: #d32f2f;
}

.stat-card.high .stat-number {
  color: #f57c00;
}

.stat-label {
  color: #666;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.card-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
}

.card-title {
  font-weight: 600;
  font-size: 1rem;
}

.card-body {
  padding: 1.5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #eee;
  background: #f9f9f9;
}

td {
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #eee;
}

tbody tr:hover {
  background: #fafafa;
}

.badge {
  display: inline-block;
  padding: 0.3rem 0.7rem;
  background: #e3f2fd;
  color: #1565c0;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.badge-critical {
  background: #ffebee;
  color: #d32f2f;
}

.badge-high {
  background: #fff3e0;
  color: #f57c00;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.link-button {
  display: block;
  padding: 1rem;
  background: #f5f7fa;
  border: 2px solid transparent;
  border-radius: 6px;
  text-align: center;
  text-decoration: none;
  color: #1565c0;
  font-weight: 500;
  transition: all 0.2s;
}

.link-button:hover {
  background: #e3f2fd;
  border-color: #1565c0;
  transform: translateY(-2px);
}
</style>
