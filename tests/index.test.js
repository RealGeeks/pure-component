'use strict';

var test = require('tape');
var React = require('react');
var renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup;
var pureComponent = require('../');

test('Pure Component simple README example', function (assert) {
  assert.plan(1);

  var myComponent = pureComponent(function myComponentRender(props) {
    return React.DOM.p(null, props.text);
  });

  assert.ok(
    renderToStaticMarkup(myComponent({text: 'Hello'})),
    '<div>Hello</div>'
  );
});

test('Pure Component spec README example', function (assert) {
  assert.plan(1);

  var myComponentSpec = {
    displayName: 'My Component',
    contextTypes: {
      greeting: React.PropTypes.string
    },
    render: function (props, context) {
      return React.DOM.p(null, context.greeting + ' ' + props.children);
    }
  };

  var myComponent = pureComponent(myComponentSpec);

  var myAppSpec = {
    childContextTypes: {
      greeting: React.PropTypes.string
    },
    getChildContext: function () {
      return {greeting: 'Hello'};
    },
    render: function (props) {
      return myComponent(props.children);
    }
  };

  var myApp = pureComponent(myAppSpec);

  assert.ok(
    renderToStaticMarkup(myApp('World')),
    '<div>Hello World</div>'
  );
});
