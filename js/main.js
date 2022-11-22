import BezierSet from "./bezier.js";

// Create Desmos calculator
var elt = document.getElementById('calculator');
window.calculator = Desmos.GraphingCalculator(elt, {lockViewport: 1, expressions: 0, settingsMenu: 0, zoomButtons: 1});
calculator.updateSettings({xAxisStep: 12, yAxisStep: 12});
calculator.setMathBounds({left: 0, right: 144, bottom: 0, top: 144});
calculator.setDefaultState(calculator.getState());

// Set up Desmos functions
calculator.setExpression({id: 'line', latex: 'L\\left(a,b,t\\right)=\\left(1-t\\right)a+tb'});
calculator.setExpression({id: 'bez', latex: 'B\\left(a_{1},a_{2},w_{1},w_{2},t\\right)=\\left(1-t\\right)\\left(\\left(1-t\\right)\\left(\\left(1-t\\right)a_{1}+tL\\left(w_{1},a_{1},2\\right)\\right)\\ +t\\left(\\left(1-t\\right)L\\left(w_{1},a_{1},2\\right)+tw_{2}\\right)\\right)+t\\left(\\left(1-t\\right)\\left(\\left(1-t\\right)L\\left(w_{1},a_{1},2\\right)+tw_{2}\\right)+t\\left(\\left(1-t\\right)w_{2}+ta_{2}\\right)\\right)'});
calculator.setExpression({id: 'bez_total', latex: 'B_{ez}\\left(a,w,t\\right)=\\left(\\sum_{n=\\left[1...\\operatorname{length}\\left(a\\right)-1\\right]}^{\\left[1...\\operatorname{length}\\left(a\\right)-1\\right]}B\\left(a\\left[n\\right],a\\left[n+1\\right],w\\left[n\\right],w\\left[n+1\\right],t\\right).x,\\sum_{n=\\left[1...\\operatorname{length}\\left(a\\right)-1\\right]}^{\\left[1...\\operatorname{length}\\left(a\\right)-1\\right]}B\\left(a\\left[n\\right],a\\left[n+1\\right],w\\left[n\\right],w\\left[n+1\\right],t\\right).y\\right)'});
calculator.setExpression({id: 'end_pts', latex: 'E\\left(a\\right)=a\\left[1,\\operatorname{length}\\left(a\\right)\\right]'});
calculator.setExpression({id: 'cursor_pt', latex: 'C=\\left(0,0\\right)', color: '#2d70b3', dragMode: Desmos.DragModes.NONE, hidden: true});


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
        color: '#2d70b3'
    });
});

// Create BezierSet
window.selected = -1;
window.adding = false;

window.B = new BezierSet();

// Add segment when space is pressed
document.addEventListener('keydown', function(evt) {
    if (evt.key == ' ') {
        B.addPoint();
    }
});

// Deselect button
window.deselect_button = document.createElement('button');
deselect_button.innerHTML = 'deselect';
deselect_button.className = 'deselect';
deselect_button.onclick = () => {
    B.deselect();
}
document.body.appendChild(deselect_button);
deselect_button.style.display = 'none';