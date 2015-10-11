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
