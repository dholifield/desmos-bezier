var elt = document.getElementById('calculator');
var calculator = Desmos.GraphingCalculator(elt, {lockViewport: 1, expressions: 1, settingsMenu: 0, zoomButtons: 0});
calculator.setGraphSettings({xAxisStep: 12, yAxisStep: 12});
calculator.setMathBounds({left: 0, right: 144, bottom: 0, top: 144})

var xvalues = [];
var yvalues = [];

function updateTable () {
    calculator.setExpression({
        id:'points',
        type: 'table',
        columns: [{latex: 'x', values: xvalues}, 
                    {latex: 'y', values: yvalues, 
                    dragMode: Desmos.DragModes.XY, 
                    columnMode: Desmos.ColumnModes.POINTS_AND_LINES, 
                    color: '#000000'}]
    });
}
updateTable();

function inRectangle(point, rect) {
    return (
        point.x >= rect.left &&
        point.x <= rect.right &&
        point.y <= rect.top &&
        point.y >= rect.bottom
    )
}

var mousePos = {x:0, y:0};
document.addEventListener('mousemove', function(evt) {
    mousePos.x = evt.pageX;
    mousePos.y = evt.pageY;
}, false);

document.addEventListener('keyup', function (evt) {
    if (evt.code == "Space") {
        var rect = elt.getBoundingClientRect();
        var x = mousePos.x - rect.left;
        var y = mousePos.y - rect.top;
        // Note, pixelsToMath expects x and y to be referenced to the top left of
        // the calculator's parent container.
        var mathCoordinates = calculator.pixelsToMath({x: x, y: y});

        if (!inRectangle(mathCoordinates, calculator.graphpaperBounds.mathCoordinates)) return;

        x = mathCoordinates.x;
        y = mathCoordinates.y;

        xvalues.push(Math.round(x * 10) / 10);
        yvalues.push(Math.round(y * 10) / 10);

        updateTable();
    }
});

var n = 0;

function drawBezier() {
    calculator.setExpression({
        id:`bezier_pts_${n}`,
        type: 'table',
        columns: [{latex: `x_b_${n}`, values: [20, 20, 50]}, 
                    {latex: `y_b_${n}`, values: [50, 20, 20], 
                    columnMode: Desmos.ColumnModes.POINTS_AND_LINES, 
                    dragMode: "XY", 
                    color: '#000000'}]
    });
    calculator.setExpression({id:`bezier_${n}`, color: '#000000', latex:`((1-t)((1-t)x_b_${n}[1]+tx_b_${n}[2])+t((1-t)x_b_${n}[2]+tx_b_${n}[3]),(1-t)((1-t)y_b_${n}[1]+ty_b_${n}[2])+t((1-t)y_b_${n}[2]+ty_b_${n}[3]))`});
    n = n + 1;
    document.getElementById('rmbz').innerHTML = "Remove Bezier " + n;
}

function removeBezier() {
    n = n <= 0 ? 0 : n - 1;
    calculator.removeExpression({id:`bezier_pts_${n}`});
    calculator.removeExpression({id:`bezier_${n}`});
    document.getElementById('rmbz').innerHTML = "Remove Bezier " + n;
}