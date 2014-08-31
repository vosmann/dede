var dedeEditServices = angular.module('dedeEditServices', ['ngResource']);


dedeEditServices.service('SelectedPageName', ["PageNames",
    function(PageNames) {
        var allNames = PageNames.query();
        var selectedPageName = allNames[0];
        return { 
            get: function() {
                return selectedPageName;
            },
            set: function(newlySelectedPage) {
                selectedPageName = newlySelectedPage;
            }
        };
    }]);

dedeEditServices.factory('PageNames', ['$resource',
    function($resource) {
        return { 
            query :function() {
                return [
                        'Stories',
                        'Projects'
                ];
            }
        }
    }]);

dedeEditServices.factory('Page', ['$resource',
    function($resource) {
        // Should query by page name (btw, create unique index on page).
        return { 
            query: function(pageName) {
                var fakePage;
                if (pageName === "Stories") {
                    fakePage = {
                        "name": "Stories",
                        "isShown": true,
                        "creationDate": "10-08-2014",
                        "modificationDate": "10-08-2014",
                        "entry_ids" : [0, 1]
                    };
                } else if (pageName === "Projects") {
                    fakePage = {
                        "name": "Projects",
                        "isShown": true,
                        "creationDate": "11-08-2014",
                        "modificationDate": "11-08-2014",
                        "entry_ids" : [2, 3]
                    };
                } else {
                    fakePage = {
                        "name": "Page " + pageName + " does not exist." 
                    }
                }

                return fakePage;
            }
        };
    }]);

dedeEditServices.service('SelectedEntryName', ["EntryNames",
    function(EntryNames) {
        var allNames = EntryNames.query();
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
            query :function() {
                return [
                        'Vinyl shelf',
                        'Red shelf'
                ];
            }
        }
    }]);



dedeEditServices.factory('Entry', ['$resource',
    function($resource) {
        // Should query by name (btw, create a unique index on field name/title of entry).
        return { 
            query: function(entryName) {
                var fakeEntry;
                if (entryName === "Vinyl shelf") {
                    fakeEntry = {
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
                                "level": 1
                            },
                            {
                                "type": "text",
                                "isShown": true,
                                "data": "This is the long-awaited vinyl shelf."
                            },
                            {
                                "type": "image",
                                "isShown": true,
                                "data": "angle_right_dramatic_light.jpg"
                            }]
                    };
                } else if (entryName === "Red shelf") {
                    fakeEntry = {
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
            store: function(entryToStore) {
                alert(entryToStore);
            }
        }
    }]);

dedeEditServices.factory('Tags', ['$resource',
    function($resource) {
        return { 
            query :function() {
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
        var allTypes = ElementTypes.query();
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
            query :function() {
                return ['title',
                        'text',
                        'image'];
            }
        }
    }]);

