'use strict';

angular.module('foodieApp')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/sitemap/', {
        templateUrl: 'src/sitemap/sitemap.tpl.html',
        controller: 'SitemapCtrl',
        resolve: {
            groupList: ['groups', function(groups) {
                return groups.getAll().then(function (response) {
                    return response;
                });
            }],
            recipeList: ['recipes', function(recipes) {
                return recipes.getAll().then(function (response) {
                    return response;
                });
            }],
            userList: ['users', function(users) {
                return users.getAll().then(function (response) {
                    return response;
                });
            }]
        },
      });
  }])

//Controller for sitemap will take the resolved data, and make it available for
//the DOM by putting it into the $Scope.
.controller('SitemapCtrl', ['$scope', 'groupList',  'recipeList', 'userList',
	function ($scope, groupList, recipeList, userList) {
    $scope.groups = groupList;
    $scope.recipes = recipeList;
    $scope.users = userList;
}]);