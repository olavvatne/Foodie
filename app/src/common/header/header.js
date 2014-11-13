angular.module('fdCommon')  
.directive("minimizer", function ($window) {
  return function(scope, element, attrs) {
      scope.minimized = false;
      angular.element($window).bind("scroll", function() {
          var value = jQuery(window).scrollTop();
          if(value > 310) {
            scope.minimized = true;
          }
          else {
            scope.minimized = false;
          }
          scope.$apply();
      });
  };
})
.directive("navbar", function () {
  return {
    templateUrl: 'src/common/header/header.tpl.html',
    link: function(scope, element, attrs) {
      console.log("HEI");
    },
  };
});