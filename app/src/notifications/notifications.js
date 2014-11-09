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
  $scope.test = function() {
        notifications.getAll()
        .then(function(data) {
            console.log(data);
        });
    }
    $scope.test();
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

        answer: function(url, answer) {
        	//Do something smart here
        }
       
    };

}]);