/**
 * Implementiert ein Item (Baustein für das Fahrzeug)
 */
 class WoodWheel extends Item{

    constructor(variant = 0){
        super();

        this.mass = 2;
        this.friction = 0.09;

        this.strength = 15000;

        this.bodyEdges = [];
        for(var i = 0; i < 6; i++){
            this.bodyEdges.push(Vector2.fromPolar(6.28 / 6 * i, Item.size / 2))
        }
    }

    /**
     * Berechnet die Kräfte, die dieses Item auf das Vehicle ausüben würde
     * @param {Vehicle} vehicle das betreffende Fahrzeug
     * @returns {Vector2} die Kraft
     */
     getVehicleForces(vehicle){
        this.groundContact = vehicle.groundContact;
        this.vehicleSpeed = vehicle.rigidBody.velocity;
        return new Vector2()
    }

    /**
     * Führt ein Zeitupdate durch
     * @param {number} dt 
     */
    update(dt){
        if(this.groundContact && this.vehicleSpeed.norm() > 20){
            Sounds.playRide();
        } else {
            Sounds.stopRide();
        }
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
        ctx.fillStyle = "brown"
        ctx.beginPath();
        ctx.arc(0, 0, Item.size / 2, 0, 2 * Math.PI)
        ctx.fill();
        ctx.resetTransform();
    }
}