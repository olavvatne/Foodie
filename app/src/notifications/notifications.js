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
        getAll: function() {
        //Mocked backend
        var url = 'api/notificaton'
        return baseService.getResources(url);
        },

        answer: function(url, answer) {
        	//Do something smart here
        }
       
    };

}]);