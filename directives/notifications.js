'use strict'

import '../templates/notifications-menu.html'

function notificationsDirective () {
  return {
    restrict: 'AE',
    templateUrl: '/notifications-menu.html',
    scope: {},
    controller: 'icons8NotificationsController',
    controllerAs: 'vm',
    bindToController: true
  }
}

export default notificationsDirective
