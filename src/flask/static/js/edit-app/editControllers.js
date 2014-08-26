
var dedeEditControllers = angular.module("dedeEditControllers", ['ui.bootstrap']);

dedeEditControllers.controller("PageOrEntryCtrl", function($scope) {
            $scope.pageOrEntry = 'page';
        });

dedeEditControllers.controller("PageNamesDropdownCtrl", ["$scope", "PageNames",
        "SelectedPageName", 
        function($scope, PageNames, SelectedPageName) {
            $scope.pageNames = PageNames.query();
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
        }]);

dedeEditControllers.controller("PageCtrl", ["$scope", "Page", "SelectedPageName",
        function($scope, Page, SelectedPageName) {
            $scope.$watch(function() {
                    return SelectedPageName.get();
                }, function() {
                    var selectedPageName = SelectedPageName.get();
                    $scope.page = Page.query(selectedPageName);
                });
            var selectedPageName = SelectedPageName.get();
            $scope.page = Page.query(selectedPageName);
        }]);


// Have separate services (even controllers?) for individual and massive entry queries?
dedeEditControllers.controller("EntryCtrl", ["$scope", "Entry",
        function($scope, Entry) {
            $scope.entry = Entry.query("Vinyl shelf");
        }]);



dedeEditControllers.controller("TagsCtrl", ["$scope", "Tags",
        function($scope, Tags) {
            $scope.tags = Tags.query();
            $scope.selectedTag = $scope.tags[0];
            $scope.setTag = function(tag) {
                $scope.selectedTag = tag;
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


dedeEditControllers.controller("ElementTypesDropdownCtrl", ["$scope", "ElementTypes",
        function($scope, ElementTypes) {
            $scope.elementTypes = ElementTypes.query();
            $scope.selectedElementType = elementTypes[0]; // put $scope.entry.element[x].type here
            $scope.setElementType = function(elementType) {
                $scope.selectedElementType = elementType;
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

