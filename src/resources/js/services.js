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

dedeServices.factory('Tags', ['$resource',
    function($resource){
        return $resource('/get-tags', {}, {
            get: {method:'GET', isArray:true}
        });
    }]);

dedeServices.factory('About', ['$resource',
    function($resource){
        return $resource('/get-about', {}, {
            get: {method:'GET', isArray:false}
        });
    }]);

dedeServices.factory('Contact', ['$resource',
    function($resource){
        return $resource('/get-contact', {}, {
            get: {method:'GET', isArray:false}
        });
    }]);

