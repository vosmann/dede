var dedeViewControllers = angular.module("dedeViewControllers", []);
// Angular FAQ says rootScope may be used to keep some data useful to the whole app. Hm.
// Perhaps replace with cacheFactory.
// I like (hate) how I alternate between .field and [field] dereferencing.

dedeViewControllers.controller("PageMenuCtrl", ["$scope", "$location", "Pages",
        function($scope, $location, Pages) {
            $scope.getPageIdsAndNames = function() {
                Pages.getIdsAndNames ().then(function(result) { 
                    $scope.pageIdsAndNames = result.data;
                });
            };
            $scope.isActive = function(pageLocation) {
                return pageLocation === $location.path();
            }
            $scope.pageIdsAndNames = {};
            $scope.getPageIdsAndNames();
        }]);

dedeViewControllers.controller("PageCtrl", ["$scope", "$rootScope", "$routeParams", "Pages",
        function($scope, $rootScope, $routeParams, Pages) {
            // Duplication.
            $scope.getPage = function(pageId) {
                Pages.getPage(pageId).then(function(result) { 
                    var page = result.data;
                    $rootScope.pages[page._id] = page;
                    $scope.currentPage = page;
                });
            };
            if ($rootScope.pages == undefined) {
                $rootScope.pages = {};
                $scope.getPage($routeParams.pageId);
            } else if ($rootScope.pages[$routeParams.pageId] == undefined) {
                $scope.getPage($routeParams.pageId);
            } else {
                $scope.currentPage = $rootScope.pages[$routeParams.pageId];
            }
        }]);

dedeViewControllers.controller("EntryCtrl", ["$scope", "$rootScope", "$routeParams", "Pages",
        function($scope, $rootScope, $routeParams, Pages) {
            // Duplication.
            $scope.getPageAndSetEntry = function(pageId, entryId) {
                Pages.getPage(pageId).then(function(result) { 
                    var page = result.data;
                    $rootScope.pages[page._id] = page;
                    // Duplication
                    var entry = page.entries[entryId];
                    if (entry != undefined) {
                        $scope.currentEntry = entry;
                    } else {
                        $scope.currentEntry = { "name" : "Entry not found" };
                    }
                });
            };
            if ($rootScope.pages == undefined) {
                $rootScope.pages = {};
                $scope.getPageAndSetEntry($routeParams.pageId, $routeParams.entryId);
            } else if ($rootScope.pages[$routeParams.pageId] == undefined) {
                $scope.getPageAndSetEntry($routeParams.pageId, $routeParams.entryId);
            } else {
                // Duplication
                var entry = $rootScope.pages[$routeParams.pageId].entries[$routeParams.entryId];
                if (entry != undefined) {
                    $scope.currentEntry = entry;
                } else {
                    $scope.currentEntry = { "name" : "Entry not found" };
                }
            }
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

