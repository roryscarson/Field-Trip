People = new Mongo.Collection('userList');
Events = new Mongo.Collection('eventList');


if (Meteor.isClient) {
  Template.showUsers.helpers({
      'getUsers': function(){
          return People.find().fetch();
      }
  });
  Template.matchesPage.helpers({
    'getUsers': function(){
      return People.find().fetch();
    },
    'getMatches': function(){
      var currentUser = Session.get('currentUser');
      var currentUserInterests = Session.get('currentUserInterests');
      var userList = People.find().fetch();

      var results = []
      var matchedInterests = []
      //replace this with map function
      userList.forEach(function(user){
        var comparingUserInterests = user.interests;
        for (var i = comparingUserInterests.length - 1; i >= 0; i--) {
          comparingUserInterests[i] = comparingUserInterests[i].trim();
        };
        matchedInterests = _.intersection(currentUserInterests, comparingUserInterests)
        results.push({cUser:currentUser,matchName:user.name,numMatches:matchedInterests.length});
        return results;
      });

      //sort results by # of matched interests high -> low
      results.sort(function(a,b){
        return b.numMatches - a.numMatches;
      });

      var sortedMatches = []
      results.forEach(function(user){
        console.log("User: "+user.matchName);
        var search = People.find(user.matchName);
        console.log("Pushing: "+search);
        console.log("Obj: "+search.name);
        sortedMatches.push(search)
      })
      
    return sortedMatches;      
    }
  });
  
  Template.matchesPage.events({
    "change #user-select": function (event, template) {
        var currentUser = $(event.currentTarget).val();
        var currentUserInterests = People.findOne({name: currentUser}, {fields: {'interests': 1}}).interests;
        for (var i = currentUserInterests.length - 1; i >= 0; i--) {
          currentUserInterests[i] = currentUserInterests[i].trim();
        };
        Session.set('currentUser', currentUser);
        Session.set('currentUserInterests', currentUserInterests);
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
      var interests = event.target.interests.value.split(",").trim();
      People.insert({
        name: name,
        age: age,
        location: location,
        interests: interests
      });
    }
  });

  Meteor.methods({
    'getMatches': function(currentUser, currentUserInterests){
      var testInterests = ["Cooking","Driving","Diving","Climbing"];
      currentUserInterests.forEach(function(interest){
        var matchedInterests = currentUserInterests.filter(function(val) {
          return testInterests.indexOf(val) != -1;
        })
      })
    }

  })
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
    },
    
  });
}
