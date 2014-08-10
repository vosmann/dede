var dedeEditControllers = angular.module("dedeEditControllers", []);

dedeEditControllers.controller("PageNamesDropdownCtrl", ["$scope", "PageNames",
        function($scope, PageNames) {
            $scope.pageNames = PageNames.query();

            //$scope.status = {
                //isopen: false
            //};

            //$scope.toggled = function(open) {
                //console.log('PageDropdown is now: ', open);
            //};

            //$scope.toggleDropdown = function($event) {
                //$event.preventDefault();
                //$event.stopPropagation();
                //$scope.status.isopen = !$scope.status.isopen;
            //};

        }]);

dedeEditControllers.controller("TagsCtrl", ["$scope", "Tags",
        function($scope, Tags) {
            $scope.tags = Tags.query();
        }]);

dedeEditControllers.controller("EntryCtrl", ["$scope", "Entry",
        function($scope, Entry) {
            $scope.entry = Entry.query("cobane");
        }]);

