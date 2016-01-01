'use strict';

var defaults = require('lodash/object/defaults');
var omit = require('lodash/object/omit');
var unshift = Array.prototype.unshift;

var keysToOmit = [
  'contextTypes',
  'defaultProps',
  'displayName',
  'propTypes',
  'render'
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
      omit(spec, keysToOmit),
      pureRenderMixin,
      react.Component.prototype
    );

    prototype.render = function () {
      return render.call(this, this.props, this.context);
    };

    Type.contextTypes = input.contextTypes;
    Type.defaultProps = input.defaultProps;
    Type.displayName = input.displayName || render.name;
    Type.propTypes = input.propTypes;

    factory.type = Type;

    return factory;
  };
};
