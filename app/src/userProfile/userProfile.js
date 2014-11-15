'use strict';

angular.module('fdUser', [])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/profile/:uid', {
        templateUrl: 'src/userProfile/userProfile.tpl.html',
        controller: 'UserProfileCtrl',
        resolve: {
          user: ['users', '$route', function(users, $route) {
            var userId = $route.current.params.uid;
            return users.get(userId).then(function (response) {
                    return response;
                });
          }]
        },
      })
  }])


.controller('UserProfileCtrl', ['$scope', 'user',  function ($scope, user) {
	$scope.user = user;
}])

.factory('users', ['baseService',
function (baseService) {

    return {
        get: function(id) {
        //Tested
        var url = 'api/user/' + id
        return baseService.getResources(url, id);
        },

        getAll: function() {
        //Tested
        var url = 'api/user'
        return baseService.getResources(url);
        },
       
        create: function(user) {
          var url = 'api/user';
          return baseService.postResource(url, user);
        }
    };

}]);