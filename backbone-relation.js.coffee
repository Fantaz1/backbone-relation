#  ==========================================================
#  @name backbone-relation
#  @version 1.0.0
#  @requires Backbone
#  @author Evgeniy Zabolotniy
#  ==========================================================

camelize = (str)->
  str = str.replace /(?:^|[-_])(\w)/g, (a, c)-> if c then c.toUpperCase() else ''
  str.charAt(0).toLowerCase() + str.substr(1)

class Backbone.RelationModel extends Backbone.Model
  defaultParamsHasMany:
    init: true
    reset: true
    parent: 'parent'
    initCallback: null
    collectionName: null

  defaultParamsHasOne:
    init: true
    parent: 'parent'
    initCallback: null
    modelName: null

  hasMany: (collection, options)->
    options['parent'] = @paramRoot if !options['parent']? and @paramRoot?

    options = _.extend _.clone(@defaultParamsHasMany), options

    throw new Error('Collection is empty') unless collection?

    model = collection::model

    if options['key']?
      key = options['key']
    else if model? and model::paramRoot?
      key = "#{model::paramRoot}s" # TODO: add pluralize
    else
      throw new Error('Key value is empty, please set key params!')

    collectionName = options.collectionName || camelize(key)

    parse = =>
      json = @get(key)
      json ||= []
      if @[collectionName]
        if options.reset is true
          @[collectionName].reset(json)
        else
          @[collectionName].set(json)
      else
        collection = new collection(json)
        collection[options.parent] = @
        @[collectionName] = collection
        options.initCallback?(collection)

    @on "change:#{key}", parse, this

    parse() if options.init is true or @has(key)

  hasOne: (model, options)->
    options['parent'] = @paramRoot if !options['parent']? and @paramRoot?
    options = _.extend _.clone(@defaultParamsHasOne), options

    throw new Error('Model is empty') unless model?

    if options['key']?
      key = options.key
    else if model::paramRoot?
      key = model::paramRoot
    else
      throw new Error('Key value is empty, please set key params!')

    modelName = options.modelName || camelize(key)

    parse = =>
      json = @get(key)

      if @[modelName]
        @[modelName].set(json)
      else
        model = new model(json)
        model[options.parent] = @
        @[modelName] = model
        options.initCallback?(model)

    @on "change:#{key}", parse, this

    parse() if options.init is true or @has(key)
