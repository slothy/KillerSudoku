var CELLS = new Array();
var POSSIBLE = new Array();
var COLOURS = ["rgb(255, 231, 76)","rgb(255, 89, 100)","rgb(107, 241, 120)","rgb(53, 167, 255)", "rgb(255, 182, 218)"];
var VALID_KEY_CODES = [49,50,51,52,53,54,55,56,57,97,98,99,100,101,102,103,104,105];
var SUDOKU_VALUES = [1,2,3,4,5,6,7,8,9];                                // An array of all the numbers that should be in a sudoku region
var BOARD_SIZE = 9;                                                     // Width and height of the Sudoku board
var EMPTY = "";                                                         // Empty cell marker
var PUZZLES = [puzzle1,puzzle2];                                       	// An array to hold all of the puzzles in the site
var PUZZLE_POSITION;                                                    // The current position in the puzzles array
var SOLVED_CELL_FLAG = 0;
var ERROR_FLAG = 0;

// The main function to draw the sudoku board
function createBoard(divId)
{
    var mainDiv = document.getElementById(divId);
    var table = document.createElement('table');
    table.setAttribute('id', 'table');
    var tableBody = document.createElement('tbody');
    var cellCounter = 0;
    for (var row = 0; row < BOARD_SIZE; row++)
    {
        var tr = document.createElement('tr');
        for (var col = 0; col < BOARD_SIZE; col++)
        {
            var td = document.createElement('td');
            var div = document.createElement('div');
            var cellID = cellCounter;
            td.setAttribute('id', cellID);
            td.appendChild(div);
            var input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('size', '1');
            input.setAttribute('maxlength', '1');
            input.setAttribute('id', cellID);
            input.setAttribute('onkeyup', 'checkInvalidChars(event,this)');
            td.appendChild(input);
            cellCounter += 1;
            if (row == 2 || row == 5)
            {
                td.style.borderBottom = "4px solid #264653";
            }
            if (col == 2 || col == 5)
            {
                td.style.borderRight = "4px solid #264653";
            }
            if (row == 3 || row == 6)
            {
                td.style.borderTop = "4px solid #264653";
            }
            if (col == 3 || col == 6)
            {
                td.style.borderLeft = "4px solid #264653";
            }
            tr.appendChild(td);
        }
        tableBody.appendChild(tr);
    }
    table.appendChild(tableBody);
    mainDiv.appendChild(table);
}

// Adds the cages to the board and colours each cage appropriately
function addCages(puzzle_no)
{
    var board = document.getElementById('board');
    var tds = board.querySelectorAll('td');
    var inputs = board.querySelectorAll('input');
    puzzle = PUZZLES[puzzle_no];
    var cageCounter = 0;
    for (var i = 0; i < puzzle.length; i++)
    {
        var cells = puzzle[i].squares;
        var sum = puzzle[i].sum;
        var cageClass = "cage" + cageCounter.toString();
        cells.forEach(ea => tds[ea].getElementsByTagName('div')[0].innerHTML = " ");
        tds[cells[0]].getElementsByTagName('div')[0].innerHTML = sum;
        cells.forEach(ea => tds[ea].getElementsByTagName('div')[0].setAttribute('class', cageClass));
        cageCounter += 1;
    }
    PUZZLE_POSITION = puzzle_no;
}

function fillPossibleAndCells()
{
    CELLS.length = 0;
    POSSIBLE.length = 0;
    for (var i = 0; i < 81; i++)
    {
        CELLS.push(0);
    }
    for (var j = 0; j < 81; j++)
    {
        POSSIBLE[j] = new Array();
        POSSIBLE[j] = SUDOKU_VALUES.slice();
    }
}

// Accepts an array of table data indexes, and a background color
function changeColour(cells, bgColour)
{
    var board = document.getElementById('board');
    var tds = board.querySelectorAll('td');
    var inputs = board.querySelectorAll('input');
    cells.forEach(ea => tds[ea].style.backgroundColor = bgColour);
    cells.forEach(ea => inputs[ea].style.backgroundColor = bgColour);
}

// Loads the next puzzle into the addCages method to display on the board
function next()
{
    var newPuzzle = PUZZLE_POSITION + 1
    if (newPuzzle == PUZZLES.length)
    {
        newPuzzle = 0;
    }
    clearBoard();
    addCages(newPuzzle);
    colourBoard();
    var tmp = PUZZLE_POSITION + 1;
    console.log("Puzzle " + tmp + " loaded");
    puzzleNo();
}

