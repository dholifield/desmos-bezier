var elt = document.getElementById('calculator');
var calculator = Desmos.GraphingCalculator(elt, {lockViewport: 1, expressions: 0, settingsMenu: 0, zoomButtons: 0});
calculator.setGraphSettings({xAxisStep: 12, yAxisStep: 12});
calculator.setMathBounds({left: 0, right: 144, bottom: 0, top: 144})

calculator.setExpression({id: 'line', latex: 'L\\left(a,b,t\\right)=\\left(1-t\\right)a+tb'});
calculator.setExpression({id: 'bez', latex: 'B\\left(a_{1},a_{2},w_{1},w_{2},t\\right)=\\left(1-t\\right)\\left(\\left(1-t\\right)\\left(\\left(1-t\\right)a_{1}+tL\\left(w_{1},a_{1},2\\right)\\right)\\ +t\\left(\\left(1-t\\right)L\\left(w_{1},a_{1},2\\right)+tw_{2}\\right)\\right)+t\\left(\\left(1-t\\right)\\left(\\left(1-t\\right)L\\left(w_{1},a_{1},2\\right)+tw_{2}\\right)+t\\left(\\left(1-t\\right)w_{2}+ta_{2}\\right)\\right)'});
calculator.setExpression({id: 'bez_total', latex: 'B_{ez}\\left(a,w,t\\right)=\\left(\\sum_{n=\\left[1...\\operatorname{length}\\left(a\\right)-1\\right]}^{\\left[1...\\operatorname{length}\\left(a\\right)-1\\right]}B\\left(a\\left[n\\right],a\\left[n+1\\right],w\\left[n\\right],w\\left[n+1\\right],t\\right).x,\\sum_{n=\\left[1...\\operatorname{length}\\left(a\\right)-1\\right]}^{\\left[1...\\operatorname{length}\\left(a\\right)-1\\right]}B\\left(a\\left[n\\right],a\\left[n+1\\right],w\\left[n\\right],w\\left[n+1\\right],t\\right).y\\right)'});
calculator.setExpression({id: 'end_pts', latex: 'E\\left(a\\right)=\\left(\\sum_{n=\\left[1,\\operatorname{length}\\left(a\\right)\\right]}^{\\left[1,\\operatorname{length}\\left(a\\right)\\right]}a\\left[n\\right].x,\\sum_{n=\\left[1,\\operatorname{length}\\left(a\\right)\\right]}^{\\left[1,\\operatorname{length}\\left(a\\right)\\right]}a\\left[n\\right].y\\right)'});

function updateTable(id, x, y, c) {
    calculator.setExpression({
        id: id,
        type: 'table',
        columns: [{
            latex: `x_{${id}}`, 
            values: x
        }, {
            latex: `y_{${id}}`,
            values: y,
            dragMode: Desmos.DragModes.XY,
            color: c
        }]
    });
}

function hideTable(id) {
    calculator.setExpression({
        id: id,
        type: 'table',
        columns: [{
            latex: `x_{${id}}`
        }, {
            latex: `y_{${id}}`,
            hidden: true
        }]
    });
}

function showTable(id) {
    calculator.setExpression({
        id: id,
        type: 'table',
        columns: [{
            latex: `x_{${id}}`
        }, {
            latex: `y_{${id}}`,
            hidden: false
        }]
    });
}

var n = 1;

class Bezier {
    constructor(id) {
        this.id = id;
        this.anchor_x = ['50', '70', '90'];
        this.anchor_y = ['70', '70', '70'];
        this.weight_x = ['50', '70', '90'];
        this.weight_y = ['90', '90', '90'];
        // Anchor points table
        updateTable(`a${this.id}`, this.anchor_x, this.anchor_y, '#000000');
        // Weight points table
        updateTable(`w${this.id}`, this.weight_x, this.weight_y, '#2d70b3');
        // Bezier curve
        calculator.setExpression({
            id: this.id+'_bez', 
            latex: 'B_{ez}\\left(\\left(x_{a'+this.id+'},y_{a'+this.id+'}\\right),\\left(x_{w'+this.id+'},y_{w'+this.id+'}\\right),t\\right)',
            color: '#000000'
        });
        // Weight lines
        calculator.setExpression({
            id: this.id+'_lines',
            latex: 'L\\left(\\left(x_{w'+this.id+'},y_{w'+this.id+'}\\right),\\left(x_{a'+this.id+'},y_{a'+this.id+'}\\right),2t\\right)',
            color: '#2d70b3',
            lineStyle: Desmos.Styles.DASHED,
            lineOpacity: 0.3,
            lineWidth: 2
        });
        // Mirrored points
        calculator.setExpression({
            id: this.id+'_m_pts',
            latex: 'L\\left(\\left(x_{w'+this.id+'},y_{w'+this.id+'}\\right),\\left(x_{a'+this.id+'},y_{a'+this.id+'}\\right),2\\right)',
            color: '#2d70b3'
        });
        // End points
        calculator.setExpression({
            id: this.id+'_ends',
            latex: 'E\\left(\\left(x_{a'+this.id+'},y_{a'+this.id+'}\\right)\\right)',
            color: '#000000',
            hidden: true
        })
        
    }

    unfocus() {
        hideTable(`a${this.id}`)
        hideTable(`w${this.id}`)
        calculator.setExpression({id: this.id+'_lines', hidden: true});
        calculator.setExpression({id: this.id+'_m_pts', hidden: true});
        calculator.setExpression({id: this.id+'_ends', hidden: false});
    }

    focus() {
        showTable(`a${this.id}`);
        showTable(`w${this.id}`);
        calculator.setExpression({id: this.id+'_lines', hidden: false});
        calculator.setExpression({id: this.id+'_m_pts', hidden: false});
        calculator.setExpression({id: this.id+'_ends', hidden: true});
    }

    add(ax, ay, wx, wy) {
        this.anchor_x.push(ax);
        this.anchor_y.push(ay);
        this.weight_x.push(wx);
        this.weight_y.push(wy);
    }
}

let b1 = new Bezier(n++);

