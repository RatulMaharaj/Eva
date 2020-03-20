// got _ from https://unpkg.com/lodash

const form = document.getElementById('search-form')
const searchBox = document.getElementById('search-box')
const resultsNode = document.getElementById('search-results')

// form.addEventListener('submit', handleChange)
searchBox.addEventListener('input', _.debounce(handleChange, 100))

function handleChange(e) {
    e.preventDefault()
    const term = searchBox.value
    if (term) {
        cachedEva(term).then(text => {
            if (searchBox.value === term) {
                resultsNode.innerHTML = text
                window.history.replaceState({},'',`/search?q=${term}`)
            }
        })
    } else {
        resultsNode.innerHTML = ''
    }
}

function fetchEva(term) {
    const url = `/search?raw=1&q=${term}`
    return fetch(url).then(res => res.text())
}

const cachedEva = cacheFn(fetchEva)

function cacheFn(fn) { // caching (aka memoization) via a closure
    const cache = {}
    const cachedFn = (x) => cache[x] = cache[x] || fn(x)
    return cachedFn
}