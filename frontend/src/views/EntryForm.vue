<template>
  <div class="form-container">
    <div class="back-link">
      <router-link to="/entries" class="btn btn-ghost btn-sm">← Back to Entries</router-link>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">{{ isEdit ? ' Edit Entry' : '+ New Entry' }}</span>
        <span v-if="isEdit" class="form-code">{{ form.issueCode }}</span>
      </div>
      <div class="card-body">

        <div v-if="api.error.value" class="alert alert-danger mb-2">{{ api.error.value }}</div>
        <div v-if="api.success.value" class="alert alert-success mb-2">{{ api.success.value }}</div>
        <div v-if="loading" class="loading"><div class="spinner"></div>Loading…</div>
        <form v-else @submit.prevent="submit">

          <!-- Issue Code -->
          <div class="form-group">
            <label class="form-label">Issue Code <span class="required">*</span></label>
            <input
              class="form-control"
              :class="{ 'is-invalid': errors.issueCode }"
              v-model="form.issueCode"
              placeholder="e.g. PWD_RESET"
              :disabled="isEdit"
              @input="form.issueCode = form.issueCode.toUpperCase().replace(/\s/g,'_')"
            />
            <p class="form-hint">Use UPPERCASE_UNDERSCORE format. Cannot be changed after creation.</p>
            <p v-if="errors.issueCode" class="form-error">{{ errors.issueCode }}</p>
          </div>

          <!-- Response -->
          <div class="form-group">
            <label class="form-label">Standard Response <span class="required">*</span></label>
            <textarea
              class="form-control"
              :class="{ 'is-invalid': errors.response }"
              v-model="form.response"
              rows="5"
              placeholder="Enter the standard helpdesk response for this issue…"
            ></textarea>
            <p class="form-hint">{{ form.response.length }} characters. Be clear and actionable.</p>
            <p v-if="errors.response" class="form-error">{{ errors.response }}</p>
          </div>

          <div class="form-row">
            <!-- Category -->
            <div class="form-group">
              <label class="form-label">Category <span class="required">*</span></label>
              <select class="form-control" :class="{ 'is-invalid': errors.category }" v-model="form.category">
                <option value="" disabled>Select category…</option>
                <option v-for="cat in categories" :key="cat">{{ cat }}</option>
              </select>
              <p v-if="errors.category" class="form-error">{{ errors.category }}</p>
            </div>

            <!-- Priority -->
            <div class="form-group">
              <label class="form-label">Priority <span class="required">*</span></label>
              <select class="form-control" :class="{ 'is-invalid': errors.priority }" v-model="form.priority">
                <option value="" disabled>Select priority…</option>
                <option v-for="p in priorities" :key="p">{{ p }}</option>
              </select>
              <p v-if="errors.priority" class="form-error">{{ errors.priority }}</p>
            </div>
          </div>

          <!-- Priority info -->
          <div v-if="form.priority" :class="priorityAlertClass(form.priority)" class="alert mb-3" style="font-size:.8rem">
            <strong>{{ form.priority }}:</strong> {{ priorityDescription(form.priority) }}
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary btn-lg" :disabled="api.loading.value">
              {{ api.loading.value ? 'Saving…' : (isEdit ? 'Update Entry' : 'Create Entry') }}
            </button>
            <router-link to="/entries" class="btn btn-ghost btn-lg">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useApi } from '../composable/useApi.js'

const props = defineProps({ id: String })
const router = useRouter()
const api = useApi()

const isEdit = computed(() => !!props.id)
const loading = ref(false)
const errors = reactive({})

const categories = ['Password & Access','Billing & Payments','Network & Connectivity','Hardware','Software','Email','Security','Other']
const priorities = ['Low','Medium','High','Critical']

const form = reactive({ issueCode: '', response: '', category: '', priority: 'Medium' })

onMounted(async () => {
  api.clearMessages()
  if (isEdit.value) {
    loading.value = true
    try {
      const { data } = await axios.get(`/api/entries/${props.id}`)
      form.issueCode = data.issueCode
      form.response = data.response
      form.category = data.category
      form.priority = data.priority
    } catch {
      api.error.value = 'Failed to load entry'
    } finally {
      loading.value = false
    }
  }
})

function validate() {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.issueCode.trim()) errors.issueCode = 'Issue code required'
  if (!form.response.trim()) errors.response = 'Response required'
  else if (form.response.trim().length < 10) errors.response = 'Min 10 characters'
  if (!form.category) errors.category = 'Category required'
  if (!form.priority) errors.priority = 'Priority required'
  return !Object.keys(errors).length
}

async function submit() {
  if (!validate()) return
  const payload = { issueCode: form.issueCode, response: form.response, category: form.category, priority: form.priority }
  const ok = isEdit.value
    ? await api.updateEntry(props.id, payload)
    : await api.createEntry(payload)
  if (ok) setTimeout(() => router.push('/entries'), 1200)
}

function priorityAlertClass(p) {
  return { Critical: 'alert-danger', High: 'alert-warning', Medium: 'alert-info', Low: 'alert-success' }[p]
}
function priorityDescription(p) {
  return { Critical: 'Immediate action', High: 'Urgent (within hours)', Medium: 'Standard', Low: 'Can wait' }[p]
}
</script>

<style scoped>
.form-container {
  max-width: 680px;
  margin: 0 auto;
}

.back-link {
  margin-bottom: 1.5rem;
}

.form-code {
  font-size: 0.8rem;
  color: #666;
  font-family: monospace;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
}

.card-title {
  font-weight: 600;
  font-size: 1.1rem;
}

.card-body {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
  font-size: 0.95rem;
}

.required {
  color: #d32f2f;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.2s ease;
  background: white;
  color: #333;
}

.form-control:focus {
  outline: none;
  border-color: #1565c0;
  box-shadow: 0 0 0 3px rgba(21, 101, 192, 0.1);
}

.form-control:hover {
  border-color: #bbb;
}

.form-control.is-invalid {
  border-color: #d32f2f;
  background: #ffebee;
}

.form-control.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
}

.form-control:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

textarea.form-control {
  resize: vertical;
  min-height: 120px;
  font-family: 'Courier New', monospace;
}

select.form-control {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2rem;
}

.form-hint {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #666;
}

.form-error {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #d32f2f;
  font-weight: 500;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.btn-lg {
  padding: 0.85rem 1.5rem;
}

.btn-primary {
  background: #1565c0;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0d47a1;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(21, 101, 192, 0.25);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-ghost {
  background: transparent;
  color: #1565c0;
  border: 1px solid transparent;
}

.btn-ghost:hover:not(:disabled) {
  background: #f0f0f0;
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.alert {
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.alert-danger {
  background: #ffebee;
  color: #d32f2f;
  border: 1px solid #ef5350;
}

.alert-success {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #66bb6a;
}

.alert-info {
  background: #e3f2fd;
  color: #1565c0;
  border: 1px solid #64b5f6;
}

.alert-warning {
  background: #fff3e0;
  color: #f57c00;
  border: 1px solid #ffb74d;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #e0e0e0;
  border-top: 3px solid #1565c0;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .card-body {
    padding: 1rem;
  }
}
</style>