// A function that only allows the valid characters 1-9 in the cells and checks to see if they are legal
function checkInvalidChars(event, ob)
{
    var invalidChars = /[^1-9]/gi;
    var key = event.keyCode;
		var possible = possibleValues(CELLS);
    var cell = ob.id;
    var number = ob.value;
    var counter = 0;
    if (invalidChars.test(ob.value))
    {
        ob.value = ob.value.replace(invalidChars, EMPTY);
        $.notify("The character you entered is not valid for Killer Sudoku",{position:"top left",autoHideDelay:9000});
    }
		for (var i = 0; i < VALID_KEY_CODES.length; i++)
		{
				if (key == VALID_KEY_CODES[i])
				{
            for (var j = 0; j < possible[cell].length; j++)
            {
                if (possible[cell][j] == number)
                {
                    getBoardValues();
                    POSSIBLE[cell].length = 0;
                    POSSIBLE[cell].push(number);
                }
                else
                {
                    counter += 1;
                }
                if (counter == possible[cell].length)
                {
                    $.notify(ob.value + " is not a legal number in cell " + ob.id,{position:"top left",autoHideDelay:9000});
                    CELLS[ob.id] = 0;
                    ob.value = EMPTY;
                }
            }
				}
				if (key == 8)
				{
						CELLS[ob.id] = 0;
            var possible2 = possibleValues(CELLS);
            POSSIBLE[ob.id] = possible2[ob.id];
				}
		}
}

// Clears the board and resets it to the original state
function clearBoard()
{
    var board = document.getElementById('board');
    var inputs = board.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++)
    {
        inputs[i].value = EMPTY;
    }
    fillPossibleAndCells();
    console.log("Board and candidates cleared");
}

// Gets all the current values in the input fields and places them in the CELLS array
function getBoardValues()
{
    var board = document.getElementById('board');
    var tds = board.querySelectorAll('td');
    var inputs = board.querySelectorAll('input');
    for (var j = 0; j < CELLS.length; j++)
    {
        CELLS[j] = 0;
    }
    for (var i = 0; i < inputs.length; i++)
    {
				CELLS[i] = inputs[i].value;
    }
}

function colourBoard()
{
    var board = document.getElementById('board');
    var tds = board.querySelectorAll('td');
    var inputs = board.querySelectorAll('input');
    var puzzle = PUZZLES[PUZZLE_POSITION];
    for (var k = 0; k < tds.length; k++)
    {
        tds[k].style.backgroundColor = "";
        inputs[k].style.backgroundColor = "";
    }
    for (var i = 0; i < puzzle.length; i++)
    {
        var coloursCopy = COLOURS.slice();
        var falseColours = [];
        var cage = puzzle[i];
        var cells = cage.squares;
        var surroundingCells = cellsAroundCage(cage);
        for (var j = 0; j < surroundingCells.length; j++)
        {
            if (tds[surroundingCells[j]].style.backgroundColor != "")
            {
                falseColours.push(tds[surroundingCells[j]].style.backgroundColor);
            }
        }
        coloursCopy = coloursCopy.filter( function( el ) { return falseColours.indexOf( el ) < 0; } );
        randomColour = coloursCopy[Math.floor(Math.random() * coloursCopy.length)];
        changeColour(cells, randomColour);
    }
}

function cellsAroundCage(cage)
{
    var cells = cage.squares;
    var surroundingCells = [];
    for (var i = 0; i < cells.length; i++)
    {
        if (returnCage(cells[i]) !== returnCage(cells[i] + 1) && (cells[i] + 1) >= 0 && (cells[i] + 1) <= 80)
        {
            surroundingCells.push(cells[i] + 1);
        }
        if (returnCage(cells[i]) !== returnCage(cells[i] - 1) && (cells[i] - 1) >= 0 && (cells[i] - 1) <= 80)
        {
            surroundingCells.push(cells[i] - 1);
        }
        if (returnCage(cells[i]) !== returnCage(cells[i] - 9) && (cells[i] - 9) >= 0 && (cells[i] - 9) <= 80)
        {
            surroundingCells.push(cells[i] - 9);
        }
        if (returnCage(cells[i]) !== returnCage(cells[i] + 9) && (cells[i] + 9) >= 0 && (cells[i] + 9) <= 80)
        {
            surroundingCells.push(cells[i] + 9);
        }
    }
    return surroundingCells;
}

