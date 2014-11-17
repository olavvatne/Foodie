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
    if(!$scope.user.username) {
      //To avoid any recipes being posted where no user is logged in.
      $location.path('/login');
      return;
    }
    if($scope.recipeForm.$valid) {
      recipes.store(recipe)
      .then(function(success) {
        //Should a message be displayed after the redirect?
        //Should a message be displayed before redirect?
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


.directive('fdDescriptor', function() {
  return {
    template:
    '<ul>'+
      '<li ng-repeat="step in model track by $index">'+
        '<label><i ng-if="$index==0">* </i>Step {{$index+1}}</label>'+
        '<button class="btn--negative" ng-click="removeStep($index)"><b>X</b></button>' +
        '<span><textarea type="text" ng-model="model[$index]" ></textarea></span>' +
      '</li>'+
      '<button type="button" class="btn--neutral" ng-click="addStep()">Add step</button>' +
    '</ul>',
    scope: {
    model: '=ngModel'
    },
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
    }],
    link: function(scope, element, attr) {
    }
  };
})

//A recipe form need a way to add ingredients. This directive creates
//a easy input component that has buttons to add ingredients and input to 
//specifiy quantity, unit and ingredient name.
.directive('fdIngredients', function() {
  return {
    scope: {
      model: '=ngModel'
    },
    template: 
    '<ul>'+
      '<li ng-repeat="step in model track by $index">'+
        '<label style="float:inherit"><i ng-if="$index==0">* </i> Ingredient {{$index+1}}</label>' +
        '<input  type="number" ng-model="step.quantity" />' +
        '<input placeholder="unit" type="text" ng-model="model[$index].unit" />' +
        '<input  class="ingredient-name" style="width: 45%" placeholder="name"type="text" ng-model="model[$index].name" />' +
        '<button class="btn--negative" ng-click="removeStep($index)" ng-show="$index >0"><b>X</b></button>' +
      '</li></ul>'+
      '<button type="button" class="btn--neutral" ng-click="addStep()" style="float:right">Add ingredients</button>',
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
})

.directive('fdLeastOne',  function() {
  return {
    require: 'ngModel',
    link: function(scope, ele, attrs, c) {
      scope.$watch(attrs.ngModel, function(newVal, oldVal) {
        console.log(newVal[0].length);
        if((newVal && newVal.length > 0) && newVal[0].length >0 || (newVal[0].name && newVal[0].name.length > 0)) {
          c.$setValidity('leastOne', true);
        }
        else {
          c.$setValidity('leastOne', false);
        }
      },true);
    }
  }
});