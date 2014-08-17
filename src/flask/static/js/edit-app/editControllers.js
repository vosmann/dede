
var dedeEditControllers = angular.module("dedeEditControllers", ['ui.bootstrap']);

dedeEditControllers.controller("PageOrEntryCtrl", function($scope) {
            $scope.pageOrEntry = 'page';
        });

// Are scopes local only for a single controller or somehow shared across the context?

dedeEditControllers.controller("PageCtrl", ["$scope", "Page",
        function($scope, Page) {
            $scope.page = Page.query("News stories");
        }]);


// Have separate services (even controllers?) for individual and massive entry queries?
dedeEditControllers.controller("EntryCtrl", ["$scope", "Entry",
        function($scope, Entry) {
            $scope.entry = Entry.query("Vinyl shelf");
            var a = 2;
        }]);

dedeEditControllers.controller("PageNamesDropdownCtrl", ["$scope", "PageNames",
        function($scope, PageNames) {
            $scope.pageNames = PageNames.query();
            $scope.selectedPageName = $scope.pageNames[0];
            $scope.setPageName = function(pageName) {
                $scope.selectedPageName = pageName;
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

