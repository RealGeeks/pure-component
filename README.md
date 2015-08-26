# Pure Component

Create React components that favor pure render functions and immutable props.

## Usage

Using a pure render function:

```js
var React = require('React');
var pureComponent = require('pure-component');

var myComponent = pureComponent(function myComponentRender(props) {
  return React.DOM.p(null, props.text);
});

React.render(myComponent({text: 'Hello'}), document.body);
```

Using a spec object:

```js
var React = require('React');
var pureComponent = require('pure-component');

var spec = {
  displayName: 'My Component',
  componentWillMount: function () {
    this.state = {greeting: 'Hello'};
  },
  render: function (props, state) {
    return React.DOM.p(null, state.greeting + ' ' + props.children);
  }
};

var myComponent = pureComponent(spec);

React.render(myComponent('World'), document.body);
```

### Spec

When passing in a spec object all of it’s own properties other than `contextTypes`, `defaultProps`, `displayName` and `propTypes` are added to the created component’s prototype. The mentioned props get added directly on the constructor instead.

Unless overwritten from spec, components default to using the [pure render](https://github.com/gaearon/react-pure-render) `shouldComponentUpdate`.

The render function receives `props` and `state` as arguments.

### Display name

The component display name is taken either from the spec, or the `displayName` or `name` of the render function, in that order.
