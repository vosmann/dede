var dedeViewApp = angular.module('dedeViewApp', [
    'ngRoute',
    'dedeViewControllers',
    'dedeViewServices'
]);

// 'dedeViewFilters',
// 'dedeViewDirectives'

// 'p' as in 'page'
dedeViewApp.config(['$routeProvider', 'Pages',
    function($routeProvider, Pages) {
        $routeProvider.
            when('/p/:pageName', {
                templateUrl: 'partials/entry-list.html',
                controller: 'PageCtrl'
            }).
            when('/p/:pageName/:entryId', {
                templateUrl: 'partials/entry.html',
                controller: 'EntryCtrl'
            }).
            otherwise({
                // TODO get list of pages and put the first one into var 'firstPageName'.
                redirectTo: '/p/' + Pages.getFirst() 
            });
    }]);

