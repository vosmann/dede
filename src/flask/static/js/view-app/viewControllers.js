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
            $scope.getMenuItemCssClass = function(pageName) {
                var currentRelativeUrl = $location.path();
                var isActive = (currentRelativeUrl.lastIndexOf(pageName, 0) === 0);
                var isInfo = (pageName.indexOf("info", 0) > -1); // terrible.
                var itemClass = "";
                if (isActive) {
                    itemClass = itemClass + "page-menu-item-active";
                }
                if (isInfo) {
                    itemClass = itemClass + " shifted";
                }
                return itemClass;
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

            $scope.getTextCssClass = function(element) {
                if (element.type === "title" && element.level === "1") {
                    return "title-1";
                }
                if (element.type === "title" && element.level === "2") {
                    return "title-2";
                }
                if (element.type === "text" && element.label === "big-text") {
                    return "big-text"; 
                }
                return "";
            }

            $scope.prepareImageList = function() {
                $scope.imageIds = [];
                var nrElements = $scope.currentEntry.elements.length;
                for (var i = 1; i < nrElements; ++i) {
                    var element = $scope.currentEntry.elements[i];
                    if (element.type === "image" && element.label !== "overview") {
                        $scope.imageIds.push($scope.currentEntry.elements[i].data);
                    }
                }
                $scope.currentImageIndex = 0; // unsafe
                console.log("currentImageIndex: " + $scope.currentImageIndex);
            }
            $scope.getCurrentImageId = function() {
                return $scope.imageIds[$scope.currentImageIndex];
            }
            $scope.toPreviousImage = function() {
                $scope.currentImageIndex--;
                if ($scope.currentImageIndex < 0) {
                    $scope.currentImageIndex = $scope.imageIds.length-1;
                    console.log("currentImageIndex was too small. reset to: " + $scope.imageIds.length-1);
                }
                console.log("currentImageIndex: " + $scope.currentImageIndex);
            }
            $scope.toNextImage  = function() {
                $scope.currentImageIndex++;
                if ($scope.currentImageIndex >= $scope.imageIds.length) {
                    $scope.currentImageIndex = 0;
                    console.log("currentImageIndex was too big. reset to: 0");
                }
                console.log("currentImageIndex: " + $scope.currentImageIndex);
            }

            // Duplication.
            $scope.getPageAndSetEntry = function(pageId, entryId) {
                Pages.getPage(pageId).then(function(result) { 
                    var page = result.data;
                    $rootScope.pages[page._id] = page;
                    // Duplication
                    var entry = page.entries[entryId];
                    if (entry != undefined) {
                        $scope.currentEntry = entry;
                        $scope.prepareImageList();
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
                    $scope.prepareImageList();
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

