<template>
  <div class="quiz-container">
    <h1 class="page-title">Helpdesk Response Library - Quiz</h1>
    <p class="page-subtitle">Match issue codes to their correct responses</p>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading quiz...</p>
    </div>

    <div v-else-if="allIssues.length === 0" class="empty-state">
      <p>No issues available for quiz</p>
    </div>

    <div v-else>
      <!-- Progress Bar -->
      <div class="card mb-3">
        <div class="card-body">
          <div class="d-flex justify-between align-center mb-2">
            <span>Question {{ currentIndex + 1 }} of {{ totalQuestions }}</span>
            <span class="badge badge-info">Score: {{ score }}/{{ totalQuestions }}</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- Quiz Card -->
      <div class="card mb-3">
        <div class="card-body">
          <!-- Current Question -->
          <div v-if="!quizComplete" class="mb-3">
            <h2 class="mb-2">Issue Code:</h2>
            <div class="alert alert-info">
              <strong>{{ currentQuestion.issueCode }}</strong>
            </div>

            <h3 class="mb-2">Select the correct response:</h3>

            <!-- Answer Options -->
            <div>
              <button
                v-for="(option, idx) in currentOptions"
                :key="idx"
                class="quiz-option"
                :class="{
                  'selected': selectedAnswer === idx && !answered,
                  'correct': answered && idx === currentQuestion.correctIndex,
                  'incorrect': answered && idx !== currentQuestion.correctIndex && selectedAnswer === idx
                }"
                @click="selectAnswer(idx)"
                :disabled="answered"
              >
                {{ option }}
              </button>
            </div>

            <!-- Feedback -->
            <div v-if="answered" class="mt-3">
              <div v-if="isCorrect" class="alert alert-success">
                ✓ Correct! Category: <strong>{{ currentQuestion.category }}</strong>
              </div>
              <div v-else class="alert alert-danger">
                ✗ Incorrect. The correct response was shown above.
              </div>

              <button v-if="currentIndex < totalQuestions - 1" @click="nextQuestion" class="btn btn-primary mt-2">
                Next Question →
              </button>
              <button v-else @click="completeQuiz" class="btn btn-success mt-2">
                Finish Quiz
              </button>
            </div>
          </div>

          <!-- Quiz Complete -->
          <div v-else class="text-center">
            <h2 class="mb-2">Quiz Complete! 🎉</h2>
            <div class="stat-card mt-3">
              <div class="stat-value" :style="{ color: scorePercentage >= 70 ? 'var(--success)' : 'var(--warning)' }">
                {{ scorePercentage }}%
              </div>
              <div class="stat-label">{{ score }} out of {{ totalQuestions }} correct</div>
            </div>

            <div v-if="scorePercentage >= 70" class="alert alert-success mt-3">
              Great job! You passed the quiz.
            </div>
            <div v-else class="alert alert-warning mt-3">
              Keep practicing! Try again to improve your score.
            </div>

            <button @click="restartQuiz" class="btn btn-primary mt-3">
              Restart Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Quiz',
  data() {
    return {
      allIssues: [],
      quizQuestions: [],
      currentIndex: 0,
      score: 0,
      selectedAnswer: null,
      answered: false,
      quizComplete: false,
      loading: true,
      totalQuestions: 10
    };
  },
  computed: {
    currentQuestion() {
      return this.quizQuestions[this.currentIndex] || {};
    },
    currentOptions() {
      return this.currentQuestion.options || [];
    },
    isCorrect() {
      return this.selectedAnswer === this.currentQuestion.correctIndex;
    },
    progressPercentage() {
      return ((this.currentIndex + 1) / this.totalQuestions) * 100;
    },
    scorePercentage() {
      return Math.round((this.score / this.totalQuestions) * 100);
    }
  },
  methods: {
    async fetchIssues() {
      try {
        this.loading = true;
        const response = await fetch('http://localhost:3000/issues');
        if (!response.ok) throw new Error('Failed to fetch issues');
        this.allIssues = await response.json();
        this.generateQuiz();
      } catch (error) {
        console.error('Error fetching issues:', error);
        alert('Failed to load quiz data');
      } finally {
        this.loading = false;
      }
    },
    generateQuiz() {
      if (this.allIssues.length < 4) {
        alert('Need at least 4 issues to generate a quiz');
        return;
      }

      this.quizQuestions = [];
      const shuffled = [...this.allIssues].sort(() => Math.random() - 0.5);
      const quizIssues = shuffled.slice(0, this.totalQuestions);

      quizIssues.forEach(issue => {
        const correctIndex = Math.floor(Math.random() * 4);
        const options = [issue.responseText];

        // Get random wrong answers
        while (options.length < 4) {
          const randomIssue = this.allIssues[Math.floor(Math.random() * this.allIssues.length)];
          if (!options.includes(randomIssue.responseText)) {
            options.push(randomIssue.responseText);
          }
        }

        // Shuffle and place correct answer at correctIndex
        const shuffledOptions = [];
        const tempOptions = [...options];
        for (let i = 0; i < 4; i++) {
          if (i === correctIndex) {
            shuffledOptions.push(issue.responseText);
            tempOptions.splice(tempOptions.indexOf(issue.responseText), 1);
          } else if (shuffledOptions.length <= i) {
            shuffledOptions.push(tempOptions.shift());
          }
        }

        this.quizQuestions.push({
          issueCode: issue.issueCode,
          responseText: issue.responseText,
          category: issue.category,
          options: shuffledOptions,
          correctIndex: correctIndex
        });
      });

      this.currentIndex = 0;
      this.score = 0;
      this.answered = false;
      this.quizComplete = false;
    },
    selectAnswer(index) {
      if (this.answered) return;
      this.selectedAnswer = index;
      this.answered = true;
      if (this.isCorrect) {
        this.score++;
      }
    },
    nextQuestion() {
      this.currentIndex++;
      this.selectedAnswer = null;
      this.answered = false;
    },
    completeQuiz() {
      this.quizComplete = true;
    },
    restartQuiz() {
      this.generateQuiz();
    }
  },
  mounted() {
    this.fetchIssues();
  }
};
</script>

<style scoped>
.quiz-container {
  max-width: 700px;
  margin: 0 auto;
}
.mb-3 {
  margin-bottom: 1.5rem;
}
</style>
