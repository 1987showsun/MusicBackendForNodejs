$(function(){
  reset.wrapper();
  reset.footer();
  reset.initial();
})

reset = {
  initial : function(){
    var status = {
          $block         : '',
          _blockIdName   : ['mainKv'],
          _blockRangeW   : [1280,768,480],
          _rangeLength   : 0,
          _blockAddName  : ['pc','pad','min','mobile'],
          _maxRangeW     : [],
          _minRangeW     : []
        }

    status._rangeLength = status._blockRangeW.length;

    for(var r=0 ; r<status._rangeLength ; r++){
      status._maxRangeW[r] = status._blockRangeW[r];
      status._minRangeW[r] = status._blockRangeW[r+1];
      if( status._blockRangeW[r+1]==undefined ){
        status._minRangeW[r] = status._blockRangeW[r];
      }
    }

    reset.reSize(status);
    $(window).resize(function(event) {
      reset.reSize(status);
    });
  },

  wrapper : function(){
    var status = {
          $block         : '',
          _blockIdName   : ['wrapper'],
          _blockRangeW   : [1280,768,480],
          _rangeLength   : 0,
          _blockAddName  : ['pc','pad','min','mobile'],
          _maxRangeW     : [],
          _minRangeW     : []
        }

    status._rangeLength = status._blockRangeW.length;

    for(var r=0 ; r<status._rangeLength ; r++){
      status._maxRangeW[r] = status._blockRangeW[r];
      status._minRangeW[r] = status._blockRangeW[r+1];
      if( status._blockRangeW[r+1]==undefined ){
        status._minRangeW[r] = status._blockRangeW[r];
      }
    }

    reset.reSize(status);
    $(window).resize(function(event) {
      reset.reSize(status);
    });
  },

  footer : function(){
    var status = {
          $block         : '',
          _blockIdName   : ['footer'],
          _blockRangeW   : [1280,768,480],
          _rangeLength   : 0,
          _blockAddName  : ['pc','pad','min','mobile'],
          _maxRangeW     : [],
          _minRangeW     : []
        }

    status._rangeLength = status._blockRangeW.length;

    for(var r=0 ; r<status._rangeLength ; r++){
      status._maxRangeW[r] = status._blockRangeW[r];
      status._minRangeW[r] = status._blockRangeW[r+1];
      if( status._blockRangeW[r+1]==undefined ){
        status._minRangeW[r] = status._blockRangeW[r];
      }
    }

    reset.reSize(status);
    $(window).resize(function(event) {
      reset.reSize(status);
    });
  },

  reSize : function(status){
    var _blockLength = status._blockIdName.length,
        $block       = '',
        _select      = 0;

    for(var b=0 ; b<_blockLength ; b++){
      $block  = $('#'+status._blockIdName);
      _select = new action($block)._select;
      $block.addClass(status._blockAddName[_select])
    }

    function action($block){
      var _winW   = $block.width(),
          _winH   = $block.height(),
          _select = 0;
      for( var r=0 ; r<status._rangeLength ; r++ ){
        if( _winW>status._maxRangeW[0] ){
          _select = 0;
        }else if( _winW<status._minRangeW[status._rangeLength-1] ){
          _select = status._rangeLength;
        }else if( _winW<=status._maxRangeW[r] && _winW>status._minRangeW[r] ){
          _select = r+1;
        }
      }

      for(var b=0 ; b<status._blockAddName.length ; b++ ){
        $block.removeClass(status._blockAddName[b]);
      }

      return {_select:_select};
    }
  }
}
