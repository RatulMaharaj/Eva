const STORAGE = localStorage;

function cachedFetch(url, options, expiryMin = 5,  keyFunction = (x => x), storage = STORAGE) {
    const key = "fetch_" + keyFunction(url);
    const expiryMS = expiryMin * 60 * 1000;
    const cacheRaw = storage.getItem(key);
    const cacheObj = cacheRaw ? JSON.parse(cacheRaw) : null;
    const cacheValid = cacheObj ? (Date.now() < cacheObj.createdTime + expiryMS) : false

    setTimeout(flushCache,1000)

    if (cacheValid) { // Use the cache if it's valid
      const blob = new Blob([cacheObj.content])
      const response = new Response(blob)
      return Promise.resolve(response)
    } else {
      return fetch(url, options).then(response => {
        response
          .clone().text().then(content => {
            const createdTime = Date.now()
            const value = {content, createdTime}
            const serialised = JSON.stringify(value)
            storage.setItem(key,serialised)
        })
        return response;
      });
      
    }
  }

async function flushCache(storage = STORAGE, expiryMin = 5, prefix ="fetch_") {
  const expiryMS = expiryMin * 60 * 1000;
  const maxTime = Date.now() - expiryMS

  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i)
    if (key.startsWith(prefix)) {
      const cacheRaw = storage.getItem(key);
      const cacheObj = cacheRaw ? JSON.parse(cacheRaw) : null;
      const {createdTime} = cacheObj
      // console.log(key, maxTime, createdTime, createdTime < maxTime)
      if (createdTime < maxTime) {
        storage.removeItem(key)
      }
    }
  }
}

export default cachedFetch