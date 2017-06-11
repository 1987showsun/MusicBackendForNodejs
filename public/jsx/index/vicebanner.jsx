var ViceBanner = React.createClass({
  getInitialState: function() {
    return {
      data : []
    };
  },

  componentWillMount: function() {
    $.getJSON('/vicebanner',this.getData);
  },

  getData : function(data){
    this.setState({
      data: data['data']
    });
    this.runSlide();
  },

  runSlide : function(){
    var slideApis = new slide.initial({
      'actionClassName' : 'bannerKv',
      'speed'           : 500,
      'navStatus'       : {
        'switch'        : false,
        'showSet'       : 'center'
      },
      'autoChange'      : {
        'switch'        : true,
        'pause'         : 3000,

      },
      'direction'       : {
        'switch'        : false,
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
                  <img src={item.file} alt={item.title} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    )
  }
})

ReactDOM.render(
  <ViceBanner />,
   document.getElementById('block1')
)
