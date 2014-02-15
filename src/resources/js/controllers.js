var dedeControllers = angular.module("dedeControllers", []);

dedeControllers.controller("ProjectsCtrl", ["$scope", "Projects", function($scope, Projects) {
    $scope.projects = Projects.get();
}]);

dedeControllers.controller("NewsCtrl", ["$scope", "News", function($scope, News) {
    $scope.news = News.get();
}]);

dedeControllers.controller("TagsCtrl", ["$scope", "Tags", function($scope, Tags) {
    $scope.tags = Tags.get();
    $scope.tagFilters = []; // Ugly to put all of this here?
    for (var i = 0; i < tags.length; ++i) {
        $scope.tagFilters.push({
            ind: i,
            display_text: tags[i],
            isActive: false
        });
    }
}]);

dedeControllers.controller("AboutCtrl", ["$scope", "About", function($scope, About) {
    $scope.about = About.get();
}]);

dedeControllers.controller("ContactCtrl", ["$scope", "Contact", function($scope, Contact) {
    $scope.contact = Contact.get();
}]);

