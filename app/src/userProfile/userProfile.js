'use strict';

angular.module('fdUserProfile', [])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/profile/', {
        templateUrl: 'src/userProfile/userProfile.tpl.html',
        controller: 'UserProfileCtrl',
      })
  }])


.controller('UserProfileCtrl', ['$scope', 'users',  function ($scope, users) {
	$scope.test = function() {
		users.get(1)
		.then(function(user) {
			console.log(user)
		});
	}
	$scope.test();
}])

.factory('users', ['baseService',
function (baseService) {

    return {
        get: function(id) {
        //Mocked backend
        var url = '/data/users.json'
        return baseService.getResources(url, id);
        },

        getAll: function() {
        //Mocked backend
        var url = '/data/users.json'
        return baseService.getResources(url);
        }
       
    };

}]);