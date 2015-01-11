var dedeViewApp = angular.module('dedeViewApp', [
    'ngRoute',
    'ngSanitize',
    'dedeViewControllers',
    'dedeViewServices'
]);

dedeViewApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/:pageId', {
                templateUrl: 'static/partials/view/page.html',
                controller: 'PageCtrl',
            }).
            when('/:pageId/:entryId', {
                templateUrl: 'static/partials/view/entry.html',
                controller: 'EntryCtrl'
            }).
            otherwise({
                redirectTo: '/projekte'
            });
    }]);

