/**
 * Implementiert ein Item (Baustein für das Fahrzeug)
 */
 class StoneBox extends Item{

    constructor(variant = 0){
        super();

        this.mass = 5;
        this.friction = 10;

        this.strength = 14000;

        this.bodyEdges = [
            new Vector2(0.5, 0.5).mul(Item.size),
            new Vector2(-0.5, 0.5).mul(Item.size),
            new Vector2(-0.5, -0.5).mul(Item.size),
            new Vector2(0.5, -0.5).mul(Item.size)
        ];
    }

    /**
     * Zeichnet das Item
     * @param {Context} ctx 
     * @param {Vector2} position Mittelpunktsposition
     * @param {number} phi Winkel zur X-Achse 
     * @param {Vector2} campos Sichtversatz 
     */
     render(ctx, position, phi, campos){
        ctx.resetTransform();
        ctx.translate(position.x - campos.x, -position.y + campos.y)
        ctx.rotate(-phi)
        ctx.strokeStyle = "gray"
        ctx.lineWidth = 4;
        ctx.strokeRect(-Item.size/2, -Item.size / 2, Item.size, Item.size)
        ctx.resetTransform();
    }
}