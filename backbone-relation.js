 // ==========================================================
 // @name backbone-relation
 // @version 1.0.0
 // @requires Backbone
 // @author Evgeniy Zabolotniy
 // ==========================================================

var camelize;

camelize = function(str) {
  str = str.replace(/(?:^|[-_])(\w)/g, function(a, c) {
    if (c) {
      return c.toUpperCase();
    } else {
      return '';
    }
  });
  return str.charAt(0).toLowerCase() + str.substr(1);
};

Backbone.RelationModel = Backbone.Model.extend({
  defaultParamsHasMany: {
    init: true,
    reset: true,
    parent: 'parent',
    collectionName: null,
    comparator: null
  },
  defaultParamsHasOne: {
    init: true,
    parent: 'parent',
    modelName: null
  },
  hasMany: function(collection, options) {
    var collectionName, key, model, parse;

    if (options == null) options = {}

    if ((options['parent'] == null) && (this.paramRoot != null)) {
      options['parent'] = this.paramRoot;
    }

    options = _.extend(_.clone(this.defaultParamsHasMany), options);

    if (collection == null) {
      throw new Error('Collection is empty');
    }
    model = collection.prototype.model;
    if (options['key'] != null) {
      key = options.key;
    } else if ((model != null) && (model.prototype.paramRoot != null)) {
      key = "" + model.prototype.paramRoot + "s";
    } else {
      throw new Error('Key value is empty, please set key params!');
    }
    collectionName = options.collectionName || camelize(key);
    parse = (function(_this) {
      return function() {
        var json;
        json = _this.get(key);
        json || (json = []);
        if (_this[collectionName]) {
          if (options.reset === true) {
            return _this[collectionName].reset(json);
          } else {
            return _this[collectionName].set(json);
          }
        } else {
          collection = new collection(json);
          collection[options.parent] = _this;
          if (options['comparator'] != null) {
            collection.comparator = options.comparator;
          }
          return _this[collectionName] = collection;
        }
      };
    })(this);
    this.on("change:" + key, parse, this);
    if (options.init === true || this.has(key)) {
      return parse();
    }
  },
  hasOne: function(model, options) {
    var key, modelName, parse;

    if (options==null) options = {}

    if ((options['parent'] == null) && (this.paramRoot != null)) {
      options['parent'] = this.paramRoot;
    }
    options = _.extend(_.clone(this.defaultParamsHasOne), options);
    if (model == null) {
      throw new Error('Model is empty');
    }
    if (options['key'] != null) {
      key = options.key;
    } else if (model.prototype.paramRoot != null) {
      key = model.prototype.paramRoot;
    } else {
      throw new Error('Key value is empty, please set key params!');
    }
    modelName = options.modelName || camelize(key);
    parse = (function(_this) {
      return function() {
        var json;
        json = _this.get(key);
        if (_this[modelName]) {
          return _this[modelName].set(json);
        } else {
          model = new model(json);
          model[options.parent] = _this;
          _this[modelName] = model;
          return typeof options.initCallback === "function" ? options.initCallback(model) : void 0;
        }
      };
    })(this);
    this.on("change:" + key, parse, this);
    if (options.init === true || this.has(key)) {
      return parse();
    }
  }
});

