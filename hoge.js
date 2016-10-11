function hoge () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('value')
      // reject(new Error('hogee'))
    }, 200)
  })
}

hoge()
  .catch((e) => {
    return 'hoge'
  })
  .then(value => {
    console.log(value)
  })
