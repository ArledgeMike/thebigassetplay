function Game_Timer(sound, options){
  
  this.game_timer_container = $('<div id="game_timer_container" />');
  this.game_timer = $('<div id="game_timer" />');
  this.el = "#game_timer_container";
  
  this.timer_duration = 4000;
  this.flipped_timer;
  this.number_of_cards_flipped = 0;
  this.add_time_sound = sound;
  this.board_ref;
  
  this.current_level_options = options;
  
  this.assets_counter =new Assets_Counter();
  this.power_meter = new Tamzometer(this.current_level_options);
    
  this.init();
}

Game_Timer.prototype ={
  constructor: Game_Timer,
  
  init:function(){
    var t = this;
    this.game_timer_container.appendTo("body");
    this.game_timer.appendTo(this.game_timer_container);
    
    
    $(window).on("card_flipped", function(){
      t.number_of_cards_flipped++;
      t.add_time( t.level_options);
      

      t.assets_counter.increase_count();
    
    });
   
   
    
  },
  set_next_level:function(new_options){
    
    this.current_level_options = new_options;
    this.power_meter.set_level( new_options);
    this.assets_counter.set_total(this.current_level_options.number_of_tiles);
  },
  
  start_timer:function(ref){

    var t = this;
    $(this.el).find("div").animate({
      width:0
    },{
      duration:this.timer_duration,
      easing:"linear",
      
      start:function(){

        t.flipped_timer = window.setInterval(function(){
                            t.timer_duration = t.timer_duration - 200;
                          },500);

      },
      
      complete:function(){
        
        t.timer_duration = t.timer_duration;
        window.clearInterval(t.flipped_timer);
        t.stop_game_timer(t);
        t.number_of_cards_flipped=0;

        $(window).trigger( "timer_end" );
        return false;
      }
      
    });

  },
  
  stop_game_timer:function(){
    window.clearInterval(this.flipped_timer);
    $(this.el).find(" > div").clearQueue();
    $(this.el).find(" > div").stop();
  },

  add_time:function(level_options){

    
    if(this.current_level_options.move_timer_reset_count == null){
      return false;
    }
          this.power_meter.increment_meter();
    if(this.number_of_cards_flipped == this.current_level_options.move_timer_reset_count){
      var t = this;
      
      //reset_the_power_meter
      
      this.stop_game_timer();
      this.number_of_cards_flipped=0;
      this.timer_duration = this.timer_duration + 100;
      $(this.el).find("> div").css("width", function(){
        var timer_w = $(t.el).find("> div").width();
        var win_w = $(window).width();
        var passed_time = (win_w - timer_w)/2;
        var new_time = timer_w + passed_time;
        return new_time;
      });
      
      this.add_time_sound.play_effect("add_time");
      
      this.start_timer();
    
    }else{
      //increment_the_power_meter


    }
  },
  
  reset_game_timer:function(){
    window.clearInterval(this.flipped_timer);
    this.timer_duration = 4000;
    $(this.el).find("> div").clearQueue();
    $(this.el).find("> div").stop();  
    $(this.el).find("> div").removeAttr("style");
    this.power_meter.reset_power_meter();
    this.number_of_cards_flipped=0; 

    this.assets_counter.reset_count()
  }
};
