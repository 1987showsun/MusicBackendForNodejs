var Test = React.createClass({
  getInitialState: function() {
    return {
      data: []
    };
  },
  componentWillMount: function() {
    $.getJSON('/json/kv.json',this.getData)
  },

  getData : function(data){
    this.setState({ data: data });
  },
  render: function() {
    console.log(this.state.data);

  }
})

var Kv = React.createClass({
  render : function(){
    console.log(this.props.data);
  }
})

ReactDOM.render(
  <Test/>,
   document.getElementById('mainKv')
)
