var 
	app = angular.module('app', ['dndLists'])
	, $s
	;
app.directive('editInPlace', function() {
  return {
    restrict: 'E',
    scope: {
      value: '='
    },
    template: '<span ng-dblclick="edit()" ng-bind="value"></span><input ng-model="value"></input><img src="https://www.imj.org.il/sites/default/files/shrine_0.jpg" style="width: 30;height:30;">',
    link: function($scope, element, attrs) {
      // Let's get a reference to the input element, as we'll want to reference it.
      var inputElement = angular.element(element.children()[1]);

      // This directive should have a set class so we can style it.
      element.addClass('edit-in-place');

      // Initially, we're not editing.
      $scope.editing = false;

      // ng-click handler to activate edit-in-place
      $scope.edit = function() {
        $scope.editing = true;

        // We control display through a class on the directive itself. See the CSS.
        element.addClass('active');

        // And we must focus the element. 
        // `angular.element()` provides a chainable array, like jQuery so to access a native DOM function, 
        // we have to reference the first element in the array.
        inputElement[0].focus();
      };

      // When we leave the input, we're done editing.
      inputElement.prop('onblur', function() {
        $scope.editing = false;
        element.removeClass('active');
      });
    }
  };
});

app.controller('ctrl', function($scope) {
		$s = $scope;
  $scope.models = {
    lists: {
      "A": []
    }
  };

  // Generate initial model
  for (var i = 1; i <= 3; ++i) {
    $scope.models.lists.A.push({
      label: "Item A" + i
    });
  }

  $scope.addToList = function(list) {
    var
      i = {
        label: "Item " + (list.length + 1)
      };
    list.push(i);
    
  }

  $scope.removeFromList = function(list, index) {
    list.splice(index, 1);
  }

  $scope.list = $scope.models.lists.A;

  // Model to JSON for demo purpose
  $scope.$watch('models', function(model) {
    $scope.modelAsJson = angular.toJson(model, true);
  }, true);

});