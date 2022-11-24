<!-- html template -->
<template>
  <div id="#app">
    <router-view />
  </div>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<!-- Vue 3 Options API -->
<script lang="ts">
// imports
import { defineComponent } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue'

// component
export default defineComponent({
  // name of component (optional)
  name: 'App',

  // mark all components from import in components object for using in <template>
  components: {
    HelloWorld,
  },
})
</script>

<!-- styles -->
<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
