function doIt(model, $modal, progressbar) {
    var authenticationData = {
        Username: model.email,
        Password: model.pass
    };
    var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

    var poolData = {
        UserPoolId: 'us-east-1_KspsxFPqW',
        ClientId: '4ghl4tcm83n7hnfuaud3acv3np'
    };
    var userData = {
        Username: model.email,
        Pool: new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData)
    };
    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function(result) {
            location.href = "/mypage.html";
            progressbar.complete();
        },
        onFailure: function(err) {
            console.dir(err);
            progressbar.reset();
            $modal.open({
                template: '<div class="md">ログインできません。</div>'
            });
        }
    });

}

angular.module('myApp', ['ui.bootstrap', 'ngProgress'])
    .controller('MyController', ['$modal', 'ngProgressFactory', function($modal, ngProgressFactory) {
        this.progressbar = ngProgressFactory.createInstance();

        this.onsubmit = function() {
            this.progressbar.start();
            AWS.config.region = 'us-east-1'; // Region
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-east-1:ecb15612-4756-4183-87d0-5eefe2fdfcc1'
            });

            // Cognito User Pool Id
            AWSCognito.config.region = 'us-east-1';
            AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-east-1:ecb15612-4756-4183-87d0-5eefe2fdfcc1'
            });

            doIt(this.model, $modal, this.progressbar);

        };
    }]);
