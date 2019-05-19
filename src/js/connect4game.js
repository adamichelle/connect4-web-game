class Connect4Game {
    constructor(gameBoardSelector, gameStatusBarSelector) {
        this._gameBoardSelector = gameBoardSelector;
        this._boardRows = 6;
        this._boardCols = 7;
        this._player = {
            "player": "1",
            "color": "yellow"
        };
        this._gameStatus = 'start';
        this._gameStatusBarSelector = gameStatusBarSelector;
        this._playerTurnMessage = `Player ${this._player.player}, Please select a coin spot`;
        

        this.createGameBoard();
        
    }

    createGameBoard = () => {
        const $gameBoard = $(this._gameBoardSelector);

        for( let row = 0; row < this._boardRows; row++) {
            let $boardRow = $('<tr>').addClass('board-row');

            for(let col = 0; col < this._boardCols; col++) {
                let $boardCol = $('<td class="text-center">')
                .addClass('board-col empty')
                .attr('data-board-col', col)
                .attr('data-board-row', row);

                $boardRow.append($boardCol);
            }

            $gameBoard.append($boardRow);  
        }

        this.setGameStatusIndicator(this._player, this._playerTurnMessage);
    }

    getLastEmptySlotInColumn = (colIndex) => {
        const columns = $(`.board-col[data-board-col='${colIndex}']`);
        for(let i = columns.length - 1; i >=0; i--) {
            const $column = $(columns[i]);
            if($column.hasClass('empty')) {
                return $column;
            }
        }
    }

    addHover = (coinSlot) => {
        const $coinSlot = $(coinSlot);
        if($coinSlot.hasClass('empty')){
            const colIndex = $coinSlot.data('board-col');
            const $lastEmptyCoinSlotInColumn = this.getLastEmptySlotInColumn(colIndex);
            $lastEmptyCoinSlotInColumn.addClass(`next-${this._player.color}`);
        }
    }

    removeHover = (coinSlot) => {
        const $coinSlot = $(coinSlot);
        if($coinSlot.hasClass('empty')){
            const colIndex = $coinSlot.data('board-col');
            const $lastEmptyCoinSlotInColumn = this.getLastEmptySlotInColumn(colIndex);
            $lastEmptyCoinSlotInColumn.removeClass(`next-${this._player.color}`);
        }
    }

    addCoin = (coinSlot) => {
        const $coinSlot = $(coinSlot);

        if($coinSlot.hasClass('empty')){
            const colIndex = $coinSlot.data('board-col');
            const $lastEmptyCoinSlotInColumn = this.getLastEmptySlotInColumn(colIndex);
            $lastEmptyCoinSlotInColumn.removeClass(`empty next-${this._player.color}`);
            $lastEmptyCoinSlotInColumn.addClass(this._player.color);
            $lastEmptyCoinSlotInColumn.data('player', this._player.player);

            $(this).trigger('mouseenter');
        }
    }

    setGameStatusIndicator = (status, message) => {
        const gameStatusBar = this._gameStatusBarSelector;
        $(`${gameStatusBar}>p`).css('color', `${status.color}`)
        .text(`${message}`)
    }
}

export default Connect4Game;