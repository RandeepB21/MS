const UNREVEALED = '\xa0 \xa0';
const REVEALED = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
const FLAG = 'F';
const MINE = '*';


class posn {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    };
}


class int_array {
  constructor() {
    this.len = 0;
    this.maxlen = 676;
    this.data = [];

    this.array_length = function () {
      return this.len;
    }

    this.array_item_at = function (pos) {
      return this.data[pos];
    }

    this.array_insert_at = function(pos, val) {
      this.data.splice(pos, 0, val);
      ++this.len
    }

    this.array_remove_at = function (pos) {
      this.data.splice(pos, 1)
      --this.len;
    }

    this.array_index_at = function (item) {
      return this.data.indexOf(item);
    }
  }
}


class board {
    constructor(width, height, num_mines) {
        this.width = width;
        this.height = height;
        this.num_mines = num_mines;
        this.board = [];
        this.mines = [];

        this.add_mine = function (mine) {
            this.mines.push(mine);
        }

        this.add_board = function (item) {
            this.board.push(item);
        }
    }
}


function flag(ms_board, x, y) {
     const index = ((y - 1) * ms_board.width)+ x - 1;
     if (ms_board.board[index] == FLAG) {
        ms_board.board[index] = UNREVEALED;
        return true;
      } else if (ms_board.board[index] == UNREVEALED) {
        ms_board.board[index] = FLAG;
        return true;
      } else {
        return false;
      }
}

function find_mine(ms_board, x, y, length) {
    for (var i = 0; i < length; ++i) {
        if (((ms_board.mines[i].x == x) && ((ms_board.mines[i].y == y)))) {
          return true;
        }
      }
      return false;
}

function adjacent_mines(ms_board, x, y){
    const width = ms_board.width;
    const height =  ms_board.height;
    var mine_count = 0;
    
    if ((1 <= y - 1) && (y - 1 <= height)) {
      mine_count += find_mine(ms_board, x, y - 1, ms_board.num_mines);
    }
    
    if ((1 <= y + 1) && (y + 1 <= height)) {
      mine_count += find_mine(ms_board, x, y + 1, ms_board.num_mines);
    }
    
    if ((1 <= x - 1) && (x - 1 <= width)) {
      mine_count += find_mine(ms_board, x - 1, y, ms_board.num_mines);
      
      if ((1 <= y + 1) && (y + 1 <= height)) {     
        mine_count += find_mine(ms_board, x - 1, y + 1, ms_board.num_mines);
      }
      
      if ((1 <= y - 1) && (y - 1 <= height)) {     
        mine_count += find_mine(ms_board, x - 1, y - 1, ms_board.num_mines);
      }
    }
    
    if ((1 <= x + 1) && (x + 1 <= width)) {
      mine_count += find_mine(ms_board, x + 1, y, ms_board.num_mines);
      
      if ((1 <= y - 1) && (y - 1 <= height)) {
        mine_count += find_mine(ms_board, x + 1, y - 1, ms_board.num_mines);
      }
      
      if ((1 <= y + 1) && (y + 1 <= height)) {
        mine_count += find_mine(ms_board, x + 1, y + 1, ms_board.num_mines);
      }
    }
    return mine_count;
}


