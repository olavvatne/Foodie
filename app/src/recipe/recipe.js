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

.controller('RecipeFormCtrl', ['$scope', 'recipes', '$location',
  function ($scope, recipes, $location) {
  $scope.newRecipe = {};
  $scope.newRecipe.ingredients = [];
  $scope.newRecipe.description = [];

  $scope.postRecipe = function(recipe) {
    if($scope.recipeForm.$valid) {
      recipes.store(recipe)
      .then(function(success) {
        $location.path('/recipe/' + success.recipeId);
      });
    }
    else {
      console.log("NOT VALID YET");
    }
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
        getPopular: function() {
          var url = 'api/recipe/popular'
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
      model: '='
    },
    template:
    '<ul>'+
      '<li ng-repeat="step in model track by $index">'+
        '<label>Step {{$index+1}}</label>'+
        '<button class="btn--remove" ng-click="removeStep($index)">Remove</button>' +
        '<span><textarea type="text" ng-model="model[$index]" ></textarea></span>' +
      '</li>'+
      '<button ng-click="addStep()">Add step</button>' +
    '</ul>',
    controller: ['$scope', function($scope) {
      $scope.addStep= function() {
        $scope.model.push("");
      };

      $scope.removeStep = function(idx) {
        //
        $scope.model.splice(idx, 1);
      };

      $scope.init = function() {
        if($scope.model.length <= 0) {
          $scope.model.push("");
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
        '<input  type="number" ng-model="step.quantity" ></input>' +
        '<input placeholder="unit" type="text" ng-model="model[$index].unit" ></input>' +
        '<input  class="ingredient-name" placeholder="name"type="text" ng-model="model[$index].name" ></input>' +
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

/*.directive('fdLeastOne',  function() {
  return {
    link: function(scope, ele, attrs, c) {
      scope.$watch(scope.model, function(newVal, oldVal) {
        console.log(scope);
        console.log(scope);
        if(scope.model && scope.model.length > 0 && scope.model[0] && scope.model[0].length >0) {
          c.$setValidity('leastOne', true);
        }
        else {
          c.$setValidity('leastOne', false);
        }
      });
    }
  }
});*/