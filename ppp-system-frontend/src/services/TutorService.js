import apiClient from './axios';

export default {
  getTutores() {
    return apiClient.get('/tutores');
  },
  asignarAlumno(tutorId, alumnoId) {
    return apiClient.post(`/tutores/${tutorId}/asignar-alumno`, { alumno_id: alumnoId });
  },
  updateAlumnoEstado(tutorId, alumnoId, estado) {
    return apiClient.put(`/tutores/${tutorId}/alumnos/${alumnoId}/estado`, { estado });
  },
  getAssignedAlumnos(tutorId) {
    return apiClient.get(`/tutores/${tutorId}/alumnos-asignados`);
  }
};
