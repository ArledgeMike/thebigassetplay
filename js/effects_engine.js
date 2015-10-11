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