// Array of 9 elements to store moves made by each players
var board = [];

// Define constants used for functions later on
var USER = "1";
var AI = "2";
var DRAW = "3";

// Controls how fast the AI reacts (in ms)
var AI_DELAY = 500;

// Contains a list of playable ICON
var AI_ICON
var USER_ICON
var PLAYER_ICON = [
  ['#CC0000', "#FFFFFF", 'fa fa-times'],
  ['#009900', "#FFFFFF", 'fa fa-circle-o'],
  ['#FFCC00', "#FFFFFF", 'fa fa-star-o'],
  ['#FF6600', "#FFFFFF", 'fa fa-sun-o'],
  ['#001655', "#FFFFFF", 'fa fa-moon-o'],
  ['#FF3399', "#FFFFFF", 'fa fa-heart-o'],
  ['#6441a5', "#FFFFFF", 'fa fa-power-off'],
  ['#0066ff', "#FFFFFF", 'fa fa-cloud'],
  ['#663300', "#FFFFFF", 'fa fa-paw'],
  ['#272822', "#FFFFFF", 'fa fa-btc']
];

$("document").ready(function() {

  activateButtons(); // Activate the 9 buttons for tic-tac-toe
  resetGame(); // Start game

});

// Assign .click() events for each buttons
function activateButtons() {
  $("#btn-1").click(function() {
    buttonCallback(0);
  });
  $("#btn-2").click(function() {
    buttonCallback(1);
  });
  $("#btn-3").click(function() {
    buttonCallback(2);
  });
  $("#btn-4").click(function() {
    buttonCallback(3);
  });
  $("#btn-5").click(function() {
    buttonCallback(4);
  });
  $("#btn-6").click(function() {
    buttonCallback(5);
  });
  $("#btn-7").click(function() {
    buttonCallback(6);
  });
  $("#btn-8").click(function() {
    buttonCallback(7);
  });
  $("#btn-9").click(function() {
    buttonCallback(8);
  });
  $("#btn-reset").click(function() {
    resetGame();
  });
}

function buttonCallback(index) {

  disableButtons(); // Disables all buttons
  board[index] = USER; // Updates board array of user's input
  updateDisplay(); // Updates values in board[] to display on the buttons
  $("#status").html("&nbsp;");

  // Checks if USER won
  if (checkWin() != 0)
    return;

  // AI's Turn (Create delay b4 AI make a move)
  var tempIntervalObj = setInterval(function() {

    clearInterval(tempIntervalObj);
    calculateNextMove();
    updateDisplay(); // Updates values in board[] to display on the buttons

    // Checks if AI won
    if (checkWin() != 0)
      return;

    enableButtons(); // Enable buttons that haven't been pressed

  }, AI_DELAY);
}

// Enable buttons that haven't been pressed
function enableButtons() {
  for (var i = 1; i <= 9; i++) {
    // Only enable buttons that haven't been pressed
    if (board[i - 1] == "-") {
      $("#btn-" + i).prop("disabled", false);
      $("#btn-" + i).addClass("hvr-grow");
    }
  }
}

// Disables all buttons
function disableButtons() {
  for (var i = 1; i <= 9; i++) {
    $("#btn-" + i).prop("disabled", true);
    $("#btn-" + i).removeClass("hvr-grow animation");
  }
}

// Resets entire game
function resetGame() {
  board = ["-", "-", "-", "-", "-", "-", "-", "-", "-"]; // resets board 

  USER_ICON = Math.floor(Math.random() * PLAYER_ICON.length)
  AI_ICON = Math.floor(Math.random() * PLAYER_ICON.length)

  // Keep generating a new value if AI_ICON value clashes with USER_ICON's value
  while (AI_ICON == USER_ICON)
    AI_ICON = Math.floor(Math.random() * PLAYER_ICON.length)

  // Randomly selects player to start the game, rounds random f.p. to 1 or 0 
  // IF result == 0, AI starts first & always open with the middle slot
  if (Math.round(Math.random()) == 0) {
    board[4] = AI;
    $("#status").text("AI STARTS FIRST")
  } else
    $("#status").text("PLAYER STARTS FIRST")

  updateDisplay();
  disableButtons();
  enableButtons();
}

