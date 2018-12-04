app.controller('DoctorsCtrl', ['$scope', '$http', 'appSerivce', 'dialogService', '$state', 'config', '$uibModal', '$filter', '$timeout', 'localStorageService', '$rootScope',
    '$stateParams', 'Notification',
    function ($scope, $http, appSerivce, dialogService, $state, config, $modal, $filter, $timeout, localStorageService, $rootScope, $stateParams, Notification) {
        $scope.sessionVal = appSerivce.getLocalStore();

        // if($rootScope.)
        $scope.selectedToppings = [];
        $scope.userdetails = {};
        $scope.searchByKeyWord = '';
        $scope.ownerPropertyList = []


        function success_msessage(message) {
            message = ` <strong>Success!</strong> ` + message;
            Notification.success({ message: message, positionY: 'bottom', positionX: 'left' });
        }

        $scope.getuserList = function () {
            // console.log('dddd',$scope.searchByKeyWord);
            $scope.validationError1 = '';
            if ($rootScope.currentRouteName == 'app.staffList') {
                $scope.user_type = 'Staff';
            } else if ($rootScope.currentRouteName == 'app.tenantList') {
                $scope.user_type = 'Tenant'
            } else {
                $scope.user_type = 'Owner'
            }

            config.getReq("maintain/getUserList", { user_type: $scope.user_type, keyword: $scope.searchByKeyWord }, false)
                .then(function (res) {
                    if (res.data.status) {
                        $scope.users_list = res.data.result;
                    } else {
                        $scope.users_list = [];
                        $scope.validationError1 = res.data.message;
                    }

                }, function (err) {
                    dialogService.showAlert(null, "Maintainit", "Server Error.");
                    // alert('server Errror');
                })
        }

        $scope.PropertyTypes = [{ property_id: '1', property_type: 'Residential' }, { property_id: '2', property_type: 'Commercial' }];
        $scope.getSubPropertyTypes = function () {
            $scope.subPropertyTypes = [{ subProperty_id: '1', subProperty_type: 'subProp1' }, { subProperty_id: '2', subProperty_type: 'subProp2' }, { subProperty_id: '3', subProperty_type: 'subProp3' }, { subProperty_id: '4', subProperty_type: 'subProp4' }]
        }

        $scope.getUserDetails = function () {
            $scope.member_id = $stateParams.member_id;
            config.getReq("maintain/getUserDetails", { member_id: $scope.member_id }, false)
                .then(function (res) {
                    if (res.data.status) {
                        $scope.userdetails = res.data.result[0];
                        if ($scope.userdetails.member_type == 2) {
                            $scope.title  = "Staff Profile Details";
                        } else if ($scope.userdetails.member_type == 1) {
                            $scope.title  = "Tenant Profile Details";
                        } else {
                            $scope.title  = "Owner Profile Details";
                        }

                        
                        config.getReq("maintain/decryptPass", { password: $scope.userdetails.password }, false)
                            .then(function (res) {

                                //console.log(res, 'testttt', typeof ($scope.userdetails.ownerPropertyList))
                                if ($scope.userdetails.member_type == 3) {

                                    //console.log($scope.userdetails.ownerPropertyList.length, "fgjh fgkjh j")
                                    for (var i = 0; i < $scope.userdetails.ownerPropertyList.length; i++) {
                                        $scope.ownerPropertyList.push($scope.userdetails.ownerPropertyList[i].property_id)
                                    }
                                    //console.log($scope.ownerPropertyList);
                                    // Object.keys($scope.userdetails.ownerPropertyList).map((item,value) => {
                                    //     console.log(item,value);
                                    //     $scope.ownerPropertyList.push(item.property_id)
                                    // })
                                    // console.log($scope.ownerPropertyList);
                                }
                                $scope.userdetails.password = res.data.result;
                                $scope.userdetails.confirmpass = $scope.userdetails.password;
                            })
                    }
                }, function (err) {
                    dialogService.showAlert(null, "Maintainit", "Server Error.");
                    // alert('server Errror');
                })
        }

        if ($rootScope.currentRouteName == 'app.user_details')
            $scope.getUserDetails();

        if ($rootScope.currentRouteName == 'app.addStaff') {
            $scope.title = 'Staff Profile Details';
        } else if($rootScope.currentRouteName == 'app.user_details'){
            $scope.title = 'Profile Details';
        }else{
            $scope.title = 'Profile Details';
        }

        $scope.addUser = function ($event) {


            if ($rootScope.currentRouteName == 'app.addStaff') {
                $scope.userdetails.member_type = 2;
            } else if ($rootScope.currentRouteName == 'app.addTenant') {
                $scope.userdetails.member_type = 1;
            } else {
                $scope.userdetails.member_type = 3;
            }



            $scope.validationError1 = '';
            $scope.successMsg1 = '';
            if (!$scope.userdetails.first_name)
                $scope.validationError1 = "First Name is Required";
            else if (!$scope.userdetails.last_name)
                $scope.validationError1 = "Last Name is Required";
            else if (!$scope.userdetails.email)
                $scope.validationError1 = "Email is Required";
            else if (!$scope.userdetails.password)
                $scope.validationError1 = "Password is Required";
            else if (!$scope.userdetails.confirmpass)
                $scope.validationError1 = "Confirm password is Required";
            else if (!$scope.userdetails.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
                $scope.validationError1 = "Invalid email.";
            else if ($scope.userdetails.password != $scope.userdetails.confirmpass)
                $scope.validationError1 = "Password and Confirm password should be the same";
            else if ($scope.validationError1 == '') {
                config.postReq("maintain/addUserDetails", $scope.userdetails, false)
                    .then(function (res) {
                        //console.log('res', res);
                        if (res.data.status) {
                            if ($scope.userdetails.member_type == 3 && res.data.member_id) {
                                //console.log('new function')
                                $scope.addOwnerProperty(res.data.member_id);
                            }

                            //console.log('res', res);
                            $scope.validationError1 = '';
                            $scope.successMsg1 = res.data.message;
                            $scope.cancel();
                        } else {
                            $scope.validationError1 = res.data.message;
                        }

                    }, function (err) {
                        dialogService.showAlert(null, "Maintainit", "Server Error.");
                        // alert('server Error');
                    })
            }
        }

        $scope.addOwnerProperty = function (member_id) {

            config.postReq("maintain/insertOwnerProperty", { member_id: member_id, property: $scope.ownerPropertyList }, true).then(function (res) {
                //console.log(res)
            }, function (err) {
                dialogService.showAlert(null, "Maintainit", "Server Error.");
            })


        }
        $scope.getPropertyLists = function () {
            //console.log($stateParams.member_id  ,$stateParams,"gyre y uyretwuye uyetwruyet yrteyeywt eywt")
            $http.get(config.apiUrl + "maintain/getProperyList", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: { owner_id: $stateParams.member_id }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.property_list = res.data.result
                    //console.log($scope.property_list);
                    $scope.validationError1 = '';
                } else {
                    //$scope.validationError1 = res.data.message;
                    $scope.property_list = [];
                }
            }, function (err) {
                dialogService.showAlert(null, "Maintain IT ", "Server Error.");
            })
        }

        $scope.updateUser = function ($event) {
            $scope.validationError1 = '';
            $scope.successMsg1 = '';
            if (!$scope.userdetails.first_name)
                $scope.validationError1 = "First Name is Required";
            else if (!$scope.userdetails.last_name)
                $scope.validationError1 = "Last Name is Required";
            else if (!$scope.userdetails.password)
                $scope.validationError1 = "Password is Required";
            else if (!$scope.userdetails.confirmpass)
                $scope.validationError1 = "Confirm password is Required";
            else if ($scope.userdetails.password != $scope.userdetails.confirmpass)
                $scope.validationError1 = "Password and Confirm password should be the same";
            else if ($scope.validationError1 == '') {
                var userDetails = {
                    first_name: $scope.userdetails.first_name,
                    last_name: $scope.userdetails.last_name,
                    member_type: $scope.userdetails.member_type,
                    address: $scope.userdetails.address,
                    state: $scope.userdetails.state,
                    zipcode: $scope.userdetails.zipcode,
                    member_id: $scope.userdetails.member_id,
                    password: $scope.userdetails.password,
                    expertise_in: $scope.userdetails.expertise_in
                }
                config.postReq("maintain/updateUserDetails", userDetails, false)
                    .then(function (res) {
                        if ($scope.userdetails.member_type == 3) {
                            //console.log("okkkk")
                            $scope.addOwnerProperty($scope.userdetails.member_id);
                        }
                        //console.log('res', res);
                        if (res.data.status) {
                            //console.log('res', res);
                            $scope.successMsg1 = res.data.message;
                            success_msessage(res.data.message);

                            if ($scope.userdetails.member_type == 1) {
                                $state.go('app.tenantList');
                            } else if ($scope.userdetails.member_type == 2) {
                                $state.go('app.staffList');
                            } else {
                                $state.go('app.ownerList');
                            }

                        } else {
                            $scope.validationError1 = res.data.error;
                        }

                    }, function (err) {
                        dialogService.showAlert(null, "Maintainit", "Server Error.");
                        // alert('server Error');
                    })
            }

        }

        $scope.searchByKeyword = function () {
            $scope.getuserList();
        }

        $scope.deleteCurUser = function ($ev, indexVal, user_id) {
            dialogService.showConfirm($ev, "Maintainit", "Do you want to remove this user").then(function (result) {
                if (result) {
                    config.postReq("maintain/removeUser", { user_id: user_id }, true).then(function (res) {
                        if (res.data.status) {
                            $scope.successMsg1 = res.data.message;
                            $scope.users_list.splice(indexVal, 1);
                        } else {
                            $scope.validationError1 = res.data.error;
                        }
                    }, function (err) {
                        dialogService.showAlert(null, "Maintainit", "Server Error.");
                    })
                }
            }, function (er) {
                //console.log("Cancelled");
            })
        }

        $scope.addNewUser = function ($event) {
            if ($rootScope.currentRouteName == 'app.staffList') {
                $state.go('app.addStaff');
            } else if ($rootScope.currentRouteName == 'app.tenantList') {
                $state.go('app.addTenant');
            } else {
                $state.go('app.addOwner');
            }



        }

        $scope.cancel = function ($event) {
            window.history.back();

        }

        $scope.onlyNumbers = function ($eve) {
            if ($eve.which < 48 || $eve.which > 57)
                $eve.preventDefault();
        }
    }]);

