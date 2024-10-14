import apiClient from './axios';

export default {
  // Listar todas las empresas
  getEmpresas() {
    return apiClient.get('/empresas');
  },

  // Crear una nueva empresa
  createEmpresa(empresa) {
    return apiClient.post('/empresas', empresa);
  },

  // Obtener una empresa por ID
  getEmpresa(id) {
    return apiClient.get(`/empresas/${id}`);
  },

  // Actualizar una empresa
  updateEmpresa(id, empresa) {
    return apiClient.put(`/empresas/${id}`, empresa);
  },

  // Eliminar una empresa
  deleteEmpresa(id) {
    return apiClient.delete(`/empresas/${id}`);
  }
};
