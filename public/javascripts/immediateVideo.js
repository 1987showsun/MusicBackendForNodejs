/*$(function(){
  immediateVideo.initial();
})*/

immediateVideo = {
  initial : function(){
    var $block = $('.immediateVideo'),
        $fixed = $('body>.fixed');
    $block.find('>li a').off().on({
      click : function(e) {
        e.preventDefault();
        $fixed.addClass('video').find('.close').off().on({
          click : function(e) {
            e.preventDefault();
            $(this).parent().removeClass('video');
          }
        });;
      }
    });
  }
}
