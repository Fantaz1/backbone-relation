describe("hasOne", function() {
  var initUserModel = function(options){
    if(options === undefined){options = {}}

    return Backbone.RelationModel.extend({
      paramRoot: 'user',

      initialize: function(){
        this.hasOne(Address, options);
      }
    });
  };

  describe("option - init", function(){
    it("should init model variable", function(){
      User = initUserModel();
      user = new User({address: {id: 1}});

      expect(user.address).toBeInstanceOf(Address);
    });

    it("shouldn't init collection variable if init option is false and json is empty", function(){
      User = initUserModel({init: false});
      user = new User({});

      expect(user.address).toBeUndefined();
    });

    it("should init collection variable if init option false but json isn't empty", function(){
      User = initUserModel({init: false});
      user = new User({address: {id: 1}});

      expect(user.address).toBeInstanceOf(Address);
    });
  });

  describe("option - parent", function(){
    it("inits reverse assotiation for collection with paramRoot name", function(){
      User = initUserModel();
      user = new User({address: {id: 1}});

      expect(user.address.user).toBeInstanceOf(User);
      expect(user.address.user.cid).toEqual(user.cid);
    });

    it("uses parent option as a variable name", function(){
      User = initUserModel({parent: 'owner'});
      user = new User({address: {id: 1}});

      expect(user.address.owner).toBeInstanceOf(User);
      expect(user.address.owner.cid).toEqual(user.cid);
    });
  });

  describe("option - key", function(){
    it("uses key option as a key for getting data from json and a name for collection variable", function(){
      User = initUserModel({key: 'location'});
      user = new User({location: {id: 1}});

      expect(user.location).toBeInstanceOf(Address);
    });

    it("camelizes the key value for collection name", function(){
      User = initUserModel({key: 'user_address'});
      user = new User({user_address: {id: 1}});

      expect(user.userAddress).toBeInstanceOf(Address);
    });
  });

  describe("option - modelName", function(){
    it("names collection variable with modelName", function(){
      User = initUserModel({modelName: 'location'})
      user = new User({address: {id: 1}});

      expect(user.location).toBeInstanceOf(Address);
    });

    it("doesn't camelize modelName", function(){
      User = initUserModel({modelName: 'user_location'})
      user = new User({address: {id: 1}});

      expect(user.user_location).toBeInstanceOf(Address);
    });
  });
});
