'use strict';

angular.module('fdRecipe', ['fdCommon'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/recipe/', {
        templateUrl: 'src/recipe/recipe.tpl.html',
        controller: 'RecipeCtrl',
      })
  }])


.controller('RecipeCtrl', ['$scope', 'recipes',  function ($scope, recipes) {
 
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