var port = "80";
var dedeViewServices = angular.module('dedeViewServices', ['ngResource']);

// Refactor the window.location.hostname into a function or something.
dedeViewServices.factory('Pages', ['$http',
    function($http) {
        return { 
            getIdsAndNames: function() {
                var promise = $http.get("http://" + window.location.hostname + ":" + port + "/get/pageIdsAndNames");
                return promise;
            },
            getPage: function(pageId) {
                var promise = $http.get("http://" + window.location.hostname + ":" + port + "/get/page/" + pageId);
                return promise;
            }
        };
    }]);

dedeViewServices.factory('Tags', ['$http',
    function($http) {
        return { 
            get: function() {
                var promise = $http.get("http://" + window.location.hostname + ":" + port + "/get/tags");
                return promise;
            }
        }
    }]);

dedeViewServices.factory('ElementTypes', ['$http',
    function($http) {
        return { 
            get: function() {
                var promise = $http.get("http://" + window.location.hostname + ":" + port + "/get/elementTypes");
                return promise;
            }
        }
    }]);

dedeViewServices.factory('Images', ['$http',
    function($http) {
        return { 
            getMeta: function(id) {
                var promise = $http.get("http://" + window.location.hostname + ":" + port + "/get/image/metadata/" + id);
                return promise;
            }
        }
    }]);

