'use strict';

angular.module('fdGroup', [])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/group/:gid', {
        templateUrl: 'src/group/group.tpl.html',
        controller: 'GroupCtrl',
        resolve: {
            group: ['groups', '$route', function(groups, $route) {
                var groupId = $route.current.params.gid;
                return groups.get(groupId).then(function (response) {
                    return response;
                });
            }]
        },
      })
      .when('/recipe/:rid/group', {
        templateUrl: 'src/group/group-form.tpl.html',
        controller: 'GroupFormCtrl',
        resolve: {
            recipeId: ['$route', function($route) {
                var recipeId = $route.current.params.rid;
                return recipeId;
            }]
        },
      });
  }])

//Skeleton for a group page. When /profile/1 for example is entered in url
//resolve will preload the group, and the data put into the scope.
.controller('GroupCtrl', ['$scope', 'group',  function ($scope, group) {
    $scope.group = group;

    //TODO
    $scope.join = function(participant) {

    }
}])

//Can be used at controller on recipe page
.controller('RecipeGroupCtrl', ['$scope', 'groups', '$location', 
    function ($scope, groups, $location) {
    $scope.noRecipes = true;
    $scope.groupList = [];

    $scope.redirectToForm = function() {
        $location.path('/recipe/' + $scope.$parent.recipe.id + '/group')
    }
    /*
    RecipeGroupCtrl is always created as a child of RecipeCtrl, and therefore get
    a child scope of the recipeCtrl. Therefore it is possible to access the
    parent scopes variables. For example the recipe id.
    */
    var init = function() {
        var recipeId = $scope.$parent.recipe.id;
        groups.getAllForRecipe(recipeId)
        .then(function(success) {
            $scope.groupList = success;
            if(success.length > 0) {
                $scope.noRecipes = false;
            }
        }, function(error) {
            //No recipes
        })
    };
    init();
}])

.controller('GroupFormCtrl', ['$scope', 'groups', '$location', 'recipeId',
    function ($scope, groups, $location, recipeId) {
    $scope.group = {};
    $scope.max = Number.MAX_VALUE;
    $scope.today = new Date();
    $scope.createGroup = function(newGroup) {
        if(!$scope.user.username) {
          //To avoid any recipes being posted where no user is logged in.
          $location.path('/login');
          return;
        }
        if($scope.groupForm.$valid) {
            if(!newGroup.nr_participants) {
                newGroup.nr_participants = $scope.max;
            }
            newGroup.recipe = {};
            newGroup.recipe.title= "";
            newGroup.recipe.id = recipeId;
            groups.store(newGroup) 
            .then(function(data) {
                $location.path('/group/' + data.groupId);
            });
        }
        else {
            console.log("Form is not valid");
        }
    };
}])

.factory('groups', ['baseService',
function (baseService) {

    return {
        getAllForRecipe: function(recipeId) {
            var url = 'api/recipe/' + recipeId + '/group';
            return baseService.getResources(url);
        },

        store: function(group) {
            //Not tested
            var url = 'api/group';
            return baseService.postResource(url, group);
        },

        get: function(groupId) {
            var url = 'api/group/' + groupId;
            return baseService.getResources(url);
        },

        putUser: function(user, groupId) {
            var url = "api/group/"+groupId+"/participant";
            return baseService.putResource(url, user);
        }
       
    };

}]);