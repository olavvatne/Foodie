'use strict';

angular.module('fdRecipe', ['fdCommon'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/recipe/:rid', {
        templateUrl: 'src/recipe/recipe.tpl.html',
        controller: 'RecipeCtrl',
        resolve: {
          recipe: ['recipes', '$route', function(recipes, $route) {
            var recipeId = $route.current.params.rid;
            return recipes.get(recipeId).then(function (response) {
                    return response;
                });
          }]
        }
      })
  }])


.controller('RecipeCtrl', ['$scope', 'recipe',  function ($scope, recipe) {
  $scope.recipe = recipe;
}])

.factory('recipes', ['baseService',
function (baseService) {

    return {
        get: function(id) {
        //Mocked backend
        var url = '/data/recipes.json'
        return baseService.getResources(url, id);
        },

        post: function(newRecipe) {
        	//Do something smart here
        }
       
    };

}]);