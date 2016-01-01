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
  return function (spec) {
    if (typeof spec == 'function') {
      spec = {render: spec};
    }

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
      react.Component.prototype
    );

    prototype.shouldComponentUpdate = shouldUpdate;

    prototype.render = function () {
      return spec.render.call(this, this.props, this.state);
    };

    Type.contextTypes = spec.contextTypes;
    Type.defaultProps = spec.defaultProps;
    Type.displayName =
      spec.displayName || spec.render.displayName || spec.render.name;
    Type.propTypes = spec.propTypes;

    factory.type = Type;

    return factory;
  };
};
