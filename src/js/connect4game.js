class Connect4Game {
    constructor(gameBoardSelector) {
        this.boardRows = 6;
        this.boardCols = 7;
        this.gameBoardSelector = gameBoardSelector;

        this.createGameBoard();
    }

    createGameBoard() {
        const $gameBoard = $(this.gameBoardSelector);

        for( let row = 0; row < this.boardRows; row++) {
            let $boardRow = $('<tr>').addClass('table-row');

            for(let col = 0; col < this.boardCols; col++) {
                let $boardCol = $('<td>').addClass('table-col table-col-empty');
                $boardRow.append($boardCol);
            }

            $gameBoard.append($boardRow);  
        }
    }
}

export default Connect4Game;