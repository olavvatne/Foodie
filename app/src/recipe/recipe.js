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

/*Controller for the recipe page displaying a single recipe. The controller
puts the recipe data into the $scope. The template can now through the $scope 
get access to the recipe data. For example the image URL, the ingredients.
The scope is required to support two way databinding. IE that changed to the
model will automatically get updated in the DOM*/
.controller('RecipeCtrl', ['$scope', 'recipe', 'recipes',  function ($scope, recipe, recipes) {
  $scope.recipe = recipe;

  /*
    Method to handle and increment the approve/like counter. When a user
    Clicks the approve button, this method will make sure that the backend is
    increment the score. if the increment was successful/promise was resolved
    the approval score is updated.
  */
  $scope.approve = function() {
    if($scope.user.username) {
      recipes.incrementLike($scope.recipe.id, $scope.user)
      .then(function(success) {
        //Put the new approvement counter
        $scope.recipe.approvals = success.approvals;
      });
    }
  }
}])

/*
  The RecipeForm controller handles the form page, and the users submit request.
*/
.controller('RecipeFormCtrl', ['$scope', 'recipes', '$location',
  function ($scope, recipes, $location) {
  $scope.newRecipe = {};
  $scope.newRecipe.ingredients = [];
  $scope.newRecipe.description = [];

  /*
  Only user that are logged in can post a recipe. If not the user is redirected
  to the login page. If the form is valid and a user is logged in the controller
  will try to store the recipe at the backend. If the POST request was  successful
  the user is redirected to a recipe page containing the posted recipe.
  */
  $scope.postRecipe = function(recipe, valid) {
    if(!$scope.user.username) {
      //To avoid any recipes being posted where no user is logged in.
      $location.path('/login');
      return;
    }
    if(valid) {
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


/*
Service for recipes, which the controllers can utilize. Provide another layer
of abstraction, between the front end and the back end. All methods construct
a url and utilize a baseService for the actual http request.
*/
.factory('recipes', ['baseService',
function (baseService) {

    return {
        get: function(id) {
        //Mocked backend
        var url = 'api/recipe/' + id;
        return baseService.getResources(url);
        },

        getAll: function() {
        //Mocked backend
        var url = 'api/recipe';
        return baseService.getResources(url);
        },

        getPopular: function() {
          var url = 'api/recipe/popular';
          return baseService.getResources(url);
        },
        store: function(newRecipe) {
          //mocked backend
        	var url ='api/recipe';
          return baseService.postResource(url, newRecipe);
        },
       
       incrementLike: function(recipeId, user) {
         var url = 'api/recipe/' + recipeId + '/like';
         return baseService.putResource(url, user);
       }
    };

}])

/*
  fdDescriptor is a custom form element, which extend the html syntax, making
  the html more readable. The directive contains a template and a controller
  for the components internal logic. 

  To utilize the component in the HTML:
  <fd-descriptor ng-model="foo"></fd-descriptor>
  All the data entered by the user will be found at $scope.foo.


*/
.directive('fdDescriptor', function() {
  return {
    template:
    '<ul>'+
      '<li ng-repeat="step in model track by $index">'+
        '<label><i ng-if="$index==0">* </i>Step {{$index+1}}</label>'+
        '<button class="btn--negative" ng-click="removeStep($index)"><b>X</b></button>' +
        '<span><textarea type="text" ng-model="model[$index]"></textarea></span>' +
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

/*
  fdLeastOne is a custom validation that can be put on form elements.
  This one is made specially for fdIngredents and fdDescriptor, and makes
  sure that the user has at least entered one ingredient or one recipe step.
  If this is not the case the form is not valid, and an error is displayed.
*/
.directive('fdLeastOne',  function() {
  return {
    require: 'ngModel',
    link: function(scope, ele, attrs, c) {
      scope.$watch(attrs.ngModel, function(newVal, oldVal) {
        console.log(newVal[0].length);
        if((newVal && newVal.length > 0) && newVal[0].length >0 || (newVal[0].name && newVal[0].name.length > 0)) {
          //The model is valid
          c.$setValidity('leastOne', true);
        }
        else {
          //the model is not valid
          c.$setValidity('leastOne', false);
        }
      },true);
    }
  }
});