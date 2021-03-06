People = new Mongo.Collection('userList');
Events = new Mongo.Collection('eventList');

Accounts.registerLoginHandler(function(loginRequest) {
  //there are multiple login handlers in meteor. 
  //a login request go through all these handlers to find it's login hander
  //so in our login handler, we only consider login requests which has admin field
  if(!loginRequest.admin) {
    return undefined;
  }

  //our authentication logic :)
  if(loginRequest.password != 'admin-password') {
    return null;
  }
  
  //we create a admin user if not exists, and get the userId
  var userId = null;
  var user = Meteor.users.findOne({username: 'admin'});
  if(!user) {
    userId = Meteor.users.insert({username: 'admin'});
  } else {
    userId = user._id;
  }

  //creating the token and adding to the user
  var stampedToken = Accounts._generateStampedLoginToken();
  var hashStampedToken = Accounts._hashStampedToken(stampedToken);
  
  Meteor.users.update(userId, 
    {$push: {'services.resume.loginTokens': hashStampedToken}}
  );

  //sending token along with the userId
  return {
    id: userId,
    token: stampedToken.token
  }
});

 /* Template.createProfilePage.events({
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
  });*/