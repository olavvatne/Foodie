'use strict';

angular.module('fdGroup', [])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/group/', {
        templateUrl: 'src/group/group.tpl.html',
        controller: 'GroupCtrl',
      })
  }])


.controller('GroupCtrl', ['$scope', 'groups',  function ($scope, groups) {
 
}])

.factory('groups', ['baseService',
function (baseService) {

    return {
        getAllForRecipe: function(recipeId) {
        //Mocked backend
        //var url = '/data/groups.json'
        //return baseService.getResources(url);
        //Probably best to make a aother groups.json where
        //all recipes are put in a dictionary, using the recipe id as key
        return null
        },

        answer: function(url, answer) {
        	//Do something smart here
        }
       
    };

}]);