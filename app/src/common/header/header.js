/*
Minimizer directive will create a scope and put the mimimized boolean variable
in the scope. It also set the css attribute of some classes. 
The variable is used by the template to decide if the top banner is expanded
or not. 
*/
angular.module('fdCommon')  
.directive("minimizer", function ($window) {
  return function(scope, element, attrs) {
      scope.minimized = false;
      angular.element($window).bind("scroll", function() {
          scope.minimized = false
          var scrollTop = $window.pageYOffset;
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

/*
A pretty wrapper for the top banner. Reduce the clutter in index.html.
*/
.directive("navbar", function () {
  return {
    templateUrl: 'src/common/header/header.tpl.html',
    link: function(scope, element, attrs) {
    },
  };
});