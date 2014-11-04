// Somehow make one unified controller?
// He'd take the two services, for page names and entry names.
// And two instances of this unified controller would be created:
// 1) for the page drop-down and 2) for the entry drop-down.
//
// TODO Very important:
// Grozno. Vrti se u digestu i pitava stalno get selected page/entry tristo puta nakon svake selekcije na drop-downu!
// Use emit to have controllers communicate instead of a watch on a service:
// http://stackoverflow.com/questions/11252780/whats-the-correct-way-to-communicate-between-controllers-in-angularjs

var dedeEditControllers = angular.module("dedeEditControllers",
        ["ui.bootstrap", "ui.multiselect", "angularFileUpload"]);


dedeEditControllers.controller("PageOrEntryCtrl", ["$scope", "SelectedPageName",
        function($scope, SelectedPageName) {
            $scope.pageOrEntry = 'page';
            $scope.$watch(function() {
                    return $scope.pageOrEntry;
                }, function() {
                    // If switching to page, reset it in case its entry list has changed.
                    if ($scope.pageOrEntry === 'page') {
                        SelectedPageName.reset();
                    }
                });
        }]);


dedeEditControllers.controller("PageNamesDropdownCtrl", ["$scope", "PageNames",
        "SelectedPageName", 
        function($scope, PageNames, SelectedPageName) {

            $scope.updatePageNames = function() {
                // Should a controller ever be aware that promises exist?
                PageNames.get().then(function(result) { 
                    $scope.pageNames = result.data;
                });
            };
            $scope.pageNames = [];
            $scope.updatePageNames();

            $scope.selectedPageName = SelectedPageName.get();
            $scope.setPageName = function(pageName) {
                $scope.selectedPageName = pageName;
                SelectedPageName.set(pageName);
            };
            $scope.status = {
                isopen: false
            };
            $scope.toggleDropdown = function($event) {
                $event.preventDefault(); // defaultPrevented() instead?
                $event.stopPropagation();
                $scope.status.isopen = !$scope.status.isopen;
            };

            $scope.$watch(function() {
                    return SelectedPageName.get();
                }, function() {
                    $scope.updatePageNames();
                    $scope.selectedPageName = SelectedPageName.get();
                });
        }]);

dedeEditControllers.controller("PageCtrl", ["$scope", "Page", "SelectedPageName",
        function($scope, Page, SelectedPageName) {

            $scope.load = function() {
                var selectedPageName = SelectedPageName.get();
                Page.get(selectedPageName).then(function(result) {
                    $scope.page = result.data;
                });
            };
            $scope.store = function() {
                var name = $scope.page.name;
                Page.store($scope.page);
                $scope.clear();
                SelectedPageName.set(name);
                $scope.load();
            };
            $scope.delete = function() {
                Page.delete($scope.page);
                SelectedPageName.reset();
            };
            $scope.clear = function() {
                SelectedPageName.reset();
                $scope.page = {};
            };

            $scope.$watch(function() {
                    return SelectedPageName.get();
                }, function() {
                    var selectedPageName = SelectedPageName.get();
                    Page.get(selectedPageName).then(function(result) {
                        $scope.page = result.data;
                    });
                });

            $scope.load();

        }]);


dedeEditControllers.controller("EntryNamesDropdownCtrl", ["$scope", "EntryNames",
        "SelectedEntryName", "SelectedPageName",
        function($scope, EntryNames, SelectedEntryName, SelectedPageName) {

            $scope.updateEntryNames = function() {
                // Should a controller ever be aware that promises exist?
                EntryNames.get(SelectedPageName.get()).then(function(result) { 
                    $scope.entryNames = result.data;
                });
            };
            $scope.entryNames = [];
            $scope.updateEntryNames();

            $scope.selectedEntryName = SelectedEntryName.get();
            $scope.setEntryName = function(entryName) {
                $scope.selectedEntryName = entryName;
                SelectedEntryName.set(entryName);
            };
            $scope.status = {
                isopen: false
            };
            $scope.toggleDropdown = function($event) {
                $event.preventDefault(); // defaultPrevented() instead?
                $event.stopPropagation();
                $scope.status.isopen = !$scope.status.isopen;
            };

            $scope.$watch(function() {
                    return SelectedEntryName.get();
                }, function() {
                    $scope.updateEntryNames();
                    $scope.selectedEntryName = SelectedEntryName.get();
                });

            $scope.$watch(function() {
                    return SelectedPageName.get();
                }, function() {
                    $scope.updateEntryNames();
                    $scope.selectedEntryName = SelectedEntryName.get();
                });
        }]);

