/**
 * Modelliert ein wuderschön funkelndes Sternchen <3
 */
class Star{
    constructor(position){
        this.position = position;
        this.time = Math.random() * Math.PI * 2;
        this.alpha = 0.9;
        this.size = 1;
        this.phi = 0;

        this.progressor = (Math.random() - 0.5) * 0.1;
    }
    update(dt){
        this.time += dt + this.progressor
        this.phi = Math.sin(this.time / 9) * Math.PI * 2
        this.size = Math.sin(this.time / 12) ** 2 * 5
    }
    render(ctx, campos = new Vector2()){
        ctx.resetTransform()
        ctx.fillStyle = "rgba(255,200,200,"+ this.alpha + ")"
        ctx.translate(this.position.x - campos.x, -this.position.y + campos.y)
        ctx.rotate(this.phi)
        ctx.fillRect(-this.size / 2, -this.size /2, this.size/2, this.size/2)
        ctx.resetTransform();
    }   
}