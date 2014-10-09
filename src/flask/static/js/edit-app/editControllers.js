// Somehow make one unified controller?
// He'd take the two services, for page names and entry names.
// And two instances of this unified controller would be created:
// 1) for the page drop-down and 2) for the entry drop-down.

var dedeEditControllers = angular.module("dedeEditControllers",
        ['ui.bootstrap', 'ui.multiselect']);


dedeEditControllers.controller("PageOrEntryCtrl", ["$scope", "SelectedPageName",
        function($scope, SelectedPageName) {
            $scope.pageOrEntry = 'page';
            $scope.$watch(function() {
                    return $scope.pageOrEntry;
                }, function() {
                    // If switching to page, reset it in case its entry list has changed.
                    if ($scope.pageOrEntry === 'page') {
                        SelectedPageName.reset();
                    }
                });
        }]);


dedeEditControllers.controller("PageNamesDropdownCtrl", ["$scope", "PageNames",
        "SelectedPageName", 
        function($scope, PageNames, SelectedPageName) {

            $scope.updatePageNames = function() {
                // Should a controller ever be aware that promises exist?
                PageNames.get().then(function(result) { 
                    $scope.pageNames = result.data;
                });
            };
            $scope.pageNames = [];
            $scope.updatePageNames();

            $scope.selectedPageName = SelectedPageName.get();
            $scope.setPageName = function(pageName) {
                $scope.selectedPageName = pageName;
                SelectedPageName.set(pageName);
            };
            $scope.status = {
                isopen: false
            };
            $scope.toggleDropdown = function($event) {
                $event.preventDefault(); // defaultPrevented() instead?
                $event.stopPropagation();
                $scope.status.isopen = !$scope.status.isopen;
            };

            $scope.$watch(function() {
                    return SelectedPageName.get();
                }, function() {
                    $scope.updatePageNames();
                    $scope.selectedPageName = SelectedPageName.get();
                });
        }]);

dedeEditControllers.controller("PageCtrl", ["$scope", "Page", "SelectedPageName",
        function($scope, Page, SelectedPageName) {

            $scope.load = function() {
                var selectedPageName = SelectedPageName.get();
                Page.get(selectedPageName).then(function(result) {
                    $scope.page = result.data;
                });
            };
            $scope.store = function() {
                var name = $scope.page.name;
                Page.store($scope.page);
                $scope.clear();
                SelectedPageName.set(name);
                $scope.load();
            };
            $scope.delete = function() {
                Page.delete($scope.page);
                SelectedPageName.reset();
            };
            $scope.clear = function() {
                SelectedPageName.reset();
                $scope.page = {};
            };

            $scope.$watch(function() {
                    return SelectedPageName.get();
                }, function() {
                    var selectedPageName = SelectedPageName.get();
                    Page.get(selectedPageName).then(function(result) {
                        $scope.page = result.data;
                    });
                });

            $scope.load();

        }]);


dedeEditControllers.controller("EntryNamesDropdownCtrl", ["$scope", "EntryNames",
        "SelectedEntryName", "SelectedPageName",
        function($scope, EntryNames, SelectedEntryName, SelectedPageName) {

            $scope.updateEntryNames = function() {
                // Should a controller ever be aware that promises exist?
                EntryNames.get(SelectedPageName.get()).then(function(result) { 
                    $scope.entryNames = result.data;
                });
            };
            $scope.entryNames = [];
            $scope.updateEntryNames();

            $scope.selectedEntryName = SelectedEntryName.get();
            $scope.setEntryName = function(entryName) {
                $scope.selectedEntryName = entryName;
                SelectedEntryName.set(entryName);
            };
            $scope.status = {
                isopen: false
            };
            $scope.toggleDropdown = function($event) {
                $event.preventDefault(); // defaultPrevented() instead?
                $event.stopPropagation();
                $scope.status.isopen = !$scope.status.isopen;
            };

            $scope.$watch(function() {
                    return SelectedEntryName.get();
                }, function() {
                    $scope.updateEntryNames();
                    $scope.selectedEntryName = SelectedEntryName.get();
                });

            $scope.$watch(function() {
                    return SelectedPageName.get();
                }, function() {
                    $scope.updateEntryNames();
                    $scope.selectedEntryName = SelectedEntryName.get();
                });
        }]);

dedeEditControllers.controller("EntryCtrl", ["$scope", "Entry", "SelectedEntryName",
        "SelectedPageName", "ElementTypes", "ImageMetadata",
        function($scope, Entry, SelectedEntryName, SelectedPageName, ElementTypes, ImageMetadata) {
            // Pseudo-constant.
            function createEmptyElement() {
                return {
                        "type": "image",
                        "data": "None",
                        "label": "",
                }; 
            }
            var emptyEntry = {}; // Pseudo-constant.

            $scope.load = function() {
                $scope.entry = emptyEntry;
                var selectedEntryName = SelectedEntryName.get();
                Entry.get(selectedEntryName).then(function(result) {
                    $scope.entry = result.data;
                });
            };
            $scope.store = function() {
                var name = $scope.entry.name;
                $scope.entry.pageName = SelectedPageName.get(); // Smuggling in a page name.
                Entry.store($scope.entry);
                $scope.clear();
                SelectedEntryName.set(name);
                $scope.load();
            };
            $scope.delete = function() {
                Entry.delete($scope.entry);
                SelectedEntryName.reset();
            };
            $scope.clear = function() {
                SelectedEntryName.reset();
                $scope.entry = emptyEntry;
            };

            ElementTypes.get().then(function(result) {
                $scope.allElementTypes = result.data;
            });
            $scope.addElementAfter = function(position) {
                if ($scope.entry == undefined) {
                    $scope.entry = emptyEntry;
                }
                if ($scope.entry.elements == undefined) {
                    $scope.entry.elements = [];
                }
                $scope.entry.elements.splice(position + 1, 0, createEmptyElement());
            };
            $scope.removeElementAt = function(position) {
                $scope.entry.elements.splice(position, 1);
            };

            ImageMetadata.get().then(function(result) {
                $scope.allImagesMetadata = result.data;
            });

            $scope.$watch(function() {
                    return SelectedEntryName.get();
                }, function() {
                    var selectedEntryName = SelectedEntryName.get();
                    Entry.get(selectedEntryName).then(function(result) {
                        $scope.entry = result.data;
                    });
                });
            $scope.$watch(function() {
                    return SelectedPageName.get();
                }, function() {
                    $scope.clear();
                });

            $scope.load();
        }]);


// TODO: Finish the tag thing at some point.
dedeEditControllers.controller("TagsCtrl", ["$scope", "Tags",
        function($scope, Tags) {
            $scope.tags = Tags.get();
            // $scope.selectedTags = $scope.$parent.entry.tags;
/*            $scope.$watch(function() {*/
                    //return $scope.$parent.entry.tags; // TODO
                //}, function() {
                    //$scope.selectedTags = $scope.$parent.entry.tags;
                /*});*/
        }]);


dedeEditControllers.controller("ImageCtrl", ["$scope", "ImageMetadata", "Images", 
        function($scope, ImageMetadata, Images) {

            $scope.updateAllImagesMetadata = function() {
                ImageMetadata.get().then(function(result) { 
                    $scope.allImagesMetadata = result.data;
                    $scope.setSelectedImageMetadata($scope.allImagesMetadata[0]);
                });
            };
            $scope.setSelectedImageMetadata = function(imageMetadata) {
                $scope.selectedImageMetadata = imageMetadata._id;
            };

            $scope.allImagesMetadata = [];
            $scope.selectedImageMetadata = {};
            $scope.updateAllImagesMetadata();
        }]);




