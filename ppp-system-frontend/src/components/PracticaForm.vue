<template>
  <div>
    <h2>{{ isEditing ? 'Editar Práctica' : 'Registrar Nueva Práctica' }}</h2>
    <form @submit.prevent="guardarPractica">
      <!-- Campo de Alumno: Solo visible para admin/tutor -->
      <div v-if="!isAlumno">
        <label>Alumno (Buscar por Código o Nombre):</label>
        <input 
          type="text" 
          v-model="codigoBusqueda" 
          @input="buscarAlumnoPorCodigo"
          placeholder="Ingrese el código o nombre del alumno"
          autocomplete="off"
        />
        <!-- Sugerencias de autocompletado -->
        <ul v-if="alumnosFiltrados.length" class="autocomplete-list">
          <li 
            v-for="alumno in alumnosFiltrados" 
            :key="alumno.id" 
            @click="seleccionarAlumno(alumno)"
          >
            {{ alumno.nombre }} ({{ alumno.codigo }})
          </li>
        </ul>
      </div>

      <!-- Mostrar el código del alumno en modo de solo lectura para el rol alumno -->
      <div v-else>
        <label>Mi Código:</label>
        <input type="text" :value="codigoAlumno" readonly />
      </div>

      <label>Empresa:</label>
      <input type="text" v-model="practica.empresa" required>

      <label>Fecha:</label>
      <input type="date" v-model="practica.fecha" required>

      <label>Horas:</label>
      <input type="number" v-model="practica.horas" required min="1">

      <label>Descripción:</label>
      <textarea v-model="practica.descripcion"></textarea>

      <!-- Campo de Estado: Solo visible para admin/tutor -->
      <div v-if="!isAlumno">
        <label>Estado:</label>
        <select v-model="practica.estado" required>
          <option value="pendiente">Pendiente</option>
          <option value="aprobado">Aprobado</option>
          <option value="rechazado">Rechazado</option>
        </select>
      </div>

      <button type="submit">{{ isEditing ? 'Actualizar' : 'Guardar' }}</button>

      <!-- Mostrar mensajes de error -->
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
import PracticaService from '../services/PracticaService';
import AlumnoService from '../services/AlumnoService';

export default {
  data() {
    return {
      practica: {
        empresa: '',
        fecha: '',
        horas: 1,
        descripcion: '',
        alumno_id: null,
        estado: 'pendiente'
      },
      codigoBusqueda: '',   // Almacena el código o nombre de búsqueda
      alumnos: [],          // Lista completa de alumnos
      alumnosFiltrados: [], // Lista de alumnos filtrados para autocompletar
      error: '',
      errorDetails: [],
      codigoAlumno: '' // Almacena el código del alumno para mostrarlo
    };
  },
  computed: {
    isEditing() {
      return !!this.$route.params.practicaId;
    },
    isAlumno() {
      return localStorage.getItem('role') === 'alumno';
    }
  },
  methods: {
    async guardarPractica() {
      try {
        if (this.isAlumno) {
          this.practica.alumno_id = localStorage.getItem('alumnoId'); // Forzamos el id del alumno
        }
        
        if (this.isEditing) {
          await PracticaService.updatePractica(this.$route.params.practicaId, this.practica);
        } else {
          await PracticaService.createPractica(this.practica);
        }

        this.$router.push({ name: 'PracticaList', params: { alumnoId: this.practica.alumno_id } });
      } catch (error) {
        this.handleErrors(error);
      }
    },
    async cargarDatosAlumno() {
      if (this.isAlumno) {
        try {
          const response = await AlumnoService.getAlumno(localStorage.getItem('alumnoId'));
          this.codigoAlumno = response.data.codigo;
          this.practica.alumno_id = response.data.id; // Asegura que el ID esté correctamente configurado
        } catch (error) {
          console.error('Error al cargar datos del alumno:', error);
          this.error = 'No se pudieron cargar los datos del alumno.';
        }
      }
    },
    async cargarAlumnos() {
      try {
        const response = await AlumnoService.getAlumnos();
        this.alumnos = response.data;
        this.alumnosFiltrados = this.alumnos;
      } catch (error) {
        console.error('Error al cargar alumnos:', error);
      }
    },
    buscarAlumnoPorCodigo() {
      if (!this.codigoBusqueda) {
        this.alumnosFiltrados = this.alumnos;
      } else {
        this.alumnosFiltrados = this.alumnos.filter(alumno =>
          alumno.codigo.includes(this.codigoBusqueda) ||
          alumno.nombre.toLowerCase().includes(this.codigoBusqueda.toLowerCase())
        );
      }
    },
    seleccionarAlumno(alumno) {
      this.practica.alumno_id = alumno.id;
      this.codigoBusqueda = `${alumno.nombre} (${alumno.codigo})`;
      this.alumnosFiltrados = [];
    },
    async cargarPractica() {
      try {
        const response = await PracticaService.getPractica(this.$route.params.practicaId);
        this.practica = response.data;

        if (response.data.alumno) {
          this.codigoBusqueda = `${response.data.alumno.nombre} (${response.data.alumno.codigo})`;
          this.practica.alumno_id = response.data.alumno.id;
        }
      } catch (error) {
        this.error = 'Hubo un problema al cargar los datos de la práctica.';
      }
    },
    handleErrors(error) {
      this.error = '';
      this.errorDetails = [];
      if (error.response && error.response.status === 422) {
        this.error = 'Error de validación: corrige los errores a continuación.';
        if (error.response.data && error.response.data.errors) {
          this.errorDetails = Object.values(error.response.data.errors).flat();
        } else {
          this.errorDetails = ['Ocurrió un error de validación.'];
        }
      } else {
        this.error = 'Hubo un problema al guardar la práctica. Intenta nuevamente.';
      }
    }
  },
  mounted() {
    if (this.isAlumno) {
      this.cargarDatosAlumno();
    } else {
      this.cargarAlumnos();
    }

    if (this.isEditing) {
      this.cargarPractica();
    }
  }
};
</script>

<style scoped>
.autocomplete-list {
  border: 1px solid #ccc;
  list-style-type: none;
  padding: 0;
  margin-top: 0;
  max-height: 150px;
  overflow-y: auto;
}

.autocomplete-list li {
  padding: 5px;
  cursor: pointer;
}

.autocomplete-list li:hover {
  background-color: #f0f0f0;
}
</style>
