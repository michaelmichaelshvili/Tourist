

var jsonContries;
var xml2json = new XMLtoJSON();
xml2json.fromFile("countries.xml", function (json) {
    jsonContries = json;
});
var questions = [
    { qid: 1, name: "who are you?" },
    { qid: 2, name: "what's your nickname?" },
    { qid: 3, name: "What's your dream job?" }
];
var questionNum = 1;

angular.module("myApp")
    .controller("registerController", function ($scope, $http, $timeout, $location, $compile) {
        $scope.answers = undefined;
        $scope.q_answers = [];

        // $scope._categories = undefined;

        $scope.doSomething = function () {
            $timeout(function () {
                var myDrop = new drop({ selector: '.MultiSelect' });
            }, 0);
        }

        $scope.submit = function () {
            document.getElementById("categories");
            sopt = [];
            for (i of document.getElementById("register_categories").options)
                if (i && i.selected == true)
                    sopt.push(i.value);
            if(sopt.length < 2){
                alert("You must choose at least 2 categories");
                return;
            }
            // console.log(sopt);
            var question = document.getElementsByTagName("select")
            var answers = document.getElementsByName("answer");
            var qas = []
            for(var i=0; i<answers.length;i++)
            {
                qas[i]=[]
                qas[i][0] = questions.filter(obj => {
                    return obj.name === question[i+2].value
                  })[0].qid
                qas[i][1] = answers[i].value
            }
            for(var i=0 ; i<qas.length;i++)
            {
                for(var j=i+1;j<qas.length;j++)
                {
                    if(qas[i][0]==qas[j][0])
                    {
                        alert("Please choose different questions");
                        return;
                    }
                }
            }
            if(qas.length<2)
            {
                alert("You must answer at least 2 questions");
                return;
            }
            // $location.path("/");
            //TODO: add post request with bdikot
            var register_json = {username: $scope.username,
                                password:$scope.password,
                                firstname:$scope.firstname,
                                lastname:$scope.lastname,
                                city:$scope.city,
                                country:$scope._selectedCountry,
                                email:$scope.email,
                                categories: sopt,
                                QAs:qas
                            };
            // console.log(register_json);

            $http({
                method: "POST",
                url: 'http://localhost:3000/Register',
                data: register_json
            }).then(function success(response){
                console.log(response.data);
            }, function erro(response){
                console.log("error");
            }); 
            $location.path("/");
        }

        $scope.possibleQuestion = questions;

        $scope.addField = function ($event) {
            var Element = document.getElementById(`question${questionNum++}`);
            // var newElement = angular.element(`<div id="question${questionNum}"></div>`);
            var newElement = angular.element(`<div id="question${questionNum}" class="questions"><select ng-required="required">
                <option disabled selected value> -- select a question -- </option>
                <option name="quesOption" value="{{ques.name}}" ng-repeat="ques in possibleQuestion">{{ques.name}}</option>
                <input name="answer" type="text" placeholder="your answer">
                </select></div>`);
            $compile(newElement.contents())($scope);
            Element.parentNode.insertBefore(newElement[0], Element.nextSibling);
            // Element.append(newElement);
            $event.preventDefault();
        }
        // $http({
        //     method: "GET",
        //     url: "http://localhost:3000/getAllCategories"
        // }).then(function success(response) {
        //     $scope._categories = response.data;
        // }, function erro(response) {
        //     console.log("error");
        // });

        // Ob($scope._categories, function (valu) {
        //     console.log(1);
        // var myDrop = new drop({
        //     selector: '.MultiSelect'
        // });
        // myDrop.toggle();
        // });

        // this.jsonContries = jsonContries;
        // this.selectedCountryId = 0;
        $scope._jsonContries = jsonContries;
        $scope._selectedCountry = undefined;

        // $scope.submit = function(){
        //     // $scope.answer = "Submitted! you entered: " + $scope.uname
        // };
    });

