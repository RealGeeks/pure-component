'use strict';

var test = require('tape');
var constant = require('lodash/utility/constant');
var react = require('react');
var creator = require('../lib/creator');

var keysToOmit = [
  'contextTypes',
  'defaultProps',
  'displayName',
  'propTypes'
];

test('Componet Creator', function (assert) {
  assert.plan(16);

  var FakeComponent = function () {};
  var component;

  FakeComponent.prototype.foo = 'bar';
  FakeComponent.prototype.state = 0;

  component = creator({
    Component: FakeComponent,
    isValidElement: constant(false),
    createElement: function (Type) {
      assert.equal(
        Type.prototype.low,
        'level',
        'merges specs into component'
      );

      assert.equal(
        Type.prototype.foo,
        'bar',
        'merges in React.Component prototype.'
      );

      assert.equal(
        typeof Type.prototype.shouldComponentUpdate,
        'function',
        'merges in pure render mixin.'
      );

      assert.ok(
        keysToOmit.every(function (key) {
          return !Type.prototype.hasOwnProperty(key);
        }),
        'does not add ' + keysToOmit.join() + ' to prototype.'
      );

      assert.equal(Type.contextTypes, 'a', 'adds contextTypes to constructor');
      assert.equal(Type.defaultProps, 'b', 'adds defaultProps to constructor');
      assert.equal(Type.displayName, 'c', 'adds displayName to constructor');
    }
  })({
    low: 'level',
    contextTypes: 'a',
    defaultProps: 'b',
    displayName: 'c',
    render: function (props, state) {
      assert.equal(props, 5, 'passes props to render as argument.');
      assert.equal(state, 0, 'passes state to render as argument.');
    }
  });

  component(5);

  var render = function () {};

  render.displayName = 'Rook';

  creator({
    Component: FakeComponent,
    isValidElement: constant(false),
    createElement: function (Type) {
      assert.equal(
        Type.displayName,
        'Rook',
        'uses displayName from render function if available.'
      );
    }
  })(render)();

  creator({
    Component: FakeComponent,
    isValidElement: constant(false),
    createElement: function (Type) {
      assert.equal(
        Type.displayName,
        'Loo',
        'uses displayName from render function name if available.'
      );
    }
  })(function Loo() {})();

  creator({
    Component: FakeComponent,
    isValidElement: react.isValidElement,
    createElement: function (Type, props) {
      assert.equal(
        props,
        null,
        'creates element with null props if passed undefined.'
      );
    }
  })(function () {})();

  creator({
    Component: FakeComponent,
    isValidElement: react.isValidElement,
    createElement: function (Type, props, child) {
      assert.equal(
        props,
        null,
        'creates element with null props if only passed child.'
      );

      assert.equal(
        child,
        5,
        'creates element with number child.'
      );
    }
  })(function () {})(5);

  creator({
    Component: FakeComponent,
    isValidElement: react.isValidElement,
    createElement: function (Type, props, child) {
      assert.equal(
        child,
        'asd',
        'creates element with string child.'
      );
    }
  })(function () {})('asd');

  creator({
    Component: FakeComponent,
    isValidElement: react.isValidElement,
    createElement: function (Type, props, c1, c2) {
      assert.equal(
        c2,
        'pls',
        'creates element with multiple children.'
      );
    }
  })(function () {})('asd', 'pls');

  creator({
    Component: FakeComponent,
    isValidElement: react.isValidElement,
    createElement: function (Type, props, child) {
      assert.deepEqual(
        props,
        {c: 4},
        'passes props.'
      );

      assert.equal(
        child,
        'asd',
        'passes props and children.'
      );
    }
  })(function () {})({c: 4}, 'asd');
});
