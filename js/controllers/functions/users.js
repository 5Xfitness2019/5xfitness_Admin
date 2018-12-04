
app.controller('UsersCtrl', ['$scope', '$http', 'appSerivce', 'dialogService', '$state', 'config', '$uibModal', '$filter', '$timeout', 'localStorageService', '$rootScope',
    '$stateParams', 'Notification', '$mdSelect',
    function ($scope, $http, appSerivce, dialogService, $state, config, $uibModal, $filter, $timeout, localStorageService, $rootScope, $stateParams, Notification, $mdSelect) {
        $(document).bind('click', function (event) {
            $mdSelect.hide();
        });

        $scope.sessionVal = appSerivce.getLocalStore();
        $scope.painChartData = [];
        // if($rootScope.)
        $scope.genderAr = ['male', 'female'];
        $scope.maritalAr = ['single', 'married'];
        $scope.menuval = "menu1";
        $scope.healthmenuval = "healthmenu1";
        $scope.painmenuval = "painmenu1";
        $scope.selectedToppings = [];
        $scope.userdetails = {};
        $scope.searchByKeyWord = '';
        $scope.ownerPropertyList = []
        $scope.search = '';
        $scope.upload_images = [];
        $scope.details = {};
        $scope.apiUrl = config.apiUrl;
        $scope.myCroppedImage = '';
        $scope.fromdate = new Date();
        $scope.todate = new Date();
        $scope.chosen_week = [];
        $scope.minDate = new Date();


        $scope.gotoTab = function (menu) {
            $scope.healthmenuval = "healthmenu1";
            $scope.menuval = menu;
        }

        $scope.gotoTabHealth = function (menu) {
            $scope.healthmenuval = menu;
        }
        $scope.gotoTabPain = function (menu) {
            $scope.painmenuval = menu;
        }
        $scope.changeRepeat = function (assignedworkout) {
            //console.log("test",$scope.assignedworkout);
            console.log("test", assignedworkout);
            $scope.repeat_times = parseInt(assignedworkout.repeat_times);
            $scope.rest = parseInt(assignedworkout.rest);
            $scope.duration = parseInt(assignedworkout.duration);
            $scope.rest_sec = parseInt(assignedworkout.rest_sec);
            $scope.weight = parseInt(assignedworkout.weight);
        }
        $scope.getHealthInfo = function (menu, details) {
            $scope.healthmenuval = "healthmenu1";
            $scope.painmenuval = "painmenu1";
            $scope.menuval = menu;
            //console.log("details",details);
            $http.get(config.apiUrl + "fivex/getHealthInfo", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: { 'member_id': details.member_id }
            }).then(function (res) {
                if (res.data.status) {
                    if (res.data.healthinfo.length > 0) {
                        $scope.healthinfo = res.data.healthinfo[0];
                        $scope.healthinfo.diseases = JSON.parse($scope.healthinfo.diseases).join();
                        $scope.healthinfo.pain_points_front_5x = JSON.parse($scope.healthinfo.pain_points_front_5x);
                        $scope.healthinfo.pain_points_back_5x = JSON.parse($scope.healthinfo.pain_points_back_5x);
                    } else {
                        $scope.healthinfo = [];
                    }

                } else {
                    $scope.healthinfo = [];
                }
            }, function (err) {
                dialogService.showAlert(null, "5X", "Server Error.");
            })
        }
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
        $scope.getSubCategory = function (category) {
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
        $scope.getAssignedWorkouts = function (menu, details) {
            $scope.getSubCategory('');
            $scope.getCategories();
            $scope.assignedWorks = [];
            $scope.healthmenuval = "healthmenu1";
            $scope.menuval = menu;
            $http.get(config.apiUrl + "fivex/getAssignedWorkouts", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: { 'member_id': details.member_id }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.assignedWorks = res.data.data;
                } else {
                    $scope.assignedWorks = [];
                }
            }, function (err) {
                dialogService.showAlert(null, "5X", "Server Error.");
            })
        }
        //-------
        $scope.getPainChartRecords = function (menu, details, fromdate, todate) {
            $scope.healthmenuval = "healthmenu1";
            $scope.menuval = menu;
            $http.get(config.apiUrl + "fivex/getPainChartRecords", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: { 'member_id': details.member_id, 'fromdate': fromdate, 'todate': todate }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.painChartData = res.data.data;
                    $scope.labels = [];
                    $scope.data1 = [];
                    $scope.data = [];
                    for (let i = 0; i < $scope.painChartData.length; i++) {
                        $scope.labels.push($scope.painChartData[i].dis_date);
                        $scope.data1.push($scope.painChartData[i].rating);
                    }
                    $scope.data.push($scope.data1);
                    //$scope.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

                } else {
                    $scope.painChartData = [];
                }
            }, function (err) {
                dialogService.showAlert(null, "5X", "Server Error.");
            })
        }
        $scope.getDailyLogWorkouts = function (menu, details) {
            $scope.dailyLogWorkout = [];
            $scope.healthmenuval = "healthmenu1";
            $scope.menuval = menu;
            $http.get(config.apiUrl + "fivex/getDailyLogWorkouts", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: { 'member_id': details.member_id }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.dailyLogWorkout = res.data.data;
                } else {
                    $scope.dailyLogWorkout = [];
                }
            }, function (err) {
                dialogService.showAlert(null, "5X", "Server Error.");
            })
        }

        $scope.getUsers = function () {
            $http.get(config.apiUrl + "fivex/getUsers", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: { 'search': $scope.search }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.validationError1 = '';
                    $scope.lists = res.data.users;
                } else {
                    $scope.lists = [];
                    $scope.validationError1 = res.data.message;
                }
            }, function (err) {
                dialogService.showAlert(null, "5X ", "Server Error.");
            })
        }

        $scope.deleteAssigns = function (item) {
            id = $scope.assignedWorks.indexOf(item);
            dialogService.showConfirm(null, "5X ", "Are you sure you want to delete").then(function (b) {
                $http.get(config.apiUrl + "fivex/deleteAssigns", {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                    params: { 'assigned_id': $scope.assignedWorks[id].assigned_id }
                }).then(function (res) {
                    if (res.data.status) {
                        success_msessage('Assigned workout removed successfully');
                        $scope.assignedWorks.splice(id, 1);
                    } else {
                        dialogService.showAlert(null, "5X ", "Failed");
                    }
                }, function (err) {
                    dialogService.showAlert(null, "5X ", "Server Error.");
                })

            }, function (x) {

            });
        }

        $scope.deleteUser = function (item) {
            id = $scope.lists.indexOf(item);
            dialogService.showConfirm(null, "5X ", "Are you sure you want to delete").then(function (b) {
                $http.get(config.apiUrl + "fivex/deleteUser", {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                    params: { 'member_id': $scope.lists[id].member_id }
                }).then(function (res) {
                    if (res.data.status) {
                        success_msessage('User deleted successfully');
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





        $scope.changeStatus = function (list, status) {

            $scope.setArray = { 'status': status, 'member_id': list.member_id };
            $http.post(config.apiUrl + "fivex/changeUserStatus", $scope.setArray, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                transformRequest: function (data) {
                    return $.param(data);
                }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.validationError1 = '';
                    success_msessage(res.data.message);
                    $scope.getUsers();
                    //$scope.modelPop.close();
                } else {
                    $scope.validationError1 = res.data.message;
                }
            }, function (err) {
                dialogService.showAlert(null, "5X", "Server Error.");
            })
        }


        function success_msessage(message) {
            message = ` <strong>Success!</strong> ` + message;
            Notification.success({ message: message, positionY: 'bottom', positionX: 'left' });
        }

        $scope.getUserdetails = function () {
            //console.log($stateParams.member_id);
            if ($stateParams.member_id != undefined && $stateParams.member_id != '') {
                $scope.member_id = $stateParams.member_id;
                //$scope.property_details = {};
                $http.get(config.apiUrl + "fivex/getUserdetails", {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                    params: { 'member_id': $scope.member_id }
                }).then(function (res) {
                    //console.log(res.data.data[0]);
                    if (res.data.status) {
                        $scope.validationError1 = '';
                        $scope.details = res.data.data[0];
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
            $scope.assigned_id = '';
            $scope.assigned_id = '';
            $scope.workout_details = '';
            $scope.repeat_times = '';
            $scope.category_id = '';
            $scope.subcategory_id = '';
            $scope.work_period = '';
            $scope.onetime_date = '';
            $scope.chosen_week = '';
            $scope.work_times = '';
            $scope.duration = '';
            $scope.rest = '';
            $state.go(path);
        }
        $scope.assignModal = function (data = {}) {

            if (data.assigned_id) {
                $scope.assigned_id = data.assigned_id;

                $scope.repeat_times = parseInt(data.repeat_times);

                $scope.category_id = data.category_id;
                if (data.category_id) {
                    $scope.getSubCategory(data.category_id)
                }

                $scope.subcategory_id = data.subcategory_id;
                if (data.subcategory_id) {
                    $scope.getWorkoutsFilter(data.category_id, data.subcategory_id, data.workout_id);
                }
                $scope.work_period = data.work_period;
                if (data.onetime_date) {
                    $scope.onetime_date = new Date(data.onetime_date);
                }

                if ($scope.chosen_week) {
                    $scope.chosen_week = data.chosen_week.split(',');
                }
                if (data.work_times) {
                    $scope.work_times = new Date('2-2-2018 ' + data.work_times);
                }

                $scope.workout_details = data.workout_details;
                $scope.duration = parseInt(data.duration);
                $scope.rest = parseInt(data.rest);
                $scope.weight = parseInt(data.weight);
                $scope.rest_sec = parseInt(data.rest_sec);
                console.log("111111111111111111111111111111111111111", $scope.chosen_week, data.chosen_week.split(','))
            }
            $scope.modelPop = $uibModal.open({
                ariaLabelledBy: 'modal-title-top',
                ariaDescribedBy: 'modal-body-top',
                templateUrl: 'html/assignworkout_modal.html',
                scope: $scope,
                size: 'md'
            });
        }
        $scope.workoutmodel = function () {
            setTimeout(() => {
                // $scope.category_id = 2;
            }, 100);
        }
        $scope.getWorkoutsFilter = function (category_id, subcategory_id, workout_id = '') {
            console.log(workout_id, category_id, "fdghdfsh gsfhgfdh gfdjhfgdh fgdhfdh");
            console.log(subcategory_id);
            $http.get(config.apiUrl + "fivex/getWorkouts", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: { 'category_id': category_id, 'subcategory_id': subcategory_id, 'search': '' }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.validationError1 = '';
                    $scope.workouts = res.data.data;
                    if (workout_id) {

                        $scope.assignedworkout = $scope.workouts.filter((item) => {

                            if (item.workout_id == workout_id) {
                                return item;
                            }
                        })[0]

                    }

                } else {
                    $scope.workouts = [];
                    $scope.validationError1 = res.data.message;
                }
            }, function (err) {
                dialogService.showAlert(null, "5X", "Server Error.");
            })
        }
        $scope.getDailyW = function (details, logdate) {
            //console.log("Here");
            $http.get(config.apiUrl + "fivex/getDailyLogWorkouts", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: { 'member_id': details.member_id, 'date': logdate }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.dailyLogWorkout = res.data.data;
                } else {
                    $scope.dailyLogWorkout = [];
                }
            }, function (err) {
                dialogService.showAlert(null, "5X", "Server Error.");
            })
        }



        $scope.getSubscription = function () {

            $http.get(config.apiUrl + "fivex/getSubscription", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: { 'search': '' }
            }).then(function (res) {
                console.log(res.data, "FHDFGDHFGD")
                if (res.data.status) {
                    $scope.subscription = res.data.subscription;
                } else {
                    $scope.subscription = []
                }

            }, function (err) {
                dialogService.showAlert(null, "5X", "Server Error.");
            })
        }

        $scope.getWorkouts = function () {
            $http.get(config.apiUrl + "fivex/getWorkouts", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: { 'search': '' }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.validationError1 = '';
                    $scope.workouts = res.data.data;
                } else {
                    $scope.workouts = [];
                    $scope.validationError1 = res.data.message;
                }
            }, function (err) {
                dialogService.showAlert(null, "5X", "Server Error.");
            })
        }
        $scope.saveWorkoutAssign = function (workout_details, repeat_times, assignedworkout, category_id, subcategory_id, work_period, onetime_date, chosen_week, work_times, duration, rest, weight, rest_sec) {
            console.log(repeat_times, duration, rest, weight, rest_sec)
            var a;
            if (chosen_week.length) {
                chosen_week.map((item) => { if (!a) { a = item } else { a = a + ',' + item } })
            }

            if (work_times) {
                work_times = new Date(work_times).getHours() + ':' + new Date(work_times).getMinutes()
            }

            if (category_id == '' || category_id == undefined) {
                $scope.validationError1 = "Please select category";
                return false;
            } else if (subcategory_id == '' || subcategory_id == undefined) {
                $scope.validationError1 = "Please select sub category";
                return false;
            }


            //////////////////////////////////////
            else if (!duration || duration == 'null') {
                $scope.validationError1 = "Sets is required";
                return !1;
            }

            else if (!weight || weight == 'null') {
                $scope.validationError1 = "weight is required";
                return !1;
            }

            else if ((!rest && !rest_sec) || (rest == "null" && rest_sec == "null")) {
                $scope.validationError1 = "Rest is required";
                return !1;
            }

            else if (!repeat_times || repeat_times == 'null') {
                $scope.validationError1 = "Reps is required";
                return !1;
            }


            ///////////////////////////////////


            else if (assignedworkout == '' || assignedworkout == undefined) {
                $scope.validationError1 = "Please select workout ";
                return false;
            } else if (!work_times) {
                $scope.validationError1 = "Please select work time ";
                return false;
            } else if (work_period == 'onetime' && !onetime_date) {
                $scope.validationError1 = "Please select work date ";
                return false;
            } else if (!workout_details) {
                $scope.validationError1 = "Please enter workout Details ";
                return false;
            }
            else {



                $scope.setArray = { weight: weight, rest_sec: rest_sec, assigned_id: $scope.assigned_id, duration: duration, rest: rest, workout_details: workout_details, 'workout_id': assignedworkout, 'member_id': $scope.details.member_id, 'repeat_times': repeat_times, 'category_id': category_id, 'subcategory_id': subcategory_id, 'work_times': work_times, 'onetime_date': onetime_date, work_period: work_period, chosen_week: a };

                console.log($scope.setArray);


                $http.post(config.apiUrl + "fivex/saveWorkoutAssign", $scope.setArray, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                    transformRequest: function (data) {
                        return $.param(data);
                    }
                }).then(function (res) {
                    if (res.data.status) {
                        $scope.assigned_id = '';
                        $scope.assigned_id = '';
                        $scope.workout_details = '';
                        $scope.repeat_times = '';
                        $scope.category_id = '';
                        $scope.subcategory_id = '';
                        $scope.work_period = '';
                        $scope.onetime_date = '';
                        //$scope.chosen_week = '';
                        $scope.work_times = '';
                        $scope.duration = '';
                        $scope.rest = '';
                        $scope.validationError1 = '';
                        success_msessage(res.data.message);
                        //$scope.getUsers();
                        $scope.getAssignedWorkouts('menu4', $scope.details);
                        $scope.modelPop.close();
                    } else {
                        $scope.assigned_id = '';
                        $scope.validationError1 = res.data.message;
                    }
                }, function (err) {
                    dialogService.showAlert(null, "5X", "Server Error.");
                })
            }

        }
        $scope.closeModal = function () {
            $scope.modelPop.close();
        }


        // $scope.saveUser = function(){

        //     $scope.details.status=true;
        //     $http.post(config.apiUrl + "fivex/saveUser", $scope.details, {
        //         headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
        //         transformRequest: function (data) {
        //             return $.param(data);
        //         }
        //     }).then(function (res) {
        //         if (res.data.status) {
        //             //$scope.successMsg1 = res.data.message;
        //             $scope.validationError1 = '';
        //             success_msessage(res.data.message);
        //             $state.go("app.users");
        //         } else {
        //             $scope.validationError1 = res.data.message;
        //         }
        //     }, function (err) {
        //         dialogService.showAlert(null, "5X ", "Server Error.");
        //     })
        // }








        //$scope.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        $scope.series = ['Workout'];
        //$scope.data = [ [9, 8, 6, 4, 5, 7, 5] ];
        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };
        // $scope.onHover = function(points) {
        //     if (points.length > 0) {
        //         console.log('Point', points[0].value);
        //     } else {
        //         console.log('No point');
        //     }
        // };
        $scope.colours = [{ // grey
            fillColor: "rgba(255,110,64,1)",
            strokeColor: "rgba(255,110,64,1)",
            pointColor: "rgba(255,110,64,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(255,110,64,1)"
        }, { // dark grey
            fillColor: "rgba(103,58,183,1)",
            strokeColor: "rgba(103,58,183,1.0)",
            pointColor: "rgba(103,58,183,1.0)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(103,58,183,1.0)"
        }];
        $scope.options = {
            scaleShowVerticalLines: false,
            scaleShowLabels: true,
            scaleLineWidth: 1,
            scaleLineColor: "rgba(0,0,0,0.1)",
            scaleShowHorizontalLines: false,
            scaleGridLineWidth: 1,
            scaleShowGridLines: false,
            scaleGridLineColor: "rgba(0,0,0,0)",
            pointDotRadius: 5,
            pointHitDetectionRadius: 10,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }

        };


        //------------

        //   $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        //   $scope.series = ['Series A', 'Series B'];
        //   $scope.data = [
        //     [65, 59, 80, 81, 56, 55, 40],
        //     [28, 48, 40, 19, 86, 27, 90]
        //   ];
        //   $scope.onClick = function (points, evt) {
        //     console.log(points, evt);
        //   };
        //   $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
        //   $scope.options = {
        //     scales: {
        //       yAxes: [
        //         {
        //           id: 'y-axis-1',
        //           type: 'linear',
        //           display: true,
        //           position: 'left'
        //         }
        //       ]
        //     }
        //   };


    }]);

