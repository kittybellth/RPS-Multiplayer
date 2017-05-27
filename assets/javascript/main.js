$(document).ready(function() {
  
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAycyAo8n2MIFwEaSPo7YTMZxq78qf4TqU",
    authDomain: "rock-paper-scissor-4b757.firebaseapp.com",
    databaseURL: "https://rock-paper-scissor-4b757.firebaseio.com",
    projectId: "rock-paper-scissor-4b757",
    storageBucket: "rock-paper-scissor-4b757.appspot.com",
    messagingSenderId: "3660067449"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// Initialize variable
var playerOne = "";
var playerTwo = "";
var playerScreen = "";
var playerOneWins = 0;
var playerTwoWins = 0;
var choices = ["Rock", "Paper", "Scissors"];
var btnClass = ["btn-primary", "btn-success", "btn-primary"];
var turnCount = 3;
var playerChoiceValue = 0;
var messageID = 0;
var valueOneChoice = 0;
var valueTwoChoice =0;
var playerOneChoice = "";
var playerTwoChoice = "";
var tie = 0;

$(".player-btn").click(function(){
    event.preventDefault();
    if ($(this).attr('id') === "player-one") {
      var nameInput = $(".player-one").val().trim(); 
        if(nameInput !== ""){
          playerOne = nameInput;
          playerScreen = playerOne;
          database.ref().child("players").child("1").set({
            name: playerOne
          });
          console.log("Screen Player is player one");
        } else {
          $(".modal").modal();
          $(".modal-body").text("Please enter your name!");
        };     
    } else if ($(this).attr('id') === "player-two"){
      var nameInput = $(".player-two").val().trim();
        if(nameInput !== ""){
          playerTwo = nameInput;
          playerScreen = playerTwo;
          database.ref().child("players").child(2).set({
            name: playerTwo
          });
          console.log("Screen Player is player two");
        } else {
          $(".modal").modal();
          $(".modal-body").text("Please enter your name!");
        };
    };
});

function displayName() {
  if(playerScreen === playerOne) {
    if(playerOne !== ""){
      $(".player-one-div").text("Hello "+playerOne+"!").children().addClass("invisible");
    } else if (playerOne === ""){
      $(".player-one-div").children().removeClass("invisible");
    };
    if(playerTwo !==""){
      $(".player-two-div").text("Player 2 is "+playerTwo+"!").children().addClass("invisible");
    } else if (playerTwo === ""){
      $(".player-two-div").children().addClass("invisible");
    }

  } else if (playerScreen === playerTwo){
   if(playerOne !== ""){
      $(".player-one-div").text("Player 1 is "+playerOne+"!").children().hide();
    } else if (playerOne === ""){
        $(".player-one-div").children().removeClass("invisible");
    };
    if(playerTwo !==""){
      $(".player-two-div").text("Hello "+playerTwo+"!").children().addClass("invisible");
    } else if (playerTwo == ""){ 
        $(".player-two-div").children().removeClass("invisible");
    }
  }
};

function status() {
  $(".middle-div").text("Status");
  var p1 = $("<p>");
  var p2 = $("<p>");
  p1.addClass("first-p");
  p2.addClass("second-p");
  $(".center-block").empty();
  $(".center-block").append(p1,p2);
    if(playerOne !==""){
      $(".first-p").text(playerOne + " connected");
    }if(playerOne === ""){
      $(".first-p").text("Player 1 disconnected");
    };
     if(playerTwo !== ""){
      $(".second-p").text(playerTwo + " connected");
    }if(playerTwo === ""){
      $(".second-p").text("Player 2 disconnected");
    };
  
};

function startGame() {
    scoreboard();
    
  if (turnCount == 3){ 
    $(".player-one-block").empty();
    $(".player-two-block").empty();
    playerTurn(playerOne, playerTwo, 'player-one-btn', '.player-one-block',
      '.player-one-div', '1', '.player-two-block');
  } else if (turnCount == 2){
    playerTurn(playerTwo, playerOne, 'player-two-btn', '.player-two-block',
      '.player-two-div', '2', '.player-one-block');
  } else if (turnCount == 1) {
    $(".player-one-block").html("<h4>"+playerOneChoice+"</h4");
    $(".player-two-block").html("<h4>"+playerTwoChoice+"</h4>");
      if (valueOneChoice == valueTwoChoice){
          $(".center-block").empty();
          $(".center-block").html("<h2>Tie</2>");
            if(playerScreen === playerOne) {
              database.ref('players').child("2").child("value").remove();
              database.ref('players').child("1").child("value").remove();
              tie++;
              database.ref().child("tie").set(tie);
              turnCount = 3;
              database.ref().child("turn").set(turnCount);        
            };
      } else if ((valueOneChoice - valueTwoChoice + 3) % 3 == 1) {
          $(".center-block").empty();
          $(".center-block").html("<h2>"+playerOne+" Won</2>");
          if (playerScreen === playerOne){
            database.ref('players').child("2").child("value").remove();
            database.ref('players').child("1").child("value").remove();
            
            playerOneWins++;
            database.ref().child("players").child("1").update({
                wins: playerOneWins
            });
            turnCount = 3;
            database.ref().child("turn").set(turnCount);
          }
      } else {
          $(".center-block").empty();
          $(".center-block").html("<h2>"+playerTwo+" Won</2>");
           if (playerScreen === playerTwo){
            database.ref('players').child("2").child("value").remove();
            database.ref('players').child("1").child("value").remove();
            
            playerTwoWins++;
            database.ref().child("players").child("2").update({
                wins: playerTwoWins
            });
            turnCount = 3;
            database.ref().child("turn").set(turnCount);
          }
      }
  }
};

function playerPick (btn,id, blck1) {
  $(btn).on("click", function(event) {
      event.preventDefault();

      playerChoice = $(this).attr("data-name");
      playerChoiceValue = $(this).attr("value");
      $(blck1).empty();
      $(blck1).html("You picked <br> <br> <strong>"+playerChoice+"</strong>");
      
      
      database.ref().child("players").child(id).update({
              choice: playerChoice,
              value: playerChoiceValue
      });
      turnCount--;
      database.ref().child("turn").set(turnCount) 
  });
}

function scoreboard() {
  $(".middle-div").text("Score");
  var p1 = $("<p>");
  var p2 = $("<p>");
  var p3 = $("<p>");
  p1.addClass("first-p");
  p2.addClass("second-p");
  p3.addClass("third-p");
  $(".center-block").empty();
  $(".center-block").append(p1,p2,p3);
  $(".first-p").text(playerOne+" Wins: "+ playerOneWins);
  $(".second-p").text(playerTwo+" Wins: "+ playerTwoWins);
  $(".third-p").text("Ties: " + tie);
};

function createBtn(v,c){
  $(c).empty();
  for(i = 0; i < choices.length; i++){
     var btnDiv = $("<div>");
     var choicesBtn = $("<button>");
        btnDiv.append(choicesBtn);
        $(c).append(btnDiv);
     choicesBtn.addClass(v+" btn "+btnClass[i]);
     choicesBtn.attr({"value": (i+1), "data-name": choices[i]});
     choicesBtn.text(choices[i]);
    
  };
};

function playerTurn(numb1, numb2, btn, blck1, div, id, blck2){

  if(playerScreen === numb1){
    $(blck2).empty();
    createBtn(btn, blck1);
    $(div).text("Your turn...");
    playerPick('.'+btn, id, blck1);
  } else if (playerScreen === numb2){
    $(blck1).empty();
    $(blck1).text("Waiting for "+ numb1);
  }  
}

function abledMessager(){
  if(playerScreen === playerOne){
    $("#msg").prop("disabled", false);
    $(".msg-form").prop("disabled", false);
    messager(playerOne);
  }else if(playerScreen === playerTwo) {
    $("#msg").prop("disabled", false);
    $(".msg-form").prop("disabled", false);
    messager(playerTwo);
  }else {
    $("#msg").prop("disabled", true);
    $(".msg-form").prop("disabled", true);
  }
};

function disabledMessager(){
 $("#msg").prop("disabled", true);
 $(".msg-form").prop("disabled", true);
};

disabledMessager();

function messager(player){
  $("#msg").on("click", function(){
    var message = $(".msg-form").val().trim();
    if (message !== ""){
      messageID++;
      database.ref().child("chat").child(messageID).set({
        message: player + ": "+ message
      });
    }
    $(".msg-form").val("");
  });
  
};
function displayMessage() {
  for(x = 0; x < messageID; x++) {
    var messageP = $("<p>");
    var messageText = snapshot.val().chat[x].message;
    messageP.text(messageText);
    $(".message-block").append(messageP);
  }
};

function stopGame(){
  $(".player-one-block").empty();
  $(".player-two-block").empty();
}

database.ref().on("value", function(snapshot){
    var player1 = snapshot.child("players").child("1").exists();
    var player2 = snapshot.child("players").child("2").exists();
    var gameTurn = snapshot.child("turn").exists();
    var gameTie = snapshot.child("tie").exists();
    var gameChat = snapshot.child("chat").exists();
    var player1Wins = snapshot.child("players").child("1").child("wins").exists();
    var player2Wins = snapshot.child("players").child("2").child("wins").exists();
    var player1Value = snapshot.child("players").child("1").child("value").exists();
    var player2Value = snapshot.child("players").child("2").child("value").exists();
    var player1Choice = snapshot.child("players").child("1").child("choice").exists();
    var player2Choice = snapshot.child("players").child("2").child("choice").exists();
      if(player1 && !player2) { 

        playerOne = snapshot.val().players[1].name;
        playerTwo = "";
          status();
          displayName();
          disabledMessager();
          stopGame();
      } else if(player2 && !player1) {

        playerTwo = snapshot.val().players[2].name;
        playerOne = "";
          status();
          displayName();
          disabledMessager();
          stopGame();
      } else if(!player1 && !player2) {

        playerOne = "";
        playerTwo = "";
          status();
          displayName();
          disabledMessager();
          stopGame();
      } else if(player1 && player2){
        playerOne = snapshot.val().players[1].name;
        playerTwo = snapshot.val().players[2].name;    
          displayName();
          if (!gameTurn){
            messageID = 0;
            abledMessager();
            status();
            database.ref().child("turn").set(turnCount);
          };

    } if(gameTurn && player1 && player2){
          turnCount = snapshot.val().turn;
            if(turnCount ==3){
              if(!player1Value && !player2Value){
                  if (gameTie && player1Wins && player2Wins){
                    tie = snapshot.val().tie;
                    playerOneWins = snapshot.val().players[1].wins;
                    playerTwoWins = snapshot.val().players[2].wins;
                      setTimeout(function(){
                        startGame();
                      },2000);
                  } else if (gameTie && player1Wins && !player2Wins){
                    tie = snapshot.val().tie;
                    playerOneWins = snapshot.val().players[1].wins;
                      setTimeout(function(){
                        startGame();
                      },2000);
                  } else if (gameTie && !player1Wins && player2Wins){
                    tie = snapshot.val().tie;
                    playerTwoWins = snapshot.val().players[2].wins;
                      setTimeout(function(){
                        startGame();
                      },2000);
                  } else if (!gameTie && player1Wins && player2Wins){
                    playerOneWins = snapshot.val().players[1].wins;
                    playerTwoWins = snapshot.val().players[2].wins;
                      setTimeout(function(){
                        startGame();
                      },2000);
                  } else if (gameTie && !player1Wins && !player2Wins){
                    tie = snapshot.val().tie;
                      setTimeout(function(){
                        startGame();
                      },2000);
                  } else if (!gameTie && player1Wins && !player2Wins){
                    playerOneWins = snapshot.val().players[1].wins;
                      setTimeout(function(){
                         startGame();
                      },2000);
                  } else if (!gameTie && !player1Wins && player2Wins){
                    playerTwoWins = snapshot.val().players[2].wins;
                      setTimeout(function(){
                         startGame();
                      },2000);
                  } else {
                    tie = 0;
                    playerOneWins = 0;
                    playerTwoWins = 0;
                    setTimeout(function(){
                      startGame();
                    },2000);
                  }
              } 
            } else if(turnCount == 2){
              if(!player2Value || !player2Choice){
                startGame();
              }
            } else if(turnCount == 1) {
                if(player1Value && player2Value && player1Choice && player2Choice){
                  valueOneChoice = snapshot.val().players[1].value;
                  playerOneChoice = snapshot.val().players[1].choice;
                  valueTwoChoice = snapshot.val().players[2].value;
                  playerTwoChoice = snapshot.val().players[2].choice;
                  startGame();
                }
            }
    } if(gameChat){
        messageID = snapshot.val().chat.length -= 1;
          $(".message-block").empty();
            for(x = 0; x < messageID; x++) {
              var messageP = $("<p>");
              var messageText = snapshot.val().chat[x+1].message;
              messageP.text(messageText);
              $(".message-block").append(messageP);
            }
      } else if(!gameChat) {
          $(".message-block").empty();
      }
});
$(window).on("unload", function(){
    if (playerScreen === playerOne) {
      // if(snapshot.child("players").child("1").exists()){
        database.ref('players').child("1").remove();
        database.ref('turn').remove();
        database.ref('tie').remove();
        database.ref('chat').remove();
        database.ref('players').child("2").child("wins").remove();
        database.ref('players').child("2").child("choice").remove();
        database.ref('players').child("2").child("value").remove();
      // }
    } else if (playerScreen === playerTwo) {
      // if(snapshot.child("players").child("2").exists()){
        database.ref('players').child("2").remove();
        database.ref('turn').remove();
        database.ref('tie').remove();
        database.ref('chat').remove();
        database.ref('players').child("1").child("wins").remove();
        database.ref('players').child("1").child("choice").remove();
        database.ref('players').child("1").child("value").remove();
      // }
    }
}); //End window.onload fn

}); //End of document.ready
