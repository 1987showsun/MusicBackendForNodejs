var Singer = React.createClass({
  getInitialState: function() {
    return {
      data : []
    };
  },

  componentWillMount: function() {
    $.getJSON('/artists',this.getData);
  },

  getData : function(data){
    this.setState({
      data: data['data']
    });
    this.runSlide();
  },

  runSlide : function(){
    var slideApis = new slide.initial({
      'actionClassName' : 'singerBlock',
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
                <a href={'/artists/'+item._id}>
                  <figure>
                    <img src={item.profile} alt={item.name_cn}/>
                    <figcaption>
                      <h3>{item.name_cn}</h3>
                    </figcaption>
                  </figure>
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
  <Singer />,
   document.getElementById('singer')
)