dedeEditControllers.controller("EntryCtrl", ["$scope", "Entry", "SelectedEntryName",
        "SelectedPageName", "ElementTypes", "Images", "Tags",
        function($scope, Entry, SelectedEntryName, SelectedPageName, ElementTypes, Images, Tags) {
            // Pseudo-constant.
            function createEmptyElement() {
                return {
                        "type": "image",
                        "data": "None",
                        "label": "",
                }; 
            }
            var emptyEntry = {}; // Pseudo-constant.

            $scope.load = function() {
                $scope.entry = emptyEntry;
                var selectedEntryName = SelectedEntryName.get();
                Entry.get(selectedEntryName).then(function(result) {
                    $scope.entry = result.data;
                });

                Tags.get().then(function(result) {
                    $scope.availableTags = [];
                    var rawTags = result.data;
                    var nrTags = rawTags.length;
                    for (var i = 0; i < nrTags; ++i) {
                        $scope.availableTags.push(rawTags[i]._id);
                    }
                });
            };
            $scope.store = function() {
                var name = $scope.entry.name;
                $scope.entry.pageName = SelectedPageName.get(); // Smuggling in a page name.
                Entry.store($scope.entry);
                $scope.clear();
                SelectedEntryName.set(name);
                $scope.load();
            };
            $scope.delete = function() {
                Entry.delete($scope.entry);
                SelectedEntryName.reset();
            };
            $scope.clear = function() {
                SelectedEntryName.reset();
                $scope.entry = emptyEntry;
            };

            ElementTypes.get().then(function(result) {
                $scope.allElementTypes = result.data;
            });
            $scope.addElementAfter = function(position) {
                if ($scope.entry == undefined) {
                    $scope.entry = emptyEntry;
                }
                if ($scope.entry.elements == undefined) {
                    $scope.entry.elements = [];
                }
                $scope.entry.elements.splice(position + 1, 0, createEmptyElement());
            };
            $scope.removeElementAt = function(position) {
                $scope.entry.elements.splice(position, 1);
            };

            Images.getAllMeta().then(function(result) {
                $scope.allImagesMetadata = result.data;
            });

            $scope.$watch(function() {
                    return SelectedEntryName.get();
                }, function() {
                    $scope.load();
                });
            $scope.$watch(function() {
                    return SelectedPageName.get();
                }, function() {
                    $scope.clear();
                });

            $scope.load();
        }]);


dedeEditControllers.controller("TagsCtrl", ["$scope", "Tags",
        function($scope, Tags) {

            // This tags. wrapper object is most likely unneccessary.
            $scope.load = function() {
                $scope.tags.newTag = {"use":"false"};
                Tags.get().then(function(result) {
                    $scope.tags.allTags = result.data;
                });
            }
            $scope.store = function(tag) {
                Tags.store(tag);
                $scope.load();
            }

            $scope.tags = {};
            $scope.load();
        }]);

// Used in *both* entry editing and image upload/review.
dedeEditControllers.controller("ImageCtrl", ["$scope", "$rootScope", "Images", 
        function($scope, $rootScope, Images) {

            $scope.updateAllImagesMetadata = function() {
                Images.getAllMeta().then(function(result) { 
                    $scope.allImagesMetadata = result.data;
                    $scope.setSelectedImageMetadata($scope.allImagesMetadata[0]);
                });
            };
            $scope.setSelectedImageMetadata = function(imageMetadata) {
                $scope.selectedImageMetadata = imageMetadata._id;
            };
            $scope.deleteImage = function(id) {
                Images.delete(id);
                $scope.updateAllImagesMetadata();
            }

            $scope.allImagesMetadata = [];
            $scope.selectedImageMetadata = {}; // Only used in entry editing?
            $scope.updateAllImagesMetadata();

            $rootScope.$on('imageUpload', function(event, data) {
                console.log('imageUpload' + ":" + data);
                $scope.updateAllImagesMetadata();
            });

        }]);


dedeEditControllers.controller("ImageUploadCtrl", ["$scope", "$rootScope", "$upload",
        function($scope, $rootScope, $upload) {
            // The controller shouldn't talk to the server. Refactor into a service at some point.
            $scope.onFileSelect = function($files) {
                for (var fileNr = 0; fileNr < $files.length; ++fileNr) {
                    var file = $files[fileNr];
                    $scope.upload = $upload.upload({
                        url: 'edit/store/image',
                        method: 'POST',
                        // TODO Debug this and see what is sent here (probably nothing).
                        data: {myObj: $scope.myModelObj},
                        file: file, // or list of files ($files) for html5 only
                    }).progress(function(progressEvent) {
                        var percentageDoneFloat = 100.0 * progressEvent.loaded / progressEvent.total;
                        $scope.percentageDone = parseInt(percentageDoneFloat);
                        console.log('percent: ' + $scope.percentageDone);
                    }).success(function(data, status, headers, config) {
                        $scope.percentageDone = 0;
                        console.log(data);
                        $rootScope.$emit('imageUpload', [1, 2, 3]); // event, data
                    });
                }
            };
        }]);

