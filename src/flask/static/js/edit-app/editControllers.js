
var dedeEditControllers = angular.module("dedeEditControllers",
        ['ui.bootstrap', 'ui.multiselect']);

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

// Somehow make one unified controller? He'd take the two services. And make
// two instances of this controller:
// one for the page drop-down and one for the entry drop-down.
dedeEditControllers.controller("EntryNamesDropdownCtrl", ["$scope", "EntryNames",
        "SelectedEntryName", 
        function($scope, EntryNames, SelectedEntryName) {
            $scope.entryNames = EntryNames.query();
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
                    $scope.entry = Entry.query(selectedEntryName);
                });
            var selectedEntryName = SelectedEntryName.get();
            $scope.entry = Entry.query(selectedEntryName);
            $scope.allElementTypes = ElementTypes.query();
        }]);

dedeEditControllers.controller("TagsCtrl", ["$scope", "Tags",
        function($scope, Tags) {
            $scope.tags = Tags.query();
            $scope.selectedTags = $scope.$parent.entry.tags;
            $scope.$watch(function() {
                    return $scope.$parent.entry;
                }, function() {
                    $scope.selectedTags = $scope.$parent.entry.tags;
                });
        }]);

/*dedeEditControllers.controller("ElementTypesDropdownCtrl", ["$scope", "ElementTypes",*/
        //"SelectedElementType", 
        //function($scope, ElementTypes, SelectedElementType) {
            //$scope.elementTypes = ElementTypes.query();
            //$scope.selectedElementType = SelectedElementType.get();
            //$scope.setElementType = function(elementType) {
                //$scope.selectedElementType = elementType;
                //SelectedElementType.set(elementType);
            //};
            //$scope.status = {
                //isopen: false
            //};
            //$scope.toggleDropdown = function($event) {
                //$event.preventDefault(); // TODO: defaultPrevented() instead?
                //$event.stopPropagation();
                //$scope.status.isopen = !$scope.status.isopen;
            //};
        /*}]);*/

