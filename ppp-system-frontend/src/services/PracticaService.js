import apiClient from './axios';

export default {
  getPracticas(alumnoId) {
    return apiClient.get(`/alumnos/${alumnoId}/practicas`);
  },
  createPractica(practica) {
    return apiClient.post('/practicas', practica);
  },
  updatePractica(practicaId, practica) {
    return apiClient.put(`/practicas/${practicaId}`, practica);
  },
  updateEstadoPractica(practicaId, estado) {  // Nuevo método para actualizar solo el estado
    return apiClient.put(`/practicas/${practicaId}`, { estado });
  },
  getPractica(practicaId) {
    return apiClient.get(`/practicas/${practicaId}`);
  },
  deletePractica(practicaId) {
    return apiClient.delete(`/practicas/${practicaId}`);
  },
  uploadEvidencia(practicaId, formData) {
    return apiClient.post(`/practicas/${practicaId}/upload-evidencia`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  updateEstadoEvidencia(practicaId, data) {  // <-- Asegúrate de agregar este método
    return apiClient.patch(`/practicas/${practicaId}/estado-evidencia`, data);
  },

  getEvidenciasHistorial(practicaId) {
    return apiClient.get(`/practicas/${practicaId}/historial-evidencias`);
  }
  
};
