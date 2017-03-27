'use strict'

userAppInfoSocketService.$inject = [
  'socketService', '$window'
]

function userAppInfoSocketService (socketService, $window) {
  const app = $window.app

  const factory = {
    connect: connect,
    watchUserInfo: watchUserInfo
  }

  return factory

  function connect () {
    socketService.connect()
  }

  function watchUserInfo () {
    socketService.on('auth', data => {
      app.cacheApiUrl = data.cacheApiUrl || app.cacheApiUrl

      if (data.userGroup && app.auth && app.auth.userGroup) {
        app.auth.userGroup = data.userGroup
      }
    })
  }
}

export default userAppInfoSocketService
