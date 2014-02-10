var dedeControllers = angular.module("dedeControllers", []);

dedeControllers.controller("ProjectsCtrl", ["$scope", "Projects", function($scope, Projects) {
    $scope.projects = Projects.get();
}]);

dedeControllers.controller("NewsCtrl", ["$scope", "News", function($scope, News) {
    $scope.news = News.get();
}]);

