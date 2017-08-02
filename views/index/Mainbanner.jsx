var React         = require('react');

var Mainbanners   = React.createClass({
  getInitialState: function() {
    return {
      data:[]
    };
  },

  render : function(){
    return(
      <div id="mainKv" className="mainKv slideBlock">
        <div className="in">
          <ul className="kv">
            {this.props.data.map(function(item){
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
      </div>
    )
  }
})

module.exports = Mainbanners;
