<template>
    <v-container fluid>
        <v-layout column xs12>
            <v-layout row justify-start>
                <v-btn color="primary" icon large @click.stop="goBack()"><v-icon large>arrow_back</v-icon></v-btn>
            </v-layout>
            <v-layout row justify-center>
                <h3>Modifica</h3>
            </v-layout>
            <v-layout row justify-center>
                    <h2>{{entry.name}}</h2>     
            </v-layout>
            <v-form>
                <v-flex>
                    <v-combobox 
                        :placeholder="entry.name"
                        v-model="itemName"
                        label="Nome"
                        allow-overflow
                        dense
                        clearable
                        :items="entryNames"
                        item-text="name"
                        item-value="name"
                        :menu-props="{maxHeight:50,openOnClick:false}"></v-combobox>
                    <v-checkbox unchecked color="primary" v-model="deleteName" :label="'elimina il vecchio nome dal db'"></v-checkbox> 
                </v-flex>
                <v-flex>
                    <v-textField :placeholder="entry.quantity.toString()" label="Quantità" v-model="itemQuantity"></v-textField>
                </v-flex>
                <v-flex>
                    <v-combobox
                        :placeholder="entry.shop"
                        v-model="shopName"
                        label="Negozio"
                        allow-overflow
                        dense
                        clearable
                        :items="shopNames"
                        item-text="name"
                        item-value="name"
                        :menu-props="{maxHeight:50,openOnClick:false}"></v-combobox>
                </v-flex>
                <v-flex>
                    <v-textField v-model="price" prefix="€" :placeholder="getEntryPrice()" label="Prezzo"></v-textField>
                </v-flex>
                <v-btn block color="success" @click.stop="
                    itemName.name? itemName=itemName.name : itemName = itemName;
                    itemName == ''? itemName = entry.name : itemName = itemName;
                    itemQuantity == '' ? itemQuantity = entry.quantity : itemQuantity = itemQuantity
                    shopName.name? shopName=shopName.name : shopName = shopName;
                    shopName == ''? shopName = entry.shop : shopName = shopName;
                    entry.price != undefined && price == '' ? price = entry.price : price = price
                    deleteName && itemName != '' ? deleteEntryNames(getEntryNameId(entry.name)) : deleteName = false
                    !itemName == '' ? checkEntryName(itemName) : itemName=itemName;
                    !shopName == '' ? checkShopName(shopName) : shopName=shopName;
                    updateEntry({listId:list.id,entryId:entry.id,data:{name:itemName,quantity:itemQuantity,shop:shopName,price:price}})
                    ">
                    Modifica
                    <v-progress-circular v-if="loading" indeterminate color="white"></v-progress-circular>
                    </v-btn>
            </v-form>
                
        </v-layout>
    </v-container>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import store from '../store'
export default {
    props: ['list'],
    data () {
        return {
           entry: "",
           itemName: "",
           itemQuantity: "",
           shopName: "",
           price: "",
           deleteName: false,
        }
    },
    computed: {
        ...mapGetters([
            'currentList',
            'currentEntry',
            'loading',
            'entryNames',
            'shopNames',
        ])
    },
    methods: {
        ...mapActions([
            'updateEntry',
            'deleteEntryNames',
            'setEntryNames',
            // 'cleanEntryNamesDb'
        ]),
        editThis(){

        },
        getEntryNameId(name){
            console.log('[EDIT ENTRY][getEntryName] name: ' + name)
            let id = this.entryNames.find(e => {return e.name == name}).id
            console.log('[EDIT ENTRY][getEntryName] id: ' + id)
            return id
        },
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
        goBack(){
            this.$router.go('-1')
        },
        getEntryPrice(){
            let price = this.entry.price
            if (price === undefined) return '0.00'
            else return price.toString()
        }
    },

    created() {
        this.setEntryNames()
        this.list == undefined ? this.$router.push('/') : console.log("[EDIT ENTRY] OK")
        this.currentEntry == undefined || this.currentList == undefined ? this.$router.push('/') : console.log("[EDIT ENTRY] OK")
        this.entry=this.list.entries.find(e => {return e.id == this.currentEntry})
        console.log("[EDIT ENTRY] this.entry: " + JSON.stringify(this.entry))
    }
}
</script>
