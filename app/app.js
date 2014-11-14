'use strict';


  angular
  .module('foodieApp', [
    'ngRoute',
    'fdHome',
    'fdNotifications',
    'fdGroup',
    'fdUserProfile',
    'fdRecipe',
    'fdCommon',
    'fdLogin'
  ])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });
  }])

  .run(function(backend, sessionManager) {
    backend.init();
    sessionManager.setContext();
  });


