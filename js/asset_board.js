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
  this.bg_images = ["1.jpg","2.jpg","3.jpg","4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg", "21.jpg", "22.jpg", "23.jpg", "24.jpg", "25.jpg", "26.jpg", "27.jpg"];
  this.url = "./images/";
  
  this.current_board_arr =[];
  
  this.current_color;
  this.current_bg;
  this.init();
  
}

Assets_Board.prototype ={
  
  constructor:Assets_Board,
  
  init:function(){
    var t = this;
    $(window).on("card_flipped", function(event,board_position){
        t.flip_similar(board_position);
    })
  },
    
  build_board:function build_board(level_options){
    
    this.current_board_arr=[];
    
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
    
    var row_arr =[];
    var row_counter = 0;
    var column_counter =0;
    
    this.current_colors = this.color_schemes[Math.floor(Math.random() * this.color_schemes.length)];

    $(this.el).removeAttr("class").addClass(options.level)

    for(var i =0; i < options.number_of_tiles; i++){
        
      var tile = new Asset_Tile(this.el,  this.current_colors[Math.floor(Math.random()*this.current_colors.length)], perc_width + "%" , perc_height + "%",row_counter,column_counter );
      row_arr.push(tile);
      
      if(row_arr.length == tiles_per_row){
        this.current_board_arr.push(row_arr);
        row_counter++;
        row_arr =[];
        column_counter = 0;
      
      }else{
        column_counter++;  
      }
    }
    
    $('body').css("background-image", "url(" + this.url + this.current_bg +  ")");
  },
  
  rebuild_board:function(level_options){
    this.current_board_arr=[];
    
    var options = level_options;
    var tiles_per_row = options.number_of_tiles / options.number_of_rows;
  
    var tile_width = (window.innerWidth / tiles_per_row);
    var perc_width = (tile_width / window.innerWidth) *100;
    
    var tile_height =  ( window.innerHeight / tiles_per_row);
    var perc_height = (tile_height / window.innerHeight) *100;
    
    var row_arr =[];
    var row_counter = 0;
    var column_counter =0;
    
    for(var i =0; i < options.number_of_tiles; i++){
      var tile = new Asset_Tile(this.el,  this.current_colors[Math.floor(Math.random()*this.current_colors.length)], perc_width + "%" , perc_height + "%", row_counter, column_counter );
      row_arr.push(tile);
      
      if(row_arr.length == tiles_per_row){
        this.current_board_arr.push(row_arr);
        row_counter++;
        row_arr =[];
        column_counter = 0;
      
      }else{
        column_counter++;
        
      }
      
    }
    $('body').css("background-image", "url(" + this.url + this.current_bg +  ")");
  },
  
  reset_board:function(){
    $(this.el).find("> *").remove();
  },
 
  flip_similar:function(tile){
    var row = tile.board_position.row;
    var column = tile.board_position.column;

    var top_target_row = row -1;
    var top_target_column = column;
    var top = {
      row:top_target_row,
      column:top_target_column
    };
    var right_target_row = row;
    var right_target_column = column +1;
    var right = {
      row:right_target_row,
      column:right_target_column
    }
    var bottom_target_row = row + 1;
    var bottom_target_column = column;
    var bottom ={
      row:bottom_target_row,
      column:bottom_target_column
    }
    var left_target_row = row;
    var left_target_column = column -1;
    var left = {
      row:left_target_row,
      column:left_target_column
    }
    var target = this.current_board_arr[row][column];
 
    var targets = [];
    
    targets.push(top, right, bottom, left);
        
    for(i in targets){
      
      if (targets[i].row < 0 || targets[i].row > this.current_board_arr[0].length -1) {
      }
      else if (targets[i].column < 0 || targets[i].column > this.current_board_arr[0].length -1) {
      }else{
        var target = this.current_board_arr[targets[i].row][targets[i].column];
        if(tile.color == target.color){
          target.$el_template.trigger("click");
        }       
        
      }

    }    
    
  }
  
}