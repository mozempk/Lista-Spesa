export const API_URL = 'http://sanetapi.us.to/api/'
export const FILTERS = {
    INCLUDE_ENTRIES:'?filter={"include":"entries"}',
    INCLUDE_NEGOZI:'?filter={"include":"negozi"}',
    WHERE_ID: (id) => '?where={"id":"'+id+'"}'

}
export const ENDPOINTS = {
    LISTS: 'lists',
    ENTRIES: 'entries',
    ENTRYNAMES: 'entryNames',
    NEGOZI: 'negozi',
    SHOPNAMES: 'shopNames', 
    UPDATE_LIST: (id) => 'lists/update?where={"id":"'+id+'"}',
    UPDATE_ENTRY: (id) => 'entries/update?where={"id":"'+id+'"}',
    LIST: (id) => {return 'lists/'+id},
    ENTRY: (id) => {return 'entries/'+id},
    ENTRIES_BY_NEGOZIO_NAME:(id,name) => {return 'lists/'+id+'/entries?{"include":"negozi","where":{"name":"'+name+'"}}'}
}

export class API {
    opts={
        method:'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    }
    //constructor() {}
    get = (endpoint) => {
        //setLoading()
        this.opts.method = "GET"
        delete this.opts.body
        console.log("[BACKEND][GET]: " + "OPTS: "+JSON.stringify(this.opts)+" URL: "+ API_URL+endpoint)
        return fetch(API_URL+endpoint,this.opts).then( res => {
            if (!res.ok) {
                let err = "[BACKEND][GET] error: " + res.status + ": "+res.statusText
                console.log(err)
                throw err //TODO
            } else {
                return res.json()
            }
        }) 

    }
    post = (endpoint,data) => {
        //setLoading
        this.opts.method = "POST"
        this.opts.body = JSON.stringify(data)
        console.log("[BACKEND][POST]: " + "OPTS: "+JSON.stringify(this.opts)+" URL: "+ API_URL+endpoint)
        return fetch(API_URL+endpoint,this.opts).then( res => {
            if (!res.ok) {
                let err = "[BACKEND][POST] error: "+ res.status + ": "+res.statusText
                console.log(err)
                throw err //TODO
            } else {
                return res.json()
            }
        })
    }

    delete = (endpoint) => {
        this.opts.method = "DELETE"
        if (this.opts.hasOwnProperty("body")) delete this.opts.body
        this.opts.body = ""
        console.log("[BACKEND][DELETE]: " + "OPTS: "+JSON.stringify(this.opts)+" URL: "+ API_URL+endpoint)
        return fetch(API_URL+endpoint,this.opts).then( res => {
            if (!res.ok) {
                let err = "[BACKEND][DELETE] error: "+ res.status + ": "+res.statusText
                console.log(err)
                throw err //TODO
            } else {
                return res
            }
        })
    }
}