# Pure Component

Create React components that favor pure render functions and immutable props.

## Usage

Using a pure render function:

```js
var React = require('react');
var ReactDom = require('react-dom');
var pureComponent = require('pure-component');

var myComponent = pureComponent(function myComponentRender(props) {
  return React.DOM.p(null, props.text);
});

ReactDom.render(myComponent({text: 'Hello'}), document.body);
```

Using a spec object:

```js
var React = require('react');
var ReactDom = require('react-dom');
var pureComponent = require('pure-component');

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

React.render(myApp('World'), document.body);
```

### Spec

When passing in a spec object all of it’s own properties other than `contextTypes`, `defaultProps`, `displayName` and `propTypes` are added to the created component’s prototype. The mentioned props get added directly on the constructor instead.

Unless overwritten from spec, components default to using the [pure render](https://github.com/gaearon/react-pure-render) `shouldComponentUpdate`.

The render function receives `props` and an optional `context` as arguments.

### Display name

The component display name is taken either from the spec, or the `displayName` or `name` of the render function, in that order.
