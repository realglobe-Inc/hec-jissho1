(function () {
  var handleError = function () {
    window.alert('予期せぬエラーが発生しました:')
  }

  window.addEventListener('error', handleError)

  // addEventListener できなかった
  var onUnhandled = window.onunhandledrejection
  window.onunhandledrejection = function (rejection) {
    onUnhandled && onUnhandled(rejection)
    console.error(rejection.reason)
    handleError()
  }
})()
