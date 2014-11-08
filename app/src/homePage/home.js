'use strict';

angular.module('fdHome', [])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'src/homePage/home.tpl.html',
        controller: 'HomeCtrl',
      })
  }])


 .controller('HomeCtrl', ['$scope',  function ($scope) {
  $scope.foodName = '';
  $scope.food_feelings = function(quality) {
    if(quality > 5) {
      return 'love'
    }
    else {
      return 'hate'
    }
  }
  $scope.foodList = [{name:'pizza', color:'red'}, {name:'potatoes', color: 'green'}, {name:'onion soup', color: "black"}]
}]) 
    
