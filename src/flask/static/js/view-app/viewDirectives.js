'use strict';

/* Directives */

var dedeViewDirectives = angular.module("dedeViewDirectives", []);

dedeViewDirectives.directive("header", function() {
    return {
        templateUrl: 'parts/header.html'
    };
});

dedeViewDirectives.directive("footer", function() {
    return {
        templateUrl: 'parts/footer.html'
    };
});
 
