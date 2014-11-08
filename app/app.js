'use strict';


  angular
  .module('foodieApp', [
    'ngRoute',
    'fdHome',
    'fdNotifications',
    'fdGroup',
    'fdUserProfile',
    'fdRecipe',
    'fdCommon'
  ])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });
  }]);


