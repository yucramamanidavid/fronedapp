<template>
  <div>
    <h2>{{ isEditing ? 'Editar Alumno' : 'Crear Alumno' }}</h2>
    <form @submit.prevent="guardarAlumno">
      <label>Nombre:</label>
      <input type="text" v-model="alumno.nombre" required>
      
      <label>Email:</label>
      <input type="email" v-model="alumno.email" required>
      
      <label>Teléfono:</label>
      <input type="text" v-model="alumno.telefono" required>

      <label>Código:</label>
      <input type="text" v-model="alumno.codigo" required>
      
      <button type="submit">{{ isEditing ? 'Actualizar' : 'Guardar' }}</button>
      
      <!-- Mostrar mensaje de error si existe -->
      <div v-if="error" style="color: red;">
        <p>{{ error }}</p>
        <ul v-if="errorDetails.length">
          <li v-for="(err, index) in errorDetails" :key="index">{{ err }}</li>
        </ul>
      </div>
    </form>
  </div>
</template>

<script>
import AlumnoService from '../services/AlumnoService';

export default {
  data() {
    return {
      alumno: {
        nombre: '',
        email: '',
        telefono: '',
        codigo: '' // Campo 'codigo' incluido
      },
      error: '',           // Variable para almacenar el mensaje de error general
      errorDetails: []     // Almacena detalles de errores específicos
    };
  },
  computed: {
    // Determina si estamos en modo edición
    isEditing() {
      return !!this.$route.params.id;
    }
  },
  methods: {
    async guardarAlumno() {
      try {
        console.log('Datos del alumno a guardar:', this.alumno);  // Verifica los datos antes de enviarlos

        // Llamar a los métodos de creación o actualización según el modo actual
        if (this.isEditing) {
          await AlumnoService.updateAlumno(this.$route.params.id, this.alumno);
        } else {
          await AlumnoService.createAlumno(this.alumno);
        }
        
        this.$router.push('/'); // Redirige a la lista de alumnos
      } catch (error) {
        // Manejo de errores de validación 422
        if (error.response && error.response.status === 422) {
          console.error('Error de validación:', error.response.data.errors);
          this.error = 'Error de validación: Corrige los errores a continuación.';
          this.errorDetails = Object.values(error.response.data.errors).flat();
        } else {
          console.error('Error al guardar el alumno:', error);
          this.error = 'Hubo un problema al guardar el alumno. Intenta nuevamente.';
        }
      }
    },
    async obtenerAlumno() {
      try {
        const response = await AlumnoService.getAlumno(this.$route.params.id);
        this.alumno = response.data;
      } catch (error) {
        console.error('Error al obtener el alumno:', error);
        this.error = 'Hubo un problema al cargar los datos del alumno.';
      }
    }
  },
  mounted() {
    // Si estamos en modo edición, obtenemos los datos del alumno
    if (this.isEditing) {
      this.obtenerAlumno();
    }
  }
};
</script>
