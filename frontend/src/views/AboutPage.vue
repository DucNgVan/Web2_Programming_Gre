<template>
  <div style="max-width:860px;margin:0 auto">
    <h1 class="page-title"> About This System</h1>
    <p class="page-subtitle">Technology choices, architecture, and design considerations</p>

    <div class="grid-2 mb-3">
      <div class="card">
        <div class="card-header"><span class="card-title">🏗️ MEVN Stack Architecture</span></div>
        <div class="card-body">
          <p style="font-size:.875rem;margin-bottom:1rem">This application is built on the <strong>MEVN stack</strong> — a full-stack JavaScript architecture:</p>
          <div v-for="item in mevn" :key="item.letter" style="display:flex;gap:1rem;margin-bottom:.9rem;align-items:flex-start">
            <div style="background:var(--primary);color:#fff;border-radius:6px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;flex-shrink:0">{{ item.letter }}</div>
            <div>
              <div style="font-weight:600;font-size:.9rem">{{ item.name }}</div>
              <div style="font-size:.8rem;color:var(--text-muted)">{{ item.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">🗄️ MongoDB vs SQL</span></div>
        <div class="card-body">
          <p style="font-size:.875rem;margin-bottom:1rem">Key differences between NoSQL (MongoDB) and relational SQL databases:</p>
          <table style="font-size:.8rem;width:100%">
            <thead><tr><th>Feature</th><th>MongoDB (NoSQL)</th><th>SQL</th></tr></thead>
            <tbody>
              <tr v-for="row in sqlVsNosql" :key="row.feature">
                <td><strong>{{ row.feature }}</strong></td>
                <td>{{ row.mongo }}</td>
                <td>{{ row.sql }}</td>
              </tr>
            </tbody>
          </table>
          <div class="alert alert-info mt-2" style="font-size:.8rem">
            <strong>Why MongoDB here?</strong> Helpdesk entries have flexible response text with varying lengths, making document storage more natural than rigid table schemas.
          </div>
        </div>
      </div>
    </div>

    <div class="grid-2 mb-3">
      <div class="card">
        <div class="card-header"><span class="card-title">♿ Accessibility Considerations</span></div>
        <div class="card-body">
          <div v-for="item in accessibility" :key="item.title" style="margin-bottom:.9rem">
            <div style="font-weight:600;font-size:.875rem">{{ item.icon }} {{ item.title }}</div>
            <div style="font-size:.8rem;color:var(--text-muted)">{{ item.desc }}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">🔒 Security Considerations</span></div>
        <div class="card-body">
          <div v-for="item in security" :key="item.title" style="margin-bottom:.9rem">
            <div style="font-weight:600;font-size:.875rem">{{ item.icon }} {{ item.title }}</div>
            <div style="font-size:.8rem;color:var(--text-muted)">{{ item.desc }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header"><span class="card-title"> Internet & Intranet Technology Issues</span></div>
      <div class="card-body grid-2">
        <div v-for="issue in techIssues" :key="issue.title">
          <div style="font-weight:600;font-size:.875rem;margin-bottom:.3rem">{{ issue.icon }} {{ issue.title }}</div>
          <div style="font-size:.8rem;color:var(--text-muted)">{{ issue.desc }}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title"> API Endpoints</span></div>
      <div class="card-body">
        <div class="table-wrapper">
          <table style="font-size:.8rem">
            <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
            <tbody>
              <tr v-for="ep in endpoints" :key="ep.endpoint">
                <td><span :class="`badge badge-${ep.badge}`">{{ ep.method }}</span></td>
                <td style="font-family:monospace">{{ ep.endpoint }}</td>
                <td>{{ ep.desc }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const mevn = [
  { letter: 'M', name: 'MongoDB', desc: 'NoSQL document database storing helpdesk entries as JSON-like BSON documents with flexible schema.' },
  { letter: 'E', name: 'Express.js', desc: 'Minimal Node.js web framework providing RESTful API routes, middleware, and request handling.' },
  { letter: 'V', name: 'Vue 3', desc: 'Progressive JavaScript framework for building reactive UI with Composition API, Pinia state management, and Vue Router.' },
  { letter: 'N', name: 'Node.js', desc: 'JavaScript runtime environment executing server-side code, enabling a unified JS codebase across frontend and backend.' }
]

const sqlVsNosql = [
  { feature: 'Data Model', mongo: 'Document (JSON/BSON)', sql: 'Relational tables & rows' },
  { feature: 'Schema', mongo: 'Flexible / dynamic', sql: 'Fixed / predefined' },
  { feature: 'Scaling', mongo: 'Horizontal (sharding)', sql: 'Vertical (scale up)' },
  { feature: 'Joins', mongo: 'Embedded documents', sql: 'Foreign keys & JOINs' },
  { feature: 'ACID', mongo: 'Supported (v4+)', sql: 'Fully ACID compliant' },
  { feature: 'Query', mongo: 'MongoDB query language', sql: 'Structured Query Language' }
]

const accessibility = [
  { icon: '', title: 'Semantic HTML', desc: 'Using proper heading hierarchy (h1→h2), labels for form controls, and button elements for interactive actions.' },
  { icon: '', title: 'Colour Contrast', desc: 'Text and background colours meet WCAG 2.1 AA contrast ratio requirements (≥4.5:1 for normal text).' },
  { icon: '', title: 'Keyboard Navigation', desc: 'All interactive elements are focusable and operable via keyboard. Focus states are clearly visible.' },
  { icon: '', title: 'Responsive Design', desc: 'CSS Grid and flexible layouts adapt to mobile, tablet, and desktop viewports for all users.' },
  { icon: '', title: 'Font Size & Readability', desc: 'Minimum 15px body text, 1.6 line height, and sufficient whitespace improve readability for all users.' }
]

const security = [
  { icon: '', title: 'Input Validation', desc: 'Server-side validation with Mongoose schema constraints and client-side form validation prevent malformed data.' },
  { icon: '', title: 'CORS Policy', desc: 'Cross-Origin Resource Sharing headers configured to allow only trusted origins in production.' },
  { icon: '', title: 'Injection Prevention', desc: 'Mongoose sanitises inputs, preventing NoSQL injection attacks via parameterised queries.' },
  { icon: '', title: 'Authentication (Future)', desc: 'Production deployment should implement JWT-based authentication to restrict write access to authorised staff.' },
  { icon: '', title: 'HTTPS', desc: 'Production deployment must use TLS/SSL (HTTPS) to encrypt data in transit, especially for credentials.' }
]

const techIssues = [
  { icon: '', title: 'Browser Compatibility', desc: 'Vue 3 targets evergreen browsers. IE11 is not supported. Polyfills may be needed for older enterprise environments.' },
  { icon: '', title: 'Performance', desc: 'Vite bundles assets efficiently. Large response text fields could benefit from lazy loading in larger deployments.' },
  { icon: '', title: 'GDPR & Data Privacy', desc: 'Helpdesk entries must not store personal data (names, emails) without consent. Issue codes keep data anonymous.' },
  { icon: '', title: 'Accessibility Law', desc: 'UK Equality Act 2010 and EN 301 549 require accessible web services, particularly for public sector intranet tools.' },
  { icon: '', title: 'Offline / Intranet Use', desc: 'The system can be deployed on a company intranet, but requires a persistent MongoDB instance and Node.js server.' },
  { icon: '', title: 'Dependency Management', desc: 'Regular npm audits and updates mitigate supply-chain security risks from third-party packages.' }
]

const endpoints = [
  { method: 'GET',    badge: 'low',    endpoint: '/api/entries',             desc: 'Retrieve all helpdesk entries' },
  { method: 'GET',    badge: 'low',    endpoint: '/api/entries/:id',         desc: 'Get a single entry by ID' },
  { method: 'POST',   badge: 'info',   endpoint: '/api/entries',             desc: 'Create a new helpdesk entry' },
  { method: 'PUT',    badge: 'medium', endpoint: '/api/entries/:id',         desc: 'Update an existing entry' },
  { method: 'DELETE', badge: 'high',   endpoint: '/api/entries/:id',         desc: 'Delete an entry by ID' },
  { method: 'GET',    badge: 'low',    endpoint: '/api/stats',               desc: 'Dashboard statistics & counts' },
  { method: 'GET',    badge: 'low',    endpoint: '/api/entries/category/:c', desc: 'Filter entries by category' },
  { method: 'POST',   badge: 'info',   endpoint: '/api/seed',                desc: 'Populate database with sample data' }
]
</script>
