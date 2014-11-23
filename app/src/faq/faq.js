'use strict';

angular.module('fdFaq', [])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/faq', {
        templateUrl: 'src/faq/faq.tpl.html',
        controller: 'FaqCtrl',
        resolve: {
            faqData: ['faq', function(faq) {
                return faq.get().then(function (response) {
                    return response.faq;
                });
            }]
        },
      });
  }])


.controller('FaqCtrl', ['$scope', 'faqData', 'faq', function ($scope, faqData, faq) {
    $scope.faq = faqData;
   
}])

.factory('faq', ['baseService',
function (baseService) {
	var convert = function(xml) {
      var x2js = new X2JS();
      var json = x2js.xml_str2json( xml );
      return json;
    };
    return {
        get: function() {
            var url = 'api/faq';
            return baseService.getResources(url)
            .then(function(data) {
            	console.log(data);
            	//The api endpoint only serves XML. Has to convert data.
            	return convert(data);
            })
        }
        
    };

}]);	