import { ref } from 'vue'
import axios from 'axios'

export function useApi() {
  const entries = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(null)

  async function fetchEntries() {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get('/api/entries')
      entries.value = response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Error loading entries'
    }
    loading.value = false
  }

  async function createEntry(payload) {
    loading.value = true
    error.value = null
    try {
      const response = await axios.post('/api/entries', payload)
      entries.value.unshift(response.data)
      success.value = 'Entry created!'
      return true
    } catch (err) {
      error.value = err.response?.data?.error || 'Error creating entry'
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateEntry(id, payload) {
    loading.value = true
    error.value = null
    try {
      const response = await axios.put(`/api/entries/${id}`, payload)
      const idx = entries.value.findIndex(e => e._id === id)
      if (idx !== -1) entries.value[idx] = response.data
      success.value = 'Entry updated!'
      return true
    } catch (err) {
      error.value = err.response?.data?.error || 'Error updating entry'
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteEntry(id) {
    loading.value = true
    error.value = null
    try {
      await axios.delete(`/api/entries/${id}`)
      entries.value = entries.value.filter(e => e._id !== id)
      success.value = 'Entry deleted!'
    } catch (err) {
      error.value = err.response?.data?.error || 'Error deleting entry'
    } finally {
      loading.value = false
    }
  }

  async function seedData() {
    try {
      await axios.post('/api/seed')
      await fetchEntries()
      success.value = 'Sample data loaded!'
    } catch (err) {
      error.value = 'Error loading sample data'
    }
  }

  function clearMessages() {
    error.value = null
    success.value = null
  }

  return {
    entries,
    loading,
    error,
    success,
    fetchEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    seedData,
    clearMessages
  }
}
