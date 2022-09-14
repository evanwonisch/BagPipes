class Button{
    /**
     * Erzeugt eine Schaltfläche
     * @param {Vector2} position 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(position, width, height){
        this.position = position;
        this.width = width;
        this.height = height;
        this.text = "";
        this.callback = undefined;
        this.message = undefined;
        this.backgroundColor = "rgba(200,200,200,1)";
        this.color = "black"
        this.selected = false;

        this.mousePoint = new Vector2();
        this.mouseclicked = false;

        this.texture = undefined;
        this.selectTexture = undefined;

        document.addEventListener("click", e => {
            this.mousePoint.x = e.pageX;
            this.mousePoint.y = -e.pageY;
            this.mouseclicked = true;
            this.date = Date.now();
        })
    }

    /**
     * Fügt den Clicklistener hinzu
     */
    addClickListener(callback, message = undefined){
        this.message = message;
        this.callback = callback;
    }

    /**
     * Fügt eine Textur hinzu
     * @param {Image} texture 
     */
    addTexture(texture, selectTexture = texture){
        this.texture = texture;
        this.selectTexture = selectTexture;
    }

    /**
     * Stellt ein ob der Button als angewählt dargestellt werden soll.
     * @param {boolean} selected 
     */
    setSelect(selected){
        this.selected = selected;
    }

    /**
     * Führt ein Zeitupdate durch
     * @param {Vector2} campos Zeichenversatz
     */
    update(campos = new Vector2()){
        if(this.mouseclicked){
            this.mouseclicked = false;
            if(Math.abs(Date.now() - this.date) < 20){
                if(Math.abs(this.mousePoint.x - this.position.x + campos.x - this.width/2) < this.width/2) { //Innerhalb X
                    if(Math.abs(this.mousePoint.y - this.position.y + this.height/2 + campos.y) < this.height/2) { //Innerhalb X
                        if(this.callback){
                            this.callback(this.message)
                        }
                    }
                }
            }
        }   
    }

    /**
     * Zeichnet den Button
     */
    render(ctx, campos = new Vector2){
        ctx.resetTransform()
        
        if(!this.texture){
            if(!this.selected){
                ctx.fillStyle = this.backgroundColor;
            } else {
                ctx.fillStyle = "rgba(150,150,150,0.7)"
            }
            ctx.fillRect(this.position.x - campos.x, -this.position.y + campos.y, this.width, this.height)
            ctx.font = "14px Arial";
            ctx.fillStyle = this.color
            ctx.fillText(this.text, this.position.x + 5 - campos.x, -this.position.y + this.height / 2 + campos.y);
        } else {
            if(!this.selected){
                ctx.drawImage(this.texture, this.position.x - campos.x, -this.position.y + campos.y, this.width, this.height)
            } else {
                ctx.drawImage(this.selectTexture, this.position.x - campos.x, -this.position.y + campos.y, this.width, this.height)
            }
        }
    }
}