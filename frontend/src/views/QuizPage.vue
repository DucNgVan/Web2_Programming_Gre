<template>
  <div style="max-width:760px;margin:0 auto">
    <h1 class="page-title">Quiz</h1>
    <p class="page-subtitle">Test your helpdesk knowledge</p>

    <!-- No entries -->
    <div v-if="!api.entries.value.length && !api.loading.value" class="card">
      <div class="empty-state" style="padding:3rem">
        <p>No entries available. <router-link to="/entries/new">Add entries</router-link> or <a href="#" @click.prevent="api.seedData()">load sample data</a>.</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-else-if="api.loading.value" class="loading"><div class="spinner"></div>Loading…</div>

    <!-- Results -->
    <div v-else-if="quizComplete" class="card">
      <div class="card-header"><span class="card-title">Quiz Complete! 🎉</span></div>
      <div class="card-body text-center">
        <div :style="`font-size:4rem;font-weight:800;color:${scoreColor}`">{{ score }}/{{ questions.length }}</div>
        <div style="font-size:1.2rem;margin:.5rem 0">{{ scoreMessage }}</div>
        <div style="font-size:.9rem;color:var(--text-muted);margin-bottom:2rem">{{ Math.round((score/questions.length)*100) }}% correct</div>

        <div style="text-align:left;margin-bottom:2rem">
          <h3 style="font-size:.95rem;font-weight:600;margin-bottom:1rem">Results:</h3>
          <div v-for="(q, i) in questions" :key="i" style="margin-bottom:0.8rem;padding:1rem;border-radius:var(--radius);border:1px solid var(--border)" :style="answers[i]?.correct ? 'background:#f0fdf4;border-color:#bbf7d0' : 'background:#fef2f2;border-color:#fecaca'">
            <div style="font-weight:600;margin-bottom:.4rem;font-size:.875rem">Q{{ i+1 }}: {{ q.question }}</div>
            <div style="font-size:.8rem;color:var(--text-muted)">
              <span v-if="answers[i]?.correct">✅ Correct!</span>
              <span v-else>❌ Incorrect</span>
            </div>
          </div>
        </div>

        <button class="btn btn-primary" @click="restartQuiz">Try Again</button>
      </div>
    </div>

    <!-- Quiz in progress -->
    <div v-else>
      <!-- Progress -->
      <div class="card mb-2">
        <div class="card-body" style="padding:1rem">
          <div class="d-flex justify-between align-center mb-1">
            <span style="font-size:.875rem;font-weight:500">Question {{ currentQ + 1 }} of {{ questions.length }}</span>
            <span style="font-size:.875rem;color:var(--text-muted)">Score: {{ score }}/{{ currentQ }}</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" :style="`width:${((currentQ)/questions.length)*100}%`"></div>
          </div>
        </div>
      </div>

      <!-- Question -->
      <div class="card" v-if="questions.length && currentQ < questions.length">
        <div class="card-header">
          <span class="badge badge-info">{{ questions[currentQ].type }}</span>
        </div>
        <div class="card-body">
          <p style="font-size:1.05rem;font-weight:600;margin-bottom:1.5rem;line-height:1.5">
            {{ questions[currentQ].question }}
          </p>

          <!-- Options -->
          <div>
            <div
              v-for="(option, idx) in questions[currentQ].options"
              :key="idx"
              class="quiz-option"
              :class="optionClass(idx)"
              @click="selectAnswer(idx)"
            >
              <span style="font-weight:600;margin-right:.5rem">{{ String.fromCharCode(65+idx) }}.</span>
              {{ option }}
            </div>
          </div>

          <!-- Feedback -->
          <div v-if="answered" class="mt-2">
            <div :class="answers[currentQ].correct ? 'alert-success' : 'alert-danger'" class="alert">
              {{ answers[currentQ].correct ? '✅ Correct!' : '❌ Incorrect' }}
            </div>
            <button class="btn btn-primary mt-2" @click="nextQuestion">
              {{ currentQ + 1 < questions.length ? 'Next →' : 'See Results' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '../composable/useApi.js'

const api = useApi()
const questions = ref([])
const currentQ = ref(0)
const answers = ref([])
const answered = ref(false)
const selectedIdx = ref(null)
const quizComplete = ref(false)

onMounted(() => api.fetchEntries().then(generateQuiz))

const score = computed(() => answers.value.filter(a => a?.correct).length)

const scoreColor = computed(() => {
  const pct = score.value / questions.value.length
  if (pct >= 0.8) return 'var(--success)'
  if (pct >= 0.5) return 'var(--warning)'
  return 'var(--danger)'
})

const scoreMessage = computed(() => {
  const pct = score.value / questions.value.length
  if (pct === 1) return 'Perfect score! 🌟'
  if (pct >= 0.8) return 'Excellent! 👏'
  if (pct >= 0.6) return 'Good job! Keep practicing.'
  if (pct >= 0.4) return 'Needs improvement. Review entries.'
  return 'Review the entries and try again.'
})

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function generateQuiz() {
  const entries = api.entries.value
  if (entries.length < 2) return

  const qs = []
  const shuffled = shuffle(entries).slice(0, Math.min(5, entries.length))

  // Simple questions: given code, find response
  shuffled.forEach(entry => {
    const wrongs = shuffle(entries.filter(e => e._id !== entry._id)).slice(0, 3).map(e => e.response)
    if (wrongs.length < 3) return
    
    const options = shuffle([entry.response, ...wrongs])
    qs.push({
      type: 'Match Response',
      question: `Issue code: "${entry.issueCode}" - What is the response?`,
      options,
      correctIndex: options.indexOf(entry.response)
    })
  })

  questions.value = shuffle(qs).slice(0, 6)
  currentQ.value = 0
  answers.value = []
  answered.value = false
}

function selectAnswer(idx) {
  if (answered.value) return
  selectedIdx.value = idx
  answered.value = true
  answers.value[currentQ.value] = {
    correct: idx === questions.value[currentQ.value].correctIndex
  }
}

function nextQuestion() {
  if (currentQ.value + 1 >= questions.value.length) {
    quizComplete.value = true
  } else {
    currentQ.value++
    answered.value = false
    selectedIdx.value = null
  }
}

function optionClass(idx) {
  if (!answered.value) return selectedIdx.value === idx ? 'selected' : ''
  const q = questions.value[currentQ.value]
  if (idx === q.correctIndex) return 'correct'
  if (idx === selectedIdx.value && idx !== q.correctIndex) return 'incorrect'
  return ''
}

function restartQuiz() {
  generateQuiz()
  quizComplete.value = false
}
</script>
