function Asset_Play_Game() {
  
  this.game_tracks = [
    {
          name:"loading",
          url:"./sound/countdown.mp3",
          autoplay:true,
          loop:true
    },{ 
      name:"flip",
      url:"./sound/flip.mp3",
      autoplay:false,
      loop:false
    },{
      name: "game_music",
      url: "./sound/game_music.mp3",
      autoplay:false,
      loop:true
    },{
      name:"menu_select",
      url:"./sound/menu_select.mp3",
      autoplay:false,
      loop:false
    },{
      name:"level_complete",
      url:"./sound/level_complete.mp3",
      autoplay:false,
      loop:false
    },{
      name:"lose",
      url:"./sound/lose.mp3",
      autoplay:false,
      loop:false
    },{
      name:"add_time",
      url:"./sound/add_time.mp3",
      autoplay:false,
      loop:false
    },{
      name:"game_lose_music",
      url:"./sound/game_stop.mp3",
      autoplay:false,
      loop:true
    },{
      name:"countdown",
      url:"./sound/countdown.mp3",
      autoplay:false,
      loop:false
    },{
      name:"start_again",
      url:"./sound/start_again.mp3",
      autoplay:false,
      loop:false
    },{
      name:"game_win",
      url:"./sound/game_win.mp3",
      autoplay:false,
      loop:false,
    },{
      name:"final_music",
      url:"./sound/final_music.mp3",
      autoplay:false,
      loop:false
    }
  ]

  //MAYBE YOU WANT TO ADD THE NEXT LEVEL COPY HERE 
  this.current_level = 1;
  this.levels =[
  {
    level:"level_one",
    number_of_tiles:2,
    number_of_rows:2,
    move_timer_interval: 1000,
    move_timer_reset_count:null,
    duration:4000
  },
  {
    level:"level_two",
    number_of_tiles:4,
    number_of_rows:2,
    move_timer_interval: 900,
    move_timer_reset_count:null,
    duration:4000
  },{
    level:"level_three",
    number_of_tiles:9,
    number_of_rows:3,
    move_timer_interval: 800,
    move_timer_reset_count:5,
    duration:4000
  },{
    level:"level_four",
    number_of_tiles:16,
    number_of_rows:4,
    move_timer_interval: 700,
    move_timer_reset_count:3,
    duration:4500
  },{
    level:"level_five",
    number_of_tiles:25,
    number_of_rows:5,
    move_timer_interval: 600,
    move_timer_reset_count:3,
    duration:5000
  },{
    level:"level_six",
    number_of_tiles:36,
    number_of_rows:6,
    move_timer_interval: 500,
    move_timer_reset_count:4,
    duration:5000
  }];
  
  this.level_options = this.levels[this.current_level];
  this.game_started= false;
  
  var t = this;
  this.effects_engine = new Effects_Engine(this.game_tracks);
  
  this.start_timer = new Start_Timer(this.effects_engine, function(){
    t.start_game();
  });
  
  this.game_menu = new Game_Menu();
  this.assets_board = new Assets_Board("#subway_car");
  this.game_timer = new Game_Timer(this.effects_engine, this.level_options);
  this.number_of_cards_flipped =0;
  this.game_timer.assets_counter.set_total(this.level_options.number_of_tiles);
  


  this.init();
}

Asset_Play_Game.prototype = {
  
  constructor: Asset_Play_Game,
  
  init:function(){
    
    FastClick.attach(document.body);
      var t = this;
      
      
      
    $(window).on("all_sounds_loaded", function(){
      
      t.effects_engine.stop_effect("loading");
      
      t.effects_engine.play_effect("level_complete");
      
      //t.effects_engine.play_effect("game_music");
         $("#title_screen").find(".marquee").animate({
           opacity:0
         },function(){
           $("#title_screen").find("button").animate({
             opacity:1
           });
         });
        
        /*
      //THIS NEEDS TO CHANGE IT IS TOO SPECIFIC ADD TO MENUS SOME GET OR SET THING
      $("#start_screen").find(".marquee").slideUp(function(){
        $("#start_screen").find("button").slideDown();
      });
      $("#start_screen .body").slideDown(1200);
      */
    
      
    });
    
  
       this.assets_board.build_board(this.level_options);
    
    $(window).on("card_flipped", function(){
      t.effects_engine.play_effect("flip");
      t.number_of_cards_flipped++;
      t.is_level_complete(t.number_of_cards_flipped);
   
    });
    
    $(window).on("level_complete", function(){
 
      t.game_menu.set_complete_message();
      t.game_timer.stop_game_timer();
     
      t.effects_engine.play_effect("level_complete");
    });
  
  
    
    $('#title').on("click", function(){      
      t.effects_engine.play_effect("menu_select");
      t.effects_engine.play_effect("game_music");
      t.game_menu.menu_out("#title_screen", function(){
        t.game_menu.menu_in("#start_screen");
        
      });
    });  
    
    $('#start_game').on("click", function(){      
      t.effects_engine.play_effect("menu_select");
      t.game_menu.menu_out("#start_screen", t.start_timer.start_countdown());
    });



    $("#next_level").on("click", function(){
      t.effects_engine.play_effect("menu_select");
      t.game_menu.menu_out("#level_complete", t.start_timer.start_countdown());
    });


    $("#reset_game ").on("click", function(){
      t.assets_board.reset_board();
      t.game_timer.reset_game_timer();
      t.assets_board.rebuild_board(t.level_options);
      t.game_menu.menu_out("#lose", t.start_timer.start_countdown());
      t.effects_engine.stop_effect("game_lose_music");
      t.effects_engine.play_effect("start_again");  
      t.effects_engine.play_effect("game_music");
    });
    
    $(window).on("timer_end", function(){
      t.game_menu.menu_in("#lose");
      t.number_of_cards_flipped = 0;
      t.effects_engine.stop_effect("game_music");
      t.effects_engine.play_effect("lose");
      t.effects_engine.play_effect("game_lose_music");
      
    });
    


  },
  
  start_game:function(){
    this.game_timer.start_timer();
    
    this.game_started = true; 
  },

  stop_game:function(){
    this.game_timer.stop_game_timer();
    this.game_started = false;
  },
  
  is_level_complete:function(count){
    
    var length =  this.level_options.number_of_tiles;
    var count = count;
    var t = this;
    if (count == length) {
      
       this.current_level++;
       this.level_options = this.levels[this.current_level];

       if(this.current_level >= this.levels.length){
         this.game_timer.stop_game_timer();
         this.game_menu.menu_in("#end_game");
         t.effects_engine.stop_effect("game_music");
         
         t.effects_engine.play_effect("game_win");
             window.setTimeout(function(){
         t.effects_engine.play_effect("final_music");
       },3000);
         
         
       }else{
         this.stop_game();
         this.number_of_cards_flipped = 0;
         this.game_timer.stop_game_timer();
       
         
         $('#flash').delay(200).fadeIn(300,function(){
           $(this).fadeOut(300);
         });

         window.setTimeout(function(){
            t.assets_board.reset_board();
            t.assets_board.build_board(t.level_options);
            t.game_timer.reset_game_timer();
            t.game_timer.set_next_level(t.level_options);
            
            t.game_menu.menu_in("#level_complete");
         },3000);
         
          $(window).trigger("level_complete");
      
       }
       
       
     }
  }

}


var asset_play_game = new Asset_Play_Game();