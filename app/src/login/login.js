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

/*
  The login controller processes login requests, and 
*/
 .controller('LoginCtrl', ['$scope', 'sessionManager', '$location',
  function ($scope, sessionManager, $location) {
  $scope.credentials = {};

  $scope.signIn = function(credentials) {
    sessionManager.postCredentials(credentials)
    .then(function(user) {
      sessionManager.setContext(user);
      $location.path('/')
    }, function(error) {
      $scope.errorMessage = error.message;
    });
  }; 
}])

.controller('HeaderCtrl', ['$scope','sessionManager',
  function ($scope, sessionManager) {
  
  $scope.signOut =function() {
    sessionManager.destroyContext();
  }
}])

.controller('AccountFormCtrl', ['$scope', 'users', 'sessionManager', function ($scope, users, sessionManager) {
  $scope.user = {};
  $scope.password = "";
  $scope.registrationSuccessful = false;
  $scope.register = function(newAccount) {
    if($scope.accountForm.$valid) {
      newAccount.username = newAccount.username.toLowerCase();
      users.create(newAccount).then(function(success) {
        $scope.user = success;
        $scope.registrationSuccessful = true;
        sessionManager.setContext($scope.user);
        console.log("Created new user");
      });
    }
    else {
      console.log("Not valid");
    }
  }; 
}])

.directive('fdIdentical',  function() {
  return {
    require: 'ngModel',
    link: function(scope, ele, attrs, c) {
      scope.$watch(attrs.ngModel, function(newVal, oldVal) {
        if(newVal === attrs.fdIdentical) {
          c.$setValidity('identical', true);
        }
        else {
          c.$setValidity('identical', false);
        }
      });
    }
  }
});