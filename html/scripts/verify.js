function doIt(model, $modal) {
    var poolData = {
        UserPoolId: 'us-east-1_KspsxFPqW',
        ClientId: '4ghl4tcm83n7hnfuaud3acv3np'
    };
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

    var userData = {
        Username: model.email,
        Pool: userPool
    };
    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.confirmRegistration(model.key, true, function(err, result) {

        var msg = 'ありがとうございます。登録しました！';

        if (err) {
            console.dir(err);
            if (err.code == "ExpiredCodeException" || err.code == "CodeMismatchException") {
                msg = '認証コードが無効です。やり直してください。';
            } else {
                msg = '認証できません。';
            }
        }
        console.log('call result: ');
        console.dir(result);

        $modal.open({
            template: '<div class="md">' + msg + '</div>'
        });

    });

}

angular.module('myApp', ['ui.bootstrap'])
    .controller('MyController', ['$modal', function($modal) {
        this.onsubmit = function() {
            AWS.config.region = 'us-east-1'; // Region
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-east-1:ecb15612-4756-4183-87d0-5eefe2fdfcc1'
            });

            // Cognito User Pool Id
            AWSCognito.config.region = 'us-east-1';
            AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-east-1:ecb15612-4756-4183-87d0-5eefe2fdfcc1'
            });

            doIt(this.model, $modal);

        };
    }]);
