var dedeEditServices = angular.module('dedeEditServices', ['ngResource']);

dedeServices.factory('Pages', ['$resource',

    // Need a function that will read pages
    // and need a function that will save pages.

    function($resource){
        return $resource('/get-projects', {}, {
            get: {method:'GET', isArray:true}
        });
    }]);

