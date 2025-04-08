document.addEventListener('DOMContentLoaded', () => {
    // --- Global variables ---
    window.container = document.getElementById('circle-container');
    window.svg = document.getElementById('lines-svg');
    window.toggleBtn = document.getElementById('toggleLayoutBtn');
    window.numDots = 13;
    window.dotElements = []; // To store the actual dot DIV elements
    window.dotPositions = []; // To store the current {x, y} coordinates
    window.connections = []; // To store pairs of connected dots {a, b}
    window.currentLayout = 'circle'; // Initial layout

    // --- Constants for calculations ---
    window.centerX = container.offsetWidth / 2;
    window.centerY = container.offsetHeight / 2;
    window.circleRadius = container.offsetWidth / 2 * 0.85; // 85% for padding
    window.minSpiralRadius = container.offsetWidth / 2 * 0.15; // Spiral starts near center
    window.maxSpiralRadius = container.offsetWidth / 2 * 0.85; // Spiral ends near edge
    window.spiralRotations = 1; // How many times the spiral winds

    // --- Initial Setup ---
    createDots();
    calculateAndUpdateLayout(); // Calculate initial positions and place dots
});

function calculateCirclePositions() {
    const positions = [];
    for (let i = 0; i < window.numDots; i++) {
        const angle = (i / window.numDots) * 2 * Math.PI - Math.PI / 2; // Start at top
        const x = window.centerX + window.circleRadius * Math.cos(angle);
        const y = window.centerY + window.circleRadius * Math.sin(angle);
        positions.push({ x, y });
    }
    return positions;
}

function calculateSpiralPositions() {
    const positions = [];
    const totalAngle = window.spiralRotations * 2 * Math.PI; // Total angle covered

    for (let i = 0; i < window.numDots; i++) {
        // Angle increases with each dot
        const angle = (i / (window.numDots - 1)) * totalAngle - Math.PI / 2; // Start near top

        // Radius increases linearly from min to max
        const radius = window.minSpiralRadius +
                       (window.maxSpiralRadius - window.minSpiralRadius) * (i / (window.numDots - 1));

        const x = window.centerX + radius * Math.cos(angle);
        const y = window.centerY + radius * Math.sin(angle);
        positions.push({ x, y });
    }
    return positions;
}

// --- Create Dot DOM Elements ---
function createDots() {
    for (let i = 0; i < window.numDots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot'); // Add number (1-based index)
        dot.textContent = i;
        dot.dataset.index = i; // Store 1-based index
        window.container.appendChild(dot);
        window.dotElements.push(dot); // Store the element reference
    }
}

// --- Update Dot Positions on Screen ---
function updateDotPositions(positions) {
    window.dotPositions = positions; // Store the new calculated positions
    window.dotElements.forEach((dot, i) => {
        if (positions[i]) {
            dot.style.left = `${positions[i].x}px`;
            dot.style.top = `${positions[i].y}px`;
        }
    });
}

// --- Clear All Lines from SVG ---
function clearSvgLines() {
    while (window.svg.firstChild) {
        window.svg.removeChild(window.svg.firstChild);
    }
}

// --- Redraw All Stored Connections ---
function redrawLines() {
    clearSvgLines(); // Clear existing lines first

    if (!window.dotPositions || window.dotPositions.length === 0) return;

    window.connections.forEach(conn => {
        const posA = window.dotPositions[conn.a]; // Get current pos (1-based to 0-based index)
        const posB = window.dotPositions[conn.b];

        if (posA && posB) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', posA.x);
            line.setAttribute('y1', posA.y);
            line.setAttribute('x2', posB.x);
            line.setAttribute('y2', posB.y);
            line.classList.add('arcane-line'); // Apply styling
            window.svg.appendChild(line);
        }
    });
}

// --- Add a Connection ---
// Changed: Now just manages the connections array and triggers redraw
function addConnection(a, b) {
    // Validate input
    if (a < 0 || a > window.numDots || b < 0 || b > window.numDots || a === b) {
        console.warn("Invalid connection attempt:", a, b);
        return;
    }

    // Ensure consistent order (optional, prevents duplicate {1,5} and {5,1})
    const start = Math.min(a, b);
    const end = Math.max(a, b);

    // Check if connection already exists
    const exists = window.connections.some(conn => conn.a === start && conn.b === end);

    if (!exists) {
        window.connections.push({ a: start, b: end });
        redrawLines(); // Redraw all lines including the new one
    } else {
        console.log(`Connection between ${start} and ${end} already exists.`);
        // Optional: implement toggle - remove connection if it exists
        // window.connections = window.connections.filter(conn => !(conn.a === start && conn.b === end));
        // redrawLines();
    }
}


// --- Toggle Layout ---
function toggleLayout() {
    if (window.currentLayout === 'circle') {
        window.currentLayout = 'spiral';
        window.toggleBtn.textContent = 'Toggle Layout (Spiral)';
    } else {
        window.currentLayout = 'circle';
        window.toggleBtn.textContent = 'Toggle Layout (Circle)';
    }
    calculateAndUpdateLayout(); // Recalculate, update dots, redraw lines
}

// --- Calculate Positions based on Current Layout and Update ---
function calculateAndUpdateLayout() {
    let newPositions;
    if (window.currentLayout === 'circle') {
        newPositions = calculateCirclePositions();
    } else {
        newPositions = calculateSpiralPositions();
    }
    updateDotPositions(newPositions); // Move the dots smoothly (due to CSS transition)
    redrawLines(); // Redraw lines based on new positions
}


// --- Button Click Handlers ---
function connectDotsFromInput() {
    const dotA = parseInt(document.getElementById('dotA').value);
    const dotB = parseInt(document.getElementById('dotB').value);
    addConnection(dotA, dotB); // Use the new connection function
}

function clearAllLines() {
    window.connections = []; // Clear the stored connections
    clearSvgLines(); // Clear the visual lines
}

function correctLength(lis,length) {
    while(lis.length<length) {
        lis = ["0"].concat(lis);
    }
    return lis
}


// Number(document.getElementById('School').value).toString(2)

function writeSpell() {
    //Define the connection matrix
    let con_mat = {0:[],1:[],2:[],3:[],4:[],5:[]};
    function correctID(id,length) {
        return correctLength(Number(document.getElementById(id).value).toString(2).split(""),length);
    }
    con_mat[0] = correctID("Level",13);
    con_mat[1] = correctID("School",13);
    con_mat[2] = correctID("DamageType",4).concat(correctID("DamageDie",3).concat(correctID("DiceNumber",6)));
    con_mat[3] = correctID("AreaType",3).concat(correctID("AreaSize",10));
    con_mat[4] = correctID("Range",13);
    con_mat[5] = correctID("DurationUnit",2).concat(correctID("DurationNumber",11));

    clearAllLines();
    let i=0;
    while(i<Object.keys(con_mat).length){
        let j = 0;
        console.log("Skip: "+i.toString(10))
        while(j<13){
            console.log(con_mat[i][j]);
            if(con_mat[i][j]=="1"){
                let a;
                if(j+i+1>12){
                    a=j+i+1-13;
                }else {
                    a = j+i+1;
                }
                console.log([j,a]);
                addConnection(j,a)
            }
            j = j+1;
        }
        i = i+1;
    }

    return con_mat;

}