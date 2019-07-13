<template>
  <v-container fluid class="px-0">
    <v-alert dismissible v-if="error && Object.keys(error) > 0" type="error" :value="true" @input="clearError">{{error}}</v-alert>
      <v-layout v-if="loading" justify-center align-center>
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-layout>
    <v-layout column class="xs-12" v-for="list in listsDateDescending" :key="list.id">
        <listCard v-bind:list="list" :key="list.entries.id"></listCard>
    </v-layout>
  </v-container>
</template>
<style scoped lang="css">
.rounded-card {
    border-radius:10px;
}
</style>
<script>
import ListCard from './listCard'
import {API} from '../services/backend.service'
import {mapGetters,mapActions} from 'vuex'
import store from '../store'
const api = new API()
export default {
  data () {
    return {
      show: false,
      showDeleteList: false,
      showDeleteEntry : false,
      editName: false,
      editQuantity: false,
      itemName: "",
      itemQuantity: ""
    }
  },
  components:{
      ListCard
  },
  created() {
    store.dispatch('setLists')
    store.dispatch('setEntryNames')
    store.dispatch('setShopNames')
  },
  computed: {
    ...mapGetters([
      'loading',
      'error',
      'listsDateDescending',
      'currentList',
      'currentEntry',
      'editList'
    ])
  },
  methods: {
    ...mapActions([
      'setCurrentList',
      'setCurrentEntry',
      'createEntry',
      'updateList',
      'updateEntry',
      'completeList',
      'clearError'
    ]),
  }
}
</script>
