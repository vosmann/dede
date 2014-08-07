var dedeEditApp = angular.module('dedeEditApp', [
    // hm. 
    'ngRoute',
    'dedeEditControllers',
    'dedeEditServices',
    'dedeEditFilters'
]);

dedeEditApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/edit', {
                templateUrl: 'resources/templates/edit-app/edit.html',
                controller: 'EditCtrl'
            ).
            otherwise({
                redirectTo: '/projects' // Should redirect to the public frontpage or an error page.
            });
    }]);

