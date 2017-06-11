var _nowShow    = 0,
    _slideArray = [];

slide = {

  $actionClassName  : '',
  $wrap             : '',
  $move             : '',
  $ul               : '',
  $li               : '',
  $nav              : '',
  _actionClassName  : '',
  _timeOut          : '',
  _caseArray        : [],
  _activeSet        : 0,
  _wrapW            : 0,
  _moveW            : 0,
  _liBeforeLength   : 0,
  _liAfterLength    : 0,
  _navShowSetStatus : ['left','center','right'],

  initial : function(slideApi){
    _slideArray.push(slideApi);
    var _actionClassNameLength = $('.'+slideApi.actionClassName).length;
    for(var i=0 ; i<_actionClassNameLength ; i++){
      var _this               = $('.'+slideApi.actionClassName).eq(i);
      slide.$actionClassName  = $('.'+slideApi.actionClassName).eq(i);
      new slide.addBlock(_this,slideApi);
    }
  },

  addBlock : function(_this,slideApi){
    _this.find('>.in>').wrapAll('<div id="'+slideApi.actionClassName+'Wrap" class="wrap"><div class="move"></div></div>');
    slide.$wrap           = _this.find('>.in>.wrap');
    slide.$move           = _this.find('>.in>.wrap>.move');
    slide.$ul             = _this.find('>.in>.wrap>.move>ul');
    slide.$li             = _this.find('>.in>.wrap>.move>ul>li');
    slide._activeSet      = slide.$li.length;
    slide._liBeforeLength = slide.$li.length;
    slide.copyContent(_this);
    slide.nav(_this,slideApi);
    slide.direction(_this,slideApi);
    _thisMove = slide.$move;
    new slide.autoChange(_thisMove,slideApi);
    slide.$li             = _this.find('>.in>.wrap>.move>ul>li');
    slide._liAfterLength  = slide.$li.length;

    _this.find('.move>ul>li').eq( (slide._liAfterLength/3) ).addClass('active');

    new slide.touchAction(_this,slideApi);
    slideResize();
    $(window).resize(function(event) {
      slideResize();
    });
    function slideResize(){
      slide.blockSize();
      slide.adjustPosition();
    }
  },

  nav : function(_this,slideApi){
    if( slideApi.navStatus.switch ){
      _this.find('>.in>').after('<div class="nav"><ul></ul></div>');
      slide.$nav = _this.find('>.in>.nav>ul');
      var showSetLength = slide._navShowSetStatus.length;
      for(var i=0 ; i<showSetLength ; i++){
        switch( slideApi.navStatus.showSet ){
          case slide._navShowSetStatus[i] :
            slide.$nav.parent().addClass(slide._navShowSetStatus[i]);
            break;
        }
      }

      for (var i = 0; i < slide._liBeforeLength; i++) {
        slide.$nav.append('<li></li>');
      }
      slide.$nav.find('>li').eq(0).addClass('active');
    }
  },

  autoChange : function(_this,slideApi){

  },

  direction : function(_this,slideApi){
    if(slideApi.direction.switch){
      var _thisDirection,_class,_moveSwitch = false;
      _this.append('<div class="left kvDirection"></div><div class="right kvDirection"></div>');
      var _kvDirection        = _this.find('>.kvDirection');
      _kvDirection.off().on({
        click : function(){
          _thisDirection      = $(this);
          _class              = _thisDirection.attr('class');

          if( _class.indexOf('left')>=0 ){
            slide._activeSet = slide._activeSet-1;
          }else{
            slide._activeSet = slide._activeSet+1;
          }
          _this               = _this.find('>.in>.wrap>.move');
          _end                = -(100)*slide._activeSet;
          _speed              = slideApi.speed;
          _moveX              = 1;
          _moveRange          = 0;
          slide.moveResult(_this,_end,_speed,_moveX,_moveRange,_moveSwitch);
        }
      })
    }
  },

  copyContent : function(){
    var _copyLiBefore  = slide.$li.clone(),
        _copyLiAfter   = slide.$li.clone();

    slide.$li.first().before(_copyLiBefore);
    slide.$li.last().after(_copyLiAfter);
  },

  blockSize : function(){
    var textlength = _slideArray.length;
    for( var i=0 ; i<textlength ; i++ ){
      slide.$wrap  = $('.'+_slideArray[i].actionClassName).find('>.in>.wrap');
      slide.$li    = slide.$wrap.find('>.move>ul>li');
      slide._wrapW = slide.$wrap.innerWidth();
      slide.$li.css({width : slide._wrapW});
    }
  },

  adjustPosition : function(){
    var _liLength = slide.$li.length,
        _nowSet   = 100,
        _end      = -(_nowSet*slide._activeSet);

    slide._moveW  = slide.$move.width();
    slide.$move.css({
      left : _end+'%'
    });
  },

  touchAction : function(_this,slideApi){

    var _switch     = false,
        _startX     = 0,
        _moveX      = 0,
        _endX       = 0,
        _translateX = 0,
        _moveRange  = 0,
        _moveSwitch = false,
        _speed      = 0,
        _length     = 0,
        _nowShow    = 0,
        _wrapW      = 0,
        _end        = 0,
        _thisMove   = '',
        _afterNowShow=0;

    _this.off().on({
      mousedown : function(e) {
        e.preventDefault();
        _switch       = true;
        _thisMove     = $(this).find('>.in>.wrap>.move');
        _length       = $(this).find('>.in>.wrap>.move>ul>li').length;
        _moveRange    = $(this).find('>.in').innerWidth()*0.5;
        _wrapW        = $(this).find('>.in').innerWidth();
        _thisHref     = $(this).find('a');
        _translateX   = (parseInt(_thisMove.css('left'))/_wrapW)*100;

        $('body').off().on({
          mousedown : function(e) {
            _startX = e.pageX;
            _moveX  = 0;
          },

          mousemove : function(e) {
            if( _switch ){
              _speed      = 0;
              _moveX      = e.pageX-_startX;
              _end        = _translateX+((_moveX/_wrapW)*100);
              _moveSwitch = true;
              new slide.moveResult(_thisMove,_nowShow,_end,_speed,_moveX,_moveRange,_moveSwitch,_length);
              _thisHref.off().on({
                click : function(e){
                  _thisHref.off();
                  if( _moveX!=0 ){
                    e.preventDefault();
                  }
                }
              });
            }
          },

          mouseup : function(e) {
            if(_switch){
              _nowShow          = new slide.activeStep(_length,_nowShow,_end,_speed,_moveX,_moveRange,_moveSwitch)._nowShow;
              _afterNowShow     = _nowShow+(_length/3);
              _speed            = 500;
              _moveSwitch       = false;
              _end              = -(100)*_afterNowShow;
              new slide.moveResult(_thisMove,_nowShow,_end,_speed,_moveX,_moveRange,_moveSwitch,_length);
              _switch           = false;
            }
          }
        });
      },

      touchstart : function(e){
        e.preventDefault();
        _switch       = true;
        _thisMove     = $(this).find('>.in>.wrap>.move');
        _length       = $(this).find('>.in>.wrap>.move>ul>li').length;
        _moveRange    = $(this).find('>.in').innerWidth()*0.5;
        _wrapW        = $(this).find('>.in').innerWidth();
        _thisHref     = $(this).find('a');
        _translateX   = (parseInt(_thisMove.css('left'))/_wrapW)*100;

        $('body').off().on({
          touchstart : function(e) {
            _startX = e.originalEvent.touches[0].pageX;
            _moveX  = 0;
          },

          touchmove : function(e) {
            if( _switch ){
              _speed      = 0;
              _moveX      = e.originalEvent.touches[0].pageX-_startX;
              _end        = _translateX+((_moveX/_wrapW)*100);
              _moveSwitch = true;
              new slide.moveResult(_thisMove,_nowShow,_end,_speed,_moveX,_moveRange,_moveSwitch,_length);
              _thisHref.off().on({
                click : function(e){
                  _thisHref.off();
                  if( _moveX!=0 ){
                    e.preventDefault();
                  }
                }
              });
            }
          },

          touchend : function(e) {
            if(_switch){
              _nowShow          = new slide.activeStep(_length,_nowShow,_end,_speed,_moveX,_moveRange,_moveSwitch)._nowShow;
              _afterNowShow     = _nowShow+(_length/3);
              _speed            = 500;
              _moveSwitch       = false;
              _end              = -(100)*_afterNowShow;
              new slide.moveResult(_thisMove,_nowShow,_end,_speed,_moveX,_moveRange,_moveSwitch,_length);
              _switch           = false;
            }
          }
        });
      },
    });
  },

  activeStep : function(_length,_nowShow,_end,_speed,_moveX,_moveRange,_moveSwitch){

    if(_moveX<0){
      if( Math.abs(_moveX) > _moveRange ){
        if( _nowShow>=(_length/3)-1 ){
          _nowShow = 0;
        }else{
          _nowShow++;
        }
      }else{
        _nowShow = _nowShow;
      }
    }else{
      if( Math.abs(_moveX) > _moveRange ){
        if( _nowShow<0){
          _nowShow = (_length/3)-2;
        }else{
          _nowShow--;
        }
      }else{
        _nowShow = _nowShow;
      }
    }
    return {_nowShow:_nowShow};
  },

  moveResult : function(_this,_nowShow,_end,_speed,_moveX,_moveRange,_moveSwitch,_length){
    _this.stop(false,true).animate({
      left : _end+'%',
    },_speed,function(){
      if( !_moveSwitch ){
        if( Math.abs(_moveX) > _moveRange ){
          $(this).parents('.in').find('>.nav>ul>li').removeClass('active').eq( _nowShow ).addClass('active');
          $(this).parents('.in').find('.move>ul>li').removeClass('active').eq( (_nowShow+(_length/3)) ).addClass('active');
          if( _nowShow==-1 ){
            _nowShow          = (_length/3)-1;
            _afterNowShow     = _nowShow+(_length/3);
            _end              = -(100)*_afterNowShow;
            $(this).animate({
              left : _end+'%',
            },0);
          }else if(_nowShow>=(_length/3)-1){
            _nowShow          = -1;
            _afterNowShow     = _nowShow+(_length/3);
            _end              = -(100)*_afterNowShow;
            $(this).animate({
              left : _end+'%',
            },0);
          }
        }
      }
    });
  },
}
