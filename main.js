
const canvas = document.querySelector(".canvas-1");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight/2;
canvas.width = window.innerWidth/2;

let pointsAmount = 6;
let points = []; 

let paths = [];
let shortestPathLength = Infinity; 
let shortestPathIndex = null;

class Point {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
    }

    draw(){
        // draw blue point
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

// creates connection between 2 points;
const connect = (start, end, color = "darkred") => {
    sx = start.x;
    sy = start.y;
    ex = end.x;
    ey = end.y;
    ctx.beginPath();
    ctx.strokeStyle = `${color}`;
    ctx.lineWidth = 8;
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
}

// Get array of points and blank array to write possible points connections
const possibleConnections = (pointsArr, chooses) => {
    if (pointsArr.length === 0) {
        paths.push(chooses);
    }
    pointsArr.forEach(point => {
        choosesCopy = [...chooses];
        choosesCopy.push(point);
        let arrCopy = [...pointsArr];
        arrCopy.splice(pointsArr.indexOf(point), 1);
        possibleConnections(arrCopy, choosesCopy);
    })
}

// calculate distance between 2 points
const calcDistance = (start, end) => {
    let distance = 0;
    sx = start.x;
    sy = start.y;
    ex = end.x;
    ey = end.y;
    dx = Math.abs(sx - ex);
    dy = Math.abs(sy - ey);
    distance = Math.sqrt(dx*dx + dy*dy);

    return distance;
}

const drawConnections = (path, color = "darkred") => {
    for (let i = 0; i < path.length - 1; i++){
        connect(path[i], path[i+1], color);
        points.forEach(point => point.draw());
    }
}

// draw points and connections between them
const findShortestPath = (paths) => {

    return new Promise(resolve => {

        paths.forEach(path => {
            let pathLength = 0;
            
            setTimeout(() => {
                
                // Clear canvas and draw 
                ctx.clearRect(0,0,canvas.width,canvas.height)
                drawConnections(path)

                // Calculate path
                for (let i = 0; i < path.length - 1; i++){
                    pathLength += calcDistance(path[i], path[i+1]);
                }

                if (shortestPathLength > pathLength) {
                    shortestPathIndex = paths.indexOf(path);
                    shortestPathLength = pathLength;
                }
                
                // Return the shortest path from all possible ones
                if (paths.indexOf(path) === paths.length - 1) {
                    resolve(shortestPathIndex);
                }

            }, 1 * paths.indexOf(path))
        })
    });
}

const init = () => {

    // Create points
    for (let i = 0; i < pointsAmount; i++) {
        points.push(new Point());
    }
    
    // Render possible connections between points
    possibleConnections(points, [])

    // Find shortest path and draw it
    findShortestPath(paths).then(res => {
        const path = paths[res];
        ctx.clearRect(0,0,canvas.width,canvas.height)
        drawConnections(path, "darkgreen")
    })
}

init();
