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
.controller('RecipeGroupCtrl', ['$scope', 'groups',  function ($scope, groups) {
    $scope.noRecipes = true;
    $scope.groupList = [];
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