// Given a sudoku cell number, returns the row number
function returnRow(cell)
{
    return Math.floor(cell / 9);
}

// Given a sudoku cell number, returns the column number
function returnCol(cell)
{
    return cell % 9;
}

// Given a sudoku cell number, returns the 3x3 block
function returnBlock(cell)
{
    return Math.floor(returnRow(cell) / 3) * 3 + Math.floor(returnCol(cell) / 3);
}

// Given a sudoku cell number, return the cage object that cell is a part of
function returnCage(cell)
{
    var puzzle = PUZZLES[PUZZLE_POSITION];
    for (var i = 0; i < puzzle.length; i++)
    {
        var cells = puzzle[i].squares;
        for (var j = 0; j < cells.length; j++)
        {
            if (cell == cells[j])
            {
                return puzzle[i];
            }
        }
    }
}

// Given a number, a row and a sudoku, returns true if the number can be placed in the row
function isPossibleRow(number, row, sudoku)
{
    for (var i = 0; i < 9; i++)
    {
		    if (sudoku[row * 9 + i] == number)
        {
			      return false;
		    }
	  }
	  return true;
}

// Given a number, a column and a sudoku, returns true if the number can be placed in the column
function isPossibleCol(number, col, sudoku)
{
    for (var i = 0; i < 9; i++)
    {
		    if (sudoku[col + 9 * i] == number)
        {
			      return false;
		    }
	  }
	  return true;
}

// Given a number, a 3x3 block and a sudoku, returns true if the number can be placed in the block
function isPossibleBlock(number, block, sudoku)
{
    for (var i = 0; i < 9; i++)
    {
		    if (sudoku[Math.floor(block / 3) * 27 + i % 3 + 9 * Math.floor(i / 3) + 3 * (block % 3)] == number)
        {
			      return false;
		    }
	  }
	  return true;
}

// Given a number, a cage and a sudoku, returns true if the number can be placed in the cage
function isPossibleCage(number, cage, sudoku)
{
    var cellsInCage = cage.squares;
    var sumOfCage = cage.sum;
    if (number >= sumOfCage)
    {
        return false;
    }
    for (var i = 0; i < cellsInCage.length; i++)
    {
        if (sudoku[cellsInCage[i]] == number)
        {
            return false;
        }
    }
    return true;
}

// Given a cell number, a number and a sudoku, returns true if the number can be placed in the cell
function isPossibleNumber(cell, number, sudoku)
{
    var row = returnRow(cell);
		var col = returnCol(cell);
		var block = returnBlock(cell);
    var cage = returnCage(cell);
		return isPossibleRow(number, row, sudoku) && isPossibleCol(number, col, sudoku) && isPossibleBlock(number, block, sudoku) && isPossibleCage(number, cage, sudoku);
}

// Given a set of possible values for Sudoku, an array, a sum you're trying to reach
// and the number of cells in the cage, return all possible cage combinations
function killerCombo(SUDOKU_VALUES, tmpArray, finalArray, target, limit)
{
    var s = 0;
    tmpArray.forEach(function(entry) { s = s + entry; });
    if (s == target)
    {
        if (tmpArray.length == limit)
        {
          finalArray.push(tmpArray);
        }
    }
    if (s >= target)
    {
        return;
    }
    for (var i = 0; i < SUDOKU_VALUES.length; i++)
    {
        n = SUDOKU_VALUES[i];
        var remaining = [];
        var remaining = SUDOKU_VALUES.slice(i + 1);
        var partical_arr = tmpArray.slice();
        partical_arr.push(n);
        killerCombo(remaining, partical_arr, finalArray, target, limit);
    }
}

