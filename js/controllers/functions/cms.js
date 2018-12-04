app.controller('CmsCtrl', ['$scope', '$http', 'appSerivce', 'dialogService', '$state', 'config', '$uibModal', '$filter', '$timeout', 'localStorageService', '$rootScope',
    '$stateParams', 'Notification',
    function ($scope, $http, appSerivce, dialogService, $state, config, $modal, $filter, $timeout, localStorageService, $rootScope, $stateParams, Notification) {
        
        
        $scope.sessionVal = appSerivce.getLocalStore();


        $scope.details = {};
        $scope.apiUrl = config.apiUrl;


        
        $scope.getCmsPages = function () {
            $http.get(config.apiUrl + "surgerize/getCmsPages", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.validationError1 = '';
                    $scope.lists = res.data.cmslists;
                } else {
                    $scope.lists = [];
                    $scope.validationError1 = res.data.message;
                }
            }, function (err) {
                dialogService.showAlert(null, "Surgerize ", "Server Error.");
            })
        }

        $scope.getCmsdetails = function(){
            if($stateParams.cms_id != undefined && $stateParams.cms_id != ''){
                $scope.cms_id = $stateParams.cms_id;
                $http.get(config.apiUrl + "surgerize/getCmsdetails", {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                    params: { 'cms_id': $scope.cms_id }
                }).then(function (res) {
                    if (res.data.status) {
                        $scope.validationError1 = '';
                        $scope.details = res.data.data[0];
                    } else {
                        $scope.details = [];
                        $scope.validationError1 = res.message;
                    }
                }, function (err) {
                    dialogService.showAlert(null, "Surgerize ", "Server Error.");
                })
            }
        }

        $scope.saveCms = function(){
            $http.post(config.apiUrl + "surgerize/saveCms", $scope.details, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                transformRequest: function (data) {
                    return $.param(data);
                }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.validationError1 = '';
                    success_msessage(res.data.message);
                    $state.go("app.cms");
                } else {
                    $scope.validationError1 = res.data.message;
                }
            }, function (err) {
                dialogService.showAlert(null, "Surgerize ", "Server Error.");
            })
        }
        $scope.changeStatus = function(list,status){
           
            $scope.setArray = { 'status': status, 'cms_id': list.cms_id };
            $http.post(config.apiUrl + "surgerize/changeCmsStatus", $scope.setArray, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                transformRequest: function (data) {
                    return $.param(data);
                }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.validationError1 = '';
                    success_msessage(res.data.message);
                    $scope.getCmsPages();
                    //$scope.modelPop.close();
                } else {
                    $scope.validationError1 = res.data.message;
                }
            }, function (err) {
                dialogService.showAlert(null, "Surgerize", "Server Error.");
            })
        }




        $scope.deleteCms = function (item) {
            id = $scope.lists.indexOf(item);
            dialogService.showConfirm(null, "Surgerize ", "Are you sure you want to delete").then(function (b) {
                $http.get(config.apiUrl + "surgerize/deleteCms", {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                    params: { 'cms_id': $scope.lists[id].cms_id }
                }).then(function (res) {
                    if (res.data.status) {
                        success_msessage('Cms deleted successfully');
                        $scope.lists.splice(id, 1);
                    } else {
                        dialogService.showAlert(null, "Surgerize ", "Failed");
                    }
                }, function (err) {
                    dialogService.showAlert(null, "Surgerize ", "Server Error.");
                })

            }, function (x) {

            });
        }








        function success_msessage(message) {
            message = ` <strong>Success!</strong> ` + message;
            Notification.success({ message: message, positionY: 'bottom', positionX: 'left' });
        }

       
        
        $scope.goback = function (path) {
            $state.go(path);
        }








        


       
    }]);

