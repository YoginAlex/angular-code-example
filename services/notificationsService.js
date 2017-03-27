'use strict'

notificationsService.$inject = ['socketService', 'apiService']

function notificationsService (socketService, apiService) {
  let offset = 0
  const factory = {
    isLoad: false,

    unread_count: 0,
    notify_count: 0,
    messages: [],

    connect: connect,
    getNotifyCount: getNotifyCount,
    getMessages: getMessages,
    getSocketMessages: getSocketMessages,
    markMessagesAsRead: markMessagesAsRead,
    markAllAsRead: markAllAsRead
  }

  function connect () {
    socketService.connect()
  }

  function getNotifyCount () {
    socketService.on('notify_count', data => {
      if (data.unread) {
        factory.unread_count = data.unread
      }
      if (data.total) {
        factory.notify_count = data.total
      }
    })
  }

  function getSocketMessages () {
    socketService.on('notify', data => {
      data.created_at_date = new Date(data.created_at)

      factory.messages.push(data)
    })
  }

  function getMessages (limit = 20, read = '') {
    if (factory.isLoad) {
      return
    }

    factory.isLoad = true

    apiService.getMessagesList({limit, offset, read}, messages => {
      factory.messages = messages.list

      factory.messages.forEach(message => {
        message.isReaded = message.is_read && message.is_read === 1
      })

      factory.notify_count = messages.total
      factory.unread_count = messages.unread
      factory.isLoad = false
    })
  }

  function markAllAsRead () {
    apiService.markMessagesAsRead({
      id: 'all'
    }, messages => {
      factory.notify_count = messages.total
      factory.unread_count = messages.unread

      factory.messages.forEach(message => {
        setMessageIsReadAtr(message)
      })
    })
  }

  function markMessagesAsRead (messages) {
    let ids = []

    if (!Array.isArray(messages)) {
      if (!messages.is_read || messages.is_read !== 1) {
        ids.push(messages.message_id)
      }
    } else {
      messages.forEach(message => {
        if (!message.is_read || message.is_read !== 1) {
          ids.push(message.message_id)
        }
      })
    }

    if (ids && ids.length > 0) {
      apiService.markMessagesAsRead({
        id: ids
      }, messages => {
        factory.notify_count = messages.total
        factory.unread_count = messages.unread

        factory.messages.forEach(message => {
          if (ids.indexOf(message.message_id) !== -1) {
            setMessageIsReadAtr(message)
          }
        })
      })
    }
  }

  function setMessageIsReadAtr (message) {
    message.is_read = 1
    message.isReaded = true
  }

  return factory
}

export default notificationsService