// Given a sudoku array, returns a two dimension array with all possible values based what is present on the board
function possibleValues(sudoku)
{
    var possible = [];
    var puzzle = PUZZLES[PUZZLE_POSITION];
    for (var i = 0; i < 81; i++)
    {
        possible[i] = new Array();
        if (sudoku[i] == 0)
        {
            for (var j = 0; j < puzzle.length; j++)
            {
                if (returnCage(i) == puzzle[j])
                {
                    var cells = puzzle[j].squares;
                    var sum = puzzle[j].sum;
                    var tmpArray = [];
                    var finalArray = [];
                    var concatArray = [];
                    killerCombo(SUDOKU_VALUES, tmpArray, finalArray, sum, cells.length);
                    for (var k = 0; k < finalArray.length; k++)
                    {
                        concatArray = concatArray.concat(finalArray[k]);
                    }
                    var uniqueArray = concatArray.filter( function(elem, index, self) { return index == self.indexOf(elem); } )
                    for (var l = 0; l < uniqueArray.length; l++)
                    {
                        if (isPossibleNumber(i, uniqueArray[l], sudoku))
                        {
                            possible[i].push(uniqueArray[l]);
                        }
                    }
                }
            }
        }
        else if (isPossibleNumber(i, document.getElementById(i), sudoku))
        {
            possible[i].push(sudoku[i]);
        }
        if (possible[i].length > 1)
        {
          possible[i].sort();
        }
        if (possible[i].length == 0)
        {
            ERROR_FLAG = 1;
        }
    }
    return possible;
}

// This replaces all the contents of the onscreen tds and fills them with the possible values that could go in each cell
function showPossibleValues()
{
    var possible = POSSIBLE.slice();
    var board = document.getElementById('board');
    var tds = board.querySelectorAll('td');
    var inputs = board.querySelectorAll('input');
    for (var i = 0; i < tds.length; i++)
    {
        tds[i].innerHTML = "";
        for (var j = 0; j < possible[i].length; j++)
        {
            tds[i].innerHTML += possible[i][j];
            tds[i].innerHTML += " ";
        }
    }
}

// This replaces all the contents of the onscreen tds and fills them with the original numbers on the sudoku board
function hidePossibleValues(sudoku)
{
    var board = document.getElementById('board');
    var tds = board.querySelectorAll('td');
    var cellCounter = 0;
    for (var j = 0; j < tds.length; j++)
    {
        tds[j].innerHTML = "";
        var div = document.createElement('div');
        var cellID = cellCounter;
        tds[j].setAttribute('id', cellID);
        tds[j].appendChild(div);
        var input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('size', '1');
        input.setAttribute('maxlength', '1');
        input.setAttribute('onkeyup', 'checkInvalidChars(event,this)');
        input.setAttribute('id', cellID);
        input.style.backgroundColor = tds[j].style.backgroundColor;
        tds[j].appendChild(input);
        cellCounter += 1;
    }
    addCages(PUZZLE_POSITION);
    var inputs = board.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++)
    {
        if (sudoku[i] != 0)
        {
            inputs[i].value = sudoku[i];
        }
    }
}

// This checks to see if the checkbox is checked and show or hide the possible values view
function togglePossible(sudoku)
{
    if (document.getElementById("checkbox").checked)
    {
        showPossibleValues();
    }
    else
    {
        hidePossibleValues(sudoku);
    }
}

function puzzleNo()
{
    var tmp = "Puzzle No: ";
    var tmp2 = PUZZLE_POSITION + 1;
    var tmp3 = PUZZLES.length;
    var tmp4 = tmp + tmp2 + " / " + tmp3;
    document.getElementById("puzzleNo").innerHTML = tmp4;
}

// Takes an array of arrays and returns all possible combinations
// Outputs ["acd", "bcd", "azd", "bzd", "ace", "bce", "aze", "bze", "acf", "bcf", "azf", "bzf"]
// From [['a', 'b'], ['c', 'z'], ['d', 'e', 'f']]
function allCombinations(arr)
{
    if (arr.length === 0)
    {
        return [];
    }
    else if (arr.length === 1)
    {
        return arr[0];
    }
    else
    {
        var result = [];
        var allCasesOfRest = allCombinations(arr.slice(1));  // recur with the rest of array
        for (var c in allCasesOfRest)
        {
            for (var i = 0; i < arr[0].length; i++)
            {
                result.push(arr[0][i] + allCasesOfRest[c]);
            }
        }
        return result;
    }
}

