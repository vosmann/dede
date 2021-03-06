port = "443"
// Perhaps I should switch to $resource.

// Refactor the window.location.hostname into a function or something.
var dedeEditServices = angular.module('dedeEditServices', ['ngResource']);
var scheme = "https://"
var port = "443"

dedeEditServices.service('SelectedPageName', ["PageNames",
    function(PageNames) {
        var selectedPageName = "None";
        return { 
            get: function() {
                return selectedPageName;
            },
            set: function(newlySelectedPage) {
                selectedPageName = newlySelectedPage;
            },
            reset: function() {
                selectedPageName = "None";
            }
        };
    }]);
dedeEditServices.factory('PageNames', ['$http',
    function($http) {
        return { 
            get: function() {
                var promise = $http.get(scheme + window.location.hostname + ":" + port + "/edit/get/pageNames");
                return promise;
            }
        }
    }]);
dedeEditServices.factory('Page', ['$http',
    function($http) {
        return { 
            get: function(pageName) {
                var promise = $http.get(scheme + window.location.hostname + ":" + port + "/edit/get/page/" + pageName);
                return promise;
            },
            store: function(page) {
                // Always saves, even when overwriting. An improvement would be a modal that 
                // asks whether to proceed updating the page if it already exists.
                var promise = $http.post(scheme + window.location.hostname + ":" + port + "/edit/store/page", page);
                return promise;
            },
            delete: function(page) {
                $http.post(scheme + window.location.hostname + ":" + port + "/edit/delete/page", page);
            }
        };
    }]);


dedeEditServices.service('SelectedEntryName', ["EntryNames",
    function(EntryNames) {
        var selectedEntryName = "None";
        return { 
            get: function() {
                return selectedEntryName;
            },
            set: function(newlySelectedEntry) {
                selectedEntryName = newlySelectedEntry;
            },
            reset: function() {
                selectedEntryName = "None";
            }
        };
    }]);
dedeEditServices.factory('EntryNames', ['$http',
    function($http) {
        return { 
            get: function(pageName) {
                var promise = $http.get(scheme + window.location.hostname + ":" + port + "/edit/get/entryNames/" + pageName);
                return promise;
            }
        }
    }]);
dedeEditServices.factory('Entry', ['$http',
    function($http) {
        return { 
            get: function(entryName) {
                var promise = $http.get(scheme + window.location.hostname + ":" + port + "/edit/get/entry/" + entryName);
                return promise;
            },
            store: function(entry) {
                // Always saves, even when overwriting. An improvement would be a modal that 
                // asks whether to proceed updating the page if it already exists.
                var promise = $http.post(scheme + window.location.hostname + ":" + port + "/edit/store/entry", entry);
                return promise;
            },
            delete: function(entry) {
                $http.post(scheme + window.location.hostname + ":" + port + "/edit/delete/entry", entry);
            }
        }
    }]);


dedeEditServices.factory('Tags', ['$http',
    function($http) {
        return { 
            get: function(entryName) {
                var promise = $http.get("/edit/get/tags");
                return promise;
            },
            store: function(tag) {
                var promise = $http.post("/edit/store/tag", tag);
                return promise;
            }
        }
    }]);


dedeEditServices.service('SelectedElementType', ["ElementTypes",
    function(ElementTypes) {
        var allTypes = ElementTypes.get();
        var selectedElementType = allTypes[0];
        return { 
            get: function() {
                return selectedElementType;
            },
            set: function(newlySelectedElementType) {
                selectedElementType = newlySelectedElementType;
            }
        };
    }]);
dedeEditServices.factory('ElementTypes', ['$http',
    function($http) {
        return { 
            get: function() {
                var promise = $http.get(scheme + window.location.hostname + ":" + port + "/edit/get/elementTypes");
                return promise;
            }
        }
    }]);


dedeEditServices.factory('Images', ['$http',
    function($http) {
        return { 
            getMeta: function(id) {
                var promise = $http.get(scheme + window.location.hostname + ":" + port + "/edit/get/image/metadata/" + id);
                return promise;
            },
            getAllMeta: function() {
                var promise = $http.get(scheme + window.location.hostname + ":" + port + "/edit/get/image/metadata/all");
                return promise;
            },
            getImage: function(id) {
                var promise = $http.get(scheme + window.location.hostname + ":" + port + "/edit/get/image/" + id);
                return promise;
            },
            delete: function(id) {
                $http.post(scheme + window.location.hostname + ":" + port + "/edit/delete/image/" + id);
            }
        }
    }]);


