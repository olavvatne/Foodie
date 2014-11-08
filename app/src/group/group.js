'use strict';

angular.module('fdGroup', [])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/group/', {
        templateUrl: 'src/group/group.tpl.html',
        controller: 'GroupCtrl',
      })
  }])


.controller('GroupCtrl', ['$scope',  function ($scope) {
 
}]);