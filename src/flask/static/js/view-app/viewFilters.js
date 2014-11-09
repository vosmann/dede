var dedeFilters = angular.module("dedeFilters", []);

dedeFilters.filter("tagFilter", function() {
    return function(taggedItems, shit, tags) { // Rename "tags" to "filterTags".

        if (tags.length == 1 && tags[0].display_text == "All") {
            return taggedItems;
        }

        var noActiveTags = true;
        for (var tagInd = 0; tagInd < tags.length; ++tagInd) {
            if (tags[tagInd].is_active) {
                noActiveTags = false;
            }
        }

        if (noActiveTags) {
            return taggedItems;
        }

        var filteredItems = [];
        for (var itemInd = 0; itemInd < taggedItems.length; ++itemInd) {
            for (var tagInd = 0; tagInd < tags.length; ++tagInd) {
                console.log("tags[" + tagInd + "].display_text: " + tags[tagInd].display_text
                    + ", taggedItems[" + itemInd + "].tag: " + taggedItems[itemInd].tag);
                if (tags[tagInd].is_active && (tags[tagInd].display_text == taggedItems[itemInd].tag)) { 
                    filteredItems.push(taggedItems[itemInd]);
                    break;
                }
            }
        }

        return filteredItems;
    }
});
