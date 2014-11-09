var dedeViewApp = angular.module('dedeViewApp', [
    'ngRoute',
    'dedeViewControllers',
    'dedeViewServices',
    'dedeViewFilters'
]);


//dedeApp.config(['$routeProvider',
    //function($routeProvider) {
        //$routeProvider.
            //when('/projects', {
                //templateUrl: 'resources/templates/projects.html',
                //controller: 'ProjectsCtrl'
            //}).
            //when('/news', {
                //templateUrl: 'resources/templates/news.html',
                //controller: 'NewsCtrl'
            //}).
            //when('/about', {
                //templateUrl: 'resources/templates/about.html',
                //controller: 'AboutCtrl'
            //}).
            //when('/contact', {
                //templateUrl: 'resources/templates/contact.html',
                //controller: 'ContactCtrl'
            //}).
            //otherwise({
                //redirectTo: '/projects'
            //});
    //}]);

