import BezierSet from "./bezier.js";

// Create Desmos calculator
var elt = document.getElementById('calculator');
window.calculator = Desmos.GraphingCalculator(elt, {lockViewport: 0, expressions: 1, expressionsCollapsed: 1, settingsMenu: 1, zoomButtons: 1});

// Set up Desmos functions
calculator.setExpression({id: 'line', secret: 1, latex: 'L\\left(a,b,t\\right)=\\left(1-t\\right)a+tb'});
calculator.setExpression({id: 'bez', secret: 1, latex: 'B_{ez}\\left(a_{1},a_{2},w_{1},w_{2},t\\right)=\\left(1-t\\right)\\left(\\left(1-t\\right)\\left(\\left(1-t\\right)a_{1}+tL\\left(w_{1},a_{1},2\\right)\\right)\\ +t\\left(\\left(1-t\\right)L\\left(w_{1},a_{1},2\\right)+tw_{2}\\right)\\right)+t\\left(\\left(1-t\\right)\\left(\\left(1-t\\right)L\\left(w_{1},a_{1},2\\right)+tw_{2}\\right)+t\\left(\\left(1-t\\right)w_{2}+ta_{2}\\right)\\right)'});
calculator.setExpression({id: 'bez_total', secret: 1, latex: 'B\\left(a,w,t\\right)=\\left(\\sum_{n=\\left[1...\\operatorname{length}\\left(a\\right)-1\\right]}^{\\left[1...\\operatorname{length}\\left(a\\right)-1\\right]}B_{ez}\\left(a\\left[n\\right],a\\left[n+1\\right],w\\left[n\\right],w\\left[n+1\\right],t\\right).x,\\sum_{n=\\left[1...\\operatorname{length}\\left(a\\right)-1\\right]}^{\\left[1...\\operatorname{length}\\left(a\\right)-1\\right]}B_{ez}\\left(a\\left[n\\right],a\\left[n+1\\right],w\\left[n\\right],w\\left[n+1\\right],t\\right).y\\right)'});
calculator.setExpression({id: 'cursor_pt', secret: 1, latex: 'C=\\left(0,0\\right)', color: '#2d70b3', dragMode: Desmos.DragModes.NONE, hidden: true});


// Create listener and point for mouse
window.mousePos = {x:0, y:0};
document.addEventListener('mousemove', function(evt) {
    var rect = elt.getBoundingClientRect();
    var curs = {x: evt.clientX - rect.left, y: evt.clientY - rect.top};
    curs = calculator.pixelsToMath(curs);
    mousePos.x = curs.x.toPrecision(4);
    mousePos.y = curs.y.toPrecision(4);

    calculator.setExpression({
        id: 'cursor_pt',
        latex: `C=\\left(${mousePos.x},${mousePos.y}\\right)`,
        color: '#000000'
    });
});

// Create BezierSet
window.selected = -1;
window.adding = false;

window.B = new BezierSet();

// Add segment when space is pressed
window.typing = false;
document.addEventListener('keydown', function(evt) {
    if (evt.key == ' ' && !typing)
        B.addPoint();
});

/*/ Double check when leaving website
window.onbeforeunload = function() {
    return 'Data may be lost if you leave the page, are you sure?';
};*/