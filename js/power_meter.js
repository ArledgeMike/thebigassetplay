function Tamzometer(options){
  
  this.$el = $('<svg id="power_meter"><circle id="meter" r="48%" cx="50%" cy="50%" /></svg>');
  this.current_level_options = options;
  
  this.circumference;
  this.increment;
  
  this.current_clicks = 0;
  this.total_clicks = this.current_level_options.move_timer_reset_count;
  

  this.init();
}

Tamzometer.prototype = {
  
  constructor:Tamzometer,
  init:function(){
  
    this.$el.appendTo(".counter");
    
    var diameter = this.$el.width();
    
    this.circumference = diameter * 3.14159;
    this.current_dashoffset = this.circumference;
    this.increment = this.circumference / this.total_clicks;
    


  
     this.$el.find('#meter').css({
      "stroke-dashoffset": this.circumference ,
      "stroke-dasharray" : this.circumference 
    });
    
    
  },

  
  increment_meter:function(){

    this.current_clicks++; 
    var new_offset = this.current_dashoffset - this.increment;
    
    
    

    
    this.$el.find('#meter').css({
      "stroke-dashoffset":new_offset
    });
    
    this.current_dashoffset = new_offset;
    

    
    var t = this;

    $('#meter').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
  
      if(t.current_clicks >= t.total_clicks){
     
        t.$el.find('#meter').css({
          "stroke-dashoffset":t.circumference
        });
        t.current_clicks = 0;
        t.current_dashoffset = t.circumference;
      }
    
    });
  },
  set_level:function(options){

   this.current_level_options = options;
   this.total_clicks = options.move_timer_reset_count;
   this.increment = this.circumference / this.total_clicks;
   this.current_dashoffset = this.circumference;

  },
  reset_power_meter:function(){
    this.current_clicks = 0;
    this.$el.find('#meter').css({
      "stroke-dashoffset":this.circumference
    });
    
    
  }
  
}



