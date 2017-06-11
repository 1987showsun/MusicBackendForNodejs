var AlbumType = React.createClass({
  getInitialState: function() {
    return {
      data : []
    };
  },

  componentWillMount: function() {
    $.getJSON('/albumtype',this.getData);
  },

  getData : function(data){
    this.setState({
      data: data['data']
    });
    this.runSlide();
  },

  runSlide : function(){
    var slideApis = new slide.initial({
      'actionClassName' : 'vicNav',
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
                <a href={'/albumlist/'+item.name_en}>
                  <figure>
                    <figcaption>{item.name_en}</figcaption>
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
  <AlbumType/>,
   document.getElementById('vicNav')
)
