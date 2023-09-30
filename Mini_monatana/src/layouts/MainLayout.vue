<template>
  <q-layout view="hHh lpr fFf" class="layout-mini">
    <q-page-container class="container-page">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MiniLayout",
});
</script>

<style lang="scss" scoped>
.container-page {
  background-color: #1E1E1E;
  padding: 1em;
}
</style>
