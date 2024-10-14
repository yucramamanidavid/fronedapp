
<template>
    <div>
      <h2>{{ isEditing ? 'Editar Tutor' : 'Registrar Nuevo Tutor' }}</h2>
      <form @submit.prevent="guardarTutor">
        <label>Nombre Completo:</label>
        <input type="text" v-model="tutor.nombre" required maxlength="255" />
  
        <label>Email:</label>
        <input type="email" v-model="tutor.email" required />
  
        <label>Teléfono:</label>
        <input type="text" v-model="tutor.telefono" maxlength="20" />
  
        <button type="submit">{{ isEditing ? 'Actualizar' : 'Guardar' }}</button>
  
        <p v-if="error" style="color: red;">{{ error }}</p>
        <p v-if="success" style="color: green;">{{ success }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import TutorService from '../services/TutorService';
  
  export default {
    data() {
      return {
        tutor: {
          nombre: '',
          email: '',
          telefono: ''
        },
        error: '',
        success: '',
      };
    },
    computed: {
      isEditing() {
        return !!this.$route.params.id;
      }
    },
    methods: {
      async guardarTutor() {
        this.error = '';
        this.success = '';
  
        try {
          if (this.isEditing) {
            await TutorService.updateTutor(this.$route.params.id, this.tutor);
            this.success = 'Tutor actualizado exitosamente';
          } else {
            await TutorService.createTutor(this.tutor);
            this.success = 'Tutor registrado exitosamente';
          }
          this.$router.push({ name: 'ListaTutores' });
        } catch (error) {
          console.error('Error al guardar el tutor:', error);
          this.error = 'Hubo un problema al guardar el tutor. Intenta nuevamente.';
        }
      },
      async cargarTutor() {
        try {
          const response = await TutorService.getTutor(this.$route.params.id);
          this.tutor = response.data;
        } catch (error) {
          console.error('Error al cargar el tutor:', error);
          this.error = 'Hubo un problema al cargar los datos del tutor.';
        }
      }
    },
    mounted() {
      if (this.isEditing) {
        this.cargarTutor();
      }
    }
  };
  </script>
  