import Connect4Game  from "./connect4game.js";

$(function() {
    $('.game-alert').hide();

    const gameBoardSelector = '#gameBoard';
    const gameStatusBarSelector = '#gameStatusBar';

    const newConnect4Game = new Connect4Game(gameBoardSelector, gameStatusBarSelector);
    $(gameBoardSelector).on('mouseenter', '.board-col', function() {
        newConnect4Game.addHover(this);
    });

    $(gameBoardSelector).on('mouseleave', '.board-col', function() {
        newConnect4Game.removeHover(this);
    });
})