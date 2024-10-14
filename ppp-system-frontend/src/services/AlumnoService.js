import apiClient from './axios';

export default {
  getAlumnos() {
    return apiClient.get('/alumnos');
  },
  getAlumno(id) {
    return apiClient.get(`/alumnos/${id}`);
  },
  createAlumno(alumno) {
    return apiClient.post('/alumnos', alumno);
  },
  updateAlumno(id, alumno) {
    return apiClient.put(`/alumnos/${id}`, alumno);
  },
  deleteAlumno(id) {
    return apiClient.delete(`/alumnos/${id}`);
  },
  buscarPorCodigo(codigo) {
    return apiClient.get(`/alumnos/codigo/${codigo}`);
  },
  
};
