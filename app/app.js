'use strict';


  angular
  .module('foodieApp', [
    'ngRoute',
    'ngMessages',
    'fdHome',
    'fdNotifications',
    'fdGroup',
    'fdUser',
    'fdRecipe',
    'fdCommon',
    'fdLogin',
    'fdFaq'
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


