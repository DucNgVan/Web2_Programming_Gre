<template>
  <div class="container">
    <h1>All Entries</h1>
    
    <div class="search-bar">
      <input 
        v-model="search" 
        type="text" 
        placeholder="Search by code or category..."
        class="search-input"
      />
    </div>

    <div v-if="api.loading.value" class="loading">Loading...</div>
    <div v-else-if="api.error.value" class="alert alert-danger">{{ api.error.value }}</div>
    <div v-else-if="filtered.length === 0" class="alert alert-info">No entries found</div>
    
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Response</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in filtered" :key="entry._id">
            <td><strong>{{ entry.issueCode }}</strong></td>
            <td>{{ entry.response.substring(0, 50) }}...</td>
            <td><span class="badge">{{ entry.category }}</span></td>
            <td><span class="badge">{{ entry.priority }}</span></td>
            <td>
              <button @click="showDetails(entry)" class="btn-small">View</button>
              <router-link :to="`/entries/edit/${entry._id}`" class="btn-small">Edit</router-link>
              <button @click="deleteEntry(entry._id)" class="btn-small btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Details Modal -->
    <div v-if="selectedEntry" class="modal-overlay" @click="selectedEntry = null">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedEntry.issueCode }}</h2>
          <button @click="selectedEntry = null" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <p><strong>Response:</strong></p>
          <p>{{ selectedEntry.response }}</p>
          <p><strong>Category:</strong> {{ selectedEntry.category }}</p>
          <p><strong>Priority:</strong> {{ selectedEntry.priority }}</p>
        </div>
        <div class="modal-footer">
          <router-link :to="`/entries/edit/${selectedEntry._id}`" class="btn">Edit</router-link>
          <button @click="selectedEntry = null" class="btn">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useApi } from '@/composable/useApi'

const api = useApi()
const search = ref('')
const selectedEntry = ref(null)

const filtered = computed(() => {
  if (!search.value) return api.entries.value
  const q = search.value.toLowerCase()
  return api.entries.value.filter(e => 
    e.issueCode.toLowerCase().includes(q) || 
    e.category.toLowerCase().includes(q)
  )
})

const showDetails = (entry) => {
  selectedEntry.value = entry
}

const deleteEntry = async (id) => {
  if (confirm('Delete this entry?')) {
    await api.deleteEntry(id)
    if (!api.error.value) {
      selectedEntry.value = null
    }
  }
}

// Load entries on mount
api.fetchEntries()
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background: #f5f5f5;
  font-weight: 600;
}

tr:hover {
  background: #f9f9f9;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 3px;
  font-size: 0.85rem;
}

.btn-small {
  padding: 0.4rem 0.8rem;
  margin-right: 0.5rem;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-small:hover {
  background: #e0e0e0;
}

.btn-small.btn-danger {
  background: #ffebee;
  border-color: #c62828;
  color: #c62828;
}

.btn-small.btn-danger:hover {
  background: #ffcdd2;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 1rem;
}

.modal-body p {
  margin: 0.5rem 0;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.5rem 1rem;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.btn:hover {
  background: #1565c0;
}

.loading, .alert {
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 3px;
}

.loading {
  background: #f5f5f5;
}

.alert-danger {
  background: #ffebee;
  color: #c62828;
}

.alert-info {
  background: #e3f2fd;
  color: #1976d2;
}

.search-bar {
  margin: 1rem 0;
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 1rem;
}
</style>
