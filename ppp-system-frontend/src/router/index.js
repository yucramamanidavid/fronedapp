// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import AlumnoList from '../components/AlumnoList.vue';
import PracticaList from '../components/PracticaList.vue';
import AlumnoForm from '../components/AlumnoForm.vue';
import PracticaForm from '../components/PracticaForm.vue';
import UserLogin from '@/components/UserLogin.vue';
import UserDashboard from '@/components/UserDashboard.vue';
import UserRegister from '@/components/UserRegister.vue';
import NotificationsList from '@/components/NotificationsList.vue';
import HelloWorld from '@/components/HelloWorld.vue';
import EmpresaList from '@/components/EmpresaList.vue';
import EmpresaForm from '@/components/EmpresaForm.vue';
import TutorList from '@/components/TutorList.vue';
import TutorForm from '@/components/TutorForm.vue';
import AsignarAlumno from '@/components/AsignarAlumno.vue';

const routes = [
  { path: '/alumnos', component: AlumnoList, name: 'ListaAlumnos' },
  { path: '/', component: HelloWorld, name: 'HelloWorld' },
  { path: '/login', component: UserLogin, name: 'Login' },
  { path: '/register', component: UserRegister, name: 'Register' },
  { path: '/dashboard', component: UserDashboard, name: 'Dashboard', meta: { requiresAuth: true, role: ['admin','tutor','alumno'] } },
  { path: '/editar-alumno/:id', component: AlumnoForm, name: 'EditarAlumno', meta: { requiresAuth: true, role: ['admin'] } },
  { path: '/crear-alumno', component: AlumnoForm, name: 'CrearAlumno', meta: { requiresAuth: true, role: ['admin'] } },
  // Ruta para los tutores
  { path: '/tutores', component: TutorList, name: 'TutorList', meta: { requiresAuth: true, role: ['admin','tutor'] } },
  { path: '/tutores/nuevo', component: TutorForm, name: 'CrearTutor', meta: { requiresAuth: true, role: ['admin','tutor'] } },
  { path: '/tutores/asignar-alumno', component: AsignarAlumno, name: 'AsignarAlumno', meta: { requiresAuth: true, role: ['admin', 'tutor'] } },

  { path: '/alumnos/:alumnoId/practicas', component: PracticaList, name: 'PracticaList', meta: { requiresAuth: true, role: ['admin', 'tutor', 'alumno'] } },
  { path: '/alumnos/:alumnoId/crear-practica', component: PracticaForm, name: 'RegistrarPractica', meta: { requiresAuth: true, role: ['admin', 'alumno'] } },
  { path: '/alumnos/:alumnoId/editar-practica/:practicaId', component: PracticaForm, name: 'EditarPractica', meta: { requiresAuth: true, role: ['admin'] } },
  { path: '/notifications', component: NotificationsList, name: 'Notifications', meta: { requiresAuth: true, role: ['admin', 'tutor', 'alumno'] } }, // Ruta para notificaciones accesible para todos los roles
  {
    path: '/practicas/:practicaId/historial',
    name: 'HistorialEvidencias',
    component: () => import('../components/HistorialEvidencias.vue'),
    props: true,
  },


  // Empresa
  { path: '/empresas', component: EmpresaList, name: 'ListaEmpresas', meta: { requiresAuth: true, role: ['admin'] } },
  { path: '/empresas/nueva', component: EmpresaForm, name: 'CrearEmpresa', meta: { requiresAuth: true, role: ['admin'] } },
  { path: '/empresas/:id/editar', component: EmpresaForm, name: 'EditarEmpresa', meta: { requiresAuth: true, role: ['admin'] } }
]
;

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Middleware para proteger las rutas basadas en la autenticación y el rol
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({ name: 'Login' });
    } else if (to.meta.role && !to.meta.role.includes(role)) {
      next({ name: 'HelloWorld' }); // Redirige si no tiene uno de los roles adecuados
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
