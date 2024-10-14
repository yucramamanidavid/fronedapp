
<template>
    <div>
      <h2>Lista de Tutores</h2>
      <router-link :to="{ name: 'CrearTutor' }">
        <button>Registrar Nuevo Tutor</button>
      </router-link>
      
      <table v-if="tutores.length" border="1">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tutor in tutores" :key="tutor.id">
            <td>{{ tutor.nombre }}</td>
            <td>{{ tutor.email }}</td>
            <td>{{ tutor.telefono }}</td>
            <td>
              <router-link :to="{ name: 'EditarTutor', params: { id: tutor.id } }">
                <button>Editar</button>
              </router-link>
              <button @click="eliminarTutor(tutor.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>No hay tutores registrados.</p>
  
      <p v-if="error" style="color: red;">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import TutorService from '../services/TutorService';
  
  export default {
    data() {
      return {
        tutores: [],
        error: ''
      };
    },
    methods: {
      async cargarTutores() {
        try {
          const response = await TutorService.getTutores();
          this.tutores = response.data;
        } catch (error) {
          console.error('Error al cargar tutores:', error);
          this.error = 'Hubo un problema al cargar los tutores. Intenta nuevamente.';
        }
      },
      async eliminarTutor(tutorId) {
        if (confirm('¿Estás seguro de eliminar este tutor?')) {
          try {
            await TutorService.deleteTutor(tutorId);
            this.cargarTutores(); // Recargar la lista de tutores después de eliminar uno
          } catch (error) {
            console.error('Error al eliminar tutor:', error);
            this.error = 'Hubo un problema al eliminar el tutor. Intenta nuevamente.';
          }
        }
      }
    },
    mounted() {
      this.cargarTutores();
    }
  };
  </script>
  