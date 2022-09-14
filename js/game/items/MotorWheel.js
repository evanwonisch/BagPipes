/**
 * Implementiert ein Item (Baustein für das Fahrzeug)
 */
 class MotorWheel extends Item{

    constructor(variant = 0){
        super();

        this.mass = 4;
        this.friction = 0.1;

        this.strength = 20000;

        this.function_available = true;

        this.bodyEdges = [];
        for(var i = 0; i < 6; i++){
            this.bodyEdges.push(Vector2.fromPolar(6.28 / 6 * i, Item.size / 2))
        }


        /////////////
        this.active = false;
        this.power = 140;
    }

    /**
     * Ruft die Itemfunktionen auf
     * @param {FunctionButtonManager} fbManager 
     * @param {FunctionButton} functionButton 
     */
    functionCall(fbManager, functionButton){
        this.active = !this.active;
        functionButton.button.setSelect(this.active)
    }

    /**
     * Berechnet die Kräfte, die dieses Item auf das Vehicle ausüben würde
     * @param {Vehicle} vehicle das betreffende Fahrzeug
     * @returns {Vector2} die Kraft
     */
    getVehicleForces(vehicle){

        this.groundContact = vehicle.groundContact;
        this.vehicleSpeed = vehicle.rigidBody.velocity;

        var phi = vehicle.rigidBody.phi;
        if(this.active && vehicle.groundContact && Math.abs(phi) < Math.PI / 2){
            return Vector2.fromPolar(phi, this.power)
        } else{
            return new Vector2()
        }
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
        ctx.fillStyle = "rgb(100,100,100)"
        ctx.beginPath();
        ctx.arc(0, 0, Item.size / 2, 0, 2 * Math.PI)
        ctx.fill();
        ctx.resetTransform();
    }
}