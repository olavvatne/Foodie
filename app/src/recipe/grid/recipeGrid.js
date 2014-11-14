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
            '<table width="100%">'+
              '<tr ng-repeat="row in matrix">'+
                '<td class="col-centered" ng-repeat="recipe in row track by $index">'+
                    '<ng-include src="thumbTemplate"></ng-include>'+
                '</td>'+
              '</tr>'+
            '</table>',
    controller: ['$scope', function($scope) {
      $scope.matrix = [];
      $scope.totalItems;
      $scope.internalMaxCols = 4;
      //Transclude this instead!
      $scope.thumbTemplate =  'src/recipe/grid/recipe-thumb.tpl.html';

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