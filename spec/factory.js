Task = Backbone.Model.extend({
  paramRoot: 'task'
});

TasksCollection = Backbone.Collection.extend({
  model: Task
});

Address = Backbone.Model.extend({
  paramRoot: 'address'
});