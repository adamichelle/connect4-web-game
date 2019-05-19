import Connect4Game  from "./connect4game.js";

$(function() {
    $('.game-alert').hide();
    const newGame = new Connect4Game('#gameBoard', '#gameStatusBar');
})