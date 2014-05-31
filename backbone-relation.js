var camelize,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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

Backbone.RelationModel = (function(_super) {
  __extends(RelationModel, _super);

  function RelationModel() {
    return RelationModel.__super__.constructor.apply(this, arguments);
  }

  RelationModel.prototype.defaultParamsHasMany = {
    init: true,
    reset: true
  };

  RelationModel.prototype.defaultParamsHasOne = {
    init: true
  };

  RelationModel.prototype.hasMany = function(collection, options) {
    var collectionName, key, model, parse;
    options = _.extend(this.defaultParamsHasMany, options);
    if (collection === null) {
      throw new Error('Collection is empty');
    }
    model = collection.prototype.model;
    if ((model !== null) && (model.prototype.paramRoot !== null)) {
      key = model.prototype.paramRoot;
    } else if (options['key'] !== null) {
      key = options.key;
    } else {
      throw new Error('Key value is empty, please set key params!');
    }
    key = "" + key + "s";
    collectionName = camelize(key);
    parse = (function(_this) {
      return function() {
        var json;
        json = _this.get(key);
        json || (json = []);
        if (_this[collectionName]) {
          if (options.reset === true) {
            _this[collectionName].reset(json);
          } else {
            _this[collectionName].set(json);
          }
        } else {
          _this[collectionName] = new collection(json);
        }
      };
    })(this);
    this.on("change:" + key, parse, this);
    if (options.init === true || this.has(key)) {
      parse();
    }
  };

  RelationModel.prototype.hasOne = function(model, options) {
    var key, modelName, parse;
    options = _.extend(this.defaultParamsHasOne, options);
    if (model === null) {
      throw new Error('Model is empty');
    }
    if (model.prototype.paramRoot !== null) {
      key = model.prototype.paramRoot;
    } else if (options['key'] !== null) {
      key = options.key;
    } else {
      throw new Error('Key value is empty, please set key params!');
    }
    modelName = camelize(key);
    parse = (function(_this) {
      return function() {
        var json;
        json = _this.get(key);
        if (_this[modelName]) {
          _this[modelName].set(json);
        } else {
          _this[modelName] = new model(json);
        }
      };
    })(this);
    this.on("change:" + key, parse, this);
    if (options.init === true || this.has(key)) {
      parse();
    }
  };

  return RelationModel;

})(Backbone.Model);
