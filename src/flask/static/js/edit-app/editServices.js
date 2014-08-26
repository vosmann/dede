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
                        "isArchived": false,
                        "creationDate": "10-08-2014",
                        "modificationDate": "10-08-2014",
                        "entry_ids" : [0, 1]
                    };
                } else if (pageName === "Projects") {
                    fakePage = {
                        "name": "Projects",
                        "isShown": true,
                        "isArchived": false,
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

dedeEditServices.factory('Entry', ['$resource',
    function($resource) {
        // Should query by name (btw, create a unique index on field name/title of entry).
        return { 
            query: function(entryName) {
                return {
                        "name": "My vinyl shelf",
                        "tags": ["interior design"],
                        "isShown": true,
                        "isArchived": true,
                        "creationDate": "02-08-2014",
                        "modificationDate": "03-08-2014",
                        "elements": [
                            {
                                "type": "title",
                                "isShown": true,
                                "data": "Redness vinyl shelf'",
                                "level": 1
                            },
                            {
                                "type": "text",
                                "isShown": true,
                                "data": "Very long description of the project."
                            },
                            {
                                "type": "image",
                                "isShown": true,
                                "data": "angle_right_dramatic_light.jpg"
                            }]
                };
            }
        }
    }]);

dedeEditServices.factory('Tags', ['$resource',
    function($resource) {
        return { 
            query :function() {
                return ['graphic design',
                        'architecture',
                        'interior design'
                ];
            }
        }
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


