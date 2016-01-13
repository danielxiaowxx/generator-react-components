var React = require('react');
var _ = require('lodash');
var i18n = require('./i18n');

var <%= firstCapCamelsubcompName %> = React.createClass({

  // ========================== lifecycle ========================== //

  propTypes: {
    // 组件固定入参 - 所有组件都需要提供该属性
    lang: React.PropTypes.oneOf(['en', 'zh_CN']),

    // 组件特定入参 - 不同的组件需要的属性是不同的

    // 事件
  },

  getDefaultProps: function() {
    return {
      // 组件固定入参 - 所有组件都需要提供该属性
      lang: 'en',

      // 组件特定入参 - 不同的组件需要的属性是不同的

      // 事件
    }
  },

  // ========================== everything-else ========================== //


  // ========================== render ========================== //

  render: function() {

    var i18nData = i18n.use(this.props.lang);

    return (
      <div>{i18nData.hi}</div>
    );
  }

});

module.exports = <%= firstCapCamelsubcompName %>;
