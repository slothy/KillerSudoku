document.addEventListener("DOMContentLoaded", function(event)
{
    fillPossibleAndCells();
    createBoard("board");
    addCages(0);
    colourBoard();
    puzzleNo();
    collectionOfUnits();
    console.log("Finished loading page");
});
