'use strict';

angular.module('foodieApp')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/references', {
        templateUrl: 'src/reference/reference.tpl.html',
      });
  }])
