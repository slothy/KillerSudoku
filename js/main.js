document.addEventListener("DOMContentLoaded", function(event)
{
    fillPossibleAndCells();
    createBoard("board");
    addCages(0);
    colourBoard();
    puzzleNo();
});
