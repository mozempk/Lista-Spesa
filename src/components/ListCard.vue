<template>
    <v-container fluid class="px-0">
            <v-list class="my-0">
                <!-- setSelectedListEntries({listId:list.id}); -->
                <v-list-tile 
                    @click="currentList == list.id ? setCurrentList('noList') : setCurrentList(list.id); 
                            showDeleteList? showDeleteList=!showDeleteList : showDeleteList=showDeleteList">
                    <v-list-tile-content>
                    <v-touch
                        @swipeleft="showDeleteList = !showDeleteList; setCurrentList(list.id)" 
                        @swiperight="showDeleteList=!showDeleteList; setCurrentList(list.id)">
                        <v-list-tile-title class="pl-0 py-0">
                            {{filter == false && list.id == currentList ? new Date(list.dateCreated).toLocaleDateString('it-it',{ weekday: 'long', month: 'numeric', day: 'numeric', hour:'numeric',minute:'numeric' }) :  new Date(list.dateCreated).toLocaleDateString('it-it',{ weekday: 'short', month: 'numeric', day: 'numeric'})}}
                                <v-icon v-if="filter != false && list.id == currentList" @click.stop="setFilter(false)">cancel</v-icon>
                                {{filter != false && list.id == currentList ? filter : ''}}

                        </v-list-tile-title>
                    </v-touch>
                        <v-list-tile-sub-title>
                            
                        </v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-btn v-if="!showDeleteList" icon light large @click.stop="completeList({id:list.id,entries:list.entries,data:{isCompleted: !list.isCompleted,dateCompleted: new Date()}})">
                            <v-icon large class="grey--text" v-if="!list.isCompleted">check_circle_outline</v-icon>
                            <v-icon large v-if="list.isCompleted" color="success">check_circle_outline</v-icon>
                        </v-btn>
                        <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
                        <v-btn v-if="!loading && showDeleteList && currentList == list.id" icon light large @click.stop="showDeleteList=false;deleteList(list.id); setCurrentList('noList')">
                            <v-icon large color="red">delete</v-icon>
                        </v-btn>
                    </v-list-tile-action>
                </v-list-tile>
            </v-list>
            <v-layout row v-if="currentList == list.id">
                <v-alert v-if="nameError && currentList==list.id" dismissible type="error" :value="true" @input="clearNameError">{{nameError}}</v-alert>
                <v-combobox 
                    class="pl-3"
                    allow-overflow
                    dense
                    clearable
                    :items="entryNames"
                    item-text="name"
                    item-value="name"
                    v-model="itemName"
                    placeholder="cosa"
                    :menu-props="{maxHeight:50,openOnClick:false}">
                </v-combobox>

                <v-text-field class="px-1" clearable regular light color="info" placeholder="quantità" v-model="itemQuantity"></v-text-field>

                <v-combobox 
                    class="pl-3"
                    allow-overflow
                    dense
                    clearable
                    :items="shopNames"
                    item-text="name"

                    v-model="shopName"
                    placeholder="dove"
                    :menu-props="{maxHeight:50,openOnClick:false}">
                </v-combobox>

                <v-btn icon large @click.stop="
                    itemName.name? itemName=itemName.name : itemName = itemName;
                    itemName == ''? setNameError('Inserisci un\' articolo!') : itemName = itemName;
                    shopName == ''? shopName = '*' :shopName=shopName;
                    itemQuantity == '' ? itemQuantity = ' ' : itemQuantity = itemQuantity
                    shopName.name? shopName=shopName.name : shopName = shopName;
                    !nameError? createEntry({listId:list.id,quantity:itemQuantity,name:itemName,shop:shopName}) : itemName=itemName;
                    !nameError? checkEntryName(itemName) : itemName=itemName;
                    !nameError? checkShopName(shopName) : shopName=shopName;
                    itemName = '';
                    shopName = '';
                    itemQuantity= ''">
                    <v-icon large color="success" >send</v-icon>
                </v-btn>
            </v-layout>
                       
        <v-divider></v-divider>
        <EntryCard v-bind:list="list"/>
    </v-container>
</template>

<style scoped lang="css">
.rounded-card {
    border-radius:10px;
}
</style>

<script>
import EntryCard from './EntryCard'
import draggable from 'vuedraggable'
import store from '../store'
import {mapGetters,mapActions} from 'vuex'
export default {
    props:['list'],
    data () {
        return {
            showDeleteList: false,
            itemName: "",
            itemQuantity: "",
            shopName: ""
        }
    },
    components: {
        EntryCard,
        draggable,
    },
      computed: {
        ...mapGetters([
        'loading',
        'currentList',
        'entryNames',
        'nameError',
        'shopNames',
        'filter'
        ])
  },
  methods: {
    ...mapActions([
      'setCurrentList',
      'createEntry',
      'completeList',
      'deleteList',
      'setEditList',
      'setNameError',
      'clearNameError',
      'setFilter'
    ]),
    checkEntryName(name) {
        let en =  this.entryNames
        let found = false
        for (let i in en){
            if (en[i].name == name){
                found = true 
            }
        }
        if (!found) store.dispatch('pushEntryNames',{name:name})
    },
    checkShopName(name) {
        let sn =  this.entryNames
        let found = false
        for (let i in sn){
            if (sn[i].name == name){
                found = true 
            }
        }
        if (!found) store.dispatch('pushShopNames',{name:name})
    },
  }

}
</script>