// Reads the values in board[] & updates the webpage of the new state
function updateDisplay() {
  for (var i = 1; i <= 9; i++) {
    if (board[i - 1] == USER) {
      $("#btn-" + i).html('<i class="' + PLAYER_ICON[USER_ICON][2] + '"></i>');
      $("#btn-" + i).css("color", PLAYER_ICON[USER_ICON][1]);
      $("#btn-" + i).css("background-color", PLAYER_ICON[USER_ICON][0]);
    } else if (board[i - 1] == AI) {
      $("#btn-" + i).html('<i class="' + PLAYER_ICON[AI_ICON][2] + '"></i>');
      $("#btn-" + i).css("color", PLAYER_ICON[AI_ICON][1]);
      $("#btn-" + i).css("background-color", PLAYER_ICON[AI_ICON][0]);
    } else {
      $("#btn-" + i).text("");
      $("#btn-" + i).css("background-color", "#DDDDDD");
    }
  }
}

// Checks if board has any of the 8 win patterns, return:
// 0    if nobody wins
// USER if user wins
// AI   if AI wins
function checkWin() {

  var winPattern = [board[0] + board[1] + board[2], board[3] + board[4] + board[5], board[6] + board[7] + board[8], // Horizontal 0,1,2
    board[0] + board[3] + board[6], board[1] + board[4] + board[7], board[2] + board[5] + board[8], // Vertical 3,4,5,
    board[0] + board[4] + board[8], board[2] + board[4] + board[6]
  ]; // Diagonal 6,7

  var USER_String = USER + USER + USER; // USER_String == "111"
  var AI_String = AI + AI + AI; // AI_String   == "222"

  for (var i = 0; i < 8; i++) {
    if (winPattern[i] == USER_String) {
      $("#status").text("YOU WON")
      activateWinAnimation(i);
      return USER; // User wins				
    } else if (winPattern[i] == AI_String) {
      $("#status").text("AI WON")
      activateWinAnimation(i);
      return AI; // AI wins			
    }
  }

  if (board.indexOf("-") == -1) {
    $("#status").text("IT'S A DRAW")
    return DRAW; // Draw!				
  }

  return 0;
}

