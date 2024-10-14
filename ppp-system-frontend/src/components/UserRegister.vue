<template>
    <div class="register-container">
      <div class="register-box">
        <h2>Registrar Nuevo Usuario</h2>
        <form @submit.prevent="register">
          <div class="form-group">
            <label>Nombre de Usuario:</label>
            <input type="text" v-model="name" required maxlength="255" placeholder="Ingresa tu nombre de usuario" />
          </div>
  
          <div class="form-group">
            <label>Email:</label>
            <input type="email" v-model="email" required placeholder="Ingresa tu correo electrónico" />
          </div>
  
          <div class="form-group">
            <label>Contraseña:</label>
            <input type="password" v-model="password" required minlength="6" placeholder="Ingresa tu contraseña" />
          </div>
  
          <div class="form-group">
            <label>Rol:</label>
            <select v-model="role" required @change="handleRoleChange">
              <option value="alumno">Alumno</option>
              <option value="tutor">Tutor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
  
          <!-- Campos adicionales solo para el rol 'alumno' -->
          <div v-if="isAlumno">
            <div class="form-group">
              <label>Nombre Completo:</label>
              <input type="text" v-model="nombre" required maxlength="255" placeholder="Ingresa tu nombre completo" />
            </div>
  
            <div class="form-group">
              <label>Teléfono:</label>
              <input type="text" v-model="telefono" maxlength="20" placeholder="Ingresa tu número de teléfono" />
            </div>
  
            <div class="form-group">
              <label>Código:</label>
              <input type="text" v-model="codigo" required placeholder="Ingresa tu código" />
            </div>
          </div>
  
          <button type="submit" class="register-button">Registrar</button>
  
          <p v-if="error" class="error-message">{{ error }}</p>
          <p v-if="success" class="success-message">Registro exitoso. Ahora puedes iniciar sesión.</p>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        name: '',
        email: '',
        password: '',
        role: 'alumno',
        nombre: '',
        telefono: '',
        codigo: '',
        error: '',
        success: false
      };
    },
    computed: {
      isAlumno() {
        return this.role === 'alumno';
      }
    },
    methods: {
      handleRoleChange() {
        if (!this.isAlumno) {
          this.nombre = '';
          this.telefono = '';
          this.codigo = '';
        }
      },
      async register() {
        this.error = '';
        this.success = false;
  
        const userData = {
          name: this.name,
          email: this.email,
          password: this.password,
          role: this.role
        };
  
        if (this.isAlumno) {
          userData.nombre = this.nombre;
          userData.telefono = this.telefono;
          userData.codigo = this.codigo;
        }
  
        try {
          await axios.post('http://127.0.0.1:8000/api/register', userData);
          this.success = true;
          this.resetForm();
        } catch (error) {
          console.error('Error al registrar el usuario:', error);
          if (error.response && error.response.data && error.response.data.validation_errors) {
            this.error = Object.values(error.response.data.validation_errors).flat().join(', ');
          } else {
            this.error = 'Hubo un problema al registrar el usuario. Intenta nuevamente.';
          }
        }
      },
      resetForm() {
        this.name = '';
        this.email = '';
        this.password = '';
        this.role = 'alumno';
        this.nombre = '';
        this.telefono = '';
        this.codigo = '';
      }
    }
  };
  </script>
  
  <style scoped>
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #1e1e2f;
    color: #ffffff;
  }
  
  .register-box {
    background-color: #2d3748;
    padding: 30px;
    border-radius: 10px;
    width: 100%;
    max-width: 450px;
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
  
  label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="password"],
  select {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: none;
    outline: none;
    font-size: 14px;
    background-color: #333d57;
    color: #fff;
  }
  
  input::placeholder {
    color: #c2c6dc;
  }
  
  .register-button {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
    border: none;
    background-color: #4bc0c0;
    color: #ffffff;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .register-button:hover {
    background-color: #44adaf;
  }
  
  .error-message {
    color: #ff6b6b;
    font-size: 14px;
    margin-top: 5px;
  }
  
  .success-message {
    color: #4bc0c0;
    font-size: 14px;
    margin-top: 5px;
  }
  </style>
  