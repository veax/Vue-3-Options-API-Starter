<template>
  <div>Page Recherche avancee</div>
  <DemoComponent title="title from props" />
</template>

<script lang="ts">
// imports
import { defineComponent } from 'vue'
import DemoComponent from '@/components/DemoComponent.vue'

// component
export default defineComponent({
  // name of component (optional)
  name: 'App',

  // mark all components from import in components object for using in <template>
  components: {
    DemoComponent,
  },
})
</script>
