
var dedeEditControllers = angular.module("dedeEditControllers", ['ui.bootstrap']);

dedeEditControllers.controller("PageOrEntryCtrl", function($scope) {
            $scope.pageOrEntry = 'page';
        });

dedeEditControllers.controller("PageNamesDropdownCtrl", ["$scope", "PageNames",
        function($scope, PageNames) {
            $scope.pageNames = PageNames.query();
            $scope.selectedPageName = $scope.pageNames[0];
            $scope.set = function(pageName) {
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
            var newTag = ['Add new tag'];
            $scope.tags = Tags.query();
        }]);

dedeEditControllers.controller("EntryCtrl", ["$scope", "Entry",
        function($scope, Entry) {
            $scope.entry = Entry.query("cobane");
        }]);

