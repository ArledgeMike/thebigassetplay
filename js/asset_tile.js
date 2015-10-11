
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