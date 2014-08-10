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

dedeEditServices.factory('Entry', ['$resource',
    function($resource){
        // Should query by name (btw, create a unique index on field name/title of entry).
        return { 
            query :function(entryName) {
                return {
                        "name": "My vinyl shelf",
                        "entryName": entryName,
                        "tags": ["interior design"],
                        "is_shown": true,
                        "is_archived": true,
                        "creation_date": "02-08-2014",
                        "modification_date": "03-08-2014",
                        "elements": [
                            {
                                "type": "title",
                                "is_shown": true,
                                "data": {
                                    "text": "Redness vinyl shelf'",
                                    "level": 1
                                }
                            },
                            {
                                "type": "text",
                                "is_shown": true,
                                "data": {
                                    "text": "Very long description of the project.",
                                    "level": 1
                                }
                            },
                            {
                                "type": "image",
                                "is_shown": true,
                                "data": {
                                    "image_id": "angle_right_dramatic_light.jpg"
                                }
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

