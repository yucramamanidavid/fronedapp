<template>
  <div>
    <h2>Lista de Alumnos</h2>
  
    <!-- Botón para agregar un nuevo alumno -->
    <button @click="crearAlumno">Agregar Nuevo Alumno</button>
    
    <!-- Campo de búsqueda por código -->
    <input 
      type="text" 
      v-model="codigoBusqueda" 
      placeholder="Buscar por código"
      @keyup.enter="buscarAlumno"
    >

    <!-- Tabla de alumnos -->
    <table v-if="alumnos.length" border="1">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Código</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="alumno in alumnos" :key="alumno.id">
          <td>{{ alumno.nombre }}</td>
          <td>{{ alumno.email }}</td>
          <td>{{ alumno.telefono }}</td>
          <td>{{ alumno.codigo }}</td>
          <td>
            <!-- Enlace para ver prácticas del alumno -->
            <router-link :to="{ name: 'PracticaList', params: { alumnoId: alumno.id } }">
              <button>Ver Prácticas</button>
            </router-link>
            
            <!-- Botón para editar alumno -->
            <button @click="editarAlumno(alumno.id)">Editar</button>

            <!-- Botón para eliminar alumno -->
            <button @click="eliminarAlumno(alumno.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- Mensaje si no hay alumnos -->
    <div v-else>
      No hay alumnos registrados.
    </div>
  </div>
</template>

<script>
import AlumnoService from '../services/AlumnoService';

export default {
  data() {
    return {
      alumnos: [],        // Lista de alumnos
      codigoBusqueda: ''  // Código para la búsqueda
    };
  },
  methods: {
    async obtenerAlumnos() {
      try {
        const response = await AlumnoService.getAlumnos();
        this.alumnos = response.data;
      } catch (error) {
        console.error("Error al obtener los alumnos:", error);
      }
    },
    async buscarAlumno() {
      if (this.codigoBusqueda) {
        try {
          const response = await AlumnoService.buscarPorCodigo(this.codigoBusqueda);
          this.alumnos = [response.data];
        } catch (error) {
          this.alumnos = [];
          console.error("Error al buscar el alumno:", error);
        }
      } else {
        this.obtenerAlumnos();
      }
    },
    async eliminarAlumno(id) {
      if (confirm('¿Estás seguro de eliminar este alumno?')) {
        try {
          await AlumnoService.deleteAlumno(id);
          this.alumnos = this.alumnos.filter(alumno => alumno.id !== id);
        } catch (error) {
          console.error("Error al eliminar el alumno:", error);
        }
      }
    },
    editarAlumno(id) {
      this.$router.push({ name: 'EditarAlumno', params: { id } });
    },
    crearAlumno() {
      this.$router.push({ name: 'CrearAlumno' });
    }
  },
  mounted() {
    this.obtenerAlumnos();
  }
};
</script>
