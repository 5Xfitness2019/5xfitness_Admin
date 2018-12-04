app.controller('WorkoutCtrl', ['$scope', '$http', 'appSerivce', 'dialogService', '$state', 'config', '$uibModal', '$filter', '$timeout', 'localStorageService', '$rootScope', '$stateParams', 'Notification', 'Upload', '$window',
    function ($scope, $http, appSerivce, dialogService, $state, config, $modal, $filter, $timeout, localStorageService, $rootScope, $stateParams, Notification, Upload, $window) {
        $scope.sessionVal = appSerivce.getLocalStore();

        // if($rootScope.)
        $scope.selectedToppings = [];
        $scope.userdetails = {};
        $scope.searchByKeyWord = '';
        $scope.ownerPropertyList = []
        $scope.search = '';
        $scope.upload_images = [];
        $scope.details = {};
        $scope.apiUrl = config.apiUrl;
        $scope.myCroppedImage = '';
        $scope.myImage = '';

        $scope.options = {
            language: 'en',
            allowedContent: true,
            entities: false
        };

        $scope.onReady = function () {

        }
        $scope.ggg = function () {
            console.log("ddddddddd");
        }

        $scope.getWorkouts = function () {
            $http.get(config.apiUrl + "fivex/getWorkouts", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: { 'search': $scope.search }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.validationError1 = '';
                    $scope.lists = res.data.data;

                } else {
                    $scope.lists = [];
                    $scope.validationError1 = res.data.message;
                }
            }, function (err) {
                dialogService.showAlert(null, "5X", "Server Error.");
            })
        }
        $scope.saveWorkout = function () {
            console.log($scope.details);
            if ($scope.details && $scope.details.image_url) {
                $scope.details.oldimage_url = $scope.details.image_url;
            }
            if ($scope.details && $scope.details.video_url) {
                $scope.details.oldvideo_url = $scope.details.video_url;
            }




            if (($scope.details && !$scope.details.category_id) || !$scope.details) {
                $scope.validationError1 = "Category is required";
                return !1;
            }
            else if ($scope.details && !$scope.details.subcategory_id) {
                $scope.validationError1 = "Sub Category is required";
                return !1;
            }
            else if ($scope.details && !$scope.details.workout_name) {
                $scope.validationError1 = "Workout name is required";
                return !1;
            }

            else if ($scope.details && !$scope.details.duration) {
                $scope.validationError1 = "Sets is required";
                return !1;
            }

            else if ($scope.details && !$scope.details.weight) {
                $scope.validationError1 = "weight is required";
                return !1;
            }

            else if ((!$scope.details.rest && !$scope.details.rest_sec) || ($scope.details.rest == "null" && $scope.details.rest_sec == "null")) {               
                $scope.validationError1 = "Rest is required";
                return !1;
            }

            else if ($scope.details && !$scope.details.repeat_times) {
                $scope.validationError1 = "Reps is required";
                return !1;
            }

            




            if ($scope.myImage == '' || $scope.myImage == undefined) {
                if ($scope.details && !$scope.details.oldimage_url) {
                    dialogService.showAlert(null, "5X", "Please upload workout image.");
                    return !1;
                }

                $scope.details.image_url = '';
            } else {
                $scope.details.image_url = $scope.myCroppedImage;
            }
            Upload.upload({
                url: config.apiUrl + "fivex/saveWorkout", //webAPI exposed to upload the file
                data: { file: $scope.file, details: $scope.details }, //pass file as data, should be user ng-model
                headers: { 'Content-Type': undefined, 'x-access-token': $scope.sessionVal.token },
            }).then(function (resp) { //upload function returns a promise
                console.log(resp.data);
                console.log(resp.data);
                if (resp.data.status == true) { //validate success
                    $scope.validationError1 = '';
                    success_msessage(resp.data.message);
                    //$window.alert('an error occured');
                    $state.go("app.workouts");

                } else {
                    $scope.validationError1 = resp.data.message;
                    //$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
            }, function (evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                //vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });

        }

        $scope.getIframeSrc = function (url) {
            return $scope.apiUrl + url;
        }

        // $scope.changeStatus = function(list,status){
        //     console.log(list);
        //     console.log(list.topic_id);
        //     $scope.setArray = { 'status': status, 'topic_id': list.topic_id };
        //     $http.post(config.apiUrl + "fivex/changeTopicStatus", $scope.setArray, {
        //         headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
        //         transformRequest: function (data) {
        //             return $.param(data);
        //         }
        //     }).then(function (res) {
        //         if (res.data.status) {
        //             $scope.validationError1 = '';
        //             success_msessage(res.data.message);
        //             $scope.getTopics();
        //             //$scope.modelPop.close();
        //         } else {
        //             $scope.validationError1 = res.data.message;
        //         }
        //     }, function (err) {
        //         dialogService.showAlert(null, "5X", "Server Error.");
        //     })
        // }
        $scope.deleteWorkout = function (item) {
            id = $scope.lists.indexOf(item);
            dialogService.showConfirm(null, "5X ", "Are you sure you want to delete").then(function (b) {
                $http.get(config.apiUrl + "fivex/deleteWorkout", {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                    params: { 'workout_id': $scope.lists[id].workout_id }
                }).then(function (res) {
                    if (res.data.status) {
                        success_msessage('Workout removed successfully');
                        $scope.lists.splice(id, 1);
                    } else {
                        dialogService.showAlert(null, "5X ", "Failed");
                    }
                }, function (err) {
                    dialogService.showAlert(null, "5X ", "Server Error.");
                })

            }, function (x) {

            });
        }

        function success_msessage(message) {
            message = ` <strong>Success!</strong> ` + message;
            Notification.success({ message: message, positionY: 'bottom', positionX: 'left' });
        }

        $scope.getWorkoutdetails = function () {
            console.log("workout_id", $stateParams.workout_id);
            $scope.myCroppedImage = '';
            if ($stateParams.workout_id != undefined && $stateParams.workout_id != '') {
                $scope.workout_id = $stateParams.workout_id;
                //$scope.property_details = {};
                $http.get(config.apiUrl + "fivex/getWorkoutdetails", {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                    params: { 'workout_id': $scope.workout_id }
                }).then(function (res) {
                    console.log(res.data.data[0]);
                    if (res.data.status) {
                        $scope.validationError1 = '';
                        $scope.details = res.data.data[0];
                        if ($scope.details.category_id) {
                            $scope.details.category_id = $scope.details.category_id.toString();
                            $scope.details.subcategory_id = $scope.details.subcategory_id.toString();
                        } else {
                            $scope.details.category_id = '';
                            $scope.details.subcategory_id = '';
                        }
                    } else {
                        $scope.details = [];
                        $scope.validationError1 = res.message;
                    }
                }, function (err) {
                    dialogService.showAlert(null, "5X ", "Server Error.");
                })
            }


        }

        $scope.goback = function (path) {
            $state.go(path);
        }



        var handleFileSelect = function (evt) {
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.myImage = evt.target.result;
                });
            };
            reader.readAsDataURL(file);
        };
        angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);

        $scope.getCategories = function () {
            $http.get(config.apiUrl + "fivex/getCategories", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: { 'search': $scope.search }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.validationError1 = '';
                    $scope.categories = res.data.categories;

                } else {
                    $scope.categories = [];
                    $scope.validationError1 = res.data.message;
                }
            }, function (err) {
                dialogService.showAlert(null, "5X ", "Server Error.");
            })
        }
        $scope.getSubCategories = function () {
            $http.get(config.apiUrl + "fivex/getSubCategories", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: { 'search': $scope.search }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.validationError1 = '';
                    $scope.subcategories = res.data.subcategories;

                } else {
                    $scope.categories = [];
                    $scope.validationError1 = res.data.message;
                }
            }, function (err) {
                dialogService.showAlert(null, "5X ", "Server Error.");
            })
        }
        $scope.getSubCategory = function (category) {
            console.log("Here", category);
            if (category) {
                $http.get(config.apiUrl + "fivex/getSubCategories", {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                    params: { 'category_id': category }
                }).then(function (res) {
                    if (res.data.status) {
                        $scope.validationError1 = '';
                        $scope.subcategories = res.data.subcategories;

                    } else {
                        $scope.categories = [];
                        $scope.validationError1 = res.data.message;
                    }
                }, function (err) {
                    dialogService.showAlert(null, "5X ", "Server Error.");
                })
            }
        }



    }]);

