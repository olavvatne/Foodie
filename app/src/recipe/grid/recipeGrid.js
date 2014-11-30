/*
fdGrid takes a array of data and create a matrix of data suitable for 
grid presentation. Currently the template or content template is not 
transcluded and therefore fixed to the recipe thumb template.

Because the thumbTemplate will inherit the scope of
the ng-repeat the data contained in one recipe can be used
by the thumbTemplate.
*/
angular.module('fdRecipe')
.directive('fdGrid', [ function() {
  return {
    restrict: 'AE',

    scope: {
      'gridContent': '=',
      'maxRow': '@',
      'maxColumn': '@',
    },

    template:

          '<div>'+
            '<table class="recipeThumb__grid">'+
              '<tr ng-repeat="row in matrix">'+
                '<td class="col-centered" ng-repeat="recipe in row track by $index">'+
                    '<ng-include src="thumbTemplate"></ng-include>'+
                '</td>'+
                '<td ng-repeat="i in getNumber(internalMaxCols - row.length)"></td>'+
              '</tr>'+
            '</table>',
    controller: ['$scope', function($scope) {
      $scope.matrix = [];
      $scope.totalItems;
      $scope.internalMaxCols = 4;
      //Transclude this instead!
      $scope.thumbTemplate =  'src/recipe/grid/recipe-thumb.tpl.html';

      $scope.getNumber = function(num) {
        var numbers = [];
        for(var i = 0; i<num; i++) {
          numbers.push(i);
        }
        return numbers;   
      }

      $scope.constructGridLayout = function(data) {
        var resultSet = angular.copy(data);
        if(angular.isDefined(resultSet)) {
          $scope.matrix = [];
          var currentRow = [];
          for( var i =0 ; i < resultSet.length;i++){
            currentRow.push(resultSet[i]);
            if(currentRow.length >= $scope.internalMaxCols) {
              $scope.matrix.push(currentRow);
              currentRow = [];
            }
          }
          if(currentRow.length>0) {
            $scope.matrix.push(currentRow);
          }
        }
      };
    }],

    link: function(scope, elem, attrs) {

      if(scope.maxColumn && scope.maxRow) {
        scope.itemPerPage = scope.maxColumn*scope.maxRow;
      }
      else {
        if(scope.maxColumn) {
          //If user specify another number of columns the constructGridLayout
          //will adapt and construct a new matrix of elements, where number of 
          //columns adhere to the maxColumn variable.
          scope.internalMaxCols = scope.maxColumn;
        }
      }
      scope.$watch('gridContent', function(newValue, oldValue) {
        if (newValue) {
          scope.constructGridLayout(newValue);
        }
      });
    }
  };
}])