var Kv = React.createClass({
  getInitialState: function() {
    return {
      data : []
    };
  },

  componentWillMount: function() {
    $.getJSON('/kv',this.getData);
  },

  getData : function(data){
    this.setState({
      data: data['data']
    });
    this.runSlide();
  },

  runSlide : function(){
    var slideApi = new slide.initial({
      'actionClassName' : 'mainKv',
      'speed'           : 500,
      'navStatus'       : {
        'switch'        : true,
        'showSet'       : 'center'
      },
      'autoChange'      : {
        'switch'        : true,
        'pause'         : 5000,

      },
      'direction'       : {
        'switch'        : true,
      }
    });
  },

  render : function(){
    return(
      <div className="in">
        <ul className="kv">
          {this.state.data.map(function(item){
            return(
              <li>
                <a href="#">
                  <img src={item.file} alt={item.title}/>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    )
  }
})

module.exports = Kv;
/*ReactDOM.render(
  <Kv/>,
   document.getElementById('mainKv')
)*/
