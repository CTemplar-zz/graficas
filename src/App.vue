<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      height="100"
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          :src="require('./assets/logo-left.jpeg')"
          transition="scale-transition"
          width="160"
        />
      </div>

      <v-spacer></v-spacer>
      
      <v-toolbar-title>Herramienta para gráfico de datos metereologicos</v-toolbar-title>

      <v-spacer></v-spacer>

      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          :src="require('./assets/logo-right.jpeg')"
          transition="scale-transition"
          width="80"
        />
      </div>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
