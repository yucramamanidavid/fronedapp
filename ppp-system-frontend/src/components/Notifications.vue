<template>
    <div>
      <h2>Notificaciones</h2>
      <ul v-if="notifications.length">
        <li v-for="notification in notifications" :key="notification.id">
          {{ notification.message }}
          <button @click="markAsRead(notification.id)">Marcar como leída</button>
        </li>
      </ul>
      <p v-else>No tienes notificaciones nuevas.</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        notifications: []
      };
    },
    methods: {
      async fetchNotifications() {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/notifications', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          this.notifications = response.data;
        } catch (error) {
          console.error('Error al obtener las notificaciones:', error);
        }
      },
      async markAsRead(id) {
        try {
          await axios.put(`http://127.0.0.1:8000/api/notifications/${id}/mark-as-read`, {}, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          this.notifications = this.notifications.filter(notification => notification.id !== id);
        } catch (error) {
          console.error('Error al marcar la notificación como leída:', error);
        }
      }
    },
    mounted() {
      this.fetchNotifications();
    }
  };
  </script>
  