<template>
  <div class="dashboard-container">
    <aside class="sidebar">
      <h2>Dashboard</h2>
      <ul>
        <li>
          <router-link :to="{ name: 'Dashboard' }">Inicio</router-link>
        </li>
        <li v-if="isAdmin">
          <router-link :to="{ name: 'ListaAlumnos' }">Gestión de Alumnos</router-link>
        </li>
        <li v-if="isAdmin">
          <router-link :to="{ name: 'ListaEmpresas' }">Gestión de Empresa</router-link>
        </li>
        <li v-if="isAdmin">
          <router-link :to="{ name: 'TutorList' }">Gestión de tutor</router-link>
        </li>
        <li v-if="isAdmin || isTutor">
          <router-link :to="{ name: 'AsignarAlumno' }">Gestión Asignar Alumno</router-link>
        </li>
        <li v-if="isAdmin || isTutor">
          <router-link :to="{ name: 'PracticaList', params: { alumnoId: 1 } }">Gestión de Prácticas</router-link>
        </li>
        <li v-if="isAlumno && alumnoId">
          <router-link :to="{ name: 'PracticaList', params: { alumnoId: alumnoId } }">Mis Prácticas</router-link>
        </li>
        <li @click="logout">
          <button>Cerrar Sesión</button>
        </li>
      </ul>
    </aside>

    <main class="content">
      <!-- Información de usuario -->
      <div class="profile-card">
        <h3>Bienvenido, {{ userData.name }}</h3>
        <p><strong>Correo:</strong> {{ userData.email }}</p>
        <p><strong>Teléfono:</strong> {{ userData.telefono }}</p>
        <p><strong>Rol:</strong> {{ role }}</p>
      </div>

      <!-- Sección de estadísticas y gráficos -->
      <div class="stats-grid">
        <div class="card large-card">
          <h4>Prácticas Realizadas</h4>
          <canvas id="practiceChart"></canvas>
        </div>
        <div class="card">
          <h4>Prácticas por Mes</h4>
          <canvas id="monthlyChart"></canvas>
        </div>
        <div class="card">
          <h4>Estado de Prácticas</h4>
          <canvas id="statusChart"></canvas>
        </div>
        <div class="card">
          <h4>Estado de Evidencias</h4>
          <canvas id="evidenceChart"></canvas>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  data() {
    return {
      userData: {
        name: '',
        email: '',
        telefono: '',
      },
      alumnoId: localStorage.getItem('userId') || null
    };
  },
  computed: {
    role() {
      return localStorage.getItem('role');
    },
    isAdmin() {
      return this.role === 'admin';
    },
    isTutor() {
      return this.role === 'tutor';
    },
    isAlumno() {
      return this.role === 'alumno';
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      this.$router.push("/login");
    },
    loadUserData() {
      this.userData.name = localStorage.getItem('name') || 'Usuario';
      this.userData.email = localStorage.getItem('email') || 'No disponible';
      this.userData.telefono = localStorage.getItem('telefono') || 'No disponible';
    },
    renderCharts() {
      // Prácticas Realizadas Chart
      const practiceCtx = document.getElementById('practiceChart').getContext('2d');
      new Chart(practiceCtx, {
        type: 'line',
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
          datasets: [{
            label: 'Prácticas Realizadas',
            data: [12, 19, 10, 17, 28, 24],
            borderColor: '#4bc0c0',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          scales: {
            x: { title: { display: true, text: 'Mes' } },
            y: { title: { display: true, text: 'Cantidad' }, min: 0 }
          }
        }
      });

      // Prácticas por Mes Chart
      const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
      new Chart(monthlyCtx, {
        type: 'bar',
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
          datasets: [{
            label: 'Prácticas',
            data: [2, 4, 3, 5, 7, 6],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: '#36a2eb',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            x: { title: { display: true, text: 'Mes' } },
            y: { title: { display: true, text: 'Prácticas' }, min: 0 }
          }
        }
      });

      // Estado de Prácticas Chart
      const statusCtx = document.getElementById('statusChart').getContext('2d');
      new Chart(statusCtx, {
        type: 'doughnut',
        data: {
          labels: ['Aprobado', 'Rechazado', 'Pendiente'],
          datasets: [{
            data: [12, 5, 8],
            backgroundColor: ['#4bc0c0', '#ff6384', '#ffcd56'],
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });

      // Estado de Evidencias Chart
      const evidenceCtx = document.getElementById('evidenceChart').getContext('2d');
      new Chart(evidenceCtx, {
        type: 'pie',
        data: {
          labels: ['Aprobado', 'Rechazado', 'Pendiente de Revisión'],
          datasets: [{
            data: [7, 4, 6],
            backgroundColor: ['#36a2eb', '#ff9f40', '#ffcd56']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
  },
  mounted() {
    this.loadUserData();
    this.renderCharts();
  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: #1e1e2f;
  color: #c2c6dc;
}

.sidebar {
  width: 250px;
  background-color: #2d3748;
  color: #fff;
  padding: 20px;
}

.sidebar h2 {
  color: #fff;
  font-size: 24px;
  margin-bottom: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar ul li {
  margin: 10px 0;
}

.sidebar ul li a,
.sidebar ul li button {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px 15px;
  width: 100%;
  text-align: left;
  display: block;
}

.sidebar ul li a:hover,
.sidebar ul li button:hover {
  background-color: #3d485f;
  border-radius: 5px;
}

.content {
  flex-grow: 1;
  padding: 20px;
  color: #c2c6dc;
}

.profile-card {
  background-color: #2d3748;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #ffffff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.card {
  background-color: #2d3748;
  padding: 20px;
  border-radius: 10px;
}

.large-card {
  grid-column: span 2;
}

canvas {
  background-color: #343d52;
  border-radius: 10px;
}
</style>
