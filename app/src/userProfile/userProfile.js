'use strict';

angular.module('fdUserProfile', [])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/profile/', {
        templateUrl: 'src/userProfile/userProfile.tpl.html',
        controller: 'UserProfileCtrl',
      })
  }])


.controller('UserProfileCtrl', ['$scope',  function ($scope) {
 
}]);