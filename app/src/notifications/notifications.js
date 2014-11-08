'use strict';

angular.module('fdNotifications', [])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/notification/', {
        templateUrl: 'src/notifications/notifications.tpl.html',
        controller: 'NotificationCtrl',
      })
  }])


.controller('NotificationCtrl', ['$scope', 'notifications', function ($scope, notifications) {
 
}])

.factory('notifications', ['baseService',
function (baseService) {

    return {
        get: function() {
        //Mocked backend
        var url = '/data/notificatons.json'
        return baseService.getResources(url);
        },

        answer: function(url, answer) {
        	//Do something smart here
        }
       
    };

}]);