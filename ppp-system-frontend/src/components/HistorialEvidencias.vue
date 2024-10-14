<template>
    <div>
      <h3>Historial de Evidencias para {{ practica.empresa }}</h3>
      <label>Año:</label>
      <input type="number" v-model="year" @input="filtrarHistorial">
  
      <ul v-if="historial.length">
        <li v-for="evidencia in historial" :key="evidencia.id">
          {{ evidencia.fecha_subida }} - 
          <a :href="`/storage/${evidencia.archivo}`" target="_blank">Ver Evidencia</a>
        </li>
      </ul>
      <p v-else>No hay evidencias para el año seleccionado.</p>
    </div>
  </template>
  
  <script>
  import PracticaService from '../services/PracticaService';
  
  export default {
    props: ['practicaId'],
    data() {
      return {
        year: new Date().getFullYear(),
        historial: []
      };
    },
    methods: {
      async cargarHistorial() {
        try {
          const response = await PracticaService.getHistorialEvidencias(this.practicaId, { year: this.year });
          this.historial = response.data;
        } catch (error) {
          console.error('Error al cargar historial de evidencias:', error);
        }
      },
      filtrarHistorial() {
        this.cargarHistorial();
      }
    },
    mounted() {
      this.cargarHistorial();
    }
  };
  </script>
  