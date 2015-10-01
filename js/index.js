//YOU NEED TO MAKE SURE THAT WE DO NOT USE THE SAME LEVEL COMPLETE MESSAGE!!!!!!!!!!!!

function Effects_Engine(tracks){
  this.tracks = tracks;
  this.samples =[];
  this.context;
  this.init();
}
Effects_Engine.prototype = {
  
  constructor: Effects_Engine,
  
  init:function(){
    var t = this;
    
  
    try{
      window.AudioContext = window.AudioContext || window.webkitAudioContext;  
      this.context = new AudioContext();
    
    }catch(e){
      alert("Your VPN access has been denied. Check Portillos for more info.");
    }
    
    var num_loaded = 0;
    var num_to_load = this.tracks.length;
    
    $(window).on("effect_loaded", function(){
      num_loaded++;
      if(num_loaded == num_to_load){
        $(window).trigger("all_sounds_loaded")
      }
    });
    
    for (var i = 0; i <this.tracks.length; i++){
      var effect = new Effects_Player(this.tracks[i].url, this.tracks[i].autoplay, this.tracks[i].loop, this.context);
      effect.name = this.tracks[i].name;
      this.samples.push(effect);
    }
  },
  
  play_effect:function(effect){
    var to_find = effect;
    for(var i =0; i< this.samples.length; i++){
      if(this.samples[i].name == to_find){
        this.samples[i].play_sound();
        return false;
      }
      
    }
  },
  stop_effect:function(effect){
    var to_find = effect;
    for(var i =0; i< this.samples.length; i++){
      if(this.samples[i].name == to_find){
        this.samples[i].stop_sound();
        return false;
      }
      
    }
  }
}

function Effects_Player(url, play, loop, context){
  
  this.url = url
  this.context = context;
  this.sound_buffer;
  this.source;
  this.auto_play = play;
  this.loop = false || loop;
  this.init();
  
}

Effects_Player.prototype = {
  
  constructor: Effects_Player,
  
  init:function(){

    this.load_sound(this.url)
    
  },
  
  load_sound:function(url){
  
    var t = this;
    var request = new XMLHttpRequest();

    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
     
    request.onload = function(){
      t.context.decodeAudioData(request.response, function(buffer){
        t.sound_buffer = buffer;
        $(window).trigger("effect_loaded");
        if(t.auto_play){
          t.play_sound();
        }
      }, t.error_sound);  
  
    }

    request.send(); 
      
  },
  
  play_sound:function(){

    var currentTime = this.context.currentTime;
    
    this.source = this.context.createBufferSource();
    this.source.buffer = this.sound_buffer;
    this.source.connect(this.context.destination);
    this.source.loop = this.loop;
        
    this.source.start(currentTime);
    if(!this.loop){
      this.source.stop(currentTime + this.sound_buffer.duration);
    }
    
  },
  
  stop_sound:function(){
  
    this.source.stop(0);
    
  },
  
  error_sound:function(){
    var t = this;
    alert("VPN ACCESS IS DENIED FOR " + t.url);
  }
}

function Assets_Board(board){

  this.el = board;

  this.color_schemes = [
             ["#3B3B40", "#E74C3C", "#ECF0F1", "#3498DB", "#2980B9"],
             ["#FCFFF5", "#D1DBBD", "#91AA9D", "#3E606F", "#193441"],
             ["#004358", "#1F8A70", "#BEDB39", "#FFE11A", "#FD7400"],
             ["#E5B96F", "#F2D99C", "#CC2738", "#BF0426", "#690011"],
             ["#597533", "#332F28", "#61B594", "#E5DEA5", "#C44E18"],
             ["#3B3B40", "#8DC7B8", "#DC574E", "#A7BD5B", "#F7E4A2"]
             ];
  this.bg_images = ["1.jpg","2.jpg","3.jpg","4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg", "21.jpg", "22.jpg",, "23.jpg", "24.jpg", "25.jpg", "26.jpg", "27.jpg"];
  this.url = "./images/";
  
  this.current_color;
  this.current_bg;
}

