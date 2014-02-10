var dedeServices = angular.module('dedeServices', ['ngResource']);

dedeServices.factory('Projects', ['$resource',
    function($resource){
        return $resource('/get-projects', {}, {
            get: {method:'GET', isArray:true}
        });
    }]);

dedeServices.factory('News', ['$resource',
    function($resource){
        return $resource('/get-news', {}, {
            get: {method:'GET', isArray:true}
        });
    }]);

