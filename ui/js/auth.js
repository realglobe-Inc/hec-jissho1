const sha1 = require('sha1')

module.exports = function (prompt, localStorage) {
  if (process.env.NODE_ENV !== 'production') {
    return true
  }
  var storageKey = 'quick-auth'
  if (localStorage.getItem(storageKey) === 'ok') {
    return true
  }
  var password = prompt('Password?')
  var ok = sha1(String(password).trim()) === '816d246b23f4f78880b094c66a52b2b40878ce08'
  if (ok) {
    localStorage.setItem(storageKey, 'ok')
    return true
  } else {
    console.error('Login failed')
    document.write('<p><h3>Auth failed.</h3></p>')
    return false
  }
}
