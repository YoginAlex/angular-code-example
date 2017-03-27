'use strict'

/**
 * notificationsController is a controller for
 * <notifications /> directive
 */

notificationsController.$inject = [
  'notificationsService', 'userAppInfoSocketService'
]

function notificationsController (
  notificationsService, userAppInfoSocketService
) {
  const vm = this

  vm.listIsShown = false
  vm.ns = notificationsService

  vm.toggleNotificationsList = toggleNotificationsList
  vm.doButtonScript = doButtonScript
  vm.markAllAsRead = markAllAsRead
  vm.closeNotificationList = closeNotificationList

  activate()
  activateUserInfoWatcher()

  function activate () {
    vm.ns.getMessages()

    notificationsService.connect()
    notificationsService.getNotifyCount()
    notificationsService.getSocketMessages()
  }

  function activateUserInfoWatcher () {
    userAppInfoSocketService.connect()
    userAppInfoSocketService.watchUserInfo()
  }

  function toggleNotificationsList () {
    if (vm.ns.notify_count > 0) {
      if (!vm.listIsShown) {
        vm.ns.getMessages()

        markAllAsRead()
      }
      vm.listIsShown = !vm.listIsShown
    }
  }

  function doButtonScript (messageAction, message, $event) {
    if ($event) {
      $event.preventDefault()
    }

    markMessageAsRead(message)

    if (messageAction.url && messageAction.url.length > 0) {
      window.location = messageAction.url
    }
    if (messageAction && messageAction.script) {
      // Do not repeat this at home!!!
      // messageAction comes as JSON string from !trusted! source
      new Function(messageAction.script)()
    }
  }

  function markAllAsRead () {
    notificationsService.markAllAsRead()
  }

  function closeNotificationList () {
    vm.listIsShown = false
  }

  function markMessageAsRead (message) {
    notificationsService.markMessagesAsRead(message)
  }
}

export default notificationsController