Assets_Board.prototype ={
  
  constructor:Assets_Board,
    
  build_board:function build_board(level_options){
    
    var t = this;
    var options = level_options;
    var tiles_per_row = options.number_of_tiles / options.number_of_rows;
    
    var ran_bg_num = Math.floor(Math.random()*t.bg_images.length);

    this.current_bg = this.bg_images[ran_bg_num];
    if(this.current_bg == 'undefinded'){
      ran_bg_num = Math.floor(Math.random()*t.bg_images.length);
       this.current_bg = this.bg_images[ran_bg_num];
    }
    //take it out dont take it out on rebuild though
    this.bg_images.splice(ran_bg_num,1);

    var tile_width = (window.innerWidth / tiles_per_row);
    var perc_width = (tile_width / window.innerWidth) *100;
    
    var tile_height =  ( window.innerHeight / tiles_per_row);
    var perc_height = (tile_height / window.innerHeight) *100;
    
    this.current_colors = this.color_schemes[Math.floor(Math.random() * this.color_schemes.length)];

    $(this.el).removeAttr("class").addClass(options.level)

    for(var i =0; i < options.number_of_tiles; i++){
      var tile = new Asset_Tile(this.el,  this.current_colors[Math.floor(Math.random()*this.current_colors.length)], perc_width + "%" , perc_height + "%" );
    }
    $('body').css("background-image", "url(" + this.url + this.current_bg +  ")");
    
  },
  rebuild_board:function(level_options){
    var options = level_options;
    var tiles_per_row = options.number_of_tiles / options.number_of_rows;
  
    var tile_width = (window.innerWidth / tiles_per_row);
    var perc_width = (tile_width / window.innerWidth) *100;
    
    var tile_height =  ( window.innerHeight / tiles_per_row);
    var perc_height = (tile_height / window.innerHeight) *100;
    for(var i =0; i < options.number_of_tiles; i++){
      var tile = new Asset_Tile(this.el,  this.current_colors[Math.floor(Math.random()*this.current_colors.length)], perc_width + "%" , perc_height + "%" );
    }
    $('body').css("background-image", "url(" + this.url + this.current_bg +  ")");
  },
  
  reset_board:function(){
    $(this.el).find("> *").remove();
  }
  
}


function Asset_Tile(container, color, width, height){
  this.container = container;
  this.color = color;
  this.width = width;
  this.height = height;
  this.game_started = false;
  this.flipped = false;

  this.$el_template =$('<div class="playing_card"><figure class="front"></figure></div>');
  this.init();
}
Asset_Tile.prototype = {
  
  constructor: Asset_Tile,
  
  init:function(){
    var t = this;
    this.$el_template.appendTo(this.container);
    
    this.$el_template.css({
      height:this.height,
      width:this.width
    });
    
    this.$el_template.find(".front").css({
        "background-color": this.color
    });
    
    $(window).on("game_ready", function(){
      t.game_started = true;
    });
    
    this.$el_template.on("click", function(){
      t.flip_tile();
    });
    
  },
  
  flip_tile:function(e){

    var t = this;
   

    if (this.flipped === false && this.game_started === true) { 
      this.flipped = true;
        t.$el_template.addClass("flipped");
 

      $(window).trigger("card_flipped");

    } 
  }
}


function Start_Timer(sound, complete_function ){
  this.count_down_timer;
  this.sound_effect = sound;
  this.countdown_container = $('<div id="countdown" />');
  this.countdown_text = $('<h1 />')
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


function Game_Timer(sound){
  
  this.game_timer_container = $('<div id="game_timer_container" />');
  this.game_timer = $('<div id="game_timer" />');
  this.el = "#game_timer_container";
  
  this.timer_duration = 4000;
  this.flipped_timer;
  this.number_of_cards_flipped = 0;
  this.add_time_sound = sound;
  this.board_ref;
    
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
    });
    
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

    
    if(level_options.move_timer_reset_count == null){
      return false;
    }
    
    if(this.number_of_cards_flipped == level_options.move_timer_reset_count){
      var t = this;

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
    
    }
  },
  
  reset_game_timer:function(){
    window.clearInterval(this.flipped_timer);
    this.timer_duration = 4000;
    $(this.el).find("> div").clearQueue();
    $(this.el).find("> div").stop();  
    $(this.el).find("> div").removeAttr("style");
    this.number_of_cards_flipped=0; 
  }
};

//MIGHT NEED REFERENCE TO CURRENT LEVEL EVERY TIME A NEXT LEVEL IS CALLED
function Game_Menu(){
  this.overlay = "#modal_overlay"; 
  this.game_messages=["<p>That was some top notch asset play! HOWEVER, the client doesn't share your vision.</p> <p>Let's try something with more top of mind bullets.</p>",
                    "<p>Great asset play! HOWEVER, your Creative Director feels the user will not understand that asset.</p> <p>Try and create a sense of worth without giving a sense of worth.</p>",
                    "<p>That was the best asset play this company has seen! HOWEVER, that asset needs more user testing to give us something more user-centric.</p>",
                    "<p>You turned that asset play over so fast! HOWEVER, dev can't code and turn around such complex designs like yours. Give me something with less pop. We need something generalized, but more specific.</p>",
                    "<p>That was key asset play! HOWEVER, it goes below the fold. Give me something a little higher on the fold and remember H2s are a sign of weakness.</p>",
                    "<p>That was some top notch asset play! HOWEVER, that color oxblood was not in scope for what we had planned. That will cost another 10 million likes to operate.</p> <p>Give me an option in budget.</p>"
                  ];
                  this.current_level = 0;
}

