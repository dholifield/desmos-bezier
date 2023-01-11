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

var n = 0;

export class Bezier {
    constructor() {
        this.id = n;
        this.color = color_text.value;
        this.name = 'bezier ' + n;
        this.anchor_x = [];
        this.anchor_y = [];
        this.weight_x = [];
        this.weight_y = [];
        // Create the tables
        this.update();
        // Create the bezier curve
        calculator.setExpression({
            id: this.id+'_bez', 
            latex: 'B\\left(\\left(x_{a'+this.id+'},y_{a'+this.id+'}\\right),\\left(x_{w'+this.id+'},y_{w'+this.id+'}\\right),t\\right)',
            color: this.color
        });
        // Create the weight lines
        calculator.setExpression({
            id: this.id+'_lines',
            latex: 'L\\left(\\left(x_{w'+this.id+'},y_{w'+this.id+'}\\right),\\left(x_{a'+this.id+'},y_{a'+this.id+'}\\right),2t\\right)',
            color: '#000000',
            lineOpacity: 0.2,
            lineWidth: 2
        });
        // Create the mirror points
        calculator.setExpression({
            id: this.id+'_m_pts',
            latex: 'L\\left(\\left(x_{w'+this.id+'},y_{w'+this.id+'}\\right),\\left(x_{a'+this.id+'},y_{a'+this.id+'}\\right),2\\right)',
            color: '#000000'
        });
        // Create selection button
        this.button = document.createElement('button');
        this.button.innerHTML = this.name;
        this.button.className = 'bez';
        this.button.onclick = () => {
            B.select(this.id);
        }
        document.body.appendChild(this.button);
    }
    // Set the display name of the curve
    setName(name) {
        if (name.length == 0) {
            alert('please enter a name');
            name_text.value = this.name;
            return;
        }
        this.name = name;
        this.button.innerHTML = this.name;
    }
    // Set the color of the curve and points
    setColor(c) {
        if (c.indexOf('#') == -1) c = '#' + c;
        if (c.length != 4 && c.length != 7) {
            alert('incorrect color format [hex]');
            color_text.value = this.color;
            return;
        }
        this.color = c;
        calculator.setExpression({id: this.id+'_bez', color: this.color});
        this.getPoints();
        this.update();
        //calculator.setExpression({id: 'a'+this.id, type: 'table', columns: [{latex: `x_{${id}}`, values: x}, {latex: `y_{${id}}`, values: y, dragMode: Desmos.DragModes.XY, color: c}]});
    }
    // Gets the points from the Desmos tables
    getPoints() {
        this.anchor_x = calculator.getExpressions().find(e=> e.id == 'a'+this.id).columns[0].values;
        this.anchor_y = calculator.getExpressions().find(e=> e.id == 'a'+this.id).columns[1].values;
        this.weight_x = calculator.getExpressions().find(e=> e.id == 'w'+this.id).columns[0].values;
        this.weight_y = calculator.getExpressions().find(e=> e.id == 'w'+this.id).columns[1].values;
    }
    // Sets the points in the Desmos tables
    update() {
        updateTable('a'+this.id, this.anchor_x, this.anchor_y, this.color);
        updateTable('w'+this.id, this.weight_x, this.weight_y, '#000000');
    }
    // Hides points
    hide() {
        hideTable('a'+this.id);
        hideTable('w'+this.id);
        calculator.setExpression({id: this.id+'_m_pts', hidden: true});
    }
    // Hides the points and lines
    unfocus() {
        this.getPoints();
        hideTable('a'+this.id)
        hideTable('w'+this.id)
        calculator.setExpression({id: this.id+'_lines', hidden: true});
        calculator.setExpression({id: this.id+'_m_pts', hidden: true});
    }
    // Shows the points and lines
    focus() {
        //color_button.style.display = 'inline-block'
        showTable('a'+this.id);
        showTable('w'+this.id);
        calculator.setExpression({id: this.id+'_lines', hidden: false});
        calculator.setExpression({id: this.id+'_m_pts', hidden: false});
        color_text.value = this.color;
        name_text.value = this.name;
    }
    // Add a new point to the end of the curve
    add(ax, ay, wx, wy) {
        this.getPoints();
        this.anchor_x.push(ax);
        this.anchor_y.push(ay);
        this.weight_x.push(wx);
        this.weight_y.push(wy);
        this.update();
    }
    // Remove the last point from the curve
    remove() {
        this.getPoints();
        this.anchor_x.splice(-1,1);
        this.anchor_y.splice(-1,1);
        this.weight_x.splice(-1,1);
        this.weight_y.splice(-1,1);
        this.update();
    }
    // Set last weight point
    setWeight(x, y) {
        this.getPoints();
        this.weight_x[this.weight_x.length-1] = x;
        this.weight_y[this.weight_y.length-1] = y;
        this.update();
    }
    // Finds and adds location of a new point
    addSegment() {
        if (adding) return;
        adding = true;

        this.getPoints();
        if (this.anchor_x.length > 0) {
            this.hide();
            calculator.setExpression({
                id: 'temp_line',
                latex: `L\\left(C,\\left(${this.anchor_x[this.anchor_x.length-1]},${this.anchor_y[this.anchor_y.length-1]}\\right),t\\right)`,
                lineOpacity: 0.2,
                color: '#000000'
            });
        } else {
            calculator.setExpression({
                id: 'temp_pt',
                latex: 't_{mp}=C',
                pointOpacity: 0.4,
                color: '#000000'
            });
        }

        // Create listener for mouse clicks
        document.addEventListener('click', function anchorListener () {
            var graph = calculator.graphpaperBounds.mathCoordinates;
            var point = mousePos;
            if (!(point.x >= graph.left && point.x <= graph.right && point.y >= graph.bottom && point.y <= graph.top)) return
            B.get(selected).add(point.x, point.y, 'C.x', 'C.y');

            // Show lines and points
            calculator.setExpression({
                id: 'temp_line',
                latex: `L\\left(C,\\left(${point.x},${point.y}\\right),2t\\right)`,
                lineOpacity: 0.2,
                color: '#000000'
            });
            calculator.setExpression({
                id: 'temp_pt',
                latex: `L\\left(C,\\left(${point.x},${point.y}\\right),2\\right)`,
                color: '#000000'
            });
            calculator.setExpression({
                id: 'cursor_pt', 
                hidden: false
            });

            // Listener for weight point
            document.addEventListener('click', function weightListener () {
                B.get(selected).setWeight(mousePos.x, mousePos.y);
                B.get(selected).focus();
                // Remove lines and points
                calculator.removeExpression({id: 'temp_line'});
                calculator.removeExpression({id: 'temp_pt'});
                calculator.setExpression({id: 'cursor_pt', hidden: true});
                adding = false;
                document.removeEventListener('click', weightListener);
            });

            document.removeEventListener('click', anchorListener);
        });

    }
    // Deletes the bezier curve
    delete() {
        calculator.removeExpression({id: this.id+'_bez'});
        calculator.removeExpression({id: this.id+'_lines'});
        calculator.removeExpression({id: this.id+'_m_pts'});
        calculator.removeExpression({id: 'a'+this.id});
        calculator.removeExpression({id: 'w'+this.id});
        this.button.remove();
    }
}

