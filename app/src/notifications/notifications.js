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
  $scope.notificationList = [];
  $scope.image ="images/no-profile-image.png"
  //Instead of using a resolve a function in controller will retrieve new notifications
  //A timer should be used to periodically requst new notifications.
  $scope.getNewNotifications = function() {
        notifications.getNew()
        .then(function(data) {
            $scope.notificationList = data;
        });
    }
    $scope.getNewNotifications();
}])

.factory('notifications', ['baseService',
function (baseService) {

    return {
        getAll: function() {
        //Mocked backend. The "backend" does not yet create notifications
        //but will return all notifications currently stored in json.
        var url = 'api/notification'
        return baseService.getResources(url);
        },

         getNew: function() {
        //Mocked backend. The "backend" does not yet create notifications
        //but will return all notifications currently stored in json.
        //temp url and all will return the same notifications for all.
        var url = 'api/notification'
        return baseService.getResources(url);
        },

        answer: function(url, answer) {
        	//Do something smart here
        }
       
    };

}]);