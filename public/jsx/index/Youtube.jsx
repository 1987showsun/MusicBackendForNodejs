var Youtube = React.createClass({
  getInitialState: function() {
    return {
      data : []
    };
  },

  componentWillMount: function() {
    $.getJSON('/mv',this.getData);
  },

  getData : function(data){
    this.setState({
      data: data['data']
    });
    this.runSlide();
  },

  runSlide : function(){
    $list.initial();
    immediateVideo.initial();
  },

  render : function(){
    return(
      <div className="in">
        <div className="title">
          <span className="text">MV</span>
        </div>
        <ul className="list immediateVideo" data-model="images" data-max="8" data-min="2" data-font="none">
          {this.state.data.map(function(item){
            return(
              <li>
                <a href={'/mv/'+item._id}>
                  <figure>
                    <img src={item.videoImg} alt={item.name}/>
                    <figcaption>
                      <h3>{item.name}</h3>
                    </figcaption>
                  </figure>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
})

ReactDOM.render(
  <Youtube />,
   document.getElementById('videolist')
)
