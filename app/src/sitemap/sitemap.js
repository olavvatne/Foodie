'use strict';

angular.module('foodieApp')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/sitemap/', {
        templateUrl: 'src/sitemap/sitemap.tpl.html',
        controller: 'SitemapCtrl',
      });
  }])

//Not sure if controller is needed for sitemap.
.controller('SitemapCtrl', ['$scope',  function ($scope) {
    
}]);