'use strict';

var defaults = require('lodash/object/defaults');
var omit = require('lodash/object/omit');
var unshift = Array.prototype.unshift;

var constructorKeys = [
  'childContextTypes',
  'contextTypes',
  'defaultProps',
  'displayName',
  'propTypes'
];

module.exports = function (react, shouldUpdate) {
  var pureRenderMixin = {shouldComponentUpdate: shouldUpdate};

  return function (input) {
    var spec = typeof input == 'function' ? {render: input} : input;
    var render = spec.render;
    var Type = function () {};

    var factory = function (config) {
      if (
        config == null ||
        config.constructor != Object ||
        react.isValidElement(config)
      ) {
        unshift.call(arguments, null);
      }

      unshift.call(arguments, Type);

      return react.createElement.apply(null, arguments);
    };

    var prototype = defaults(
      Type.prototype,
      input === spec && omit(spec, constructorKeys),
      pureRenderMixin,
      react.Component.prototype
    );

    prototype.render = function () {
      return render.call(this, this.props, this.context);
    };

    constructorKeys.forEach(function (key) {
      if (input.hasOwnProperty(key)) {
        Type[key] = input[key];
      }
    });

    if (!Type.displayName && render.name) {
      Type.displayName = render.name;
    }

    factory.type = Type;

    return factory;
  };
};
