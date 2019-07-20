window.addEventListener("load", () => {
    p5.disableFriendlyErrors = true;
    window.addEventListener("resize", () => {
        resizeCanvas(windowWidth, windowHeight);
        window.setup();
    });
});

var isFullScreened = false;
function setupFullscreen(canvas) {
    canvas.ondblclick = () => {
        if (isFullScreened) {
            (document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen).call(document);
            isFullScreened = false;
        } else {
            (document.body.requestFullScreen || document.body.webkitRequestFullScreen || document.body.mozRequestFullScreen || document.body.msRequestFullScreen).call(document.body);
            isFullScreened = true;
        }
    }
}

class Shape {
    constructor() {
        this.pos = { x: random() * windowWidth, y: 0 }
    }

    applyProperties() {
        this.newColorProps();
        this.size = { w: random(prop.minSize, prop.maxSize), h: windowHeight };
        this.speed = random(prop.minSpeed, prop.maxSpeed);
        if (random() < .5)
            this.speed = -this.speed;
    }

    newColorProps() {
        this.hue = Math.ceil(random(prop.minHue, prop.maxHue));
        this.alpha = random(prop.minAlpha, prop.maxAlpha);
        this.recalculateColor(0);
    }

    recalculateColor(colorOffset) {
        this.color = color(`hsla(${this.hue + colorOffset}, ${prop.saturation}%, ${prop.brightness}%, ${this.alpha})`);
    }

    draw() {
        fill(this.color);
        rect(this.pos.x, this.pos.y, this.size.w, this.size.h);
    }

    hide() {
        if (this.speed < 0)
            this.pos.x = windowWidth
        else
            this.pos.x = -this.size.w
    }

    outOfSight() {
        return this.pos.x >= windowWidth || this.pos.x < -this.size.w;
    }

    rareUpdate() {
        if (this.outOfSight()) {
            this.applyProperties();
            this.hide();
        }
    }

    update() {
        this.pos.x += this.speed;
    }

    updateAndDraw() {
        this.update();
        this.draw();
    }
}

function applyColors() {
    shapes.forEach(shape => shape.newColorProps());
}

function applyProperties() {
    while (shapes.length < prop.density)
        shapes.push(new Shape());
    while (shapes.length > prop.density)
        shapes.pop();
    shapes.forEach(shape => shape.applyProperties());
}

var shapes = [];
var prop = {
    backgroundColor: undefined,
    volumeMultiplier: 200,
    saturation: 80,
    brightness: 80,
    leaveTraces: true,
    density: 30,
    minSpeed: 0.5,
    maxSpeed: 2,
    minHue: 0,
    maxHue: 360,
    minAlpha: .75,
    maxAlpha: 1,
    minSize: 25,
    maxSize: 200
}

var logMsg = undefined;

function start() {
    window.setup = function () {
        loadWallpaperEngine();
        if (prop["backgroundColor"] == undefined) prop.backgroundColor = color(0);
        noSmooth();
        noStroke();
        resizeCanvas(windowWidth, windowHeight);
        applyProperties();
    }
    window.draw = function () {
        if (!prop.leaveTraces)
            background(prop.backgroundColor);
        shapes.forEach(shape => shape.updateAndDraw());
        if (frameCount % 10 == 0)
            shapes.forEach(shape => shape.rareUpdate());
        if (logMsg) { //This is for debugging porpuses outside the browser
            noStroke();
            fill(255, 255, 255);
            rect(0, 0, width, 50);
            textSize(32);
            fill(0, 0, 0);
            text(logMsg, 5, 35);
        }
    }
    p5Obj = new p5();
}

start();