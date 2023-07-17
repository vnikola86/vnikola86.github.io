const obj = document.getElementById("object");
const w = document.getElementById("width");
const h = document.getElementById("height");
const r = document.getElementById("radius");
const c = document.getElementById("color");
const op = document.getElementById("opacity");

const widthRow = document.getElementById("width-row");
const heightRow = document.getElementById("height-row");
const radiusRow = document.getElementById("radius-row");

const reset = document.getElementById("reset");
const submit = document.getElementById("submit");

let object;
let width;
let height;
let radius;
let color;
let opacity;

let div;
let drw;
let divList;


class Design {

    constructor(width, height, borderRadius, color, opacity) {

        this.width = width;
        this.height = height;
        this.borderRadius = borderRadius;
        this.color = color;

        if(opacity==true){ this.opacity = 0.5 } else { this.opacity = 1 }

    }

    draw() {

        div = document.createElement('div');
    
        div.style.width = `${this.width}px`;
        div.style.height = `${this.height}px`;
        div.style.borderRadius = `${this.borderRadius*this.width*0.5}px`;
        div.style.backgroundColor = this.color;
        div.style.opacity = this.opacity;
    
        drw = document.getElementById("drawing");
        drw.appendChild(div);
    }

    
}


class Rectangle extends Design {

    constructor(width, height, color, opacity) {

        super(width, height, 0, color, opacity)
    }

}


class Circle extends Design {
    
    constructor(radius, color, opacity) {

        super(radius*2, radius*2, 1, color, opacity);
    }

}


document.getElementById("object").onchange = function(){

    submit.disabled = false;

    object = obj.value;

    if(object=='rectangle'){ 

        radiusRow.style.top = "67%";

        w.disabled = false;
        h.disabled = false;
        r.disabled = true;


        widthRow.style.visibility = "visible";
        heightRow.style.visibility = "visible";
        radiusRow.style.visibility = "hidden";

    }   else {

        radiusRow.style.top = "0";

        w.disabled = true;
        h.disabled = true;
        r.disabled = false;

        widthRow.style.visibility = "hidden";
        heightRow.style.visibility = "hidden";
        radiusRow.style.visibility = "visible"

    }

 };


function drawObject() {

    if(object=='rectangle'){ 
        
        let rect = new Rectangle (w.value, h.value, c.value, op.checked);

        rect.draw();
    }
    else {
        
        let crcl = new Circle (r.value, c.value, op.checked);

        crcl.draw();
    }
}


submit.addEventListener('click', (e) => {

        e.preventDefault();        

        drawObject()

    });


reset.addEventListener("click", () => {

    divList = document.querySelectorAll("#drawing div");

    divList.forEach((d) => {

        d.parentElement.removeChild(d);
    })

    radiusRow.style.top = "67%";

    widthRow.style.visibility = "visible";
    heightRow.style.visibility = "visible";
    radiusRow.style.visibility = "visible";

    w.disabled = true;
    h.disabled = true;
    r.disabled = true;

    submit.disabled = true;

});