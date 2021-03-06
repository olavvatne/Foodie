'use strict';

angular.module('fdGroup', [])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/group/:gid', {
        templateUrl: 'src/group/group.tpl.html',
        controller: 'GroupCtrl',
        resolve: {
            groupData: ['groups', '$route', function(groups, $route) {
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
            recipe: ['recipes', '$route', function(recipes, $route) {
                var recipeId = $route.current.params.rid;
                return recipes.get(recipeId).then(function (response) {
                        return response;
            });
          }]
        },
      });
  }])


//Skeleton for a group page. When /profile/1 for example is entered in url
//resolve will preload the group, and the data put into the scope.
.controller('GroupCtrl', ['$scope', 'groupData', 'groups', function ($scope, groupData, groups) {
    $scope.group = groupData;
    $scope.thumbTemplate =  'src/recipe/grid/recipe-thumb.tpl.html';
    $scope.recipe = $scope.group.recipe;

    //TODO
    $scope.join = function(participant) {
        if($scope.user.username) {
            groups.putUser($scope.user, $scope.group.id)
            .then(function(success) {
                $scope.group.participants = success.participants;
                $scope.group.joined = true;
            }, function(error) {
                console.log("Could not join group");
            });
        }
    }

    $scope.leave = function(userId) {
        if($scope.user.username) {
            groups.leaveUser($scope.user, $scope.group.id)
            .then(function(success) {
                $scope.group.participants = success.participants;
                $scope.group.joined = false;
            });
        }
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


.controller('GroupFormCtrl', ['$scope', 'groups', '$location', 'recipe',
    function ($scope, groups, $location, recipe) {
    $scope.group = {};
    $scope.recipe = recipe;
    $scope.max = Number.MAX_VALUE;
    $scope.today = new Date();
    $scope.createGroup = function(newGroup, valid) {
        if(!$scope.user.username) {
          //To avoid any recipes being posted where no user is logged in.
          $location.path('/login');
          return;
        }
        if(valid) {
            if(!newGroup.nr_participants) {
                newGroup.nr_participants = $scope.max;
            }
            newGroup.recipe = {};
            newGroup.recipe.title= "";
            newGroup.recipe.id = recipe.id;
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

        getAll: function(groupId) {
            var url = 'api/group';
            return baseService.getResources(url);
        },

        putUser: function(user, groupId) {
            var url = "api/group/"+groupId+"/join";
            return baseService.putResource(url, user);
        },

        leaveUser: function(user, groupId) {
            console.log("TEST");
            var url = "api/group/"+groupId+"/leave";
            return baseService.putResource(url, user);
        }
        
    };

}]);