// Algorithm to determine AI's move
function calculateNextMove() {

  // Win: If you have two in a row, play the third to get three in a row.
  // Block: If the opponent has two in a row, play the third to block them.
  // Fork: Create an opportunity where you can win in two ways.
  // Block Opponent's Fork:
  //  Option 1: Create two in a row to force the opponent into defending, as long as it doesn't result in them creating a fork or winning. 
  //	For example, if "X" has a corner, "O" has the center, and "X" has the opposite corner as well, "O" must not play a corner in order to win.
  // (Playing a corner in this scenario creates a fork for "X" to win.)
  // 	Option 2: If there is a configuration where the opponent can fork, block that fork.
  // Center: Play the center.
  // Opposite Corner: If the opponent is in the corner, play the opposite corner.
  // Empty Corner: Play an empty corner.
  // Empty Side: Play an empty side.

  var winPattern = [board[0] + board[1] + board[2], board[3] + board[4] + board[5], board[6] + board[7] + board[8], // Horizontal
    board[0] + board[3] + board[6], board[1] + board[4] + board[7], board[2] + board[5] + board[8], // Vertical
    board[0] + board[4] + board[8], board[2] + board[4] + board[6]
  ]; // Diagonal

  // Contains the index for each pattern in winPattern[]
  var patternIndex = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Horizontal
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Vertical
    [0, 4, 8],
    [2, 4, 6]
  ]; // Diagonal

  // WIN: Check if there's 2 AI in a row
  for (var i = 0; i < 8; i++) {
    if (winPattern[i].replace("-", "") == AI + AI) {
      var tempIndex = winPattern[i].indexOf("-");
      board[patternIndex[i][tempIndex]] = AI;
      return;
    }
  }

  // BLOCK: Check if there's 2 USER in a row
  for (var i = 0; i < 8; i++) {
    if (winPattern[i].replace("-", "") == USER + USER) {
      var tempIndex = winPattern[i].indexOf("-");
      board[patternIndex[i][tempIndex]] = AI;
      return;
    }
  }

  // FORK: Create an opportunity where you can win in two ways.	
  if (board.join().replace("-", "").replace(USER, "").length >= 2) {
    for (var i = 0; i < 9; i++) {
      if (checkWaysToWin(i) > 1) {
        board[i] = AI;
        return;
      }
    }
  }

  // Block Opponent's Fork: Move into an any corner
  if ((board[0] == USER && board[8] == USER) || (board[2] == USER && board[6] == USER)) {
    if ((board[1] + board[3] + board[5] + board[7]).indexOf("-") >= 0) {
      if (board[1] == "-") board[1] = AI;
      else if (board[3] == "-") board[3] = AI;
      else if (board[5] == "-") board[5] = AI;
      else if (board[7] == "-") board[7] = AI;
      return;
    }
  }
  // Move into the corner between the 2 sides
  else if ((board[1] + board[5] == USER + USER) && board[2] == "-") {
    board[2] = AI;
    return;
  } else if ((board[5] + board[7] == USER + USER) && board[8] == "-") {
    board[8] = AI;
    return;
  } else if ((board[7] + board[3] == USER + USER) && board[6] == "-") {
    board[6] = AI;
    return;
  } else if ((board[3] + board[1] == USER + USER) && board[0] == "-") {
    board[0] = AI;
    return;
  }

  // Center: Play the center
  if (board[4] == "-")
    board[4] = AI;
  // Opposite Corner: If the opponent is in the corner, play the opposite corner.
  else if (board[0] == USER && board[8] == "-") board[8] = AI;
  else if (board[2] == USER && board[6] == "-") board[6] = AI;
  else if (board[6] == USER && board[2] == "-") board[2] = AI;
  else if (board[8] == USER && board[0] == "-") board[0] = AI;
  // Empty Corner: Play an empty corner.
  // Empty Side: Play an empty side.
  else {
    // Fills up corners first, followed by sides
    var sequence = [0, 2, 8, 6, 3, 1, 5, 7];
    for (var i = 0; i < 7; i++) {
      if (board[sequence[i]] == "-") {
        board[sequence[i]] = AI;
        return;
      }
    }
  }

}

// Test all possible moves the AI can make & choose the move that allow AI to win the most ways (i.e. Determine how to create a FORK)
function checkWaysToWin(index) {

  if (board[index] == "-")
    return 0; // Immediately stops if slot is already occupied
  else
    board[index] == AI; // Test slot & see how many way we could win

  var AI_String = AI + AI + AI; // AI_String   == "222"
  var winCount = 0;
  var winPattern = [board[0] + board[1] + board[2], board[3] + board[4] + board[5], board[6] + board[7] + board[8], // Horizontal
    board[0] + board[3] + board[6], board[1] + board[4] + board[7], board[2] + board[5] + board[8], // Vertical
    board[0] + board[4] + board[8], board[2] + board[4] + board[6]
  ]; // Diagonal

  // Check 8 diff combinations
  for (var i = 0; i < 8; i++) {
    if (winPattern[i] == AI_String)
      winCount++;
  }

  board[index] == "-"; // Change back slot that we tested
  return winCount;
}

// Adds hover.css class to winning tiles
function activateWinAnimation(pattern) {

  var winPatternIndex = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Horizontal 0,1,2
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Vertical 3,4,5,
    [0, 4, 8],
    [2, 4, 6]
  ]; // Diagonal 6,7

  for (var i = 0; i < 3; i++)
    $("#btn-" + (winPatternIndex[pattern][i] + 1)).addClass("animation");
}