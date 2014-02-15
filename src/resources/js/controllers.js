var dedeControllers = angular.module("dedeControllers", []);

dedeControllers.controller("ProjectsCtrl", ["$scope", "Projects", function($scope, Projects) {
    $scope.projects = Projects.get();
    $scope.$on("tagFilterChange", function(e, tagFilters) {
        console.log("ProjectsCtrl received event: " + e.name);
        $scope.tagFilters = tagFilters;
        logTagFilters("ProjectsCtrl");
    });
    function logTagFilters(prefix) {
        for (var i = 0; i < $scope.tagFilters.length; ++i) {
            console.log("(" + prefix + ") " + $scope.tagFilters[i].ind
                + " : " + $scope.tagFilters[i].display_text
                + " : " + $scope.tagFilters[i].is_active);
        }
    }
}]);

dedeControllers.controller("NewsCtrl", ["$scope", "News", function($scope, News) {
    $scope.news = News.get();
    $scope.$on("tagFilterChange", function(e, tagFilters) {
        console.log("NewsCtrl received event: " + e.name);
        $scope.tagFilters = tagFilters;
        logTagFilters("NewsCtrl");
    });
    function logTagFilters(prefix) {
        for (var i = 0; i < $scope.tagFilters.length; ++i) {
            console.log("(" + prefix + ") " + $scope.tagFilters[i].ind
                + " : " + $scope.tagFilters[i].display_text
                + " : " + $scope.tagFilters[i].is_active);
        }
    }
}]);

dedeControllers.controller("TagsCtrl", ["$scope", "Tags", "$rootScope", function($scope, Tags, $rootScope) {

    // Ugly to put all of this here?
    // Should maybe re-work this into a directive.

    // $scope.tagFilters = [{ ind: -1, display_text: "All", is_active: true }];
    $scope.tagFilters = [];
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
        $rootScope.$broadcast("tagFilterChange", $scope.tagFilters);
        logTagFilters();
    }, function(reason) {
        alert("Could not retrieve tags. Reason: " + reason);
    });

    $scope.toggleTagFilter = function(tagDisplayText) {
        console.log("toggleTagFilter called with: " + tagDisplayText);
        for (var i = 0; i < $scope.tagFilters.length; ++i) {
            if ($scope.tagFilters[i].display_text == tagDisplayText) {
                $scope.tagFilters[i].is_active = !$scope.tagFilters[i].is_active;
                break;
            }
        }
        $rootScope.$broadcast("tagFilterChange", $scope.tagFilters);
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

