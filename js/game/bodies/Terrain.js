/**
 * Modelliert einen Festen Umgebungsblock
 */
class Terrain extends Body{
    constructor(position, normal, width, height, visible = true, color = "brown"){
        super();
        
        this.width = width;
        this.height = height;
        this.visible = visible;
        this.color = color;

        var parts = [];
        var barriers = [
            new CollisionBarrier(new Vector2(), normal, width, height)
        ];
        this.rigidBody = new RigidBody(parts, barriers, position, new Vector2(), 0, 0);
    }

    /**
     * Zeichnet den Körper
     * @param {Context} ctx
     * @param {Vector2} campos Der Sichtversatz
     */
    render(ctx, campos){
        if(this.visible){
            var phi = Math.PI/2 + Math.atan2(this.rigidBody.barriers[0].normal.y, this.rigidBody.barriers[0].normal.x)
            ctx.translate(this.rigidBody.position.x - campos.x, -this.rigidBody.position.y + campos.y)
            ctx.rotate(-phi)
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height)
            ctx.resetTransform();
        }
    }
}