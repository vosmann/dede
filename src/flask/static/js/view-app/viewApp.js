var dedeViewApp = angular.module('dedeViewApp', [
    'ngRoute',
    'dedeViewControllers',
    'dedeViewServices'
]);

// 'dedeViewFilters',
// 'dedeViewDirectives'

dedeViewApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/:pageName', {
                templateUrl: 'partials/page.html',
                controller: 'PageCtrl',
                }
            }).
            when('/:pageName/:entryId', {
                templateUrl: 'partials/entry.html',
                controller: 'EntryCtrl'
            }).
            otherwise({
                redirectTo: '/projects'
            });
    }]);