function tile_revealed(ms_board, x, y) {
    const index = ((y - 1) * ms_board.width) + x - 1;
    for (var i = 0; i < 9; ++i) {
      if (ms_board.board[index] == REVEALED[i]) {
        return true;
      }
    }
    return false; 
  }


  function reveal(ms_board, x, y) {
    const index = ((y - 1) * ms_board.width) + x - 1;
    const adjacent_mines_count = adjacent_mines(ms_board, x, y);
    const width = ms_board.width;
    const height = ms_board.height;
    
    if (tile_revealed(ms_board, x, y) == true) {
      return false;
    } else if (find_mine(ms_board, x, y, ms_board.num_mines) == true) {
      ms_board.board[index] = MINE;
      return false;
    } else if (0 < adjacent_mines_count && adjacent_mines_count <= 8) {
      ms_board.board[index] = REVEALED[adjacent_mines_count];
      return true;
    } else if (adjacent_mines_count == 0) {
      ms_board.board[index] = REVEALED[adjacent_mines_count];
          
      if ((1 <= (y - 1)) && ((y - 1) <= height)) {
        reveal(ms_board, x, y - 1);
      }
      
      if ((1 <= (y + 1)) && ((y + 1) <= height)) {
       reveal(ms_board, x, y + 1);
      }
      
      if ((1 <= (x - 1)) && ((x - 1) <= width)) {
        reveal(ms_board, x - 1, y);
        
        if ((1 <= (y + 1)) && ((y + 1) <= height)) {
          reveal(ms_board, x - 1, y + 1);
        }
        
        if ((1 <= (y - 1)) && ((y - 1) <= height)) {
          reveal(ms_board, x - 1, y - 1);
        }
      }
      
      if ((1 <= (x + 1)) && ((x + 1) <= width)) {
        reveal(ms_board, x + 1, y);
        
        if ((1 <= (y - 1)) && ((y - 1) <= height)) {
          reveal(ms_board, x + 1, y - 1);
        }
        
        if ((1 <= (y + 1)) && ((y + 1) <= height)) {
          reveal(ms_board, x + 1, y + 1);
        }
      }
      return true;
    } else {
      return false;
    }
  }


  function all_safe_tiles_revealed(ms_board) {
    var safe_tiles_revealed = 1;
    
    for (var i = 1; i <= ms_board.width; ++i) {
      for (var j = 1; j <= ms_board.height; ++j) {
        if (!find_mine(ms_board, i, j, ms_board.num_mines)) {
          safe_tiles_revealed *= tile_revealed(ms_board, i, j);
        }
      }
    }
    return safe_tiles_revealed;
  }
  

  function tile_flagged_or_unrevealed(ms_board, x, y) {
    const index = ((y - 1) * ms_board.width) + x - 1;
    return ((ms_board.board[index] == FLAG) || (ms_board.board[index] == UNREVEALED)); 
  }

  
  function check_mines(ms_board) {
    var mines_unrevealed_or_flagged = 1;
    
    for (var i = 1; i <= ms_board.width; ++i) {
      for (var j = 1; j <= ms_board.height; ++j) {
        if (find_mine(ms_board, i, j, ms_board.num_mines)) {
          mines_unrevealed_or_flagged *= tile_flagged_or_unrevealed(ms_board, i, j);
        }
      }
    }
    return mines_unrevealed_or_flagged;
  }
  

  function game_won(ms_board) {
    return (all_safe_tiles_revealed(ms_board) && check_mines(ms_board)); 
  }

  
  function game_lost(ms_board) {
    for (var i = 1; i <= ms_board.width; ++i) {
      for (var j = 1; j <= ms_board.height; ++j) {
        var index = ((j - 1) * ms_board.width)+ i - 1;
        if (find_mine(ms_board, i, j, ms_board.num_mines) && ms_board.board[index] == MINE) {
          return true;
        }
      }
    }
    return false;
  }

  
  function generate_num(length) {
    var x =  Math.floor(Math.random() * length);
    return x;
  }


  function add_mines(ms_board) {
    array = new int_array();
    
    for (var i = 0; i < ms_board.width * ms_board.height; ++i) {
      array.array_insert_at(i, i);
    } 
    var count = 0;
    var i = 1;   
    
    while (count < ms_board.num_mines) {
      var pos = generate_num(array.len);
      var num = array.array_item_at(pos);
      var j = num + 1;
      var x = (num + 1) % ms_board.width;
      var y = Math.ceil(j / ms_board.width);
      
      if (x == 0) {
          x = ms_board.width;
      }
      
      var index = array.array_index_at(num);
      array.array_remove_at(index);
      ms_board.add_mine(new posn(x, y))
      ++count;
      ++i;
      }
  }
  

  function increment_letter(letter) {
  var char_code = letter.charCodeAt(0);

  if (65 <= char_code && char_code <= 90) {
    return String.fromCharCode(++char_code);
  }
}


  function print_grid(ms_board) {
    var s_array = [];
    var letter = 'A';
    var string = "__|";
    
    for (var i = 0; i < ms_board.width; ++i) {
      var s = '___' + letter;
        string = string.concat(s);
        letter = increment_letter(letter); 
    }
    string = string.concat("___\n");
    s_array.push(string);


    for (var i = 1; i <= ms_board.height; ++i) {
      var s = '\xa0 \xa0' + i.toString() + "  |";
        
        for (var j = 1; j <= ms_board.width; ++j) {
            const index = (i - 1) * ms_board.width + j - 1;
            if (j == 1) {
              s = s + '\xa0' + ms_board.board[index] + '\xa0 \xa0';
            } else {
              s = s + '\xa0 \xa0' + ms_board.board[index] +  '\xa0 \xa0';
            }
        }
        s = s + "\n\n";
        s_array.push(s);
        string = string + s;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = 'Helvetica';
        var w = context.measureText(s_array[0]).width;
        document.getElementById("grid").style.width = w;
    }
    var grid = document.getElementById("grid");
    grid.innerText = string;
}


