var React         = require('react');

var Master = React.createClass({
  render : function(){
    return(
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <title>{this.props.title}</title>
          <link rel="stylesheet" href="/stylesheets/index.css" />
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
          <script type="text/javascript" src="/javascripts/index.js"></script>
          <script type="text/javascript" src="/javascripts/list.js"></script>
          <script type="text/javascript" src="/javascripts/slide.js"></script>
          <script type="text/javascript" src="/javascripts/immediateVideo.js"></script>
        </head>
        <body>
          <div id="wrapper">
            {this.props.children}
          </div>
        </body>
      </html>
    )
  }
})

module.exports = Master;