export default class BezierSet {
    constructor() {
        this.beziers = [];
    }
    // Gets the kth bezier curve
    get(k) {
        return this.beziers[k];
    }
    // Set the color of the selected bezier curve
    setColor(color) {
        if (selected != -1)
            this.beziers[selected].setColor(color);
    }
    // Set the name of the selected bezier curve
    setName(name) {
        if (selected != -1)
            this.beziers[selected].setName(name);
    }
    // Focuses on the selected bezier curve
    updateFocus() {
        for (let i = 0; i < this.beziers.length; i++) {
            this.beziers[i].unfocus();
        }
        if (selected != -1) {
            this.beziers[selected].focus();
        }
    }
    // Adds a new bezier curve
    addBezier() {
        if (adding) {
            alert('Finish adding the current curve first')
            return;
        }
        let b = new Bezier();
        this.beziers.push(b);
        b.addSegment();
        this.select(n);
        n++;
    }
    // Deletes the selected bezier curve
    removeBezier() {
        if (selected != -1) {
            this.beziers[selected].delete();
            this.beziers.splice(selected, 1);
            selected = -1;
            this.updateFocus();
        } else {
            alert('No curve selected');
        }
        this.deselect();
    }
    // Set selected bezier curve
    select(k) {
        selected = k;
        this.updateFocus();
        name_text.style.display = 'inline-block';
        deselect_button.style.display = 'inline-block';
    }
    // Deselct bezier curve
    deselect() {
        selected = -1;
        this.updateFocus();
        // Hide deselect button
        deselect_button.style.display = 'none';
        name_text.style.display = 'none';
    }
    // Add a new point to the selected bezier curve
    addPoint() {
        if (selected != -1) {
            this.beziers[selected].addSegment();
        } else {
            alert('No curve selected');
        }
    }
    // Remove a point from the selected bezier curve
    removePoint() {
        if (selected != -1) {
            this.beziers[selected].remove();
        } else {
            alert('No curve selected');
        }
    }
}