function canCageAddUp(cage)
{
    var input = new Array();
    var sum = cage.sum;
    var cells = cage.squares;
    var flag = 1;
    for (var i = 0; i < cells.length; i++)
    {
        input.push(POSSIBLE[cells[i]]);
    }
    var output = allCombinations(input);
    for (var k = 0; k < output.length; k++)
    {
        if (output[k] == sum)
        {
            flag = 0;
            break;
        }
    }
    if (flag == 1)
    {
        return false;
    }
    else
    {
        return true;
    }
}

function howManyCandidatesRow(row, candidate, blockNo)
{
    for (var x in 9)
    {
        var counter = 0;
        for (var i in POSSIBLE)
        {
            if (returnRow(i) == row && returnBlock(i) == x)
            {
                for (j in POSSIBLE[i])
                {
                    if (POSSIBLE[i][j] == candidate)
                    {
                        counter += 1;
                    }
                }
            }
        }
        blockNo = x;
        return counter;
    }
}

function howManyCandidatesCol(col, candidate, blockNo)
{
    for (var x in 9)
    {
        var counter = 0;
        for (var i in POSSIBLE)
        {
            if (returnCol(i) == col && returnBlock(i) == x)
            {
                for (j in POSSIBLE[i])
                {
                    if (POSSIBLE[i][j] == candidate)
                    {
                        counter += 1;
                    }
                }
            }
        }
        blockNo = x;
        return counter;
    }
}

function howManyCandidatesBlockCol(block, candidate, colNo)
{
    for (var x in 9)
    {
        var counter = 0;
        for (var i in POSSIBLE)
        {
            if (returnBlock(i) == block && returnCol(i) == x)
            {
                for (j in POSSIBLE[i])
                {
                    if (POSSIBLE[i][j] == candidate)
                    {
                        counter += 1;
                    }
                }
            }
        }
        colNo = x;
        return counter;
    }
}

function howManyCandidatesBlockRow(block, candidate, rowNo)
{
    for (var x in 9)
    {
        var counter = 0;
        for (var i in POSSIBLE)
        {
            if (returnBlock(i) == block && returnRow(i) == x)
            {
                for (j in POSSIBLE[i])
                {
                    if (POSSIBLE[i][j] == candidate)
                    {
                        counter += 1;
                    }
                }
            }
        }
        rowNo = x;
        return counter;
    }
}

/************************ STRATEGTY METHODS ************************/

function nakedSingles()
{
    var board = document.getElementById('board');
    var tds = board.querySelectorAll('td');
    var inputs = board.querySelectorAll('input');
    for (var i = 0; i < POSSIBLE.length; i++)
    {
        if (POSSIBLE[i].length == 1 && isPossibleNumber(i, POSSIBLE[i][0], CELLS))
        {
            inputs[i].value = POSSIBLE[i][0];
            CELLS[i] = POSSIBLE[i][0];
            SOLVED_CELL_FLAG = 1;
            break;
        }
    }
}

function lastInCage()
{
    var puzzle = PUZZLES[PUZZLE_POSITION];

    for (var i = 0; i < puzzle.length; i++)
    {
        var cells = puzzle[i].squares;
        var sum = puzzle[i].sum;
        var counter = 0;
        var total = 0;
        var threshold = cells.length - 1;
        for (var j = 0; j < cells.length; j++)
        {
            if (POSSIBLE[cells[j]].length == 1)
            {
                counter += 1;
                total += Number(POSSIBLE[cells[j]][0]);
            }
        }
        if (threshold == counter)
        {
            for (var k = 0; k < cells.length; k++)
            {
                if (POSSIBLE[cells[k]].length != 1)
                {
                    var newVal = sum - total;
                    POSSIBLE[cells[k]].length = 0;
                    POSSIBLE[cells[k]].push(newVal);
                    CELLS[cells[j]] = newVal;
                }
            }
        }
    }
}

function lastInRow()
{
    var puzzle = PUZZLES[PUZZLE_POSITION];

    for (var i = 0; i < puzzle.length; i++)
    {
        var counter = 0;
        var total = 0;
        var threshold = 8;
        for (var j = 0; j < 9; j++)
        {
            if (returnRow(i) == j)
            {
                if (POSSIBLE[i].length == 1)
                {
                    counter += 1;
                    total += Number(POSSIBLE[i][0]);
                }
            }
        }
        if (threshold == counter)
        {
            for (var k = 0; k < 9; k++)
            {
                if (returnRow(i) == k)
                {
                    if (POSSIBLE[i].length != 1)
                    {
                        var newVal = sum - total;
                        POSSIBLE[i].length = 0;
                        POSSIBLE[i].push(newVal);
                        CELLS[i] = newVal;
                    }
                }
            }
        }
    }
}

