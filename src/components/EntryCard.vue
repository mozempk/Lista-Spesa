<template>
    <v-list>
        <v-alert v-if="info && currentEntry==entry.id" dismissible type="info" :value="true" @input="info = undefined">{{info}}</v-alert>
        <v-alert v-if="error && currentEntry==entry.id" dismissible type="error" :value="true" @input="clearError">{{error}}</v-alert>
        <!-- <v-list-tile class="py-0 ma-0" v-if="currentList == list.id" v-for="entry in list.entries.slice().reverse()" :key="entry.id"> -->
        <v-list-tile class="py-0 ma-0" v-if="currentList == list.id" v-for="entry in filterEntries(list.entries)" :key="entry.id">
            <v-list-tile-content @click.stop="setCurrentEntry(entry.id); showDeleteEntry=false">
                <v-list-tile-title>              
                            <v-container fluid class="px-0 ma-0 py-0">
                                <v-layout row xs12> 
                                    <v-flex>
                                        <v-touch
                                            @swipeleft="showDeleteEntry = !showDeleteEntry; setCurrentEntry(entry.id)"
                                            @swiperight="showDeleteEntry=!showDeleteEntry;setCurrentEntry(entry.id)"
                                            @press="setCurrentList(list.id);setCurrentEntry(entry.id);editEntry()">  
                                            {{entry.name}}
                                        </v-touch>
                                    </v-flex>
                                    
                                    <v-flex>
                                        {{' '+entry.quantity}}
                                    </v-flex>
                                    <v-flex @click.stop="entry.shop? setFilter(entry.shop): setFilter(false)">
                                        {{entry.shop? entry.shop : '*'}}
                                    </v-flex>
                                </v-layout>
                            </v-container>
                </v-list-tile-title>          
            </v-list-tile-content>
            <v-list-tile-action>
                <v-btn large v-if="(!showDeleteEntry && !loading)" icon light @click.stop="updateEntry({listId:list.id,entryId:entry.id,data:{isCompleted: !entry.isCompleted}})">
                    <v-icon large class="grey--text" v-if="!entry.isCompleted">check_circle_outline</v-icon>
                    <v-icon large v-if="entry.isCompleted" color="success">check_circle_outline</v-icon>
                </v-btn>                               
                <v-btn v-if="!loading && showDeleteEntry && entry.id == currentEntry" large icon @click="showDeleteEntry=false; deleteEntry({listId:list.id,entryId:entry.id}); setCurrentEntry('noEntry')">
                    <v-icon large color="red">delete</v-icon>
                </v-btn>
                <v-progress-circular v-if="loading &&  entry.id == currentEntry" indeterminate color="primary"></v-progress-circular>
            </v-list-tile-action>
        </v-list-tile>  
    </v-list>
</template>

<style scoped lang="css">
.rounded-card {
    border-radius:10px;
}
</style>

<script>
import {mapGetters,mapActions} from 'vuex'
import store from '../store'
//import router from '../router/index.js'
export default {
    props: ['list'],
    data () {
        return {
            showDeleteEntry : false,
            itemName: "",
            itemQuantity: "",
            info: undefined
        }
    },
    computed: {
        ...mapGetters([
        'loading',
        'error',
        'currentEntry',
        'currentList',
        'selectedListEntries',
        'filter',
        'shopNames'
        ]),
  },
  methods: {
    ...mapActions([
      'setCurrentList',
      'setCurrentEntry',
      'createEntry',
      'completeEntry',
      'updateEntry',
      'clearError',
      'deleteEntry',
      'setFilter'
    ]),
    filterEntries(entries){
        if (this.filter){
            let filtered=[]
            for (let e in entries){
                console.log('[ENTRYCARD][filterEntries] entries.e.shop: '+JSON.stringify(entries[e].shop))
                if (entries[e].shop == this.filter) filtered.push(entries[e])
            }
            return filtered
        } else {
            return entries.slice().reverse()
        }
    },
    editEntry(){
        this.$router.push({name: 'Edit',params: {list: this.list}})

    }
  },   
}
</script>