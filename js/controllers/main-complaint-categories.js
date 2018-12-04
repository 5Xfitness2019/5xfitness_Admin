app.controller('complaintCategoriesCtrl', ['$scope', '$http', 'appSerivce', 'dialogService', '$state', 'config', '$uibModal', '$filter', '$timeout', 'localStorageService', 'Notification',
    function ($scope, $http, appSerivce, dialogService, $state, config, $modal, $filter, $timeout, localStorageService, Notification) {


        $scope.sessionVal = appSerivce.getLocalStore();
        $scope.propertyTypes = [];
        $scope.property_details = [];
        
     
        $scope.onReady = function () {
            // ...

        };

        $scope.goback = function (path) {
            $state.go("app.properties");
            //window.history.back();
        }

        function success_msessage(message) {
            message = ` <strong>Success!</strong> ` + message;
            Notification.success({ message: message, positionY: 'bottom', positionX: 'left' });
        }

        $scope.categorylists = [];
        $scope.getCategoriesLists = function(){
            $http.get(config.apiUrl + "maintain/getCategoriesLists", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: { 'search': $scope.search }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.categorylists = res.data.result
                } else {
                    $scope.validationError1 = res.data.message;
                    $scope.categorylists = [];
                }
            }, function (err) {
                dialogService.showAlert(null, "Maintain IT ", "Server Error.");
            })
        }


        $scope.deleteCategory = function (item) {
            id = $scope.categorylists.indexOf(item);

            dialogService.showConfirm(null, "Maintain IT ", "Are you sure you want to delete").then(function (b) {
                //console.log($scope.property_list[id].property_id );
                $http.get(config.apiUrl + "maintain/deleteCategory", {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                    params: { 'category_id': $scope.categorylists[id].category_id }
                }).then(function (res) {
                    //console.log(res);
                    if (res.data.status) {
                        success_msessage('Property removed successfully');
                        $scope.property_list.splice(id, 1);
                    } else {
                        dialogService.showAlert(null, "Maintain IT ", "Failed");
                    }
                }, function (err) {
                    dialogService.showAlert(null, "Maintain IT ", "Server Error.");
                })

            }, function (x) {

            });

        }

        // $scope.getproperty_details = function () {
        //     if ($scope.property_id) {
        //         $http.get(config.apiUrl + "maintain/getProperyDetails", {
        //             headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
        //             params: { 'property_id': $scope.property_id }
        //         }).then(function (res) {
        //             if (res.data.status) {
        //                 $scope.property_details = res.data.result[0];
        //                 $scope.property_details.property_type = res.data.result[0].property_type.toString();
        //                 $scope.property_details.property_subtype = res.data.result[0].property_subtype.toString();
        //                 console.log($scope.propertyTypes);
        //                 angular.forEach($scope.propertyTypes, function(value, key) {
        //                     if(value['property_type_id'] == $scope.property_details.property_type){
        //                         $scope.subPropertyTypes = value['subPropertyTypes'];
        //                     }
        //                 });
        //                 //$scope.propertyTypes = $scope.propertyTypes[res.data.result[0].property_type].subPropertyTypes;
        //             } else {
        //                 $scope.validationError1 = res.data.message;
        //             }
        //         }, function (err) {
        //             dialogService.showAlert(null, "Maintain IT ", "Server Error.");
        //         })
        //     }
        // }

        // $scope.getSubPropertyTypes = function(property_type){
        //     angular.forEach($scope.propertyTypes, function(value, key) {
        //         if(value['property_type_id'] == property_type){
        //             $scope.subPropertyTypes = value['subPropertyTypes'];
        //         }
        //     });
        // }
        // $scope.getpropertyTypes = function () {
        //         $http.post(config.apiUrl + "users/getPropertyTypes", {} , {
        //             headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
        //         }).then(function (res) {
        //             if (res.data.status) {
        //                 $scope.propertyTypes = res.data.propertyTypes;
        //             } else {
        //                 $scope.validationError1 = res.data.message;
        //             }
        //         }, function (err) {
        //             dialogService.showAlert(null, "Maintain IT ", "Server Error.");
        //         })
        // }


        // $scope.deleteCategory = function (item) {
        //     id = $scope.property_list.indexOf(item);

        //     dialogService.showConfirm(null, "Maintain IT ", "Are you sure you want to delete").then(function (b) {
        //         //console.log($scope.property_list[id].property_id );
        //         $http.get(config.apiUrl + "maintain/deleteProperty", {
        //             headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
        //             params: { 'property_id': $scope.property_list[id].property_id }
        //         }).then(function (res) {
        //             console.log(res);
        //             if (res.data.status) {
        //                 success_msessage('Property removed successfully');
        //                 $scope.property_list.splice(id, 1);
        //             } else {
        //                 dialogService.showAlert(null, "Maintain IT ", "Failed");
        //             }
        //         }, function (err) {
        //             dialogService.showAlert(null, "Maintain IT ", "Server Error.");
        //         })

        //     }, function (x) {

        //     });

        // }//// deleteUser end


        // $scope.saveProperty = function (){
        //     console.log($scope.property_details);
        //         $http.post(config.apiUrl + "users/savePropertyDetails", $scope.property_details, {
        //             headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
        //             transformRequest: function(data){
        //                 return $.param(data);
        //             }
        //         }).then(function (res) {
        //             if (res.data.status) {
        //                 //$scope.successMsg1 = res.data.message;
        //                 success_msessage(res.data.message);
        //             } else {
        //                 $scope.validationError1 = res.data.message;
        //             }
        //         }, function (err) {
        //             dialogService.showAlert(null, "Maintain IT ", "Server Error.");
        //         })
        // }









    }]);