function lastInCol()
{
    var puzzle = PUZZLES[PUZZLE_POSITION];

    for (var i = 0; i < puzzle.length; i++)
    {
        var counter = 0;
        var total = 0;
        var threshold = 8;
        for (var j = 0; j < 9; j++)
        {
            if (returnCol(i) == j)
            {
                if (POSSIBLE[i].length == 1)
                {
                    counter += 1;
                    total += Number(POSSIBLE[i][0]);
                }
            }
        }
        if (threshold == counter)
        {
            for (var k = 0; k < 9; k++)
            {
                if (returnCol(i) == k)
                {
                    if (POSSIBLE[i].length != 1)
                    {
                        var newVal = sum - total;
                        POSSIBLE[i].length = 0;
                        POSSIBLE[i].push(newVal);
                        CELLS[i] = newVal;
                    }
                }
            }
        }
    }
}

function lastInBlock()
{
    var puzzle = PUZZLES[PUZZLE_POSITION];

    for (var i = 0; i < puzzle.length; i++)
    {
        var counter = 0;
        var total = 0;
        var threshold = 8;
        for (var j = 0; j < 9; j++)
        {
            if (returnBlock(i) == j)
            {
                if (POSSIBLE[i].length == 1)
                {
                    counter += 1;
                    total += Number(POSSIBLE[i][0]);
                }
            }
        }
        if (threshold == counter)
        {
            for (var k = 0; k < 9; k++)
            {
                if (returnBlock(i) == k)
                {
                    if (POSSIBLE[i].length != 1)
                    {
                        var newVal = sum - total;
                        POSSIBLE[i].length = 0;
                        POSSIBLE[i].push(newVal);
                        CELLS[i] = newVal;
                    }
                }
            }
        }
    }
}

function killerCombinationsCleanUp()
{
    POSSIBLE = possibleValues(CELLS);
}

function hiddenSingles()
{
    loop:
    for (var i = 0; i < POSSIBLE.length; i++)
    {
        var row = 0;
        var col = 0;
        var block = 0;
        if (POSSIBLE[i].length > 1)
        {
            for (var j = 0; j < POSSIBLE[i].length; j++)
            {
                for (var int1 = 0; int1 < CELLS.length; int1++)
                {
                    if (returnCol(int1) == returnCol(i) && int1 != i && col == 0)
                    {
                        for (var l = 0; l < POSSIBLE[int1].length; l++)
                        {
                            if (POSSIBLE[int1][l] == POSSIBLE[i][j])
                            {
                                col = 1;
                            }
                        }
                    }
                }
                for (var int2 = 0; int2 < CELLS.length; int2++)
                {
                    if (returnRow(int2) == returnRow(i) && int2 != i && row == 0)
                    {
                        for (var m = 0; m < POSSIBLE[int2].length; m++)
                        {
                            if (POSSIBLE[int2][m] == POSSIBLE[i][j])
                            {
                                row = 1;
                            }
                        }
                    }
                }
                for (var int3 = 0; int3 < CELLS.length; int3++)
                {
                    if (returnBlock(int3) == returnBlock(i) && int3 != i && block == 0)
                    {
                        for (var n = 0; n < POSSIBLE[int3].length; n++)
                        {
                            if (POSSIBLE[int3][n] == POSSIBLE[i][j])
                            {
                                block = 1;
                            }
                        }
                    }
                }
                if (row == 0 || col == 0 || block == 0)
                {
                    var tmp = POSSIBLE[i][j];
                    POSSIBLE[i].length = 0;
                    POSSIBLE[i].push(tmp);
                    break loop;
                }
            }
        }
    }
}

