<template>
  <q-page class="flex flex-start justify-center">
    <div class="column full-width" style="gap: 1em">
      <div class="column items-center full-width" >
        <img
          alt="Logo"
          @click="this.$router.push({name: 'HomePage'})"
          src="~assets/logo_montana.png"
          style="width: 36px; height: 50px"
        >
      </div>

      <div>
        <span class="fs-xl text-white"><b>Поддержка</b></span>
      </div>
      
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',

  data() {
    return {
      country: 1,
      countyOptions: [
        { id: 1, value: 'Испания'},
        { id: 2, value: 'Франция'},
        { id: 3, value: 'ОАЭ'},
        { id: 3, value: 'Мексика'},
      ]
    }
  },
  mounted() {
    window.Telegram.WebApp.MainButton.setText('НАЗАД')
    window.Telegram.WebApp.MainButton.show()
    const f = () => this.$route.push({name:'HomePage'})
    window.Telegram.WebApp.MainButton.onClick(f)
  }
})
</script>

<style lang="scss" scoped>
.grid_two_column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1em;
}
:deep(.q-field__native) {
  color: white;
}
</style>
