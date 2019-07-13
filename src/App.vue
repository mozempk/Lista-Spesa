<template>
  <v-app>
    <v-toolbar fixed app :clipped-left="clipped" color="primary" >
      <v-layout row justify-center align-center>
        <v-flex>
          <v-toolbar-title v-text="title" class="white--text"></v-toolbar-title>
        </v-flex>
        <v-flex class="white--text">
          {{new Date(lastUpdate).toLocaleDateString('it-it',{year: '2-digit', month: '2-digit', day: '2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'})}}
        </v-flex>
        <v-spacer></v-spacer>
        <v-btn large icon class="white--text" @click.stop="setLists">
          <v-icon large>refresh</v-icon>
        </v-btn>
        <v-btn icon large class="white--text" @click.stop="createList">
          <v-icon large>add_circle_outline</v-icon>
        </v-btn>    
      </v-layout>
    </v-toolbar>
    <v-content class="pt-5">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  import Vue from 'vue'
  import {mapActions, mapGetters} from 'vuex'
  export default {
    data () {
      return {
        cordova: Vue.cordova,
        clipped: false,
        drawer: true,
        items: [{
          icon: 'bubble_chart',
          title: 'Inspire'
        }],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Lista Spesa'
      }
    },
    created () {
      var self = this
      this.cordova.on('deviceready', () => {
        self.onDeviceReady()
      })
    },
    computed: {
      ...mapGetters([
        'lastUpdate',
        'loading',
        'error',
        'currentList'
      ])
    },
    methods: {
      ...mapActions([
        'createList',
        'setLists',
        'setCurrentList'
      ]),
      onDeviceReady: function () {
        // Handle the device ready event.
        this.cordova.on('pause', this.onPause, false)
        this.cordova.on('resume', this.onResume, false)
        if (this.cordova.device.platform === 'Android') {
          document.addEventListener('backbutton', this.onBackKeyDown, false)
        }
      },
      onPause () {
        // Handle the pause lifecycle event.
        console.log('pause')
      },
      onResume () {
        // Handle the resume lifecycle event.
        // SetTimeout required for iOS.
        setTimeout(function () {
          console.log('resume')
        }, 0)
      },
      onBackKeyDown () {
        if (this.$router.history.current.path == '/'){
          // Handle the back-button event on Android. By default it will exit the app.
          if (this.currentList == 'noList'){
            navigator.app.exitApp()
          } else {
            this.setCurrentList('noList')
          }
        } else {
          this.$router.go('-1')
        }

      }
    },
    mounted () {
      this.$options.interval = setInterval(this.setLists, 54000000);
    },
  }
</script>

<style>
	body {
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
	}
  .footer{ /* Apply this to v-bottom-nav if necessary. */
    margin-bottom: constant(safe-area-inset-bottom);
    margin-bottom: env(safe-area-inset-bottom);
  }
</style>
