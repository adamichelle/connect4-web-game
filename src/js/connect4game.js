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
        

        this.createGameBoard();
        this.addCoinToBoard();
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
    }

    addCoinToBoard = () => {
        if(this._gameStatus === 'win') return;

        const $gameBoard = $(this._gameBoardSelector);
        let that = this;

        let playerTurnMessage = `Player ${this._player.player}, Please select a coin spot`;
        that.setGameStatusIndicator(this._player, playerTurnMessage);

        $gameBoard.on('mouseenter', '.board-col.empty', function() {
            const colIndex = $(this).data('board-col');
            const $lastEmptyColumn  = that.getLastEmptySpot(colIndex);
            $lastEmptyColumn.addClass(`next-${that._player.color}`);

        });

        $gameBoard.on('mouseleave', '.board-col', function() {
            $('.board-col').removeClass(`next-${that._player.color}`);
        });

        $gameBoard.on('click', '.board-col.empty', function() {
            const colIndex = $(this).data('board-col');

            const $lastEmptySpot  = that.getLastEmptySpot(colIndex);
            $lastEmptySpot.removeClass(`empty next-${that._player.color}`);
            $lastEmptySpot.addClass(that._player.color);
            $lastEmptySpot.data('player', that._player.player)
        
            const currentRowIndex = $lastEmptySpot.data('board-row');
            const currentColIndex = $lastEmptySpot.data('board-col');

            
            const winner = that.checkForWinner(currentRowIndex, currentColIndex);
            if(winner) {
                alert(`Player ${winner.player} wins!`);
                that.endGame('game won');
                return;
            }

            that._player.player = (that._player.player === '1') ? '2' : '1';
            that._player.color = (that._player.color === 'yellow') ? 'red': 'yellow';
            playerTurnMessage = `Player ${that._player.player}, Please select a coin spot`;
            that.setGameStatusIndicator(that._player, playerTurnMessage);

            $(this).trigger('mouseenter');
        })
    }

    getLastEmptySpot = (colIndex) => {
        const columns = $(`.board-col[data-board-col='${colIndex}']`);
        for(let i = columns.length - 1; i >=0; i--) {
            const $column = $(columns[i]);
            if($column.hasClass('empty')) {
                return $column;
            }
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
        }

        $(this._gameBoardSelector).off();
        $('.board-col.empty').css("cursor", "initial");
        this._gameStatus = 'start';
        
    }

    setGameStatusIndicator = (status, message) => {
        const gameStatusBar = this._gameStatusBarSelector;
        $(`${gameStatusBar}>p`).css('color', `${status.color}`)
        .text(`${message}`)
    }
}

export default Connect4Game;