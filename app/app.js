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

  .run(function($rootScope, backend, sessionManager) {
    //The base address to the external api service.
    //Currently the api is mocked through backend.js and localstorage,
    //but if an external api is used the base path should be entered bellow
    $rootScope.apiPath = "";
    backend.init();
    sessionManager.setContext();
  });


