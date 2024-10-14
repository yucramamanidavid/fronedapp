<template>
  <div>
    <h2>Prácticas de {{ alumno.nombre }}</h2>

    <router-link :to="{ name: 'RegistrarPractica', params: { alumnoId: alumno.id } }">
      <button>Registrar Nueva Práctica</button>
    </router-link>

    <table v-if="practicas.length" border="1">
      <thead>
        <tr>
          <th>Empresa</th>
          <th>Fecha</th>
          <th>Horas</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th>Evidencia</th>
          <th>Estado de Evidencia</th>
          <th>Acciones</th>
          <th>Acción de Solicitud</th>
          <th>Historial</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="practica in practicas" :key="practica.id">
          <td>{{ practica.empresa }}</td>
          <td>{{ practica.fecha }}</td>
          <td>{{ practica.horas }}</td>
          <td>{{ practica.descripcion }}</td>
          <td>{{ practica.estado }}</td>
          <td>
            <div v-if="isAlumno && practica.estado === 'aprobado' && !practica.evidencia_url">
              <form @submit.prevent="subirEvidencia(practica.id)">
                <input type="file" @change="onFileChange" required>
                <button type="submit">Subir Evidencia</button>
              </form>
            </div>

            <div v-else>
              <a v-if="practica.evidencia_url" :href="practica.evidencia_url" target="_blank">Ver Evidencia</a>
              <span v-else>No hay evidencia</span>
            </div>
          </td>
          <td>{{ practica.estado_evidencia || 'pendiente de revisión' }}</td>
          <td>
            
            <router-link :to="{ name: 'EditarPractica', params: { alumnoId: alumno.id, practicaId: practica.id } }">
              <button>Editar</button>
            </router-link>
            <button @click="eliminarPractica(practica.id)">Eliminar</button>
          </td>
          <td>
            <div v-if="isTutorOrAdmin">
              <button v-if="practica.estado === 'pendiente'" @click="cambiarEstadoPractica(practica.id, 'aprobado')">Aprobar Práctica</button>
              <button v-if="practica.estado === 'pendiente'" @click="cambiarEstadoPractica(practica.id, 'rechazado')">Rechazar Práctica</button>
              <button v-if="practica.evidencia_url && practica.estado_evidencia === 'pendiente de revisión'" @click="cambiarEstadoEvidencia(practica.id, 'aprobado')">Aprobar Evidencia</button>
              <button v-if="practica.evidencia_url && practica.estado_evidencia === 'pendiente de revisión'" @click="cambiarEstadoEvidencia(practica.id, 'rechazado')">Rechazar Evidencia</button>
            </div>
          </td>
          <td>
            <button @click="abrirHistorial(practica.id)">Ver Historial</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>No hay prácticas registradas para este alumno.</p>

    <div v-if="error" style="color: red;">
      <p>{{ error }}</p>
    </div>

    <!-- Modal de Historial de Evidencias -->
    <div v-if="mostrarHistorial" class="modal">
      <div class="modal-content">
        <span class="close" @click="cerrarHistorial">&times;</span>
        <h3>Historial de Evidencias</h3>
        <ul>
          
          <li v-for="evidencia in historialEvidencias" :key="evidencia.id">
            Fecha: {{ evidencia.fecha }} | <a :href="evidencia.url" target="_blank">Ver Archivo</a>
          </li>
        </ul>
      </div>
    </div>
    
  </div>
</template>

<script>
import PracticaService from '../services/PracticaService';
import AlumnoService from '../services/AlumnoService';