function nakedPairs()
{
    for (var i = 0; i < POSSIBLE.length; i++)
    {
        var pair1 = 0;
        var pair2 = 0;
        var pairCell1 = 0;
        var pairCell2 = 0;
        if (POSSIBLE[i].length == 2)
        {
            pair1 = POSSIBLE[i][0];
            pair2 = POSSIBLE[i][1];
            pairCell1 = i;
            for (var j = 0; j < POSSIBLE.length; j++)
            {
                if ( j != i && POSSIBLE[j].length == 2 && (returnRow(i) == returnRow(j) || returnCol(i) == returnCol(j) || returnBlock(i) == returnBlock(j) || returnCage(i) == returnCage(j)) )
                {
                    if (pair1 == POSSIBLE[j][0] && pair2 == POSSIBLE[j][1])
                    {
                        pairCell2 = j;
                        for (var k = 0; k < POSSIBLE.length; k++)
                        {
                            if (k != pairCell1 && k != pairCell2 && ((returnRow(k) == returnRow(pairCell1) && returnRow(k) == returnRow(pairCell2)) || (returnCol(k) == returnCol(pairCell1) && returnCol(k) == returnCol(pairCell2))
                            || (returnBlock(k) == returnBlock(pairCell1) && returnBlock(k) == returnBlock(pairCell2)) || (returnCage(k) == returnCage(pairCell1) && returnCage(k) == returnCage(pairCell2))) )
                            {
                                for (var l = 0; l < POSSIBLE[k].length; l++)
                                {
                                    if (POSSIBLE[k][l] == pair1 || POSSIBLE[k][l] == pair2)
                                    {
                                        var tmp = POSSIBLE[k];
                                        POSSIBLE[k].splice(l, 1);
                                        if (canCageAddUp(returnCage(pairCell1)) == false || canCageAddUp(returnCage(pairCell2)) == false)
                                        {
                                            POSSIBLE[k] = tmp;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function nakedTriples()
{
    for (var i = 0; i < POSSIBLE.length; i++)
    {
        var triple1 = 0;
        var triple2 = 0;
        var triple3 = 0;
        var tripleCell1 = 0;
        var tripleCell2 = 0;
        var tripleCell3 = 0;
        if (POSSIBLE[i].length == 3)
        {
            triple1 = POSSIBLE[i][0];
            triple2 = POSSIBLE[i][1];
            triple3 = POSSIBLE[i][2];
            tripleCell1 = i;
            for (var j = 0; j < POSSIBLE.length; j++)
            {
                if (j != i && (POSSIBLE[j].length == 2 || POSSIBLE[j].length == 3) && (returnRow(i) == returnRow(j) || returnCol(i) == returnCol(j) || returnBlock(i) == returnBlock(j) || returnCage(i) == returnCage(j)))
                {
                    for (var x = 0; x < POSSIBLE[j].length; x++)
                    {
                        var counter = 0;
                        if (POSSIBLE[j][x] == triple1 || POSSIBLE[j][x] == triple2 || POSSIBLE[j][x] == triple3)
                        {
                            counter += 1;
                        }
                    }
                    if (counter == POSSIBLE[j].length)
                    {
                        tripleCell2 = j;
                        for (var k = 0; k < POSSIBLE.length; k++)
                        {
                            if (k != i && k != j && (POSSIBLE[k].length == 2 || POSSIBLE[k].length == 3) && (
                            ( returnRow(tripleCell1) == returnRow(tripleCell2) && returnRow(tripleCell1) == returnRow(k) ) ||
                            ( returnCol(tripleCell1) == returnCol(tripleCell2) && returnCol(tripleCell1) == returnCol(k) ) ||
                            ( returnBlock(tripleCell1) == returnBlock(tripleCell2) && returnBlock(tripleCell1) == returnBlock(k) ) ||
                            ( returnCage(tripleCell1) == returnCage(tripleCell2) && returnCage(tripleCell1) == returnCage(k) )
                            ) )
                            {
                                for (var y = 0; y < POSSIBLE[k].length; y++)
                                {
                                    var counter1 = 0;
                                    if (POSSIBLE[k][y] == triple1 || POSSIBLE[k][y] == triple2 || POSSIBLE[k][y] == triple3)
                                    {
                                        counter1 += 1;
                                    }
                                }
                                if (counter1 == POSSIBLE[k].length)
                                {
                                    tripleCell3 = k;
                                    for (var z = 0; z < POSSIBLE.length; z++)
                                    {
                                        if (z != tripleCell1 && z != tripleCell2 && z != tripleCell3)
                                        {
                                            for (var m = 0; m < POSSIBLE[z].length; m++)
                                            {
                                                if (POSSIBLE[z][m] != triple1 && POSSIBLE[z][m] != triple2 && POSSIBLE[z][m] != triple3)
                                                {
                                                    var tmp = POSSIBLE[z];
                                                    POSSIBLE[z].splice(m, 1);
                                                    if (canCageAddUp(returnCage(tripleCell1)) == false || canCageAddUp(returnCage(tripleCell2)) == false || canCageAddUp(returnCage(tripleCell3)) == false)
                                                    {
                                                        POSSIBLE[z] = tmp;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                break;
                            }
                        }
                    }
                    else
                    {
                        break;
                    }
                }
            }
        }
    }
}

function intersectionRemoval()
{
    for (var i in SUDOKU_VALUES)
    {
        for (var j in 9)
        {
            var blockNo = 0;
            var colNo = 0;
            var rowNo = 0;
            if (howManyCandidatesRow(j, i, blockNo) == 2 || howManyCandidatesRow(j, i, blockNo) == 3)
            {
                for (x in POSSIBLE)
                {
                    if (returnBlock(x) == returnBlock(blockNo))
                    {
                        for (var y in POSSIBLE[x])
                        {
                            if (POSSIBLE[x][y] == i)
                            {
                                POSSIBLE[x].splice(y, 1);
                            }
                        }
                    }
                }
            }
            if (howManyCandidatesCol(j, i, blockNo) == 2 || howManyCandidatesCol(j, i, blockNo) == 3)
            {
                for (a in POSSIBLE)
                {
                    if (returnBlock(a) == returnBlock(blockNo))
                    {
                        for (var b in POSSIBLE[a])
                        {
                            if (POSSIBLE[a][b] == i)
                            {
                                POSSIBLE[a].splice(b, 1);
                            }
                        }
                    }
                }
            }
            if (howManyCandidatesBlockRow(j, i, rowNo) == 2 || howManyCandidatesBlockRow(j, i, rowNo) == 3)
            {
                for (c in POSSIBLE)
                {
                    if (returnRow(c) == returnRow(rowNo))
                    {
                        for (var d in POSSIBLE[c])
                        {
                            if (POSSIBLE[c][d] == i)
                            {
                                cnsole.log(rowNo);
                                POSSIBLE[c].splice(d, 1);
                            }
                        }
                    }
                }
            }
            if (howManyCandidatesBlockCol(j, i, colNo) == 2 || howManyCandidatesBlockCol(j, i, colNo) == 3)
            {
                for (e in POSSIBLE)
                {
                    if (returnCol(e) == returnCol(colNo))
                    {
                        for (var f in POSSIBLE[e])
                        {
                            if (POSSIBLE[e][f] == i)
                            {
                                POSSIBLE[e].splice(f, 1);
                            }
                        }
                    }
                }
            }
        }
    }
}

/******************** MAIN EXECUTION LOOP METHOD ********************/

function hint()
{
    console.log("Starting hint loop...");
    SOLVED_CELL_FLAG = 0;
    var counter = 0;
    while (SOLVED_CELL_FLAG == 0 && ERROR_FLAG == 0 && counter < 20)
    {
        nakedSingles();
        if (SOLVED_CELL_FLAG == 1) break;
        killerCombinationsCleanUp();
        hiddenSingles();
        nakedSingles();
        if (SOLVED_CELL_FLAG == 1) break;
        nakedPairs();
        nakedSingles();
        if (SOLVED_CELL_FLAG == 1) break;
        nakedTriples();
        nakedSingles();
        if (SOLVED_CELL_FLAG == 1) break;
        intersectionRemoval();
        nakedSingles();
        if (SOLVED_CELL_FLAG == 1) break;
        lastInCage();
        nakedSingles();
        if (SOLVED_CELL_FLAG == 1) break;
        lastInRow();
        nakedSingles();
        if (SOLVED_CELL_FLAG == 1) break;
        lastInCol();
        nakedSingles();
        if (SOLVED_CELL_FLAG == 1) break;
        lastInBlock();
        nakedSingles();
        if (SOLVED_CELL_FLAG == 1) break;
        counter += 1;
    }
    if (ERROR_FLAG == 1)
    {
        $.notify("Go back and check previous entries, there's an illegal value somewhere!",{position:"top left",autoHideDelay:9000});
    }
    if (SOLVED_CELL_FLAG == 1)
    {
        $.notify("Solved a Cell!",{position:"top left",className:"success",autoHideDelay:9000});
    }
}
