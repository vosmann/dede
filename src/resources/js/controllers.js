var dedeControllers = angular.module("dedeControllers", []);

dedeControllers.controller("ProjectsCtrl", ["$scope", "Projects", function($scope, Projects) {
    $scope.projects = Projects.get();
}]);

dedeControllers.controller("NewsCtrl", ["$scope", "News", function($scope, News) {
    $scope.news = News.get();
}]);

dedeControllers.controller("TagsCtrl", ["$scope", "Tags", function($scope, Tags) {
    // $scope.tags = Tags.get();


    $scope.tagFilters = []; // Ugly to put all of this here?

    // Tags.get().then(function() {}, function() {}, function() {});
    // Tags.get().then(function(tags) {
    var tagsPromise = Tags.get();
    tagsPromise.$promise.then(function(tags) {
        for (var i = 0; i < tags.length; ++i) {
            console.log(tags[i]._id + " : " + tags[i].display_text);
            $scope.tagFilters.push({
                ind: i,
                display_text: tags[i].display_text,
                is_active: false
            });
        }
        logTagFilters();
    }, function(reason) {
        alert("Could not retrieve tags. Reason: " + reason);
    });

    // Should re-work this into a directive.
    

    $scope.toggleTagFilter = function(tagDisplayText) {
        console.log("toggleTagFilter called with: " + tagDisplayText);
        for (var i = 0; i < $scope.tagFilters.length; ++i) {
            if ($scope.tagFilters[i].display_text == tagDisplayText) {
                $scope.tagFilters[i].is_active = !$scope.tagFilters[i].is_active;
                break;
            }
        }
        logTagFilters();
    }

    function logTagFilters() {
        for (var i = 0; i < $scope.tagFilters.length; ++i) {
            console.log($scope.tagFilters[i].ind + " : " + $scope.tagFilters[i].display_text + " : " + $scope.tagFilters[i].is_active);
        }
    }
}]);

dedeControllers.controller("AboutCtrl", ["$scope", "About", function($scope, About) {
    $scope.about = About.get();
}]);

dedeControllers.controller("ContactCtrl", ["$scope", "Contact", function($scope, Contact) {
    $scope.contact = Contact.get();
}]);

