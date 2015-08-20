People = new Mongo.Collection('userList');
Events = new Mongo.Collection('eventList');


if (Meteor.isClient) {
  Template.showUsers.helpers({
      'listUsers': function(){
          return People.find().fetch();
      }
  });
  Template.matchesPage.helpers({
    'listUsers': function(){
          return People.find().fetch();
      }
  });
  Template.categories.events({
    "change #category-select": function (event, template) {
        var category = $(event.currentTarget).val();
        console.log("category : " + category);
        // additional code to do what you want with the category
    }  
  });



  Meteor.loginAsAdmin = function(password, callback) {
    //create a login request with admin: true, so our loginHandler can handle this request
    var loginRequest = {admin: true, password: password};

    //send the login request
    Accounts.callLoginMethod({
      methodArguments: [loginRequest],
      userCallback: callback
    });
  };

  Template.launchPage.events({
    "click .login": function(event, template){
      alert("show login popup");
    },
    "click .signup": function(event, template){
      alert("show signup form");
    }
  });

  Template.signupPage.events({
    "submit form": function(event, template){
      var pass1 = event.target.pwd1.value;
      var pass2 = event.target.pwd2.value;

      //TODO Move this to server side. Meteor has built in security to 
      // transport passwords not in cleartext(Uses bcrypt)
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
    }
  });

  Template.createProfilePage.events({
    //"event element": function(DOM Object, this)
    "submit form": function (event, template) {
      //insertUserData(event, template);
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
    }
  });
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });


//TODO figure out server/client interaction. Maybe this needs to be
// moved to the server folder. 
  Meteor.methods({
    'insertUserData': function(event, template){
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
    }
  })
}
