'use strict'

import angular from 'angular'

import '../common/module'
import '../globals/module'

import apiService from './services/apiService'
import socketService from './services/socketService'
import notificationsService from './services/notificationsService'
import userAppInfoSocketService from './services/userAppInfoSocketService'
import notificationsController from './controllers/notificationsController'
import notificationsDirective from './directives/notifications'

angular.module('notifications', ['common'])
  .factory('apiService', apiService)
  .factory('socketService', socketService)
  .factory('notificationsService', notificationsService)
  .factory('userAppInfoSocketService', userAppInfoSocketService)

  .controller('notificationsController', notificationsController)

  .directive('notifications', notificationsDirective)
