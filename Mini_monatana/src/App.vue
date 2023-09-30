<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',  
  mounted () {
    try {
      window.Telegram.WebApp.ready()
      // window.Telegram.WebApp.MainButton.setText('Оформить заказ')
      // window.Telegram.WebApp.MainButton.show()
      // window.Telegram.WebApp.MainButton.onClick(function () {
      //   this.clickMainButton()
      // })
    } catch (err) {
      console.log(err)
    }
  },
})
</script>
