var dedeViewApp = angular.module('dedeViewApp', [
    'ngRoute',
    'dedeViewControllers',
    'dedeViewServices'
]);

dedeViewApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/:pageId', {
                templateUrl: 'partials/page.html',
                controller: 'PageCtrl',
                }
            }).
            when('/:pageId/:entryId', {
                templateUrl: 'partials/entry.html',
                controller: 'EntryCtrl'
            }).
            otherwise({
                redirectTo: '/projects'
            });
    }]);

