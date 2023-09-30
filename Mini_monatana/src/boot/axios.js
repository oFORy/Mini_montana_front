import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: 'http://localhost:23400' })
// const api = axios.create({ baseURL: '' })

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  // Перехватчик запросов, прежде чем запрос уйдет, мы добавляем к нему доп парметры
  api.interceptors.request.use(function (config) {
    const headres = {
      headers: {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
      }
    }
    config.headers = headres
    config.withCredentials = true
    config.validateStatus = function (status) {
      return (status >= 200 && status < 500) && status !== 401 // default
    }

    return config
  }, function (err) {
    return Promise.reject(err)
  })

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
