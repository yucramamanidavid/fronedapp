<template>
    <div>
      <h2>Lista de Empresas</h2>
      <button @click="nuevaEmpresa">Crear Empresa</button>
      
      <table v-if="empresas.length" border="1">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="empresa in empresas" :key="empresa.id">
            <td>{{ empresa.nombre }}</td>
            <td>{{ empresa.direccion }}</td>
            <td>{{ empresa.telefono }}</td>
            <td>{{ empresa.email }}</td>
            <td>{{ empresa.estado }}</td>
            <td>
              <button @click="editarEmpresa(empresa.id)">Editar</button>
              <button @click="eliminarEmpresa(empresa.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <p v-else>No hay empresas registradas.</p>
    </div>
  </template>
  
  <script>
  import EmpresaService from '../services/EmpresaService';
  
  export default {
    data() {
      return {
        empresas: [],
        error: ''
      };
    },
    methods: {
      async cargarEmpresas() {
        try {
          const response = await EmpresaService.getEmpresas();
          this.empresas = response.data;
        } catch (error) {
          console.error('Error al cargar empresas:', error);
          this.error = 'Hubo un problema al cargar las empresas.';
        }
      },
      nuevaEmpresa() {
        this.$router.push({ name: 'CrearEmpresa' });
      },
      editarEmpresa(id) {
        this.$router.push({ name: 'EditarEmpresa', params: { id } });
      },
      async eliminarEmpresa(id) {
        if (confirm('¿Estás seguro de eliminar esta empresa?')) {
          try {
            await EmpresaService.deleteEmpresa(id);
            this.cargarEmpresas();
          } catch (error) {
            console.error('Error al eliminar empresa:', error);
            this.error = 'Hubo un problema al eliminar la empresa.';
          }
        }
      }
    },
    mounted() {
      this.cargarEmpresas();
    }
  };
  </script>
  