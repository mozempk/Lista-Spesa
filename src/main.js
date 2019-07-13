// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VueCordova from 'vue-cordova'
import VueHead from 'vue-head'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import './assets/stylus-overrides.styl'
import store from './store'
import VueTouch from 'vue-touch'
Vue.use(Vuetify,{
  theme: {
    primary: "#3F51B5",
    secondary: "#82B1FF",
    accent: "#4527A0",
    error: "#f44336",
    warning: "#ffeb3b",
    info: "#BBDEFB",
    success: "#2962FF"
  }
})
Vue.use(Vuex)
Vue.use(VueTouch)
Vue.config.productionTip = false
Vue.use(VueCordova)
Vue.use(VueHead)
// add cordova.js only if serving the app through file://
if (window.location.protocol === 'file:' || window.location.port === '3001') {
  var cordovaScript = document.createElement('script')
  cordovaScript.setAttribute('type', 'text/javascript')
  cordovaScript.setAttribute('src', 'cordova.js')
  document.body.appendChild(cordovaScript)
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  head: {
    meta: [
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      }
    ]
  },
  store
})
