<template>
  <div class="welcome-container">
    <header class="header">
      <img src="@/assets/logo.png" alt="Logo Institucional" class="logo" /> <!-- Ruta del logo -->
      <h1>Sistema de Gestión de Prácticas Pre-Profesionales</h1>
    </header>

    <div class="content">
      <p class="intro-text">
        Bienvenido a la plataforma de gestión de prácticas pre-profesionales, diseñada para estudiantes, tutores y administradores.
        Aquí podrás gestionar, documentar y dar seguimiento a tus actividades de práctica profesional de manera eficiente.
      </p>

      <!-- Video de introducción -->
      <div class="video-container">
        <iframe 
          width="560" 
          height="315" 
          src="https://www.youtube.com/watch?v=P_ajjxDUH-M"
          title="Video introductorio" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
        ></iframe>
      </div>

      <!-- Botones para iniciar sesión y registrarse -->
      <div class="button-container">
        <router-link v-if="!isAuthenticated" :to="{ name: 'Login' }">
          <button class="login-button">Iniciar Sesión</button>
        </router-link>
        <router-link v-if="!isAuthenticated" :to="{ name: 'Register' }">
          <button class="register-button">Crear Cuenta</button>
        </router-link>
        <router-link v-else :to="{ name: 'Dashboard' }">
          <button class="dashboard-button">Ir al Dashboard</button>
        </router-link>
      </div>
    </div>

    <!-- Pie de página -->
    <footer class="footer">
      <p>&copy; 2023 Nombre de la Institución. Todos los derechos reservados.</p>
      <p><a href="https://www.nombreinstitucion.edu" target="_blank">Visítanos en nuestro sitio web</a></p>
    </footer>
  </div>
</template>

<script>
export default {
  
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('token');
    }
  }
};
</script>

<style scoped>
/* Estilo principal */
.welcome-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  background-color: #f4f4f4;
  padding: 20px;
  color: #333;
}

/* Encabezado */
.header {
  text-align: center;
  padding: 20px 0;
}

.logo {
  width: 100px;
  margin-bottom: 10px;
}

h1 {
  font-size: 32px;
  margin: 0;
  color: #1f2937;
}

/* Contenido central */
.content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.intro-text {
  font-size: 18px;
  color: #555;
  margin-bottom: 30px;
}

/* Video */
.video-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

iframe {
  border: none;
  width: 100%;
  max-width: 560px;
  height: 315px;
  border-radius: 10px;
}

/* Botones */
.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

button {
  font-size: 18px;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button {
  background-color: #007BFF;
  color: #fff;
}

.register-button {
  background-color: #ffc107;
  color: #333;
}

.dashboard-button {
  background-color: #28a745;
  color: #fff;
}

button:hover {
  opacity: 0.9;
}

/* Pie de página */
.footer {
  text-align: center;
  padding: 20px 0;
  background-color: #1f2937;
  color: #fff;
}

.footer a {
  color: #61dafb;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}
</style>