function x_coordinate(width, letter) {
  var c = 'A';
  var return_val = 0;
  for (var i = 1; i <= width; ++i) {
      if (c == letter) {
          return_val = i;
          break;
      }
      c = increment_letter(c);
  }
  return return_val;
}

var ms_board = new board(0, 0, 0);
var width = 0;
var height = 0;
var mine_count = 0;
var command = '0';
var coordinate = '0';
var width_entered = 0;
var height_entered = 0;
var mine_count_entered = 0;
var command_entered = 0;
var coordinate_entered = 0;


function handle_commands(ms_board) {
  var x = x_coordinate(ms_board.width, coordinate.charAt(0));
  var y = coordinate.charAt(1) - '0';
  if (command == 'f') {
    flag(ms_board, x, y);

  } else if (command == 'r') {
    reveal(ms_board, x, y);
  }

  command_entered = 0;
  coordinate_entered = 0;
  print_grid(ms_board);
  var won = game_won(ms_board);
  var lost = game_lost(ms_board);

  if (won || lost) {
    if (won) {
      document.getElementById("label").innerText = "You Win!\n";
    } else {
      document.getElementById("label").innerText = "You Lose!\n";
    }
    document.getElementById("text_box").disabled = true;
    document.getElementById("button").disabled = true;
  } else {
    document.getElementById("label").innerText = "Enter 'f' to place/remove a flag or 'r' to reveal a tile\n";
  }
}


function button_clicked() {
  var text_box = document.getElementById("text_box");
  text = text_box.value;
  text_box.value = '';

  if (width_entered == 0 && height_entered == 0 && mine_count_entered == 0) {
    width = parseInt(text, 10);
    width_entered = 1;
    document.getElementById("label").innerText = "Enter Height";
    
  } else if (width_entered == 1 && height_entered == 0) {
    height = parseInt(text, 10);
    height_entered = 1;
    document.getElementById("label").innerText = "Enter Mine Count";
  } else if (width_entered == 1 && height_entered == 1 && mine_count_entered == 0) {
    mine_count = parseInt(text, 10);
    mine_count_entered = 1;
    document.getElementById("label").innerText = "Enter 'f' to place/remove a flag or 'r' to reveal a tile\n";
    ms_board.width = width;
    ms_board.height = height;
    ms_board.num_mines = mine_count;
    

    for (var i = 0; i < width * height; ++i) {
      ms_board.add_board(UNREVEALED);
     };

    add_mines(ms_board);
    print_grid(ms_board);  
  } else {
    if (command_entered == 0) {
      command = text;
      command_entered = 1;
      document.getElementById("label").innerText = "Enter coordinate (e.g. A1)\n";
    } else {
      coordinate = text;
      coordinate_entered = 1;
      handle_commands(ms_board);
    }
  }

}

$(document).ready(function() {
  document.getElementById('button').addEventListener('click', button_clicked);
  });
