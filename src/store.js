import {API,ENDPOINTS,FILTERS} from './services/backend.service'
import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
const api = new API()
export default new Vuex.Store({
    state: {
        loading: false,
        error: false,
        lists: [],
        currentList: "",
        currentEntry: "",
        entryNames: [],
        lastUpdate: new Date(),
        nameError: false,
        shopNames: [],
        filter: false,
    },
    getters: {
        loading: state => state.loading,
        error: state => state.error,
        lists: state => state.lists,
        listsDateDescending: state => state.lists.sort( (a,b) => {
            a = new Date(a.dateCreated)
            b = new Date(b.dateCreated)
            return a>b ? -1 : a<b ? 1 : 0
        } ),
        currentList: state => state.currentList,
        currentEntry: state => state.currentEntry,
        entryNames: state => state.entryNames,
        entryNamesClean: state => {
            let clean = []
            for (let e in state.entryNames) {
                clean.push(state.entryNames[e].name)
            }
            return clean
        },
        shopNames: state => state.shopNames,
        lastUpdate: state => state.lastUpdate,
        nameError: state => state.nameError,
        filter: state=> state.filter,
    },
    mutations: {
        SET_LOADING(state,payload){
            state.loading = payload
        },
        SET_ERROR(state,payload){
            if (payload == undefined) payload = false
            state.error=payload
        },
        SET_LISTS(state,payload){
            state.lists = payload
        },
        SET_CURRENT_LIST(state,payload){
            state.currentList = payload
        },
        SET_CURRENT_ENTRY(state,payload){
            state.currentEntry = payload
        },
        PUSH_LIST(state,payload){
            state.lists.push(payload)
        },
        PUSH_ENTRY_TO_LIST(state,payload){
            let idx = state.lists.findIndex(elem => {
                console.log('[STORE][PUSHENTRYTOLIST] List id: '+elem.id)
                return elem.id == payload.listId
            })
            if (state.lists[idx].entries) {
                console.log('[STORE][PUSHENTRYTOLIST] List index: ' + idx + ' has already an array of entries')
                state.lists[idx].entries.push(payload)
            } else {
                console.log('[STORE][PUSHENTRYTOLIST] List index: ' + idx + ' didnt have an array of entries')
                state.lists[idx].entries = []
                state.lists[idx].entries.push(payload)
            }
        },
        //JavaScripts Object-Array VooDoo!! \^^/ 
        UPDATE_LIST(state,payload){
            let j = state.lists.findIndex(e => e.id == payload.id) //find list index
            let dataKeys = Object.keys(payload.data) //isolating what object properties i need to change
            let completeThemAll = false
            for (let i in dataKeys){ //iterate on them
                let key = Object.keys(state.lists[j]).find(e => e == dataKeys[i]) //compare to original object properties
                state.lists[j][key] = payload.data[dataKeys[i]] //modify original object property, with new object property's value
            }
        },
        UPDATE_ENTRY(state,payload){
            let j = state.lists.findIndex(e => e.id == payload.listId) //find list index
            let k = state.lists[j].entries.findIndex(e => e.id == payload.entryId) //find entry index inside list
            let dataKeys = Object.keys(payload.data) //isolating what object properties i need to change
            for (let i in dataKeys){
                let key = Object.keys(state.lists[j].entries[k]).find(e => e == dataKeys[i])
                state.lists[j].entries[k][key] = payload.data[dataKeys[i]]
            }
        },
        DELETE_LIST(state, payload) {
            state.lists.splice(state.lists.findIndex(e => {e.id == payload}),1)
        },
        DELETE_ENTRY(state,payload){
            console.log('[STORE][DELETE_ENTRY] payload: '+JSON.stringify(payload))
            let listIdx=state.lists.findIndex(e => e.id == payload.listId)
            console.log('[STORE][DELETE_ENTRY] listIdx: '+listIdx)
            let entryIdx=state.lists[listIdx].entries.findIndex(e => e.id == payload.entryId)
            state.lists[listIdx].entries.splice(entryIdx,1)
        },
        DELETE_ENTRYNAMES(state,payload){
            console.log('[STORE][DELETE_ENTRYNAME] payload: '+JSON.stringify(payload))
            let idx=state.entryNames.findIndex(e => e.id == payload)
            console.log('[STORE][DELETE_ENTRYNAME] idx: '+ idx)
            state.entryNames[idx].splice(idx,1)
        },
        SET_ENTRYNAMES(state,payload){
            state.entryNames = payload
        },
        PUSH_ENTRYNAMES(state,payload){
            state.entryNames.push(payload)
        },
        SET_LAST_UPDATE(state,payload) {
            console.log('[STORE][SET_LAST_UPDATE] payload: '+payload)
            state.lastUpdate = payload
        },
        SET_NAME_ERROR(state,payload) {
            state.nameError = payload
        },
        SET_SHOPNAMES(state,payload){
            state.shopNames = payload
        },
        PUSH_SHOPNAMES(state,payload){
            state.shopNames.push(payload)
        },
        SET_FILTER(state,payload){
            state.filter=payload
        },

    },
    actions:{
        setLoading({commit},payload) {
            commit('SET_LOADING',payload)
        },
        setError({commit},payload){
            commit('SET_ERROR',payload)
        },
        clearError({commit}){
            commit('SET_ERROR',false)
        },
        setLists({commit}){
            commit('SET_LOADING',true)
            api.get(ENDPOINTS.LISTS+FILTERS.INCLUDE_ENTRIES)
            .then(lists => {
                console.log("[STORE][SET LISTS] lists:" + JSON.stringify(lists))
                commit('SET_LISTS',lists)
                commit('SET_LAST_UPDATE',new Date())
                commit('SET_LOADING',false)
            })
            .catch(e => {
                commit('SET_ERROR',e)
                commit('SET_LOADING',false)
            }) 
        },
        setCurrentList({commit},payload){
            console.log("[STORE][SET CURRENT LIST]: "+payload)
            commit('SET_CURRENT_LIST',payload)
        },
        setCurrentEntry({commit},payload){
            console.log("[STORE][SET CURRENT ENTRY]: "+payload)
            commit('SET_CURRENT_ENTRY',payload)
        },
        createList({commit}){
            commit('SET_LOADING',true)
            api.post(ENDPOINTS.LISTS,{dateCreated: new Date(),isCompleted: false,entries: []})
            .then(data => {
                data.entries=[]
                console.log('[STORE][CREATE LIST] data: '+JSON.stringify(data))
                commit('SET_LOADING',false)
                commit('SET_CURRENT_LIST',data.id)
                commit('PUSH_LIST',data)
            })
            .catch(e => {
                commit('SET_ERROR',e)
                commit('SET_LOADING',false)
            }) 
        },
        createEntry({commit},payload){
            commit('SET_LOADING',true)
            api.post(ENDPOINTS.ENTRIES,payload)
            .then(data  => {
                console.log('[STORE][CREATE ENTRY] data: '+JSON.stringify(data))
                commit('PUSH_ENTRY_TO_LIST',data)
                commit('SET_LOADING',false)
                
            })
            .catch(e => {
                commit('SET_ERROR',e)
                commit('SET_LOADING',false)
            }) 
        },
        /*
        payload: {
            id: listId,
            data: {
                key0: value0
                ...
                keyN: valueN
            }
        }
        */
        updateList({commit},payload){
            console.log('[STORE][UPDATE LIST] payload: %s',JSON.stringify(payload))
            commit('SET_LOADING',true)
            api.post(ENDPOINTS.UPDATE_LIST(payload.id),payload.data) /*BALLS TO THE WALL!*/
            .then( () => {
                commit('UPDATE_LIST',payload)
                commit('SET_LOADING',false)
            } )
            .catch(e => {
                commit('SET_ERROR',e)
                commit('SET_LOADING',false)
            })

        },
        /*payload: {
            listId: listId,
            entryId: entryId,
            data: {
                key0: value0
                ...
                keyN: valueN
            }
        }
        */
        updateEntry({commit},payload){
            console.log('[STORE][UPDATE ENTRY] payload: %s',JSON.stringify(payload))
            commit('SET_LOADING',true)
            api.post(ENDPOINTS.UPDATE_ENTRY(payload.entryId),payload.data) /*BALLS TO THE WALL!*/
            .then(()=>{
                commit('UPDATE_ENTRY',payload)
                commit('SET_LOADING',false)                
            })
            .catch(e => {
                commit('SET_ERROR',e)
                commit('SET_LOADING',false)
            })
            
        },

        /*payload: {
            id: listId,
            entries: list.entries[]
            data: {
                    isCompleted: bool
                    dateCompleted:
            }
        }*/
        completeList({commit},payload){
            console.log('[STORE][COMPLETE LIST] payload: %s',JSON.stringify(payload))
            commit('SET_LOADING',true)
            commit('UPDATE_LIST',{id: payload.id,data:payload.data})
            for (let entry in payload.entries) {
                commit('UPDATE_ENTRY',{listId:payload.id,entryId:payload.entries[entry].id,data:{isCompleted:payload.data.isCompleted}})
                api.post(ENDPOINTS.UPDATE_ENTRY(payload.entries[entry].id),{isCompleted:payload.data.isCompleted}) //update db
            }
            api.post(ENDPOINTS.UPDATE_LIST(payload.id),payload.data) /*BALLS TO THE WALL!*/
            .then( () => {
                commit('SET_LOADING',false)
            })
            .catch(e => {
                commit('SET_ERROR',e)
                commit('SET_LOADING',false)
            })
            
        },

        deleteList({commit},payload) {
            console.log('[STORE][DELETE LIST] payload: %s',JSON.stringify(payload))
            commit('SET_LOADING',true)
            api.delete(ENDPOINTS.LIST(payload))
            .then( () => {
                commit('DELETE_LIST',payload)
                commit('SET_LOADING',false)
            })
            .catch(e => {
                commit('SET_ERROR',e)
                commit('SET_LOADING',false)
            })
        },

        /*payload: {
            listId: id,
            entryId: id
        } */

        deleteEntry({commit},payload) {
            console.log('[STORE][DELETE ENTRY] payload: %s',JSON.stringify(payload))
            commit('SET_LOADING',true)
            api.delete(ENDPOINTS.LIST(payload.listId)+'/'+ENDPOINTS.ENTRY(payload.entryId))
            .then( () => {
                commit('DELETE_ENTRY',payload)
                commit('SET_LOADING',false)
            } )
            .catch(e => {
                commit('SET_ERROR',e)
                commit('SET_LOADING',false)                
            })
        },
        deleteEntryNames({commit},payload) {
            console.log('[STORE][deleteEntryNames] payload: %s',JSON.stringify(payload))
            commit('SET_LOADING',true)
            api.delete(ENDPOINTS.ENTRYNAMES+'/'+payload)
            .then( () => {
                commit('DELETE_ENTRYNAMES',payload)
                commit('SET_LOADING',false)
            } )
            .catch(e => {
                commit('SET_ERROR',e)
                commit('SET_LOADING',false)                
            })
        },
        setEntryNames({commit}){
            commit('SET_LOADING',true)
            api.get(ENDPOINTS.ENTRYNAMES)
            .then(names => {
                console.log("[STORE][SET ENTRY NAMES] names:" + JSON.stringify(names))
                commit('SET_ENTRYNAMES',names)
                commit('SET_LOADING',false)
            })
            .catch(e => {
                commit('SET_ERROR',e)
                commit('SET_LOADING',false)
            }) 
        },
        pushEntryNames({commit},payload){
            commit('SET_LOADING',true)
            api.post(ENDPOINTS.ENTRYNAMES,payload)
            .then( () => {
                commit('PUSH_ENTRYNAMES',payload)
                commit('SET_LOADING',false)
            } )
            .catch(e => {
                commit('SET_ERROR',e)
                commit('SET_LOADING',false)
            })
        },
        setLastUpdate({commit},payload){
            commit('SET_LAST_UPDATE',payload)

        },
        setNameError({commit},payload){
            commit('SET_NAME_ERROR',payload)
        },
        clearNameError({commit}){
            commit('SET_NAME_ERROR',false)
        },
        setShopNames({commit}){
            commit('SET_LOADING',true)
            api.get(ENDPOINTS.SHOPNAMES)
            .then(names => {
                console.log("[STORE][SET SHOP NAMES] names:" + JSON.stringify(names))
                commit('SET_SHOPNAMES',names)
                commit('SET_LOADING',false)
            })
            .catch(e => {
                commit('SET_ERROR',e)
                commit('SET_LOADING',false)
            }) 
        },
        pushShopNames({commit},payload){
            commit('SET_LOADING',true)
            api.post(ENDPOINTS.SHOPNAMES,payload)
            .then( () => {
                commit('PUSH_SHOPNAMES',payload)
                commit('SET_LOADING',false)
            } )
            .catch(e => {
                commit('SET_ERROR',e)
                commit('SET_LOADING',false)
            })
        },
        setFilter({commit},payload){
            console.log("[STORE][SET FILTER] payload:" + JSON.stringify(payload))
            commit('SET_FILTER',payload)
        },
/*         cleanEntryNamesDb({commit}, entryNames){
            commit('SET_LOADING',true)
            console.log("[STORE][cleanEntryNamesDb] cleaning")
            let uniques = []
            let duplicates = []
            for (let i in entryNames) {
                let check = false
                for (let j in uniques) {
                    console.log("[STORE][cleanEntryNamesDb] i: %s, j: %s",i,j)
                    if (entryNames[i].name == uniques[j].name) check = true
                }
                if (!check) uniques.push(entryNames[i])
                else duplicates.push(entryNames[i])
            }
            commit('SET_ENTRYNAMES', uniques)
            for (let i in duplicates) {
                api.delete(ENDPOINTS.ENTRYNAMES + '/' + duplicates[i].id).then( () => {
                    commit('SET_LOADING', false)
                })
                .catch(e => {
                    commit('SET_ERROR',e)
                    commit('SET_LOADING', false)
                })
            }
        } */
    }
})