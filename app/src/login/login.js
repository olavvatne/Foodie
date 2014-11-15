'use strict';

angular.module('fdLogin', ['fdCommon', 'fdUser'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'src/login/login.tpl.html',
        controller: 'LoginCtrl',
      })
      .when('/create-account', {
        templateUrl: 'src/login/create-account.tpl.html',
        controller: 'AccountFormCtrl',
      });
  }])


 .controller('LoginCtrl', ['$scope', 'sessionManager', '$location',
  function ($scope, sessionManager, $location) {
  $scope.credentials = {};

  $scope.signIn = function(credentials) {
    sessionManager.postCredentials(credentials)
    .then(function(user) {
      sessionManager.setContext(user);
      $location.path('/')
    });
  }; 
}])

.controller('HeaderCtrl', ['$scope','sessionManager',
  function ($scope, sessionManager) {
  
  $scope.signOut =function() {
    sessionManager.destroyContext();
  }
}])

.controller('AccountFormCtrl', ['$scope', 'users', function ($scope, users) {
  $scope.register = function(newAccount) {
    users.create(newAccount)
    .then(function(success) {
      console.log("Created new user");
    });
  }; 
}]);