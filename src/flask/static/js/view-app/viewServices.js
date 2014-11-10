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

dedeEditServices.factory('Tags', ['$http',
    function($http) {
        return { 
            get: function() {
                var promise = $http.get("http://localhost:4000/get/tags");
                return promise;
            }
        }
    }]);

dedeEditServices.factory('ElementTypes', ['$http',
    function($http) {
        return { 
            get: function() {
                var promise = $http.get("http://localhost:4000/get/elementTypes");
                return promise;
            }
        }
    }]);

dedeEditServices.factory('Images', ['$http',
    function($http) {
        return { 
            getMeta: function(id) {
                var promise = $http.get("http://localhost:4000/get/image/metadata/" + id);
                return promise;
            }
            // getAllMeta: function() {
            //     var promise = $http.get("http://localhost:4000/edit/get/image/metadata/all");
            //     return promise;
            // }
            // getImage: function(id) {
            //     var promise = $http.get("http://localhost:4000/get/image/" + id);
            //     return promise;
            // }
        }
    }]);

