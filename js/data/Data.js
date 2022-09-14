class Data{
    static cacheName = "0.0.1"

    /**
     * Checks whether the Data Management has been set up already
     * @param {Function} callback 
     */
    static initialised(callback = () => {}){
        caches.has(Data.cacheName).then(value => {
            callback(value)
        })
    }


    /**
     * Saves a JSON Object in Cache
     * @param {String} name 
     * @param {JSON} data 
     * @param {Function} callback Ruft zurück
     */
    static saveAttribute(name, data, callback = () => {}){
        caches.open(Data.cacheName).then(cache => {
            var response = new Response(JSON.stringify(data))
            cache.put(name, response).then(e => {
                callback();
            })
        })
    }


    /**
     * Returns whether a ressource exists in the Cache
     * @param {String} name 
     * @param {Function} callback 
     */
    static attributeExists(name, callback = () => {}){
        caches.open(Data.cacheName).then(cache => {
            cache.match(name).then(response => {
                if(response){
                    callback(true)
                } else {
                    callback(false)
                }
            })
        })
    }

    /**
     * Fetches the Data and calls back
     * @param {String} name 
     * @param {Function} callback 
     */
    static getAttribute(name, callback = () => {}){
        caches.open(Data.cacheName).then(cache => {
            cache.match(name).then(response => {
                if(response){
                    response.json().then(data => {
                        callback(data)
                    })
                } else {
                    callback(undefined)
                }
            })
        })
    }
}