export default {
  data() {
    return {
      practicas: [],
      alumno: {},
      error: '',
      evidencia: null,
      mostrarHistorial: false,
      historialEvidencias: []
    };
  },
  computed: {
    isTutorOrAdmin() {
      const role = localStorage.getItem('role');
      return role === 'tutor' || role === 'admin';
    },
    isAlumno() {
      return localStorage.getItem('role') === 'alumno';
    }
  },
  methods: {
    onFileChange(event) {
      this.evidencia = event.target.files[0];
    },
    async cargarPracticas(alumnoId) {
      try {
        const response = await PracticaService.getPracticas(alumnoId);
        this.practicas = response.data.map(practica => ({
          ...practica,
          evidencia_url: practica.evidencia ? `/uploads/${practica.evidencia}` : null
        }));
      } catch (error) {
        console.error('Error al cargar prácticas:', error);
        this.error = 'Hubo un problema al cargar las prácticas. Intenta nuevamente.';
      }
    },
    async cargarAlumno(alumnoId) {
    console.log("Cargando datos del alumno con ID:", alumnoId); // Verifica el ID
    try {
        const response = await AlumnoService.getAlumno(alumnoId);
        this.alumno = response.data;
    } catch (error) {
        console.error('Error al cargar alumno:', error);
        if (error.response && error.response.status === 404) {
            this.error = 'El alumno no fue encontrado.';
        } else {
            this.error = 'Hubo un problema al cargar la información del alumno.';
        }
    }
},

    async eliminarPractica(practicaId) {
      if (confirm('¿Estás seguro de eliminar esta práctica?')) {
        try {
          await PracticaService.deletePractica(practicaId);
          this.practicas = this.practicas.filter(practica => practica.id !== practicaId);
        } catch (error) {
          console.error('Error al eliminar práctica:', error);
          this.error = 'Hubo un problema al eliminar la práctica. Intenta nuevamente.';
        }
      }
    },
    async cambiarEstadoPractica(practicaId, nuevoEstado) {
      try {
        await PracticaService.updatePractica(practicaId, { estado: nuevoEstado });
        this.cargarPracticas(this.alumno.id);
      } catch (error) {
        console.error('Error al cambiar el estado de la práctica:', error);
        this.error = 'No se pudo cambiar el estado de la práctica. Intenta nuevamente.';
      }
    },
    async subirEvidencia(practicaId) {
      if (!this.evidencia) {
        this.error = 'Por favor, selecciona un archivo de evidencia.';
        return;
      }
      const formData = new FormData();
      formData.append('evidencia', this.evidencia);
      try {
        await PracticaService.uploadEvidencia(practicaId, formData);
        alert('Evidencia subida con éxito');
        this.cargarPracticas(this.alumno.id);
      } catch (error) {
        console.error('Error al subir la evidencia:', error);
        this.error = 'Hubo un problema al subir la evidencia. Intenta nuevamente.';
      }
    },
    async cambiarEstadoEvidencia(practicaId, nuevoEstadoEvidencia) {
      try {
        await PracticaService.updateEstadoEvidencia(practicaId, { estado_evidencia: nuevoEstadoEvidencia });
        this.cargarPracticas(this.alumno.id);
      } catch (error) {
        console.error('Error al cambiar el estado de la evidencia:', error);
        this.error = 'No se pudo cambiar el estado de la evidencia. Intenta nuevamente.';
      }
    },
    async abrirHistorial(practicaId) {
      try {
        const response = await PracticaService.getEvidenciasHistorial(practicaId);
        this.historialEvidencias = response.data;
        this.mostrarHistorial = true;
      } catch (error) {
        console.error('Error al cargar el historial de evidencias:', error);
        this.error = 'Hubo un problema al cargar el historial. Intenta nuevamente.';
      }
    },
    cerrarHistorial() {
      this.mostrarHistorial = false;
      this.historialEvidencias = [];
    }
  },
  mounted() {
    const alumnoId = localStorage.getItem('alumnoId');
    if (alumnoId) {
        console.log(`Cargando datos del alumno con ID: ${alumnoId}`);
        this.cargarAlumno(alumnoId);
        this.cargarPracticas(alumnoId);
    } else {
        console.error("No se encontró el alumnoId");
        this.error = 'No se pudo cargar el alumno. Por favor, verifica tus datos.';
    }
}



  
};
</script>

<style>
/* Estilos para la tabla, modal, y otros elementos */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  width: 300px;
  border-radius: 8px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
}
</style>
