var dedeViewControllers = angular.module("dedeViewControllers", []);

dedeViewControllers.controller("PageCtrl", ["$scope", '$routeParams', "Pages",
        function($scope, $routeParams, Pages) {
            $scope.getPages = function() {
                Pages.get().then(function(result) { 
                    $scope.pages = result.data;
                });
            };
            $scope.pages = {};
            $scope.getPages();
            $scope.pageName = $routeParams.pageName;
        }]);


dedeViewControllers.controller("EntryCtrl", ["$scope", "Entry",
        "ElementTypes", "Images", "Tags",
        function($scope, Entry, ElementTypes, Images, Tags) {

            $scope.getEntry = function(entryId) {
                Entry.get(entryId).then(function(result) {
                    $scope.entry = result.data;
                });
            };

            $scope.getAllElementTypes = function() {
                ElementTypes.get().then(function(result) {
                    $scope.allElementTypes = result.data;
                });
            };
            $scope.getAllElementTypes();
        }]);


dedeViewControllers.controller("TagsCtrl", ["$scope", "Tags",
        function($scope, Tags) {
            $scope.getTags = function() {
                Tags.get().then(function(result) {
                    $scope.tags = result.data;
                });
            };
            $scope.tags = [];
            $scope.getTags();
        }]);







////////////////

/*dedeViewControllers.controller("OldProjectsCtrl", ["$scope", "Projects", function($scope, Projects) {*/
    //$scope.projects = Projects.get();
    //$scope.$on("tagFilterChange", function(e, tagFilters) {
        //console.log("OldProjectsCtrl received event: " + e.name);
        //$scope.tagFilters = tagFilters;
        //logTagFilters("OldProjectsCtrl");
    //});
    //function logTagFilters(prefix) {
        //for (var i = 0; i < $scope.tagFilters.length; ++i) {
            //console.log("(" + prefix + ") " + $scope.tagFilters[i].ind
                //+ " : " + $scope.tagFilters[i].display_text
                //+ " : " + $scope.tagFilters[i].is_active);
        //}
    //}
//}]);

//dedeViewControllers.controller("OldNewsCtrl", ["$scope", "News", function($scope, News) {
    //$scope.news = News.get();
    //$scope.$on("tagFilterChange", function(e, tagFilters) {
        //console.log("NewsCtrl received event: " + e.name);
        //$scope.tagFilters = tagFilters;
        //logTagFilters("NewsCtrl");
    //});
    //function logTagFilters(prefix) {
        //for (var i = 0; i < $scope.tagFilters.length; ++i) {
            //console.log("(" + prefix + ") " + $scope.tagFilters[i].ind
                //+ " : " + $scope.tagFilters[i].display_text
                //+ " : " + $scope.tagFilters[i].is_active);
        //}
    //}
//}]);

//dedeViewControllers.controller("OldTagsCtrl", ["$scope", "Tags", "$rootScope", function($scope, Tags, $rootScope) {

    //// Ugly to put all of this here?
    //// Should maybe re-work this into a directive.

    //// $scope.tagFilters = [{ ind: -1, display_text: "All", is_active: true }];
    //$scope.tagFilters = []; // Rename to just "tags".
    //var tagsPromise = Tags.get();
    //tagsPromise.$promise.then(function(tags) {
        //for (var i = 0; i < tags.length; ++i) {
            //console.log(tags[i]._id + " : " + tags[i].display_text);
            //$scope.tagFilters.push({
                //ind: i,
                //display_text: tags[i].display_text,
                //is_active: false
            //});
        //}
        //$rootScope.$broadcast("tagFilterChange", $scope.tagFilters);
        //logTagFilters();
    //}, function(reason) {
        //alert("Could not retrieve tags. Reason: " + reason);
    //});

    //$scope.toggleTagFilter = function(tagDisplayText) {
        //console.log("toggleTagFilter called with: " + tagDisplayText);
        //for (var i = 0; i < $scope.tagFilters.length; ++i) {
            //if ($scope.tagFilters[i].display_text == tagDisplayText) {
                //$scope.tagFilters[i].is_active = !$scope.tagFilters[i].is_active;
                //break;
            //}
        //}
        //$rootScope.$broadcast("tagFilterChange", $scope.tagFilters);
        //logTagFilters();
    //}

    //function logTagFilters() {
        //for (var i = 0; i < $scope.tagFilters.length; ++i) {
            //console.log($scope.tagFilters[i].ind + " : " + $scope.tagFilters[i].display_text + " : " + $scope.tagFilters[i].is_active);
        //}
    //}
//}]);

