import { defineStore } from 'pinia'
import axios from 'axios'

const API = '/api'

export const useHelpdeskStore = defineStore('helpdesk', {
  state: () => ({
    entries: [],
    stats: null,
    loading: false,
    error: null,
    success: null
  }),

  getters: {
    totalEntries: (state) => state.entries.length,
    criticalEntries: (state) => state.entries.filter(e => e.priority === 'Critical').length,
    entriesByCategory: (state) => {
      const map = {}
      state.entries.forEach(e => {
        map[e.category] = (map[e.category] || 0) + 1
      })
      return map
    }
  },

  actions: {
    clearMessages() {
      this.error = null
      this.success = null
    },

    async fetchEntries() {
      this.loading = true
      this.error = null
      try {
        const { data } = await axios.get(`${API}/entries`)
        this.entries = data
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to load entries'
      } finally {
        this.loading = false
      }
    },

    async fetchStats() {
      try {
        const { data } = await axios.get(`${API}/stats`)
        this.stats = data
      } catch (err) {
        console.error('Stats fetch failed:', err)
      }
    },

    async createEntry(payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await axios.post(`${API}/entries`, payload)
        this.success = 'Entry created successfully!'
        this.entries.unshift(data.entry)
        return true
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to create entry'
        return false
      } finally {
        this.loading = false
      }
    },

    async updateEntry(id, payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await axios.put(`${API}/entries/${id}`, payload)
        const idx = this.entries.findIndex(e => e._id === id)
        if (idx !== -1) this.entries[idx] = data.entry
        this.success = 'Entry updated successfully!'
        return true
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to update entry'
        return false
      } finally {
        this.loading = false
      }
    },

    async deleteEntry(id) {
      this.loading = true
      this.error = null
      try {
        await axios.delete(`${API}/entries/${id}`)
        this.entries = this.entries.filter(e => e._id !== id)
        this.success = 'Entry deleted successfully!'
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to delete entry'
      } finally {
        this.loading = false
      }
    },

    async seedData() {
      try {
        await axios.post(`${API}/seed`)
        await this.fetchEntries()
        await this.fetchStats()
        this.success = 'Sample data loaded!'
      } catch (err) {
        this.error = 'Seeding failed'
      }
    }
  }
})
