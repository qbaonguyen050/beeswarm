// IndexedDB logic for Bee Swarm Simulator

async function createDatabase() {
    return await new Promise(async (resolve, reject) => {
        let request = window.indexedDB.open("IndexedDB_BeeSwarmSimulator", 1)

        request.onupgradeneeded = function(event) {
            let DB = event.target.result
            let store = DB.createObjectStore("worlds", { keyPath: "id" })
            store.createIndex("id", "id", { unique: true })
        }

        request.onsuccess = function(e) {
            resolve(request.result)
        }

        request.onerror = function(e) {
            reject(e)
        }
    })
}

async function loadFromDB(id) {
    return await new Promise(async (resolve, reject) => {
        try {
            let db = await createDatabase()
            let trans = db.transaction("worlds", "readwrite")
            let store = trans.objectStore("worlds")
            let req = id ? store.get(id) : store.getAll()

            req.onsuccess = function(e) {
                resolve(req.result)
                db.close()
            }
            req.onerror = function(e) {
                resolve(null)
                db.close()
            }
        } catch (e) {
            reject(e)
        }
    })
}

async function saveToDB(id, data) {
    return new Promise(async (resolve, reject) => {
        try {
            let db = await createDatabase()
            let trans = db.transaction("worlds", "readwrite")
            let store = trans.objectStore("worlds")
            let req = store.put({ id: id, data: data })
            req.onsuccess = function() {
                resolve(req.result)
            }
            req.onerror = function(e) {
                reject(e)
            }
        } catch (e) {
            reject(e)
        }
    })
}

async function deleteFromDB(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let db = await createDatabase()
            let trans = db.transaction("worlds", "readwrite")
            let store = trans.objectStore("worlds")
            let req = store.delete(id)
            req.onsuccess = function() {
                resolve(req.result)
            }
            req.onerror = function(e) {
                reject(e)
            }
        } catch (e) {
            reject(e)
        }
    })
}
