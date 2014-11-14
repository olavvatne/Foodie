'use strict';

angular.module('fdHome', ['fdRecipe'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'src/homePage/home.tpl.html',
        controller: 'HomeCtrl',
        resolve: {
            recipes: ['recipes', function(recipes) {
                return recipes.getPopular().then(function (response) {
                    return response;
                });
            }]
        },
      })
  }])


.controller('HomeCtrl', ['$scope', 'recipes',  function ($scope, recipes) {
  $scope.popularRecipes = recipes;
}]);
    
