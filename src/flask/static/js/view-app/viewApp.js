var dedeViewApp = angular.module('dedeViewApp', [
    'ngRoute',
    'dedeViewControllers',
    'dedeViewServices'
]);

// 'dedeViewFilters',
// 'dedeViewDirectives'

// 'p' as in 'page'
dedeViewApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/p/:pageName', {
                templateUrl: 'partials/entry-list.html',
                controller: 'PageCtrl',
                resolve: {
                    getPages: function(Pages) {
                    }
                }
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

