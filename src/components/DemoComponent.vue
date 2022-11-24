<!-- declaring html template -->
<template>
  <div class="hello">
    <!-- example access state by mapped properties from store -->
    <p>campagne getter: {{ getCampagneMappedFromStore }}</p>
    <p>campagne state: {{ campagneMappedFromStore }}</p>

    <!-- access store property from store by store name + const word "Store" -->
    <!-- https://pinia.vuejs.org/cookbook/options-api.html -->
    <!-- example for accessing 'appConfig' getCampagne getter -->
    <p>
      campagne state from mapStores(useAppConfigStore) :
      {{ appConfigStore.campagne }}
    </p>

    <!-- example using value from props in template -->
    <p>Value from props : {{ title }}</p>

    <!-- router links -->
    <router-link to="/about">Link to another Router v4 page</router-link>
  </div>
</template>

<!-- script tag without setup option as we using Options API -->
<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import useAppConfigStore from '@/store/stores/useAppConfigStore'
import { mapState, mapStores } from 'pinia'

// declaring internal interfaces
interface ComplexProps {
  firstValue: string // required
  secondfValue?: number // optional props with "?"
}

// declaring component
export default defineComponent({
  props: {
    title: { type: String, required: true }, // if required should be mark explicitly with "required: true"
    objectWithComplexProps: { type: Object as PropType<ComplexProps> },
  },
  computed: {
    // 1st option : mapStores : get all state from store without mapping names
    ...mapStores(useAppConfigStore),

    // 2nd option: mapState : get only what needed with name mapping
    ...mapState(useAppConfigStore, {
      getCampagneMappedFromStore: 'getCampagne',
      campagneMappedFromStore: 'campagne',
    }),
    // state properties are not private in Pinia, so no real benefit to using getters ->
    // we can using state directly in components
  },
})
</script>

<!-- declaring styles -->
<style scoped>
.hello {
  background-color: aliceblue;
  padding: 2rem;
}
</style>
