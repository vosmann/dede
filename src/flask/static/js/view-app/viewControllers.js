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
            // Duplication.
            $scope.getFirstImageId = function(pageId, entryId) {
                var elements = $rootScope.pages[pageId].entries[entryId].elements;
                for (var elementNr = 0; elementNr < elements.length; ++elementNr) {
                    var element = elements[elementNr];
                    var url = "/get/image/" + element.data;
                    if (element.type == "image") {
                        return url;
                    }
                }
                return undefined;
            }
            $scope.getAlignment = function(entryIndex) {
                if (entryIndex % 2 == 0) {
                    return "leftie";
                } else {
                    return "rightie";
                }
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
            // Duplication.
            $scope.getFirstImageId = function(pageId, entryId) {
                var elements = $rootScope.pages[pageId].entries[entryId].elements;
                for (var elementNr = 0; elementNr < elements.length; ++elementNr) {
                    var element = elements[elementNr];
                    var url = "/get/image/" +  element.data;
                    if (element.type == "image") {
                        return url;
                    }
                }
                return undefined;
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

