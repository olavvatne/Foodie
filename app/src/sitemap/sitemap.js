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

//Not sure if controller is needed for sitemap.
.controller('SitemapCtrl', ['$scope', 'groupList',  'recipeList', 'userList',
	function ($scope, groupList, recipeList, userList) {
    $scope.groups = groupList;
    $scope.recipes = recipeList;
    $scope.users = userList;
}]);