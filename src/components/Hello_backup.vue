<template>
  <v-container fluid>
    <div v-if="loading" slot="loading">Sto caricando le liste...</div>
    <v-layout column class="xs-12" v-for="list in listsDateDescending" :key="list.id">
      <v-flex>
        <v-card class="rounded-card my-2" color="secondary white--text">
          <v-card-title @click="setCurrentList(list.id); show=false; showDeleteList? showDeleteList=!showDeleteList : showDeleteList=showDeleteList" >
            <v-container fluid class="px-0">
              <v-touch @swipeleft="showDeleteList = !showDeleteList" @swiperight="showDeleteList=!showDeleteList" @pressup="showDeleteList=!showDeleteList">
                <v-layout row>
                  <v-flex class="xs12 pt-3" align-content-center>
                    <h3>Lista del: {{new Date(list.dateCreated).toLocaleDateString()}} </h3>
                  </v-flex>
                  <v-flex v-if="!showDeleteList">
                    <v-layout row>
                      <v-btn icon light large @click.stop="completeList({id:list.id,entries:list.entries,data:{isCompleted: !list.isCompleted,dateCompleted: new Date()}})">
                        <v-icon large class="white--text" v-if="!list.isCompleted">check_circle_outline</v-icon>
                        <v-icon large v-if="list.isCompleted" color="success">check_circle_outline</v-icon>
                      </v-btn>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-touch>
            </v-container>
          </v-card-title>
          <v-card-text v-if="currentList == list.id">
            <v-container fluid class="px-0 ma-0">
              <draggable v-model="list.entries">
                <v-layout column v-if="currentList == list.id"  v-for="entry in list.entries" :key="entry.id">
                  <v-slide-y-transition>    
                    <v-card class="white--text mb-1" height="120" color="secondary">             
                      <v-card-title class="px-1 my-0 " @click.stop="setCurrentEntry(entry.id)">
                        <v-container xs12 class="px-0">
                          <v-layout row wrap xs12>

                            <v-flex xs5>
                              <div>Nome</div>
                            </v-flex>

                            <v-flex xs5>
                              <div>Quantità</div>
                            </v-flex>

                            <v-flex xs1>
                              <div>Tick</div>
                            </v-flex>
                          </v-layout>

                          <v-layout row wrap xs12>

                            <v-flex xs5>
                              <div class="pt-3" v-if="!editName" @click.stop="editName = !editName; setCurrentEntry(entry.id)">{{entry.name}}</div>
                              <v-layout row v-if="editName && currentEntry == entry.id" class="px-0">
                                <v-flex class="pt-3">
                                  <v-btn icon light @click.stop="editName=false">
                                    <v-icon class="white--text" v-if="!entry.isCompleted">cancel</v-icon>
                                  </v-btn>
                                </v-flex>
                                <v-flex>
                                  <v-text-field clearable regular light color="info" placeholder="cosa..." v-model="itemName"></v-text-field>                                    
                                </v-flex>
                              </v-layout>
                            </v-flex>

                            <v-flex xs5>
                              <div class="pt-3" v-if="!editQuantity" @click.stop="editQuantity = !editQuantity; setCurrentEntry(entry.id)"> {{entry.quantity}}</div>
                              <v-layout row v-if="editQuantity && currentEntry == entry.id">
                                <v-flex class="pt-3">
                                  <v-btn icon light @click.stop="editQuantity=false">
                                    <v-icon class="white--text" v-if="!entry.isCompleted">cancel</v-icon>
                                  </v-btn>
                                </v-flex>
                                <v-flex>
                                  <v-text-field clearable regular light color="info" placeholder="quantità" v-model="itemQuantity"></v-text-field>
                                </v-flex>
                              </v-layout>
                            </v-flex>

                            <v-flex xs1>
                              <v-btn v-if="!((editName || editQuantity) && currentEntry == entry.id)" icon light @click.stop="updateEntry({listId:list.id,entryId:entry.id,data:{isCompleted: !entry.isCompleted}})">
                                <v-icon class="white--text" v-if="!entry.isCompleted">check_circle_outline</v-icon>
                                <v-icon v-if="entry.isCompleted" color="success">check_circle_outline</v-icon>
                              </v-btn>                               
                            </v-flex>

                            <v-flex xs1 v-if="((editName || editQuantity) && currentEntry == entry.id )" class="pt-3">
                              <v-btn icon>
                                <v-icon color="success" @click="
                                (itemName!='' && itemQuantity!='') ? updateEntry({listId:list.id,entryId:entry.id,data:{quantity:itemQuantity,name:itemName}}) :
                                (itemName != '' && !itemQuantity!='') ? updateEntry({listId:list.id,entryId:entry.id,data:{name:itemName}}) :
                                (!itemName!= '' && itemQuantity !='') ? updateEntry({listId:list.id,entryId:entry.id,data:{quantity:itemQuantity}}) : (editName=false,editQuantity=false)
                                itemName = '';
                                itemQuantity= '';
                                editName = false;
                                editQuantity=false">send</v-icon>
                              </v-btn>
                            </v-flex>
                          </v-layout>                     
                        </v-container>
                      </v-card-title> 
                    </v-card>
                  </v-slide-y-transition>
                </v-layout>
              </draggable>
            </v-container>
          </v-card-text>    
          <v-card-text v-if="currentList == list.id" v-show="show" transition="scale-transition">
            <v-layout row>
              <v-flex class="mx-2">
                <v-text-field clearable regular light color="info" placeholder="cosa..." v-model="itemName"></v-text-field>
              </v-flex>
              <v-flex class="mx-2">
                <v-text-field clearable regular light color="info" placeholder="quantità" v-model="itemQuantity"></v-text-field>
              </v-flex>
              <v-btn icon large>
                <v-icon large color="success" @click="createEntry({listId:list.id,quantity:itemQuantity,name:itemName});itemName = ''; itemQuantity= ''">send</v-icon>
              </v-btn>
            </v-layout>
          </v-card-text>
          <v-card-actions v-if="currentList == list.id">
            <v-flex class="text-xs-center">
              <v-btn large icon @click="show = !show" >
                <v-icon large class="white--text">{{show ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</v-icon>
              </v-btn>
            </v-flex>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<style scoped lang="css">
.rounded-card {
    border-radius:10px;
}
</style>
<script>
import {API, ENDPOINTS,FILTERS} from '../services/backend.service'
import {mapGetters,mapActions} from 'vuex'
import store from '../store'
import draggable from 'vuedraggable'
const api = new API()
export default {
  components: {
    draggable,
  },
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
  created() {
    store.dispatch('setLists')  
  },
  computed: {
    ...mapGetters([
      'loading',
      'listsDateDescending',
      'currentList',
      'currentEntry'
    ])
  },
  methods: {
    ...mapActions([
      'setCurrentList',
      'setCurrentEntry',
      'createEntry',
      'updateList',
      'updateEntry',
      'completeList'
    ]),
  }
}
</script>
