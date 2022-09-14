/**
 * Implementiert ein Item (Baustein für das Fahrzeug)
 */
 class Propeller extends Item{

    constructor(variant = 0){
        super();

        this.mass = 1;
        this.friction = 5;

        this.strength = 11000;

        this.function_available = true;

        this.variant = variant % 4;
        switch (variant) {
            case 0:
                this.normal = new Vector2(1,0)
                break;
        
            case 1:
                this.normal = new Vector2(0,1)
                break;

            case 2:
                this.normal = new Vector2(-1,0)
                break;

            case 3:
                this.normal = new Vector2(0,-1)
                break;

            default:
                this.normal = new Vector2(1,0)
                break;
        }

        var normal_alpha = Math.atan2(this.normal.y, this.normal.x)
        this.bodyEdges = [
            new Vector2(0, Item.size/2).rotate(normal_alpha),
            new Vector2(0, -Item.size/2).rotate(normal_alpha),
        ];

        /////////////
        this.active = false;
        this.power = 230;
        this.time = 0;
        this.stretchY = 1;
    }

    /**
     * Ruft die Itemfunktionen auf
     * @param {FunctionButtonManager} fbManager 
     * @param {FunctionButton} functionButton 
     */
    functionCall(fbManager, functionButton){
        this.active = !this.active;
        functionButton.button.setSelect(this.active)
        if(this.active){
            Sounds.startPropeller();
        } else {
            Sounds.stopPropeller();
        }
    }

    /**
     * Berechnet die Kräfte, die dieses Item auf das Vehicle ausüben würde
     * @param {Vehicle} vehicle das betreffende Fahrzeug
     * @returns {Vector2} die Kraft
     */
    getVehicleForces(vehicle){
        var phi = vehicle.rigidBody.phi;
        if(this.active){
            return Vector2.fromPolar(phi + Math.atan2(this.normal.y, this.normal.x), this.power)
        } else{
            return new Vector2()
        }
    }

    /**
     * Führt ein Zeitupdate durch
     * @param {number} dt 
     */
    update(dt){
        this.time += dt;
        if(this.active){
            this.stretchY += (Math.cos(this.time * 10) * 0.5 + 0.5 - this.stretchY) * 0.8
        } else {
            this.stretchY += (1 - this.stretchY) * 0.1
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
        var normal_alpha = this.normal.alpha();
        ctx.resetTransform()
        ctx.translate(position.x - campos.x, -position.y + campos.y)
        ctx.rotate(-phi - normal_alpha)
        ctx.beginPath();
        ctx.ellipse(0,0, 5, Item.size/2 * this.stretchY, 0, 0, Math.PI * 2)
        ctx.fillStyle = "lightgray"
        ctx.fill();
    }
}