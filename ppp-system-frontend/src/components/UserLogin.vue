<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label>Email:</label>
          <input type="email" v-model="email" required placeholder="Ingresa tu correo" />
          <span v-if="emailError" class="error-message">{{ emailError }}</span>
        </div>

        <div class="form-group">
          <label>Contraseña:</label>
          <input type="password" v-model="password" required placeholder="Ingresa tu contraseña" />
          <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
        </div>

        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="!isLoading">Login</span>
          <span v-else class="loader"></span>
        </button>

        <p v-if="error" class="error-message">{{ error }}</p>
        
        <!-- Enlace para redirigir al formulario de registro -->
        <p class="register-link">
          ¿No tienes una cuenta?
          <router-link :to="{ name: 'Register' }">Regístrate aquí</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
      error: '',
      isLoading: false
    };
  },
  methods: {
    async login() {
      this.error = '';
      this.emailError = '';
      this.passwordError = '';
      //this.isLoading = true;

      // Validar campos
      if (!this.email) {
        this.emailError = 'El email es obligatorio';
        this.isLoading = false;
        return;
      }
      if (!this.password) {
        this.passwordError = 'La contraseña es obligatoria';
        this.isLoading = false;
        return;
      }

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/login', {
          email: this.email,
          password: this.password
        });

        // Guardar token, rol y userId en localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('userId', response.data.userId);
        
        if (response.data.alumnoId) {
            localStorage.setItem('alumnoId', response.data.alumnoId); // Guardar el ID del alumno
        }

        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        if (error.response && error.response.status === 401) {
          this.error = 'Credenciales incorrectas. Intenta de nuevo.';
        } else {
          this.error = 'Ocurrió un problema al intentar iniciar sesión. Intenta más tarde.';
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1e1e2f;
  color: #ffffff;
}

.login-box {
  background-color: #2d3748;
  padding: 30px;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  outline: none;
  font-size: 14px;
  background-color: #333d57;
  color: #fff;
}

input[type="email"]::placeholder,
input[type="password"]::placeholder {
  color: #c2c6dc;
}

.login-button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  background-color: #4bc0c0;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
}

.login-button:disabled {
  background-color: #3d485f;
  cursor: not-allowed;
}

.login-button:hover:not(:disabled) {
  background-color: #44adaf;
}

.error-message {
  color: #ff6b6b;
  font-size: 14px;
  margin-top: 5px;
}

.register-link {
  margin-top: 15px;
  font-size: 14px;
}

.register-link a {
  color: #4bc0c0;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid #fff;
  border-top: 3px solid #4bc0c0;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
