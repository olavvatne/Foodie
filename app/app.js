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
  })

  .directive("minimizer", function ($window) {
    return function(scope, element, attrs) {
        scope.minimized = false;
        angular.element($window).bind("scroll", function() {
            var value = jQuery(window).scrollTop();
            if(value > 310) {
              scope.minimized = true;
            }
            else {
              scope.minimized = false;
            }
            scope.$apply();
        });
    };
});


