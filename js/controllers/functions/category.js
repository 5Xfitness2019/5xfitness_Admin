app.controller('CategoryCtrl', ['$scope', '$http', 'appSerivce', 'dialogService', '$state', 'config', '$uibModal', '$filter', '$timeout', 'localStorageService', 'Notification',
    function ($scope, $http, appSerivce, dialogService, $state, config, $uibModal, $filter, $timeout, localStorageService, Notification) {
 

        $scope.sessionVal = appSerivce.getLocalStore();
        $scope.categories = [];
        $scope.property_details = {};
        $scope.search = '';
        $scope.search_type = '';
        $scope.search_subtype = '';


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

        $scope.subCategoryModal = function (category) {
            console.log(category);
            if (category) {
                $scope.sub_category_id = category.sub_category_id;
                $scope.category_id = category.category_id.toString();
                $scope.sub_category_name = category.sub_category_name;
                $scope.setArray = { 'sub_category_id': $scope.sub_category_id, 'category_id': $scope.category_id, 'sub_category_name': $scope.sub_category_name };
            } else {
                $scope.sub_category_name = $scope.category_id = $scope.sub_category_id = '';
                $scope.setArray = { 'sub_category_id': $scope.sub_category_id, 'category_id': $scope.category_id, 'sub_category_name': $scope.sub_category_name };
            }

            $scope.modelPop = $uibModal.open({
                ariaLabelledBy: 'modal-title-top',
                ariaDescribedBy: 'modal-body-top',
                templateUrl: 'html/subcategory_modal.html',
                scope: $scope,
                size: 'md'
            });
        }



        $scope.categoryModal = function (category) {
            if (category != '') {
                $scope.category_name = category.category_name;
                $scope.category_id = category.category_id;
                $scope.setArray = { 'category_name': $scope.category_name, 'category_id': $scope.category_id };
            } else {
                $scope.category_name = $scope.category_id = '';
                $scope.setArray = { 'category_name': $scope.category_name, 'category_id': $scope.category_id };
            }

            $scope.modelPop = $uibModal.open({
                ariaLabelledBy: 'modal-title-top',
                ariaDescribedBy: 'modal-body-top',
                templateUrl: 'html/category_modal.html',
                scope: $scope,
                size: 'md'
            });
        }

        $scope.saveCategory = function (category_name) {
            $scope.setArray.category_name = category_name;

            if (category_name == '' || category_name == undefined) {
                $scope.validationError1 = 'Category cannot be empty.';
            } else if (category_name != '') {
                $http.post(config.apiUrl + "fivex/saveCategory", $scope.setArray, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                    transformRequest: function (data) {
                        return $.param(data);
                    }
                }).then(function (res) {
                    if (res.data.status) {
                        $scope.validationError1 = '';
                        success_msessage(res.data.message);
                        $scope.getCategories();
                        $scope.modelPop.close();
                    } else {
                        $scope.validationError1 = res.data.message;
                    }
                }, function (err) {
                    dialogService.showAlert(null, "5X", "Server Error.");
                })
            } else {
                $scope.validationError1 = 'Fields cannot be emplty.';
            }
        }
        $scope.saveSubCategory = function (subcategory, sub_category_name, category_id) {
            if (!category_id) {
                $scope.validationError1 = 'Category cannot be empty.';
                return !1;
            }
            if (!sub_category_name) {
                $scope.validationError1 = 'Sub Category cannot be empty.';
                return !1;
            }
            $scope.setArray.sub_category_name = sub_category_name;
            $scope.setArray.category_id = category_id;
            $scope.setArray.sub_category_id = subcategory.sub_category_id;
            $http.post(config.apiUrl + "fivex/saveSubCategory", $scope.setArray, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                transformRequest: function (data) {
                    return $.param(data);
                }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.validationError1 = '';
                    success_msessage(res.data.message);
                    $scope.getSubCategories();
                    $scope.modelPop.close();
                } else {
                    $scope.validationError1 = res.data.message;
                }
            }, function (err) {
                dialogService.showAlert(null, "Maintain IT ", "Server Error.");
            })
        }

        $scope.changeCategoryStatus = function (category, status) {
            //console.log(category);
            //console.log(category.category_id);
            $scope.setArray = { 'status': status, 'category_id': category.category_id };
            $http.post(config.apiUrl + "fivex/changeCategoryStatus", $scope.setArray, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                transformRequest: function (data) {
                    return $.param(data);
                }
            }).then(function (res) {
                if (res.data.status) {
                    $scope.validationError1 = '';
                    success_msessage(res.data.message);
                    $scope.getCategories();
                    //$scope.modelPop.close();
                } else {
                    $scope.validationError1 = res.data.message;
                }
            }, function (err) {
                dialogService.showAlert(null, "5X", "Server Error.");
            })
        }

        $scope.deleteCategory = function (item) {
            id = $scope.categories.indexOf(item);
            dialogService.showConfirm(null, "5X ", "Are you sure you want to delete").then(function (b) {
                $http.get(config.apiUrl + "fivex/deleteCategory", {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                    params: { 'category_id': $scope.categories[id].category_id }
                }).then(function (res) {
                    if (res.data.status) {
                        success_msessage('Category removed successfully');
                        $scope.categories.splice(id, 1);
                    } else {
                        dialogService.showAlert(null, "5X ", "Failed");
                    }
                }, function (err) {
                    dialogService.showAlert(null, "5X ", "Server Error.");
                })

            }, function (x) {

            });
        }
        $scope.deleteSubCategory = function (item) {
            id = $scope.subcategories.indexOf(item);
            dialogService.showConfirm(null, "5X ", "Are you sure you want to delete").then(function (b) {
                $http.get(config.apiUrl + "fivex/deleteSubCategory", {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'x-access-token': $scope.sessionVal.token },
                    params: { 'sub_category_id': $scope.subcategories[id].sub_category_id }
                }).then(function (res) {
                    if (res.data.status) {
                        success_msessage('Category removed successfully');
                        $scope.subcategories.splice(id, 1);
                    } else {
                        dialogService.showAlert(null, "5X ", "Failed");
                    }
                }, function (err) {
                    dialogService.showAlert(null, "5X ", "Server Error.");
                })

            }, function (x) {

            });
        }


        $scope.closeModal = function () {
            $scope.modelPop.close();
        }
        function success_msessage(message) {
            message = ` <strong>Success!</strong> ` + message;
            Notification.success({ message: message, positionY: 'bottom', positionX: 'left' });
        }









        $scope.goback = function (path) {
            $state.go("app.category");
            //window.history.back();
        }












    }]);
