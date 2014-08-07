var dedeEditControllers = angular.module("dedeEditControllers", []);

dedeEditControllers.controller("EditCtrl", ["$scope", "Pages", function($scope, Pages) {

    // Should handle the dropdown menu that selects the page (pages being "projects", "stories", "contact" etc.).
    // Should enable user to add new entries to each type of page.

    $scope.pages = Pages.get();

}]);

