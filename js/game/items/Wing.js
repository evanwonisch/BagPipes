/**
 * Implementiert ein Item (Baustein für das Fahrzeug)
 */
 class Wing extends Item{

    constructor(variant = 0){
        super();

        this.mass = 1;
        this.friction = 10;

        this.strength = 11000;

        this.bodyEdges = [
            new Vector2(-0.1,-0.2).mul(Item.size),
            new Vector2(0,-0.4).mul(Item.size),
            new Vector2(-0.3,-0.6).mul(Item.size),
            new Vector2(0.4,-0.6).mul(Item.size),
            new Vector2(0.1,-0.2).mul(Item.size),

            new Vector2(0.7,-0.2).mul(Item.size),
            new Vector2(0.8,-0.05).mul(Item.size),
            new Vector2(0.7,0.1).mul(Item.size),
            new Vector2(-0.3,0.05).mul(Item.size),
            new Vector2(-1.5,-0.2).mul(Item.size),
        ];
    }

    /**
     * Berechnet die Kräfte, die dieses Item auf das Vehicle ausüben würde
     * @param {Vehicle} vehicle das betreffende Fahrzeug
     * @returns {Vector2} die Kraft
     */
     getVehicleForces(vehicle){
        var phi = vehicle.rigidBody.phi;
        var v_forward = Vector2.fromPolar(phi, 1).dot(vehicle.rigidBody.velocity)
        var v_downward = Vector2.fromPolar(phi - Math.PI / 2, 1).dot(vehicle.rigidBody.velocity)

        var force = new Vector2()

        if(v_forward > 0 && Math.abs(phi) < 1){
            force = force.add(Vector2.fromPolar(phi + Math.PI / 2, (1 - Math.exp(- v_forward / 60)) * 1400))
        }
        if(v_downward > 0){
            force = force.add(Vector2.fromPolar(phi, v_downward * 0.8))
        }

        return force;
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
        ctx.fillStyle = "brown"
        ctx.beginPath();
        ctx.moveTo(this.bodyEdges[0].x, -this.bodyEdges[0].y)
        for(var i = 1; i < this.bodyEdges.length; i++){
            ctx.lineTo(this.bodyEdges[i].x, -this.bodyEdges[i].y)
        }
        ctx.fill();
        ctx.resetTransform();
    }
}