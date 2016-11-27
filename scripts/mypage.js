function gotoExpired(progressbar) {
    // location.href = "/expired.html";
    progressbar.reset();
}

function getUserInfo(session, $scope, $modal, $http, progressbar) {
    var client = new AWSCognito.CognitoIdentityServiceProvider({
        apiVersion: '2016-04-19'
    });
    client.getUser({
        AccessToken: session.getAccessToken().getJwtToken()
    }, function(err, result) {
        if (err) {
            console.dir(err);
            gotoExpired(progressbar);
            return;
        }
        var model = { show: true };
        var ary = result.UserAttributes;
        var len = ary.length;
        for (i = 0; i < len; i++) {
            if (ary[i].Name == "email") {
                model.email = ary[i].Value;
            }
            if (ary[i].Name == "nickname") {
                model.nickname = decodeURIComponent(escape(atob(ary[i].Value)));
            }
        }

        if (!model.email) {
            gotoExpired(progressbar);
            return;
        }

        $scope.model = setModel(model, null);
        progressbar.complete();

    });
}

function setModel(model, data) {
    model.my_date = new Date();
    model.datePickerOpen = false;
    model.toggleDatePicker = function($event) {
        $event.stopPropagation();
        model.datePickerOpen = !model.datePickerOpen;
    };

    model.now_string = (new Date()).toLocaleDateString();

    model.category = {
        value: "1",
        name: "カテゴリ1"
    };
    model.categoryList = [{
        value: "1",
        name: "カテゴリ1"
    }, {
        value: "2",
        name: "カテゴリ2"
    }];

    model.memo = ''; //data.Memo;

    return model;
}

function getInfo($scope, $modal, $http, progressbar) {
    var cognitoUser = getCurrentUser();
    if (cognitoUser == null) {
        gotoExpired(progressbar);
        return;
    }
    cognitoUser.getSession(function(err, session) {
        if (err) {
            console.dir(err);
            gotoExpired(progressbar);
            return;
        }
        console.dir(session);
        getUserInfo(session, $scope, $modal, $http, progressbar);
    });
}

function getCurrentUser() {
    AWS.config.region = 'us-east-1'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:ecb15612-4756-4183-87d0-5eefe2fdfcc1'
    });

    // Cognito User Pool Id
    AWSCognito.config.region = 'us-east-1';
    AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:ecb15612-4756-4183-87d0-5eefe2fdfcc1'
    });

    var poolData = {
        UserPoolId: 'us-east-1_KspsxFPqW',
        ClientId: '4ghl4tcm83n7hnfuaud3acv3np'
    };
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    return userPool.getCurrentUser();
}

(function() {
    var myApp = angular.module('myApp', ['ui.bootstrap', 'ngProgress'])
        .config(["datepickerConfig", "datepickerPopupConfig", "timepickerConfig",
            function(datepickerConfig, datepickerPopupConfig, timepickerConfig) {
                datepickerConfig.showWeeks = false; // 週番号（日本では馴染みが薄い）を非表示にする
                datepickerConfig.dayTitleFormat = "yyyy年 MMMM";
                datepickerPopupConfig.currentText = "本日";
                datepickerPopupConfig.clearText = "消去";
                datepickerPopupConfig.toggleWeeksText = "週番号";
                datepickerPopupConfig.closeText = "閉じる";
                timepickerConfig.showMeridian = false; // 時刻を24時間表示にする（デフォルトでは12時間表示）
            }
        ]);

    myApp.controller('MyController', ['$scope', '$modal', '$http', 'ngProgressFactory', function($scope, $modal, $http, ngProgressFactory) {

        this.progressbar = ngProgressFactory.createInstance();
        this.progressbar.start();

        this.logout = function() {
            this.progressbar.start();
            var cognitoUser = getCurrentUser();
            if (cognitoUser != null) {
                cognitoUser.signOut();
            }
            location.href = "/signin.html";
            this.progressbar.complete();
        };

        getInfo($scope, $modal, $http, this.progressbar);

    }]);

})();
