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

        const isthereATie = this.checkForATie();
        if(isthereATie) {
            alert('game is tied');
            return;
        }

        if($coinSlot.hasClass('empty')){
            const colIndex = $coinSlot.data('board-col');
            const $lastEmptyCoinSlotInColumn = this.getLastEmptySlotInColumn(colIndex);
            $lastEmptyCoinSlotInColumn.removeClass(`empty next-${this._player.color}`);
            $lastEmptyCoinSlotInColumn.addClass(this._player.color);
            $lastEmptyCoinSlotInColumn.data('player', this._player.player)
        
            const currentRowIndex = $lastEmptyCoinSlotInColumn.data('board-row');
            const currentColIndex = $lastEmptyCoinSlotInColumn.data('board-col');

            
            const winner = this.checkForWinner(currentRowIndex, currentColIndex);
            if(winner) {
                alert(`Player ${winner.player} wins!`);
                this.endGame('game won');
                return;
            }

            this._player.player = (this._player.player === '1') ? '2' : '1';
            this._player.color = (this._player.color === 'yellow') ? 'red': 'yellow';
            this._playerTurnMessage = `Player ${this._player.player}, Please select a coin spot`;
            this.setGameStatusIndicator(this._player, this._playerTurnMessage);

            $(this).trigger('mouseenter');
        }
    }

    checkForWinner = (currentRowIndex, currentColIndex) => {
        const directions = {
            "vertically": {
                "up": [-1, 0],
                "down": [1, 0]
            },
            "horizontally": {
                "left": [0, -1],
                "right": [0, 1]
            },
            "diagonallyFromTLtoBR": {
                "foward": [1, 1],
                "backward": [-1, -1]
            },
            "diagonallyFromBRtoTL": {
                "foward": [-1, 1],
                "backward": [1, -1]
            }
        }

        return (
            this.checkPossibleWinOutcomes('vertically', directions.vertically.up, directions.vertically.down, currentRowIndex, currentColIndex) ||
            this.checkPossibleWinOutcomes('horizontally', directions.horizontally.left, directions.horizontally.right, currentRowIndex, currentColIndex) ||
            this.checkPossibleWinOutcomes('diagonallyFromTLtoBR', directions.diagonallyFromTLtoBR.foward, directions.diagonallyFromTLtoBR.backward, currentRowIndex, currentColIndex) ||
            this.checkPossibleWinOutcomes('diagonallyFromBRtoTL', directions.diagonallyFromBRtoTL.foward, directions.diagonallyFromBRtoTL.backward, currentRowIndex, currentColIndex)
        )
    }

    checkPossibleWinOutcomes = (outcome, direction1, direction2, cRowIndex, cColIndex) => {
        const chainLength = 1 + this.checkDirection(direction1, cRowIndex, cColIndex) + this.checkDirection(direction2, cRowIndex, cColIndex);

        if(chainLength >= 4) {
            return this._player;
        } else {
            return null;
        }
    }

    checkDirection = (direction, cRowIndex, cColIndex) => {
        let sum = 0;
        let i = cRowIndex + direction[0];
        let j = cColIndex + direction[1];
        let $nextSimilarCoinSpot = this.getSimilarCoinSpot(i, j);

        while (i>=0 && i <this._boardRows && j>=0 && j<this._boardCols && 
        $nextSimilarCoinSpot.data('player') === this._player.player) {
            sum++;
            i += direction[0];
            j += direction[1];
            $nextSimilarCoinSpot = this.getSimilarCoinSpot(i, j);
        }
        return sum;
    }

    getSimilarCoinSpot = (i, j) => {
        return $(`.board-col[data-board-row='${i}'][data-board-col='${j}']`);
    }

    endGame = (reason) => {
        if(reason === 'game won') {
            this._gameStatus = 'win';
            const message = `Player ${this._player.player} wins!`;
            this.setGameStatusIndicator(this._player, message);
        }

        $(this._gameBoardSelector).off();
        $('.board-col.empty').css("cursor", "initial");
        this._gameStatus = 'start';
        $('.game-alert').show();
    }

    setGameStatusIndicator = (status, message) => {
        const gameStatusBar = this._gameStatusBarSelector;
        $(`${gameStatusBar}>p`).css('color', `${status.color}`)
        .text(`${message}`)
    }

    checkForATie = () => {
        if(!this.checkForWinner()){
            const noOfEmptySpotsLeft = $('.board-col.empty').length;
            if(noOfEmptySpotsLeft === 0) {
                return true;
            } else {
                return false;
            }
        }
    }
}

export default Connect4Game;