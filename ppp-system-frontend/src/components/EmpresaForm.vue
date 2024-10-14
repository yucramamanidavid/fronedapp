<template>
    <div>
      <h2>{{ isEditing ? 'Editar Empresa' : 'Crear Nueva Empresa' }}</h2>
      <form @submit.prevent="guardarEmpresa">
        <label>Nombre:</label>
        <input type="text" v-model="empresa.nombre" required />
  
        <label>Dirección:</label>
        <input type="text" v-model="empresa.direccion" />
  
        <label>Teléfono:</label>
        <input type="text" v-model="empresa.telefono" />
  
        <label>Email:</label>
        <input type="email" v-model="empresa.email" />
  
        <label>Website:</label>
        <input type="url" v-model="empresa.website" />
  
        <label>Nombre de Contacto:</label>
        <input type="text" v-model="empresa.contacto_nombre" />
  
        <label>Teléfono de Contacto:</label>
        <input type="text" v-model="empresa.contacto_telefono" />
  
        <label>Email de Contacto:</label>
        <input type="email" v-model="empresa.contacto_email" />
  
        <label>Notas:</label>
        <textarea v-model="empresa.notas"></textarea>
  
        <label>Estado:</label>
        <select v-model="empresa.estado" required>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
  
        <button type="submit">{{ isEditing ? 'Actualizar' : 'Guardar' }}</button>
  
        <p v-if="error" style="color: red;">{{ error }}</p>
        <p v-if="success" style="color: green;">Empresa guardada exitosamente.</p>
      </form>
    </div>
  </template>
  
  <script>
  import EmpresaService from '../services/EmpresaService';
  
  export default {
    data() {
      return {
        empresa: {
          nombre: '',
          direccion: '',
          telefono: '',
          email: '',
          website: '',
          contacto_nombre: '',
          contacto_telefono: '',
          contacto_email: '',
          notas: '',
          estado: 'activo'
        },
        error: '',
        success: false
      };
    },
    computed: {
      isEditing() {
        return !!this.$route.params.id;
      }
    },
    methods: {
      async cargarEmpresa() {
        try {
          const response = await EmpresaService.getEmpresa(this.$route.params.id);
          this.empresa = response.data;
        } catch (error) {
          console.error('Error al cargar la empresa:', error);
          this.error = 'Hubo un problema al cargar la información de la empresa.';
        }
      },
      async guardarEmpresa() {
        this.error = '';
        this.success = false;
        try {
          if (this.isEditing) {
            await EmpresaService.updateEmpresa(this.$route.params.id, this.empresa);
          } else {
            await EmpresaService.createEmpresa(this.empresa);
          }
          this.success = true;
          this.$router.push({ name: 'ListaEmpresas' });
        } catch (error) {
          console.error('Error al guardar la empresa:', error);
          if (error.response && error.response.data.validation_errors) {
            this.error = Object.values(error.response.data.validation_errors).flat().join(', ');
          } else {
            this.error = 'Hubo un problema al guardar la empresa. Intenta nuevamente.';
          }
        }
      }
    },
    mounted() {
      if (this.isEditing) {
        this.cargarEmpresa();
      }
    }
  };
  </script>
  