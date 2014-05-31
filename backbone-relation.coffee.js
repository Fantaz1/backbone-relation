camelize = (str)->
  str = str.replace /(?:^|[-_])(\w)/g, (a, c)-> if c then c.toUpperCase() else ''
  str.charAt(0).toLowerCase() + str.substr(1)

class Backbone.RelationModel extends Backbone.Model
  defaultParamsHasMany:
    init: true
    reset: true

  defaultParamsHasOne:
    init: true

  hasMany: (collection, options)->
    options = _.extend @defaultParamsHasMany, options

    throw new Error('Collection is empty') unless collection?

    model = collection::model
    if model? and model::paramRoot?
      key = model::paramRoot
    else if options['key']?
      key = options.key
    else
      throw new Error('Key value is empty, please set key params!')

    key = "#{key}s" # TODO: add pluralize

    collectionName = camelize(key)

    parse = =>
      json = @get(key)
      json ||= []
      if @[collectionName]
        if options.reset is true
          @[collectionName].reset(json)
        else
          @[collectionName].set(json)
      else
        @[collectionName] = new collection(json)

    @on "change:#{key}", parse, this

    parse() if options.init is true or @has(key)

  hasOne: (model, options)->
    options = _.extend @defaultParamsHasOne, options

    throw new Error('Model is empty') unless model?

    if model::paramRoot?
      key = model::paramRoot
    else if options['key']?
      key = options.key
    else
      throw new Error('Key value is empty, please set key params!')

    modelName = camelize(key)

    parse = =>
      json = @get(key)

      if @[modelName]
        @[modelName].set(json)
      else
        @[modelName] = new model(json)

    @on "change:#{key}", parse, this

    parse() if options.init is true or @has(key)
