describe("hasMany", function() {
  var initUserModel = function(options){
    if(options === undefined){options = {}}

    return Backbone.RelationModel.extend({
      paramRoot: 'user',

      initialize: function(){
        this.hasMany(TasksCollection, options);
      }
    });
  };

  describe("option - init", function(){
    it("should init collection variable", function(){
      User = initUserModel();
      user = new User({tasks: [{id: 1}, {id: 2}]});

      expect(user.tasks).not.toBeUndefined();
      expect(user.tasks.length).toEqual(2);
    });

    it("shouldn't init collection variable if init option is false and json is empty", function(){
      User = initUserModel({init: false});
      user = new User({});

      expect(user.tasks).toBeUndefined();
    });

    it("should init collection variable if init option false but json isn't empty", function(){
      User = initUserModel({init: false});
      user = new User({tasks: [{id: 1}, {id: 2}]});

      expect(user.tasks).not.toBeUndefined();
      expect(user.tasks.length).toEqual(2);
    });
  });

  describe("option - reset", function(){
    it("resets collection by default if json has changed", function(){
      User = initUserModel();
      user = new User({tasks: [{id: 1}, {id: 2}]});

      user.set({tasks: [{id: 3}]});
      expect(user.tasks.length).toEqual(1);
    });

    it("uses reset method and trigger reset event", function(){
      User = initUserModel();
      user = new User({tasks: [{id: 1}, {id: 2}]});

      resetCalled = false;
      user.tasks.on('reset', function(){ resetCalled = true; });

      user.set({tasks: [{id: 3}]});
      expect(resetCalled).toEqual(true);
    });

    it("uses set method for updating if reset options is false", function(){
      User = initUserModel({reset: false});
      user = new User({tasks: [{id: 1}, {id: 2}]});

      resetCalled = false;
      user.tasks.on('reset', function(){ resetCalled = true; });

      user.set({tasks: [{id: 3}]});
      expect(resetCalled).toEqual(false);
    });

    it("uses set method for updating if reset options is false", function(){
      User = initUserModel({reset: false});
      task = new Task({id: 1})
      user = new User({tasks: [task]});

      removeCalled = false;
      task.on('remove', function(){ removeCalled = true; });

      addCalled = false;
      user.tasks.on('add', function(){ addCalled = true; });

      user.set({tasks: [{id: 2}]});

      expect(removeCalled).toEqual(true);
      expect(addCalled).toEqual(true);
    });
  });

  describe("option - parent", function(){
    it("inits reverse assotiation for collection with paramRoot name", function(){
      User = initUserModel();
      user = new User({tasks: [{id: 1}, {id: 2}]});

      expect(user.tasks.user).not.toBeUndefined();
      expect(user.tasks.user.cid).toEqual(user.cid);
    });

    it("uses parent option as a variable name", function(){
      User = initUserModel({parent: 'owner'});
      user = new User({tasks: [{id: 1}, {id: 2}]});

      expect(user.tasks.owner).not.toBeUndefined()
      expect(user.tasks.owner.cid).toEqual(user.cid)
    });
  });

  describe("option - key", function(){
    it("uses key option as a key for getting data from json and a name for collection variable", function(){
      User = initUserModel({key: 'tickets'});
      user = new User({tickets: [{id: 1}, {id: 2}]});

      expect(user.tickets).not.toBeUndefined();
      expect(user.tickets.length).toEqual(2);
    });

    it("camelizes the key value for collection name", function(){
      User = initUserModel({key: 'user_tickets'});
      user = new User({user_tickets: [{id: 1}, {id: 2}]});

      expect(user.userTickets).not.toBeUndefined();
      expect(user.userTickets.length).toEqual(2);
    });
  });

  describe("option - collectionName", function(){
    it("names collection variable with collectionName", function(){
      User = initUserModel({collectionName: 'tickets'})
      user = new User({tasks: [{id: 1}, {id: 2}]});

      expect(user.tickets).not.toBeUndefined();
      expect(user.tickets.length).toEqual(2);
    });

    it("doesn't camelize collectionName", function(){
      User = initUserModel({collectionName: 'user_tickets'})
      user = new User({tasks: [{id: 1}, {id: 2}]});

      expect(user.user_tickets).not.toBeUndefined();
      expect(user.user_tickets.length).toEqual(2);
    });
  });

  describe("option - comparator", function(){
    it("sets collection comparator", function(){
      comparator = function(task){ -task.id }

      User = initUserModel({comparator: comparator});
      user = new User({tasks: [{id: 1}, {id: 2}]});
      expect(user.tasks.comparator).toEqual(comparator)
    });
  });
});
