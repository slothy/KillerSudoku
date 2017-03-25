var CELLS = new Array();
var POSSIBLE = new Array();
var COLOURS = ["rgb(255, 231, 76)","rgb(255, 89, 100)","rgb(107, 241, 120)","rgb(53, 167, 255)", "rgb(255, 182, 218)"];
var VALID_KEY_CODES = [49,50,51,52,53,54,55,56,57,97,98,99,100,101,102,103,104,105];
var SUDOKU_VALUES = [1,2,3,4,5,6,7,8,9];                                // An array of all the numbers that should be in a sudoku region
var BOARD_SIZE = 9;                                                     // Width and height of the Sudoku board
var EMPTY = "";                                                         // Empty cell marker
var PUZZLES = [puzzle1,puzzle2];                                       	// An array to hold all of the puzzles in the site
var PUZZLE_POSITION;                                                    // The current position in the puzzles array
var LOOP_COUNTER = 0;
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
        alert("The character you entered is not valid for Killer Sudoku");
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
                    alert(ob.value + " is not a legal number in cell " + ob.id);
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

// Given a row and a sudoku, returns true if it's a legal row
function isCorrectRow(row, sudoku)
{
  	var rightSequence = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
  	var rowTemp = new Array();
  	for (var i = 0; i < 9; i++)
    {
  		rowTemp[i] = sudoku[row * 9 + i];
  	}
  	rowTemp.sort();
  	return rowTemp.join() == rightSequence.join();
}

// Given a column and a sudoku, returns true if it's a legal column
function isCorrectCol(col, sudoku)
{
  	var rightSequence = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
  	var colTemp = new Array();
  	for (var i = 0; i < 9; i++)
    {
  		colTemp[i] = sudoku[col + i * 9];
  	}
  	colTemp.sort();
  	return colTemp.join() == rightSequence.join();
}

// Given a 3x3 block and a sudoku, returns true if it's a legal block
function isCorrectBlock(block, sudoku)
{
  	var rightSequence = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
  	var blockTemp = new Array();
  	for (var i = 0; i < 9; i++)
    {
  		blockTemp[i] = sudoku[Math.floor(block / 3) * 27 + i % 3 + 9 * Math.floor(i / 3) + 3 * (block % 3)];
  	}
  	blockTemp.sort();
  	return blockTemp.join() == rightSequence.join();
}

// Given a cage and a sudoku, returns true if it's a legal cage
function isCorrectCage(cage, sudoku)
{
    var finalArray = [];
    var tmpArray = [];
    var cellsInCage = cage.squares;
    var numbersInCage = [];
    var sumOfCage = cage.sum;
    var fails = 0;
    killerCombo(SUDOKU_VALUES, tmpArray, finalArray, sumOfCage, cellsInCage.length);
    for (var j = 0; j < cellsInCage.length; j++)
    {
        numbersInCage.push(sudoku[cellsInCage[j]]);
    }
    numbersInCage.sort();
    for (var i = 0; i < finalArray.length; i++)
    {
        for (var k = 0; k < finalArray[i].length; k++)
        {
            finalArray[i].sort();
            if (finalArray[i][k] != numbersInCage[k])
            {
                fails += 1;
            }
        }
    }
    return !(fails == finalArray.length);
}

// Given a sudoku, returns true if the sudoku is solved
function isSolvedSudoku(sudoku) {
    var puzzle = PUZZLE[PUZZLE_POSITION];
    for (var j = 0; j < puzzle.length; j++)
    {
        if(!isCorrectCage(puzzle[j], sudoku))
        {
            return false;
        }
    }
  	for (var i = 0; i < 9; i++)
    {
  	    if (!isCorrectBlock(i,sudoku) || !isCorrectRow(i,sudoku) || !isCorrectCol(i,sudoku))
        {
  			     return false;
  	    }
  	}
	  return true;
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

/************************ STRATEGTY METHODS ************************/

function checkForSolvedCells()
{
    console.log("Checking for solved cells");
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
        }
    }
}

function lastNumberInCage()
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

function lastNumberInRow()
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

function lastNumberInCol()
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

function lastNumberInBlock()
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
    console.log("Applying killer combinations and updating possible values");
    POSSIBLE = possibleValues(CELLS);
}

/******************** MAIN EXECUTION LOOP METHOD ********************/

function hint()
{
    console.log("Starting hint loop...");
    LOOP_COUNTER = 0;
    SOLVED_CELL_FLAG = 0;
    ERROR_FLAG = 0;
    while (SOLVED_CELL_FLAG == 0 && LOOP_COUNTER < 7 && ERROR_FLAG != 1)
    {
        killerCombinationsCleanUp();
        if (SOLVED_CELL_FLAG == 1) break;
        LOOP_COUNTER += 1;
        checkForSolvedCells();
        if (SOLVED_CELL_FLAG == 1) break;
        LOOP_COUNTER += 1;
        lastNumberInCage();
        if (SOLVED_CELL_FLAG == 1) break;
        LOOP_COUNTER += 1;
        lastNumberInRow();
        if (SOLVED_CELL_FLAG == 1) break;
        LOOP_COUNTER += 1;
        lastNumberInCol();
        if (SOLVED_CELL_FLAG == 1) break;
        LOOP_COUNTER += 1;
        lastNumberInBlock();
        if (SOLVED_CELL_FLAG == 1) break;
        LOOP_COUNTER += 1;
        checkForSolvedCells();
        if (SOLVED_CELL_FLAG == 1) break;
        LOOP_COUNTER += 1;
    }
    if (ERROR_FLAG == 1)
    {
        alert("Go back and check previous entries, there's an illegal value somewhere!");
    }
}
