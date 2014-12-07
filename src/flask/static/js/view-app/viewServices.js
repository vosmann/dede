var dedeViewServices = angular.module('dedeViewServices', ['ngResource']);

dedeViewServices.factory('Pages', ['$http',
    function($http) {
        return { 
            get: function() {
                var promise = $http.get("http://localhost:4000/get/pages/");
                return promise;
            }
        };
    }]);

dedeViewServices.factory('Entry', ['$http',
    function($http) {
        return { 
            get: function(entryId) {
                var promise = $http.get("http://localhost:4000/get/entry/" + entryId);
                return promise;
            }
        }
    }]);

dedeViewServices.factory('Tags', ['$http',
    function($http) {
        return { 
            get: function() {
                var promise = $http.get("http://localhost:4000/get/tags");
                return promise;
            }
        }
    }]);

dedeViewServices.factory('ElementTypes', ['$http',
    function($http) {
        return { 
            get: function() {
                var promise = $http.get("http://localhost:4000/get/elementTypes");
                return promise;
            }
        }
    }]);

dedeViewServices.factory('Images', ['$http',
    function($http) {
        return { 
            getMeta: function(id) {
                var promise = $http.get("http://localhost:4000/get/image/metadata/" + id);
                return promise;
            }
        }
    }]);

