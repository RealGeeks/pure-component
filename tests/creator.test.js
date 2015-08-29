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
  assert.plan(17);

  var FakeComponent = function () {};
  var component;

  FakeComponent.prototype.foo = 'bar';
  FakeComponent.prototype.state = 0;

  component = creator({
    Component: FakeComponent,
    isValidElement: constant(false),
    createElement: function (Type) {
      assert.equal(
        Type,
        component.type,
        'calls createElement with correct type'
      );
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

  assert.equal(
    component.type.prototype.low,
    'level',
    'merges specs into component'
  );

  assert.equal(
    component.type.prototype.foo,
    'bar',
    'merges in React.Component prototype.'
  );

  assert.equal(
    typeof component.type.prototype.shouldComponentUpdate,
    'function',
    'merges in pure render mixin.'
  );

  assert.ok(
    keysToOmit.every(function (key) {
      return !component.type.prototype.hasOwnProperty(key);
    }),
    'does not add ' + keysToOmit.join() + ' to prototype.'
  );

  assert.equal(
    component.type.contextTypes, 'a', 'adds contextTypes to constructor'
  );
  assert.equal(
    component.type.defaultProps, 'b', 'adds defaultProps to constructor'
  );
  assert.equal(
    component.type.displayName, 'c', 'adds displayName to constructor'
  );

  var render = function () {};

  render.displayName = 'Rook';

  component = creator({
    Component: FakeComponent,
    isValidElement: constant(false)
  })(render);

  assert.equal(
    component.type.displayName,
    'Rook',
    'uses displayName from render function if available.'
  );

  component = creator({
    Component: FakeComponent,
    isValidElement: constant(false)
  })(function Loo() {});

  assert.equal(
    component.type.displayName,
    'Loo',
    'uses displayName from render function name if available.'
  );

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
