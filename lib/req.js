const rp = require('request-promise')

async function get ({ url, params = {}, headers = {} }) {
    const options = {
        url,
        qs: params,
        headers
    }
     
    return rp(options)
}

async function post ({ url, params = {}, headers = {} }) {
    
}

module.exports = {
    get,
    post
}