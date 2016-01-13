var React = require('react');

var <%= firstCapCamelComponentName %> = React.createClass({
  render: function() {
    return (
      <div className="<%= componentName %>">
        include some sub-components here
      </div>
    )
  }
});

module.exports = <%= firstCapCamelComponentName %>;
