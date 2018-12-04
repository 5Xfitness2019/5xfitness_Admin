
app.controller('ChatCtrl', ['$scope', '$http', 'appSerivce', 'dialogService', '$state', 'config', '$uibModal', '$filter', '$timeout', 'localStorageService', '$rootScope',
    '$stateParams', 'Notification', 'Upload', '$window', '$element', '$mdSelect',
    function ($scope, $http, appSerivce, dialogService, $state, config, $uibModal, $filter, $timeout, localStorageService, $rootScope, $stateParams, Notification, Upload, $window, $element, $mdSelect) {
        var session = JSON.parse(localStorageService.get('user'));
        var socket = io('http://newagesme.com:7071/', { query: "member_id=" + session.member_id });
        //socket.disconnect();
        socket.connect();
        $(document).bind('click', function (event) {
            $mdSelect.hide();
        });

        //console.log(socket);
        $scope.myCroppedImage = '';
        $scope.myImage = '';
        $scope.seltab = 'image';
        $scope.groupMembers = [];
        $scope.options = {
            language: 'en',
            allowedContent: true,
            entities: false
        };

        $scope.uploadFile = function (event) {
            console.log(event.target.files)
            var files = event.target.files;
        };
        $scope.handleFileSelect = function (evt) {
            console.log("Hai");
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.myImage = evt.target.result;
                });
            };
            reader.readAsDataURL(file);
        };
        $scope.initFunction = function () {

            angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
        }







        $scope.newGroupChatModal = function (group_name = '', group_id = '') {


            if (group_name && group_id) {
                $scope.group_id = group_id;
                $scope.group_name = group_name;
            }
            $scope.modelPop = $uibModal.open({
                ariaLabelledBy: 'modal-title-top',
                ariaDescribedBy: 'modal-body-top',
                templateUrl: 'html/newGroupChat.html',
                scope: $scope,
                size: 'md'
            });
        }
        $scope.setGroupMembers = function (id) {
            $scope.editGroupId = id;

            $scope.modelPop = $uibModal.open({
                ariaLabelledBy: 'modal-title-top',
                ariaDescribedBy: 'modal-body-top',
                templateUrl: 'html/addMemberToGroup.html',
                scope: $scope,
                size: 'md'
            });
        }


        $scope.saveMebers = function (groupMbrs) {
            console.log(groupMbrs, $scope.groupMembers, "idss groupid");

            $http.get(config.apiUrl + "fivex/addMembers", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: { 'ids': groupMbrs }
            }).then(function (res) {


                $scope.groupMembers = [];
                $scope.closeModal();
            }, function (err) {
                dialogService.showAlert(null, "5X", "Server Error.");
            })

        }



        $scope.getMebers = function () {
            $scope.mbrs = [];
            $scope.groupMembers = [];
            $http.get(config.apiUrl + "fivex/getMebers", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: { group_id: $scope.editGroupId }
            }).then(function (res) {

                $scope.mbrs = res.data.members;

                $scope.groupMembers = res.data.group_members.map((item) => {
                    return item.member_id;
                })

                console.log(res, "fdsgkfghfidshkfdshy ")

            }, function (err) {
                dialogService.showAlert(null, "5X", "Server Error.");
            })

        }



        $scope.saveGroupMembers = function (groupMbrs) {
            $http.get(config.apiUrl + "fivex/saveGroupMembers", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: { group_id: $scope.editGroupId, group_members: groupMbrs }
            }).then(function (res) {

                $scope.closeModal();

            }, function (err) {
                dialogService.showAlert(null, "5X", "Server Error.");
            })
        }

        // The md-select directive eats keydown events for some quick select
        // logic. Since we have a search input here, we don't need that logic.


        $scope.addNewGroup = function (group_name) {
            console.log(group_name);
            $http.get(config.apiUrl + "fivex/creatGroups", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: { 'group_name': group_name, group_id: $scope.group_id }
            }).then(function (res) {
                console.log(res);
                if ($scope.group_id) {
                    $scope.groups.map((item, idex) => {
                        if (item.group_id == $scope.group_id) {
                            $scope.groups[idex].group_name = group_name
                            $scope.group_id == '';
                            $scope.group_name = '';
                        }
                    })
                } else {
                    $scope.groups.push({ group_id: res.data.details.group_id, group_name: group_name, status: 'Y' })
                }

                $scope.closeModal();
            }, function (err) {
                dialogService.showAlert(null, "5X", "Server Error.");
            })
        }
        $scope.deleteGroup = function (group_id, idx) {

            dialogService.showConfirm(null, "5X ", "Are you sure you want to delete").then(function (b) {
                console.log(group_id, idx);
                $http.get(config.apiUrl + "fivex/deleteGroup", {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                    params: { 'group_id': group_id }
                }).then(function (res) {

                    $scope.groups.splice(idx, 1);

                }, function (err) {
                    dialogService.showAlert(null, "5X", "Server Error.");
                })
            }, function (x) {

            })
        }


        $scope.sessionVal = appSerivce.getLocalStore();
        $scope.apiUrl = config.apiUrl;
        //socket.disconnect();
        //socket.connect();
        $scope.user = JSON.parse(localStorageService.get('user'));
        console.log($scope.user);
        $scope.getTest = function () {
            //console.log("$scope.details");
        }
        $scope.getGroups = function () {
            $scope.group_id = '';
            console.log("Here");
            $http.get(config.apiUrl + "fivex/getGroups", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: {}
            }).then(function (res) {
                if (res.data.status) {
                    $scope.groups = res.data.data;
                } else {
                    $scope.groups = [];
                }
            }, function (err) {
                dialogService.showAlert(null, "5X", "Server Error.");
            })
        }
        $scope.getChatHistory = function () {
            if ($stateParams.group_id != undefined && $stateParams.group_id != '') {
                $scope.group_id = $stateParams.group_id;
                console.log($scope.group_id, "group idddd");
                //$scope.property_details = {};
                $http.get(config.apiUrl + "fivex/getChatHistory", {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                    params: { 'group_id': $scope.group_id }
                }).then(function (res) {
                    //console.log(res.data.data[0]);
                    if (res.data.status) {
                        $scope.validationError1 = '';
                        $scope.chats = res.data.data;
                        //$('#messageBox').scrollTop(1000);
                    } else {
                        $scope.details = [];
                        $scope.validationError1 = res.message;
                    }
                }, function (err) {
                    dialogService.showAlert(null, "5X ", "Server Error.");
                })
            }


        }




        socket.on('notification', function (data) {
            var loclgroup = $scope.group_id;
            console.log(data, $stateParams.group_id, $scope.group_id, data.group_id)
            if ($stateParams.group_id == data.group_id) {
                $scope.$apply(function () {
                    $scope.chats.push(data);
                });
            } else {
                dialogService.showAlert(null, "5X", "New Message from " + data.group_name)
            }


            console.log(data, "locall scoket");
            // $scope.notification_count++;
            // localStorageService.set('notification_count', $scope.notification_count);
            // if ($state.current.name == '/booking-calender') {
            //     $scope.getHangerRequests_my_looking();
            //     $scope.getHangerRequests_my_space();
            //     $scope.getbadgeCounts();
            // }
        })
        $scope.testSocket = function () {
            var data = { 'user_id': '19', 'data': 'sdsdsdsd' };

            // socket.emit('notification', data);
        }
        $scope.sendMessage = function () {
            //console.log($scope.message);
            if (!$scope.message) {
                return !1;
            }
            $scope.setArray = { 'message': $scope.message, 'group_id': $scope.group_id, 'member_id': $scope.user.member_id, 'image': $scope.user.image, 'first_name': $scope.user.first_name, 'last_name': $scope.user.last_name };


            socket.emit('sendMessage', $scope.setArray);



            $http.post(config.apiUrl + "users/addMessage", $scope.setArray, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                transformRequest: function (data) {
                    return $.param(data);
                }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.validationError1 = '';
                    //success_msessage(res.data.message);
                    //$scope.getUsers();

                    $scope.chats.push($scope.setArray);
                    $scope.message = "";

                } else {
                    $scope.validationError1 = res.data.message;
                }
            }, function (err) {
                //dialogService.showAlert(null, "5X", "Server Error.");
            })
        }

        $scope.getIframeSrc = function (url) {
            //return 'http://10.10.10.41:7071/'+url;
            return $scope.apiUrl + url;
        }

        $scope.sendImage = function (category) {
            //console.log(category);
            // if (category) {
            //     $scope.sub_category_id = category.sub_category_id;
            //     $scope.category_id = category.category_id.toString();
            //     $scope.sub_category_name = category.sub_category_name;
            //     $scope.setArray = { 'sub_category_id': $scope.sub_category_id, 'category_id': $scope.category_id, 'sub_category_name': $scope.sub_category_name};
            // } else {
            //     $scope.sub_category_name = $scope.category_id =  $scope.sub_category_id = '';
            //     $scope.setArray = { 'sub_category_id': $scope.sub_category_id, 'category_id': $scope.category_id, 'sub_category_name': $scope.sub_category_name};
            // }

            $scope.modelPop = $uibModal.open({
                ariaLabelledBy: 'modal-title-top',
                ariaDescribedBy: 'modal-body-top',
                templateUrl: 'html/sendImage_modal.html',
                scope: $scope,
                backdrop: 'static',
                size: 'md'
            });
        }
        $scope.saveVideoMessage = function (textmessage, file) {
            console.log(textmessage);
            console.log(file);
            $scope.setArray = { 'message': textmessage, 'group_id': $scope.group_id, 'member_id': $scope.user.member_id, 'image': $scope.user.image, 'first_name': $scope.user.first_name, 'last_name': $scope.user.last_name };
            Upload.upload({
                url: config.apiUrl + "fivex/sendVideoMessage", //webAPI exposed to upload the file
                data: { 'file': file, 'message': textmessage, 'group_id': $scope.group_id, 'member_id': $scope.user.member_id, 'image': $scope.user.image, 'first_name': $scope.user.first_name, 'last_name': $scope.user.last_name }, //pass file as data, should be user ng-model
                headers: { 'Content-Type': undefined, 'x-access-token': $scope.sessionVal.token },
            }).then(function (resp) { //upload function returns a promise
                console.log(resp.data);
                $scope.setArray.media_url = resp.data.data.media_url;
                $scope.setArray.type = resp.data.data.type;
                $scope.chats.push($scope.setArray);
                $scope.getChatHistory();
                $scope.modelPop.close();
            }, function (resp) { //catch error
                $window.alert('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        }
        $scope.saveImageMessage = function (textmessage, myCroppedImage) {

            $scope.setArray = { 'message': textmessage, 'group_id': $scope.group_id, 'member_id': $scope.user.member_id, 'image': $scope.user.image, 'first_name': $scope.user.first_name, 'last_name': $scope.user.last_name, 'textimage': myCroppedImage };
            $http.post(config.apiUrl + "fivex/sendMessage", $scope.setArray, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                transformRequest: function (data) {
                    return $.param(data);
                }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.validationError1 = '';
                    //success_msessage(res.data.message);
                    //$scope.getUsers();
                    $scope.setArray.media_url = res.data.data.media_url;
                    $scope.setArray.type = res.data.data.type;
                    $scope.chats.push($scope.setArray);

                    $scope.getChatHistory();
                    $scope.modelPop.close();
                    //$scope.message = "";

                } else {
                    $scope.validationError1 = res.data.message;
                }
            }, function (err) {
                //dialogService.showAlert(null, "5X", "Server Error.");
            })
        }


        $scope.closeModal = function () {
            $scope.modelPop.close();
        }


        $scope.showTab = function (tab) {
            $scope.seltab = tab;
        }
    }]);

