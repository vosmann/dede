var dedeEditApp = angular.module('dedeEditApp', [
    'ngRoute',
    'dedeEditControllers',
    'dedeEditServices',
    'dedeEditFilters'
]);



//dedeEditApp.config(['$routeProvider',
    //function($routeProvider) {
        //$routeProvider.
            //when('/edit', {
                //templateUrl: 'static/edit-index.html',
                //controller: 'PageNamesDropdownCtrl'
            //}).
            //otherwise({
                //redirectTo: '/sranje' // Should redirect to the public frontpage or an error page.
            //});
    //}]);

