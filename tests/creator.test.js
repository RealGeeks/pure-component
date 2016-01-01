'use strict';

var test = require('tape');
var noop = require('lodash/utility/noop');
var react = require('react');
var creator = require('../lib/creator');

var shouldComponentUpdate = function () {};
var componentFactory = creator(react, shouldComponentUpdate);

var factoryWithCreateElement = function (createElement) {
  return creator({
    Component: react.Component,
    isValidElement: react.isValidElement,
    createElement: createElement || noop
  }, shouldComponentUpdate);
};

test('Component Creator', function (t) {
  t.test('created component calls React.createElement', function (assert) {
    assert.plan(8);

    var component = factoryWithCreateElement(function (Type) {
      assert.equal(
        Type,
        component.type,
        'with correct type'
      );
    })(noop);

    component();

    factoryWithCreateElement(function (Type, props) {
      assert.equal(
        props,
        null,
        'creates element with null props if passed undefined.'
      );
    })(noop)();

    factoryWithCreateElement(function (Type, props, child) {
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
    })(noop)(5);

    factoryWithCreateElement(function (Type, props, child) {
      assert.equal(
        child,
        'asd',
        'creates element with string child.'
      );
    })(noop)('asd');

    factoryWithCreateElement(function (Type, props, c1, c2) {
      assert.equal(
        c2,
        'pls',
        'creates element with multiple children.'
      );
    })(noop)('asd', 'pls');

    factoryWithCreateElement(function (Type, props, child) {
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
    })(noop)({c: 4}, 'asd');
  });

  t.test('render method receives props and state', function (assert) {
    assert.plan(2);

    var component = componentFactory(function (props, state) {
      assert.equal(props, 5, 'passes props to render as argument.');
      assert.equal(state, 0, 'passes state to render as argument.');
    });

    component.type.prototype.render.call({
      props: 5,
      state: 0
    });
  });

  t.test('created component has correct structure', function (assert) {
    assert.plan(10);

    var component = componentFactory({
      low: 'level',
      contextTypes: 'a',
      defaultProps: 'b',
      displayName: 'c',
      render: noop
    });

    assert.equal(
      component.type.prototype.low,
      'level',
      'merges specs into component'
    );

    assert.equal(
      typeof component.type.prototype.setState,
      'function',
      'merges in React.Component prototype.'
    );

    assert.equal(
      component.type.prototype.shouldComponentUpdate,
      shouldComponentUpdate,
      'adds passed in shouldComponentUpdate to prototype.'
    );

    assert.ok(
      !component.type.prototype.hasOwnProperty('contextTypes'),
      'does not add contextTypes to prototype'
    );

    assert.ok(
      !component.type.prototype.hasOwnProperty('defaultProps'),
      'does not add defaultProps to prototype'
    );

    assert.ok(
      !component.type.prototype.hasOwnProperty('displayName'),
      'does not add displayName to prototype'
    );

    assert.ok(
      !component.type.prototype.hasOwnProperty('propTypes'),
      'does not add propTypes to prototype'
    );

    assert.equal(
      component.type.contextTypes,
      'a',
      'adds contextTypes to constructor'
    );

    assert.equal(
      component.type.defaultProps,
      'b',
      'adds defaultProps to constructor'
    );

    assert.equal(
      component.type.displayName,
      'c',
      'adds displayName to constructor'
    );
  });

  t.test('resolves component display name', function (assert) {
    assert.plan(2);

    var render = function () {};
    render.displayName = 'Rook';

    assert.equal(
      componentFactory(render).type.displayName,
      'Rook',
      'uses displayName from render function if available.'
    );

    assert.equal(
      componentFactory(function Loo() {}).type.displayName,
      'Loo',
      'uses displayName from render function name if available.'
    );
  });
});
