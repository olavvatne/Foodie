'use strict';

angular.module('fdRecipe', [])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/recipe/', {
        templateUrl: 'src/recipe/recipe.tpl.html',
        controller: 'RecipeCtrl',
      })
  }])


.controller('RecipeCtrl', ['$scope',  function ($scope) {
 
}]);