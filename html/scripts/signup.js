function doIt(model, $modal, progressbar) {
    var poolData = {
        UserPoolId: 'us-east-1_KspsxFPqW',
        ClientId: '4ghl4tcm83n7hnfuaud3acv3np'
    };
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

    var attributeList = [];

    var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
        Name: 'email',
        Value: model.email
    });
    attributeList.push(attributeEmail);

    if (model.nickname) {
        var attributeName = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
            Name: 'nickname',
            Value: btoa(unescape(encodeURIComponent(model.nickname)))
        });
        attributeList.push(attributeName);
    }

    userPool.signUp(model.email, model.pass, attributeList, null, function(err, result) {

        var msg = 'メールを送信しましたので、ご確認ください。';

        if (err) {
            console.dir(err);
            if (err.code == "UsernameExistsException") {
                msg = 'そのメールアドレスは既に登録されています。';
            } else {
                msg = '申し訳ありません。エラーが発生したため送信できませんでした。';
            }
            progressbar.reset();
        } else {
            cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
            progressbar.complete();
        }
        console.log('call result: ');
        console.dir(result);

        $modal.open({
            template: '<div class="md">' + msg + '</div>'
        });

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
