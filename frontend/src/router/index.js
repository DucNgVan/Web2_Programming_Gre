import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import EntriesList from '../views/EntriesList.vue'
import EntryForm from '../views/EntryForm.vue'
import QuizPage from '../views/QuizPage.vue'
import AboutPage from '../views/AboutPage.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/entries', name: 'Entries', component: EntriesList },
  { path: '/entries/new', name: 'NewEntry', component: EntryForm },
  { path: '/entries/edit/:id', name: 'EditEntry', component: EntryForm, props: true },
  { path: '/quiz', name: 'Quiz', component: QuizPage },
  { path: '/about', name: 'About', component: AboutPage },
]

export default createRouter({
  history: createWebHistory(),
  routes
})
