var dedeEditServices = angular.module('dedeEditServices', ['ngResource']);


/*return $resource('/get-projects', {}, {*/
    //get: {method:'GET', isArray:true}
/*});*/

dedeEditServices.factory('PageNames', ['$resource',
    function($resource){
        return { 
            query :function() {
                return ['Stories',
                        'Projects',
                        'About',
                        'Contact us'];
            }
        }
    }]);

dedeEditServices.factory('Page', ['$resource',
    function($resource){
        // Should query by page name (btw, create unique index on page).
        return { 
            query: function(pageName) {
                return {
                        "name": "News stories",
                        "isShown": true,
                        "isArchived": true,
                        "creationDate": "10-08-2014",
                        "modificationDate": "10-08-2014"
                };
            }
        };
    }]);

dedeEditServices.factory('Entry', ['$resource',
    function($resource){
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
    function($resource){
        return { 
            query :function() {
                return ['interior design',
                        'architecture'];
            }
        }
    }]);

