$(function(){
  $list.initial();
})

$list = {
  initial : function(){
    var _name     = ['list'],
        $block    = '',
        _this     = '',
        _addClass = ['display4k','pc','pad','min','mobile'],
        _rangew   = [1380,900,680,480],
        _rangeL   = _rangew.length,
        _maxW     = [],
        _minW     = [],
        _dataFont = 'block';

    for( var r=0 ; r<_rangeL ; r++){
      _maxW[r] = _rangew[r];
      _minW[r] = _rangew[r+1];
      if( _rangew[r+1]==undefined ){
        _minW[r] = _rangew[r];
      }
    }


    new reSet();
    $(window).resize(function() {
      new reSet();
    });

    function reSet(){
      for (var n=0; n<_name.length ; n++) {
        $block = $('.'+_name[n]);
        var _blockLength = $block.length;
        for(var b=0 ; b<_blockLength ; b++){
          _this      = $block.eq(b);
          _dataFont  = _this.attr('data-font');
          _this.addClass( _this.attr('data-model') );
          switch(_dataFont){
            case 'none' :
              _this.find('figcaption').addClass('fontNone');
              break;
            case 'bottom' :
              _this.find('figcaption').addClass('fontBottom');
              break;
          }

          var _select = new $list.reset(_this,_maxW,_minW,_rangeL,_addClass)._select;
          _this.addClass( _addClass[_select] );
        }
      }

    }
  },

  reset : function(_this,_maxW,_minW,_rangeL,_addClass){
    var _winW   = _this.innerWidth(),
        _select = 0;
    for( var r=0 ; r<_rangeL ; r++ ){
      if( _winW>=_maxW[0] ){
        _select = 0;
      }else if(_winW<_minW[_rangeL-1]){
        _select = _rangeL;
      }else if( _winW<_maxW[r] && _winW>=_minW[r] ){
        _select = r+1;
      }
    }

    for(var d=0 ; d<=_rangeL ; d++){
      _this.removeClass( _addClass[d] );
    }

    return {_select:_select}
  }
}
