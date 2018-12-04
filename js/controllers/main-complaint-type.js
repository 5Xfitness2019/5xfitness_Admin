app.controller('complaintTypeCtrl', ['$scope', '$http', 'appSerivce', 'dialogService', '$state', 'config', '$uibModal', '$filter', '$timeout', 'localStorageService', 'Notification',
    function ($scope, $http, appSerivce, dialogService, $state, config, $uibModal, $filter, $timeout, localStorageService, Notification) {

        $scope.search = "";
        $scope.sessionVal = appSerivce.getLocalStore();
        $scope.goback = function (path) {
            $state.go("app.properties");
        }

        function success_msessage(message) {
            message = ` <strong>Success!</strong> ` + message;
            Notification.success({ message: message, positionY: 'bottom', positionX: 'left' });
        }

        $scope.complanintTypes = [];
        $scope.getComplaintTypes = function(){
            $http.get(config.apiUrl + "maintain/getComplaintTypes", {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                params: { 'search': $scope.search }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.validationError1 = '';
                    $scope.complanintTypes = res.data.result
                } else {
                    $scope.validationError1 = res.data.message;
                    $scope.complanintTypes = [];
                }
            }, function (err) {
                dialogService.showAlert(null, "Maintain IT ", "Server Error.");
            })
        }
        $scope.deleteCmpType = function (item) {
            id = $scope.complanintTypes.indexOf(item);

            dialogService.showConfirm(null, "Maintain IT ", "Are you sure you want to delete").then(function (b) {
                $http.get(config.apiUrl + "maintain/deleteComplanintType", {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                    params: { 'type_id': $scope.complanintTypes[id].type_id }
                }).then(function (res) {
                    //console.log(res);
                    if (res.data.status) {
                        success_msessage('Complaint type removed successfully');
                        $scope.complanintTypes.splice(id, 1);
                    } else {
                        dialogService.showAlert(null, "Maintain IT ", "Failed");
                    }
                }, function (err) {
                    dialogService.showAlert(null, "Maintain IT ", "Server Error.");
                })
            }, function (x) {
            });
        }


      $scope.complaintTypeModal = function(property){
        //console.log(property); 
        if(property != ''){
            $scope.complaint_type = property.complaint_type;
            $scope.type_id = property.type_id;
            $scope.status = property.status;
            $scope.setArray = {'complaint_type':$scope.complaint_type ,'type_id':$scope.type_id  , 'status': $scope.status};
        }else{
            $scope.complaint_type=$scope.type_id=$scope.status ='';
            $scope.setArray = {'complaint_type':$scope.complaint_type ,'type_id':$scope.type_id  , 'status': $scope.status};
        }


        $scope.modelPop = $uibModal.open({
          ariaLabelledBy: 'modal-title-top',
          ariaDescribedBy: 'modal-body-top',
          templateUrl: 'html/complaint_type_modal.html',
          scope: $scope,
          size: 'md'          
        });

      }
      $scope.closeModal= function(){
          $scope.modelPop.close();
      }

      $scope.saveComplaintType = function(types,complaint_type){
        $scope.setArray.complaint_type = complaint_type;
        $http.post(config.apiUrl + "maintain/saveComplaintType",types, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
            transformRequest: function(data){
                return $.param(data);
            }
        }).then(function (res) {
            if (res.data.status) {
                $scope.validationError1 = '';
                success_msessage(res.data.message);
                $scope.getComplaintTypes();
                $scope.modelPop.close();
            } else {
                $scope.validationError1 = res.data.message;
            }
        }, function (err) {
            dialogService.showAlert(null, "Maintain IT ", "Server Error.");
        })
      }

      



    }]);
