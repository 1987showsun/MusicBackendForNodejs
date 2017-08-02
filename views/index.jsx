var React         = require('react');
var ReactDom      = require('react-dom');
var Master        = require('./layout/master');
var Mainbanners   = require('./index/Mainbanner');
var axios         = require('axios');

var IndexComponent = React.createClass({
  getInitialState: function() {
    return {
      data : []
    }
  },

  componentDidMount: function() {
    alert()
  },

  render : function(){
    return(
      <Master title={this.props.title}>
        <Mainbanners data={this.props.kvData}/>
      </Master>
    );
  }
});

module.exports = IndexComponent;
