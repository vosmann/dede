
var dedeEditControllers = angular.module("dedeEditControllers",
        ['ui.bootstrap', 'ui.multiselect']);

dedeEditControllers.controller("PageOrEntryCtrl", function($scope) {
            $scope.pageOrEntry = 'page';
        });

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
                // This below doesn't seem to refresh from server on drop-down opening.
                // $scope.updatePageNames();
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
            
            var selectedPageName = SelectedPageName.get();
            Page.get(selectedPageName).then(function(result) {
                $scope.page = result.data;
            });

            $scope.store = function() {
                Page.store($scope.page);
                SelectedPageName.set($scope.page.name);
            };
            $scope.remove = function() {
                Page.remove($scope.page);
            };
            $scope.clear = function() {
                $scope.page = {};
                SelectedPageName.reset();
            };

            $scope.$watch(function() {
                    return SelectedPageName.get();
                }, function() {
                    var selectedPageName = SelectedPageName.get();
                    Page.get(selectedPageName).then(function(result) {
                        $scope.page = result.data;
                    });
                });
        }]);

// Somehow make one unified controller?
// He'd take the two services. And make two instances of this unified controller:
// 1) for the page drop-down and 2) for the entry drop-down.
dedeEditControllers.controller("EntryNamesDropdownCtrl", ["$scope", "EntryNames",
        "SelectedEntryName", 
        function($scope, EntryNames, SelectedEntryName) {
            $scope.entryNames = EntryNames.get();
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
        }]);

// Have separate services (even controllers?) for individual and massive entry queries?
//
// Somehow make one unified controller? He'd take the two services. And make
// two instances of this controller:
// one for the page drop-down and one for the entry drop-down.
dedeEditControllers.controller("EntryCtrl", ["$scope", "Entry", "SelectedEntryName",
        "ElementTypes",
        function($scope, Entry, SelectedEntryName, ElementTypes) {
            $scope.$watch(function() {
                    return SelectedEntryName.get();
                }, function() {
                    var selectedEntryName = SelectedEntryName.get();
                    $scope.entry = Entry.get(selectedEntryName);
                });
            var selectedEntryName = SelectedEntryName.get();
            $scope.entry = Entry.get(selectedEntryName);
            $scope.allElementTypes = ElementTypes.get();

            $scope.store = function() {
                Entry.store($scope.entry);
            };
        }]);

dedeEditControllers.controller("TagsCtrl", ["$scope", "Tags",
        function($scope, Tags) {
            $scope.tags = Tags.get();
            $scope.selectedTags = $scope.$parent.entry.tags;
            $scope.$watch(function() {
                    return $scope.$parent.entry;
                }, function() {
                    $scope.selectedTags = $scope.$parent.entry.tags;
                });
        }]);

