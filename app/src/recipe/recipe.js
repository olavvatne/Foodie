'use strict';

angular.module('fdRecipe', ['fdCommon'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/recipe/', {
        templateUrl: 'src/recipe/recipe-form.tpl.html',
        controller: 'RecipeFormCtrl',
      })
      .when('/recipe/:rid', {
        templateUrl: 'src/recipe/recipe.tpl.html',
        controller: 'RecipeCtrl',
        resolve: {
          //The routeProvider resolve option will run whatever is inside,
          //before displaying the page. This ensures that the data used by the template
          //is available at showtime.
          recipe: ['recipes', '$route', function(recipes, $route) {
            var recipeId = $route.current.params.rid;
            return recipes.get(recipeId).then(function (response) {
                    return response;
                });
          }]
        }
      });
  }])


.controller('RecipeCtrl', ['$scope', 'recipe',  function ($scope, recipe) {
  $scope.recipe = recipe;
}])

.controller('RecipeFormCtrl', ['$scope', 'recipes',  function ($scope, recipes) {
  $scope.newRecipe = {};
  $scope.newRecipe.ingredients = [];
  $scope.newRecipe.description = [];

  $scope.postRecipe = function(recipe) {
    recipes.store(recipe);
  };
}])

.factory('recipes', ['baseService',
function (baseService) {

    return {
        get: function(id) {
        //Mocked backend
        var url = 'api/recipe/' + id
        return baseService.getResources(url);
        },

        store: function(newRecipe) {
          //mocked backend
        	var url ="api/recipe"
          return baseService.postResource(url, newRecipe);
        }
       
    };

}])

//Each recipe has to be descriped by a set of steps. This directive creates
//form input for the user to insert a recipe step, and a button to add more
//recipe steps
.directive('fdDescriptor', function() {
  return {
    scope: {
      stepModel: '='
    },
    template:
    '<ul>'+
      '<li ng-repeat="step in stepModel track by $index">'+
        '<label>Step {{$index+1}}</label>'+
        '<button class="btn--remove" ng-click="removeStep($index)">Remove</button>' +
        '<span><textarea type="text" ng-model="stepModel[$index]" ></textarea></span>' +
      '</li>'+
      '<button ng-click="addStep()">Add step</button>' +
    '</ul>',
    controller: ['$scope', function($scope) {
      $scope.addStep= function() {
        $scope.stepModel.push("");
      };

      $scope.removeStep = function(idx) {
        //
        $scope.stepModel.splice(idx, 1);
      };

      $scope.init = function() {
        if($scope.stepModel.length <= 0) {
          $scope.stepModel.push("");
        }
      };
      $scope.init();
    }]
  };
})

//A recipe form need a way to add ingredients. This directive creates
//a easy input component that has buttons to add ingredients and input to 
//specifiy quantity, unit and ingredient name.
.directive('fdIngredients', function() {
  return {
    scope: {
      model: '='
    },
    template: 
    '<ul>'+
      '<li ng-repeat="step in model track by $index">'+
        '<label> Ingredient {{$index+1}}</label>' +
        '<button ng-click="removeStep($index)">Remove</button>' +
        '<span><input type="number" ng-model="step.quantity" ></input>' +
        '<input placeholder="unit" type="text" ng-model="model[$index].unit" ></input>' +
        '<input class="ingredient-name" placeholder="name"type="text" ng-model="model[$index].name" ></input></span>' +
      '</li>'+
      '<button ng-click="addStep()">Add ingredients</button>' +
    '</ul>',
    controller: ['$scope', function($scope) {
      $scope.addStep= function() {
        $scope.model.push({quantity: 0, unit: '', name: ''});
      };

      $scope.removeStep = function(idx) {
        //
        $scope.model.splice(idx, 1);
      };

      $scope.init = function() {
        if($scope.model.length <= 0) {
          $scope.model.push({quantity: 0, unit: '', name: ''});
        }
      };
      $scope.init();
    }]
  };
});