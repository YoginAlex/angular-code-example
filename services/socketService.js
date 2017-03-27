'use strict'

// import io from 'socket.io-client'

socketService.$inject = ['$rootScope', 'UserInfo', 'config']

function socketService ($rootScope, UserInfo, config) {
  const factory = {
    connect: connect,
    connected: connected,
    on: on,
    emit: emit
  }

  const nodePath = config.icons8_websockets_url + '?channel=' + UserInfo.userChannel
  let socket = null
  let queueEvent = []

  function connect () {
    if (!UserInfo.isGuest) {
      require.ensure(['socket.io-client'], function (require) {
        const io = require('socket.io-client')

        socket = io.connect(nodePath, {
          reconnection: true,
          reconnectionAttempts: 30,
          reconnectionDelay: 2000,
          reconnectionDelayMax: 120000,
          randomizationFactor: 0.5,
          timeout: 240000
        })

        queueEvent.forEach(item => {
          if (item.type === 'on') {
            on(null, ...item.arg)
          }

          if (item.type === 'emit') {
            emit(null, ...item.arg)
          }
        })

        queueEvent = []
      })
    }
  }

  function connected () {
    return socket && socket !== null
  }

  function on (eventName, callback) {
    if (factory.connected()) {
      socket.on(eventName, function () {
        const args = arguments

        $rootScope.$apply(() => {
          callback.apply(socket, {...args})
        })
      })
    } else {
      queueEvent.push({
        type: 'on',
        arg: arguments
      })
    }
  }

  function emit (eventName, data, callback) {
    if (factory.connected()) {
      socket.emit(eventName, data, function () {
        const args = arguments

        $rootScope.$apply(() => {
          if (callback) {
            callback.apply(socket, {...args})
          }
        })
      })
    } else {
      queueEvent.push({
        type: 'emit',
        arg: arguments
      })
    }
  }

  return factory
}

export default socketService
