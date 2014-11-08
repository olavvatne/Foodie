'use strict';

angular.module('fdNotifications', [])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/notification/', {
        templateUrl: 'src/notifications/notifications.tpl.html',
        controller: 'NotificationCtrl',
      })
  }])


.controller('NotificationCtrl', ['$scope',  function ($scope) {
 
}]);