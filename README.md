backbone-relation
=================

Simple has many and has one associations in backbone models

Usage
--------

### Has Many assotiation:

```
class User extends Backbone.RelationModel
  initialize: ->
    hasMany TasksCollection, reset: false
    hasMany OffersCollection
```
###### options:
  + **reset** (default: true) - if true collection will be reseted after json changed with Backbone method 'reset', in another case, it will use 'set' method
  + **init** (default: true) - initialize collection even if json is empty
  + **key** (default: paramsRoot from collection.model) - it will use this key for getting data and naming child collection variable
  + **collectionName** (default: 'key' value if it presents, in another case - model::paramRoot) - name of collection variable
  + **comparator** (default: null) - comparator for collection

### Has One assotiation:

```
class Company extends Backbone.RelationModel
  initialize: ->
    hasOne Location, init: false
    hasOne User, key: 'owner'
```

###### options:
  + **init** (default: true) - initialize model even if json is empty
  + **key** (default: paramsRoot from the model) - it will use this key for getting data and naming child model variable
  + **modelName** (default: 'key' value if it presents, in another case - model::paramRoot) - name of model variable

### Example:
###### hasMany
  ```
  class Task extends Backbone.Model
    paramRoot: 'task'

  class TasksCollection extends Backbone.Collection
    model: Task

  class TradeRequest extends Backbone.Model
    paramRoot: 'trade_request'

  class TradeRequestsCollection extends Backbone.Collection
    model: TradeRequest

  class User extends Backbone.RelationModel
    initialize: ->
      hasMany TasksCollection, reset: false
      hasMany TradeRequestsCollection, init: false

  user = new User({tasks: [{id: 1, id: 2}], trade_requests: [{id: 1, id: 2}]})

  user.tasks          # TasksCollection
  user.tradeRequests  # TradeRequestsCollection

  user.tasks.length         # => 2
  user.tradeRequests.length # => 2

  user.set('tasks', [{id: 3}])          # reset
  user.set('trade_requests', [{id: 3}]) # set

  user.tasks.length         # => 1
  user.tradeRequests.length # => 3

  user = new User()
  user.tasks          # => TasksCollection
  user.tradeRequests  # => undefined
  ```

###### hasOne
  ```
  class Location extends Backbone.Model
    paramRoot: 'location'

  class Company extends Backbone.RelationModel
    initialize: ->
      hasOne Location, init: false
      hasOne User, key: 'owner'

  company = new Company({location: {id: 3}], owner: {id: 5}]})
  company.location # => Location
  company.owner    # => User

  company = new Company()
  company.location # => undefined
  company.owner    # => User

  ```