import Connect4Game  from "./connect4game.js";

$(function() {
    $('.game-alert').hide();

    const gameBoardSelector = '#gameBoard';
    const gameStatusBarSelector = '#gameStatusBar';

    const newConnect4Game = new Connect4Game(gameBoardSelector, gameStatusBarSelector);

    $('#restartGame').click(function() {
        newConnect4Game.restartGame();
        $('.game-alert').hide();
    });

    $('#resetGame').click(function() {
        newConnect4Game.restartGame();
    })
})