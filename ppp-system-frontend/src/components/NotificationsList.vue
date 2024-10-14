<template>
    <div>
      <h2>Notificaciones</h2>
      <!-- Aquí se mostrarían las notificaciones -->
      <ul>
        <li v-for="notification in notifications" :key="notification.id">
          {{ notification.message }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        notifications: [
          { id: 1, message: "Notificación de prueba 1" },
          { id: 2, message: "Notificación de prueba 2" }
        ]
      };
    }
  };
  </script>
  