class Label{
    /**
     * Erzeugt ein Label
     * @param {Vector2} position 
     * @param {String} text 
     * @param {String} color Schriftfarbe
     * @param {number} size Schriftgröße 
     */
    constructor(position, text, color = "black", size = 14, backgroundColor = undefined){
        this.position = position;
        this.text = text;
        this.color = color;
        this.size = size;
        this.backgroundColor = backgroundColor;
    }

    /**
     * Updated das Label
     */
    update(){}

    /**
     * Zeichnet das Label
     * @param {Context} ctx 
     * @param {Vector2} campos
     */
    render(ctx, campos = new Vector2()){

        if(this.backgroundColor){
            ctx.beginPath()
            ctx.arc(this.position.x - campos.x, -this.position.y + campos.y, this.size / 1.5, 0, Math.PI * 2)
            ctx.fillStyle = this.backgroundColor;
            ctx.fill();
        }

        ctx.font = this.size + "px Arial";
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.position.x - campos.x - ctx.measureText(this.text).width / 2, campos.y -this.position.y + ctx.measureText(this.text).actualBoundingBoxAscent / 2);
    }
}