'use strict'

apiService.$inject = [
  'UserInfo', 'config', '$http', 'languageService',
  '$resource'
]

function apiService (
  UserInfo, config, $http, languageService, $resource
) {
  const factory = {
    getMessagesList: getMessagesList,
    markMessagesAsRead: markMessagesAsRead
  }

  const GLOBAL_API_URL = `${config.api_url}/api/`
  const url = `${GLOBAL_API_URL}messages/1.0.0/list/`
  const APPLICATION_ID = 'api-test/a572f606e790'

  const Messages = $resource(url,
    {
      'application-id': APPLICATION_ID,
      'application-platform': 'web-app',
      'application-version': 1,
      hash: UserInfo.authToken,
      read: '',
      limit: 10,
      offset: 0
    },
    {
      GetMessages: {
        method: 'GET'
      },
      MarkAsRead: {
        method: 'POST',
        params: {
          id: '@id'
        }
      }
    }
  )

  function getMessagesList (params, callback, fallback) {
    Messages.GetMessages({ ...params }).$promise.then(response => {
      if (callback &&
        response.data &&
        response.data.messages &&
        response.data.messages.list) {
        const messages = response.data.messages

        messages.list.forEach(message => {
          message.created_at_date = new Date(message.created_at)
        })

        callback(messages)
      } else {
        fallback(response)
      }
    })
  }

  function markMessagesAsRead (params, callback, fallback) {
    Messages.GetMessages({ ...params }).$promise.then(response => {
      if (callback && response.data.messages) {
        callback(response.data.messages)
      }
    })
  }

  return factory
}

export default apiService
