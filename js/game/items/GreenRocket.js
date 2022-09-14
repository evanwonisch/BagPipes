/**
 * Implementiert ein Item (Baustein für das Fahrzeug)
 */
 class GreenRocket extends Item{

    constructor(variant = 0){
        super();

        this.mass = 1.4;
        this.friction = 2;

        this.strength = 14000;

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
            new Vector2(Item.size/2 , 0).rotate(normal_alpha),
            new Vector2(Item.size/3 , Item.size/2.4).rotate(normal_alpha),
            new Vector2(-Item.size/2 , Item.size/3).rotate(normal_alpha),
            new Vector2(-Item.size/2 , -Item.size/3).rotate(normal_alpha),
            new Vector2(Item.size/3 , -Item.size/2.4).rotate(normal_alpha)
        ];

        /////////////
        this.active = false;
        this.power = 620;
        this.duration = 17;
        this.dust = new Dust(2);
    }

    /**
     * Ruft die Itemfunktionen auf
     * @param {FunctionButtonManager} fbManager 
     * @param {FunctionButton} functionButton 
     */
    functionCall(fbManager, functionButton){
        this.active = true;
        fbManager.removeFunctionButton(functionButton);
        Sounds.playRocketLong();
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
        if(this.active){
            this.duration -= dt;
        }
        if(this.duration < 0){
            this.active = false;
        }

        this.dust.update(dt);
    }

    /**
     * Zeichnet das Item
     * @param {Context} ctx 
     * @param {Vector2} position Mittelpunktsposition
     * @param {number} phi Winkel zur X-Achse 
     * @param {Vector2} campos Sichtversatz 
     */
     render(ctx, position, phi, campos){
        if(this.active){
            for(var i = 0; i < 15; i++){
                this.dust.insertDust(position.add(Vector2.randomCenter(10)), Vector2.fromPolar(phi + Math.atan2(this.normal.y, this.normal.x), -200).add(Vector2.randomCenter(60)))
            }
        }

        this.dust.render(ctx, campos)

        ctx.resetTransform()
        ctx.beginPath();

        var position_abs = position.add(this.bodyEdges[0].rotate(phi))
        ctx.moveTo(position_abs.x - campos.x, -position_abs.y + campos.y)
        for(var i = 1; i < this.bodyEdges.length; i++){
            position_abs = position.add(this.bodyEdges[i].rotate(phi))
            ctx.lineTo(position_abs.x - campos.x, -position_abs.y + campos.y)
        }
        ctx.fillStyle = "green"
        ctx.fill();
    }
}