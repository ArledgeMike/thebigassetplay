
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