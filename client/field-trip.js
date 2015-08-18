People = new Mongo.Collection('userList');
Events = new Mongo.Collection('eventList');


if (Meteor.isClient) {

  Meteor.loginAsAdmin = function(password, callback) {
    //create a login request with admin: true, so our loginHandler can handle this request
    var loginRequest = {admin: true, password: password};

    //send the login request
    Accounts.callLoginMethod({
      methodArguments: [loginRequest],
      userCallback: callback
    });
  };

  Template.signupPage.events({
    "submit form": function(event, template){
      var pass1 = event.target.pwd1.value;
      var pass2 = event.target.pwd2.value;

      //Password validation. 6+ alphanumeric mixed case 
      if(pass1 != "" && pass1 == pass2){
        if(pass1.length < 6) {
          alert("Error: Password must contain at least six characters!");
          return false;
        }
        re = /[0-9]/;
        if(!re.test(pass1)) {
          alert(pass1+" Error: password numeric!");
          return false;
        }
        re = /[a-z]/;
        if(!re.test(pass1)) {
          alert(pass1+" Error: password lower alpha!");
          return false;
        }
        re = /[A-Z]/;
        if(!re.test(pass1)) {
          alert(pass1+" Error: password upper alpha");
          return false;
        }
        re = /[\w$-\/:-?{-~!"^_`\[\]]/;
        if(!re.test(pass1)) {
          alert(pass1+" Error: password symbols!");
          return false;
        }
      }else{
        alert("Error: Please check that you've entered and confirmed your password!");
        return false;
      }

      alert("Valid password.");
      return true;
    },
    "click #fb-login-button": function(event) {
        Meteor.loginWithFacebook({}, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }else{
              //TODO figure out what button login is doing.
              console.log('test');
              alert("Welcome "+currentUser.services.facebook.name);
            }
        });
    },
    "click #logout": function(event) {
        Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
            }
        })
    }
  });

  Template.launchPage.events({
    "click .login": function(event, template){
      alert("show login popup");
    },
    "click .signup": function(event, template){
      alert("show signup form");
    }
  });


  Template.createProfilePage.events({
    //"event element": function(DOM Object, this)
    "submit form": function (event, template) {
      var helperValue = this;
      var name = event.target.firstname.value;
      var age = event.target.age.value;
      var location = event.target.location.value;
      var interests = event.target.interests.value.split(",");
      People.insert({
        name: name,
        age: age,
        location: location,
        interests: interests
      });
      //alert(message, helperValue);
    }
  });

  Template.signupPage.events({
    "submit form": function(event, template){
      var pass1 = event.target.pwd1.value;
      var pass2 = event.target.pwd2.value;

      //Password validation. 6+ alphanumeric mixed case 
      if(pass1 != "" && pass1 == pass2){
        if(pass1.length < 6) {
          alert("Error: Password must contain at least six characters!");
          return false;
        }
        re = /[0-9]/;
        if(!re.test(pass1)) {
          alert(pass1+" Error: password numeric!");
          return false;
        }
        re = /[a-z]/;
        if(!re.test(pass1)) {
          alert(pass1+" Error: password lower alpha!");
          return false;
        }
        re = /[A-Z]/;
        if(!re.test(pass1)) {
          alert(pass1+" Error: password upper alpha");
          return false;
        }
        re = /[\w$-\/:-?{-~!"^_`\[\]]/;
        if(!re.test(pass1)) {
          alert(pass1+" Error: password symbols!");
          return false;
        }
      }else{
        alert("Error: Please check that you've entered and confirmed your password!");
        return false;
      }

      alert("Valid password.");
      return true;
    },
    "click #fb-login-button": function(event) {
        Meteor.loginWithFacebook({}, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }else{
              //TODO figure out what button login is doing.
              console.log('test');
              alert("Welcome "+currentUser.services.facebook.name);
            }
        });
    },
    "click #logout": function(event) {
        Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
            }
        })
    }
  });

  Template.launchPage.events({
    "click .login": function(event, template){
      alert("show login popup");
    },
    "click .signup": function(event, template){
      alert("show signup form");
    }
  });


  Template.createProfilePage.events({
    //"event element": function(DOM Object, this)
    "submit form": function (event, template) {
      var helperValue = this;
      var name = event.target.firstname.value;
      var age = event.target.age.value;
      var location = event.target.location.value;
      var interests = event.target.interests.value.split(",");
      People.insert({
        name: name,
        age: age,
        location: location,
        interests: interests
      });
      //alert(message, helperValue);
    }
  });

}




if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
