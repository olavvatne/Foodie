angular.module('fdCommon')  
.directive("minimizer", function ($window) {
  return function(scope, element, attrs) {
      scope.minimized = false;
      angular.element($window).bind("scroll", function() {
          scope.minimized = false
          var scrollTop = jQuery(window).scrollTop();
          var navBP = 310; //breakpoint for banner/navigation
          var navAniBP = 280; //breakpoint for the transition animation;
          if(scrollTop > navAniBP) {
            var value = (( scrollTop - navAniBP)/ (navBP - navAniBP));
            var nSize = (100 - (30*value)).toFixed();
           
            document.getElementById("overlay").setAttribute("style", "opacity: "+value+";");
            document.getElementById("pictureAni").setAttribute("style", "width: "+nSize+"px; height: "+nSize+"px;");
          }
          else { //Reset to original
            document.getElementById("overlay").setAttribute("style", "opacity:0;");
            document.getElementById("pictureAni").setAttribute("style", "width: 100px; height:100px;");
          }
          if ((scrollTop > navBP)) {
              
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
    },
  };
});