Game_Menu.prototype = {
  constructor:Game_Menu,
  
  menu_in:function(modal_type){
    var $modal = $(modal_type);
    
    if(modal_type= "level_complete"){
      level_complete_message(modal_type);
    }

    //CHANGE LEVEL COMPLETE MESSAGE IF YOU BEAT A LEVEL
    function level_complete_message(modal_type){
      $modal.find(".active").removeClass("active");
      var $messages = $modal.find(".body");
      var ran_num = Math.floor(Math.random()*$messages.length);
      var $show_message =$messages[ran_num];
      $($show_message).addClass("active");
    }
    
    $(this.overlay).fadeIn();
      $modal.css({
        top: "50%",
      
      });
  },

  menu_out:function(modal_type, callback){
  
    var $modal = $(modal_type);
    
    $(this.overlay).fadeOut();
    $modal.css({
      top: "200%",
    
    });
      
    if(callback != 'undefined' && typeof(callback) == 'function'){
      callback();
    }
    
  },
  set_complete_message:function(){

    var message = this.game_messages[this.current_level];
    $('#level_complete .body').html(message); 
     this.current_level++;
  }
 

}


function Assets_Counter(){
  this.$el_template = $('<div class="counter"><p><span class="count">0</span>/<span class="total">100</span></p></div>');
 this.count =0;
  this.$el_template.appendTo("body");
}
Assets_Counter.prototype ={
  constructor: Assets_Counter,
  
  increase_count:function(){
    this.count++;
    this.set_count(this.count);
    
  },
  
  reset_count:function(){
    this.count = 0;
    this.set_count(this.count);
  },
  
  set_count:function(count){
    $(this.$el_template).find(".count").text(count);
  },
  set_total:function(total){
    $(this.$el_template).find(".total").text(total);

  }
}





function Asset_Play_Game() {
  
  
  
  this.game_tracks = [
    {
          name:"loading",
          url:"./sound/countdown.mp3",
          autoplay:true,
          loop:true
    },{ 
      name:"flip",
      url:"./sound/flip.wav",
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
  this.assets_counter =new Assets_Counter();
  this.number_of_cards_flipped =0;
  this.assets_counter.set_total(this.level_options.number_of_tiles);
  
  this.game_timer = new Game_Timer(this.effects_engine);

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
        t.effects_engine.play_effect("game_music");
      $("#start_screen").find("marquee").slideUp(function(){
        $("#start_screen").find("button").slideDown();
      });
      $("#start_screen .body").slideDown(1200);
      
    
      
    });
    
  
       this.assets_board.build_board(this.level_options);
    
    $(window).on("card_flipped", function(){
      t.effects_engine.play_effect("flip");
      t.number_of_cards_flipped++;
      t.assets_counter.increase_count();
      t.is_level_complete(t.number_of_cards_flipped);
      t.game_timer.add_time( t.level_options);
    });
    
    $(window).on("level_complete", function(){
      t.game_menu.set_complete_message();
      
      t.game_timer.stop_game_timer();
      t.effects_engine.play_effect("level_complete");
    });
    
    $('#start_game').on("click", function(){      
      t.effects_engine.play_effect("menu_select");
      t.game_menu.menu_out("#start_screen", t.start_timer.start_countdown());
    });

    $("#next_level").on("click", function(){
      t.assets_counter.reset_count();
      t.effects_engine.play_effect("menu_select");
      t.game_menu.menu_out("#level_complete", t.start_timer.start_countdown());
    });


    $("#reset_game ").on("click", function(){
      t.assets_board.reset_board();
      t.game_timer.reset_game_timer();
      t.assets_counter.reset_count();
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
         $(window).trigger("level_complete");
         
         $('#flash').delay(200).fadeIn(300,function(){
           $(this).fadeOut(300);
         });

         window.setTimeout(function(){
            t.assets_board.reset_board();
            t.game_timer.reset_game_timer();
            t.assets_counter.reset_count();
            t.assets_counter.set_total(t.level_options.number_of_tiles);
            t.assets_board.build_board(t.level_options);
            
            
            t.game_menu.menu_in("#level_complete");
         },3000);
        
      
       }
     }
  }

}


var asset_play_game = new Asset_Play_Game();