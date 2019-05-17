class Connect4Game {
    constructor(gameBoardSelector) {
        this.boardRows = 6;
        this.boardCols = 7;
        this.gameBoardSelector = gameBoardSelector;

        this.createGameBoard();
        this.addCoinToBoard();
    }

    createGameBoard = () => {
        const $gameBoard = $(this.gameBoardSelector);

        for( let row = 0; row < this.boardRows; row++) {
            let $boardRow = $('<tr>').addClass('board-row');

            for(let col = 0; col < this.boardCols; col++) {
                let $boardCol = $('<td>')
                .addClass('board-col empty')
                .attr('data-board-col', col)
                .attr('data-board-row', row);

                $boardRow.append($boardCol);
            }

            $gameBoard.append($boardRow);  
        }
    }

    getLastEmptyCol = (colIndex) => {
        const columns = $(`.board-col[data-board-col='${colIndex}']`);
        for(let i = columns.length - 1; i >=0; i--) {
            const $column = $(columns[i]);
            if($column.hasClass('empty')) {
                return $column;
            }
        }
    }

    addCoinToBoard = () => {
        const $gameBoard = $(this.gameBoardSelector);
        let that = this;

        $gameBoard.on('mouseenter', '.board-col.empty', function() {
            const colIndex = $(this).data('board-col');
            const $lastEmptyColumn  = that.getLastEmptyCol(colIndex);
            $lastEmptyColumn.addClass('next-yellow');

        });

        $gameBoard.on('mouseleave', '.board-col', function() {
            $('.board-col').removeClass('next-yellow');
        })
    }
}

export default Connect4Game;