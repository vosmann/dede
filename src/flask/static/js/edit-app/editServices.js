// Enable Angular's cache on everything using $http?
// Perhaps I should switch to $resource.

var dedeEditServices = angular.module('dedeEditServices', ['ngResource']);

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
                var promise = $http.get("http://localhost:5000/edit/get/pages");
                return promise;
            }
        }
    }]);


dedeEditServices.factory('Page', ['$http',
    function($http) {
        // Should get by page name (btw, create unique index on page).
        return { 
            get: function(pageName) {
                var promise = $http.get("http://localhost:5000/edit/get/page/" + pageName);
                return promise;
            },
            store: function(page) {
                // Always saves even when overwriting. An improvement would be a modal that 
                // asks whether to proceed updating the page if it already exists.
                $http.post("http://localhost:5000/edit/store/page", page);
            },
            remove: function(page) {
                $http.post("http://localhost:5000/edit/delete/page", page);
            }
        };
    }]);

dedeEditServices.service('SelectedEntryName', ["EntryNames",
    function(EntryNames) {
        var allNames = EntryNames.get();
        var selectedEntryName = allNames[0];
        return { 
            get: function() {
                return selectedEntryName;
            },
            set: function(newlySelectedEntry) {
                selectedEntryName = newlySelectedEntry;
            }
        };
    }]);

dedeEditServices.factory('EntryNames', ['$resource',
    function($resource) {
        return { 
            get :function() {
                return [
                        'Vinyl shelf',
                        'Red shelf'
                ];
            }
        }
    }]);

dedeEditServices.factory('Entry', ['$http',
    function($http) {
        // Should get by name (btw, create a unique index on field name/title of entry).
        return { 
            get: function(entryName) {
                var fakeEntry;
                if (entryName === "Vinyl shelf") {
                    fakeEntry = {
                        "_id": 0,
                        "name": "Vinyl shelf",
                        "tags": ["interior design"],
                        "isShown": true,
                        "isArchived": false,
                        "creationDate": "02-08-2014",
                        "modificationDate": "03-08-2014",
                        "elements": [
                            {
                                "type": "title",
                                "isShown": true,
                                "data": "Vinyl shelf",
                                "label": "special label 1",
                                "level": 1
                            },
                            {
                                "type": "text",
                                "isShown": true,
                                "label": "ordinary label 1",
                                "data": "This is the long-awaited vinyl shelf."
                            },
                            {
                                "type": "image",
                                "isShown": true,
                                "label": "ordinary label 2",
                                "data": "angle_right_dramatic_light.jpg"
                            }]
                    };
                } else if (entryName === "Red shelf") {
                    fakeEntry = {
                        "_id": 1,
                        "name": "Red shelf",
                        "tags": ["art", "interior design"],
                        "isShown": false,
                        "isArchived": true,
                        "creationDate": "30-08-2014",
                        "modificationDate": "30-08-2014",
                        "elements": [
                            {
                                "type": "title",
                                "isShown": true,
                                "data": "Red red red",
                                "level": 1
                            },
                            {
                                "type": "text",
                                "isShown": true,
                                "data": "A playful red shelf-toy."
                            },
                            {
                                "type": "image",
                                "isShown": true,
                                "data": "red_shelf.jpg"
                            }]
                    };
                } else {
                    fakeEntry = {
                        "name": "Entry " + entryName + " does not exist." 
                    }
                }

                return fakeEntry;
            },
            store: function(entry) {
                alert("Sending to server: " + JSON.stringify(entry));
                $http.post("http://localhost:5000/edit/store/entry", entry);
            }
        }
    }]);

dedeEditServices.factory('Tags', ['$resource',
    function($resource) {
        return { 
            get :function() {
                return ['graphic design',
                        'architecture',
                        'art',
                        'interior design'
                ];
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

dedeEditServices.factory('ElementTypes', ['$resource',
    function($resource) {
        return { 
            get: function() {
                return ['title',
                        'text',
                        'image'];
            }
        }
    }]);

