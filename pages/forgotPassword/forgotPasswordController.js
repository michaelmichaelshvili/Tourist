angular.module("myApp")
    .controller('forgotPasswordController', function ($scope, $routeParams, $http, $location, sharedProperties) {
        $scope.questions = [
            { qid: 1, name: "who are you?" },
            { qid: 2, name: "what's your nickname?" },
            { qid: 3, name: "What's your dream job?" }
        ];
        $scope.username = $routeParams.username;
        $scope.submit = function () {
            $http({
                method: "POST",
                url: "http://localhost:3000/restore_password",
                data: { username: $scope.username, question: $scope.question, answer: $scope.answer }
            }).then(function success(response) {
                if (response.data == "User does not exists" || response.data == "Wrong answer") {
                    $scope._error = response.data;
                }
                // else if(response.data is error)
                else {
                    // console.log(response.data);
                    $scope._error = "The password is " + response.data[0].password;

                }
            }, function erro(response) {
                $scope._error = response;
            });
        };
        
    });