function Start_Timer(sound, complete_function ){
  this.count_down_timer;
  this.sound_effect = sound;
  this.countdown_container = $('<div id="countdown" />');
  this.countdown_text = $('<h1 />');
  this.el = "#countdown";
  this.count_down_length = 3;
  this.complete_function = complete_function;
  
  this.init();
}

Start_Timer.prototype ={
  constructor:Start_Timer,

  init:function(){
   
    this.countdown_container.appendTo("body");  
    this.countdown_text.appendTo(this.countdown_container).text(this.count_down_length)
     
  },
  
  start_countdown:function(){
    var t = this;
    
    var count_down = this.count_down_length;
    
    $(t.el).fadeIn(function(){
    
      t.count_down_timer = window.setInterval(function(){
        
        $(t.el).find("> *").fadeOut(100,function(){
          count_down--;

          t.sound_effect.play_effect("countdown");
          if(count_down === 0){
            count_down = "Click";
          }
          $(this).text(count_down).fadeIn(500, function(){
            if(count_down === "Click"){
              $(window).trigger("game_ready");
              stop_countdown(t);
            }
          });
        });
        
      },1000);
      
      function stop_countdown(ref){
        var t = ref;
        window.clearInterval(t.count_down_timer);
        $(t.el).fadeOut(function(){
          $(t.el).find('> *').text(t.count_down_length);
          t.complete_function();
        });
      }
    
    });
  }
};