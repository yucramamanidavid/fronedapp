<template>
    <div>
      <h2>Asignar Alumno a Tutor</h2>
      <label for="tutor">Selecciona un Tutor:</label>
      <select v-model="selectedTutor">
        <option v-for="tutor in tutores" :key="tutor.id" :value="tutor.id">{{ tutor.nombre }}</option>
      </select>
  
      <label for="alumno">Selecciona un Alumno:</label>
      <select v-model="selectedAlumno">
        <option v-for="alumno in alumnos" :key="alumno.id" :value="alumno.id">{{ alumno.nombre }}</option>
      </select>
  
      <button @click="asignarAlumno">Asignar Alumno</button>
  
      <div v-if="message" class="success-message">{{ message }}</div>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </template>
  
  <script>
  import TutorService from '../services/TutorService';
  import AlumnoService from '../services/AlumnoService';
  
  export default {
    data() {
      return {
        tutores: [],
        alumnos: [],
        selectedTutor: null,
        selectedAlumno: null,
        message: '',
        error: ''
      };
    },
    methods: {
      async cargarDatos() {
        try {
          const tutorResponse = await TutorService.getTutores();
          const alumnoResponse = await AlumnoService.getAlumnos();
          this.tutores = tutorResponse.data;
          this.alumnos = alumnoResponse.data;
        } catch (error) {
          console.error('Error al cargar tutores o alumnos:', error);
          this.error = 'Hubo un problema al cargar los datos.';
        }
      },
      async asignarAlumno() {
        try {
          await TutorService.asignarAlumno(this.selectedTutor, this.selectedAlumno);
          this.message = 'Alumno asignado exitosamente';
          this.error = '';
        } catch (error) {
          console.error('Error al asignar alumno:', error);
          this.error = 'Hubo un problema al asignar el alumno.';
        }
      }
    },
    mounted() {
      this.cargarDatos();
    }
  };
  </script>
  
  <style>
  .success-message {
    color: green;
  }
  .error-message {
    color: red;
  }
  </style>
  