angular.module('fdCommon')  
.directive("minimizer", function ($window) {
  return function(scope, element, attrs) {
      scope.minimized = false;
      angular.element($window).bind("scroll", function() {
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
              if(!made) {
                $('header').addClass("fix-user");
                var div = "<div class='top__user'><div class='top__user--picture'> <img class='picture' src='http://www.dailynk.com/efile/201204/DNKF00009101_2.jpg'/></div></div>";
                  $("header.fix-user").append(div);
                  made = true;
                }
            }
            else {
              var node = $('header.fix-user');
              while (node.firstChild) {
                node.removeChild(node.firstChild);
              }
              node.empty();
              $('header').removeClass("fix-user");
              $("navBanner__contents").removeClass("startTrans");
              made = false;
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