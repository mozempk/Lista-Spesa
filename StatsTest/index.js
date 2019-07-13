const fetch = require('node-fetch')
let results = []
let listsCount = 0;
let itemsCount = 0;
let lut = []
let blob = []
let downloadedLists = []
const listsEndpoint = 'http://sanetapi.us.to/api/lists?filter={"include":"entries"}'
opts={
    method:'GET',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    }
}
const getLists = () => {
    return fetch(listsEndpoint,opts).then(res => {
        if (res.ok) return res.json()
        throw ({code: res.statusCode, text: rest.statusText})
    })
    .catch(e => {
        console.log(e)
    })
}
// Fill LUT and blob
const arrangeData = () => {
    downloadedLists.forEach(dl => {
        if (dl.isCompleted){
            listsCount ++
            dl.entries.forEach(e => {
                if (lut.findIndex(l => {return l === e.name}) === -1) lut.push(e.name)
                blob.push({
                    name: e.name,
                    dateCompleted: dl.dateCompleted,
                    shop: e.shop,
                    price: e.price,
                    qu: e.quantity
                })
            })
        }

    })
    itemsCount = lut.length
}
const computeStats = () => {
    //most visited shop
    // {shop: "shop", count: "..."}
    let shops=[]
    blob.forEach(e => {
        let s = shops.find(sh => sh.name == e.shop)
        if (s !== undefined) {
            s.count ++
        }
        else shops.push({name: e.shop, count: 1})
    })
    //console.log("\nSHOPS: " + JSON.stringify(shops))

    //MAIN SHOP: shop wich ahs the most shopped items in total
    results.mainShop = {}
    results.mainShop.count = Math.max.apply(Math, shops.map(sh => sh.count)) //Math.max(...shops.map(sh => sh.count))
    results.mainShop.name = shops.find(e => e.count == results.mainShop.count).name
    //console.log("MS: " + JSON.stringify(results.mainShop))

    
    //Average Spent: average amount of money spent per list
    results.averageSpent = 0
    blob.forEach(e => {
        results.averageSpent += (e.qu * e.price)
    })
    results.averageSpent = results.averageSpent / listsCount

     //console.log("AS: " + results.averageSpent)
    

    //AverageItemsCount: average amount of items per list
    results.averageItemsCount = 0
    blob.forEach(e => {
        let parsed = parseInt(e.qu)
        //console.log(e.name + ": " + parseInt(e.qu))
        if (parsed > 0 && parsed != "NaN"){
            results.averageItemsCount +=  parsed
        }
    })
    results.averageItemsCount = results.averageItemsCount / itemsCount//listsCount

    console.log("MS\t\t\t\tAS\t\t\tAIC \n"+ JSON.stringify(results.mainShop) + "\t"+results.averageSpent +"\t\t"+results.averageItemsCount)
}

getLists().then(data => {
    downloadedLists = data
    //console.log(JSON.stringify(data))
     arrangeData()
    //console.log('\nLUT: ' + JSON.stringify(lut.sort()))
    //console.log('\nBLOB: ' + JSON.stringify(blob))
    computeStats()
}).catch(e => {
    console.log(e)
})
