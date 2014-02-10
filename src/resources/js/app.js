var dedeApp = angular.module('dedeApp', [
    'ngRoute',
    'dedeControllers',
    'dedeServices'
]);

dedeApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/projects', {
                templateUrl: 'resources/templates/projects.html',
                controller: 'ProjectsCtrl'
            }).
            when('/news', {
                templateUrl: 'resources/templates/news.html',
                controller: 'NewsCtrl'
            }).
            otherwise({
                redirectTo: '/projects'
            });
    }]);


