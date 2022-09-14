/**
 * Modelliert ein Fahrzeug
 */
class Vehicle extends Body{
    constructor(position, items, g = 120){
        super();

        this.g = g;
        this.items = items;

        var bodyParts = []
        this.items.forEach(item => {
            var gridX = item.gridX;
            var gridY = item.gridY

            var centerCoordinates = new Vector2(gridX, gridY).mul(Item.space + Item.size).add(new Vector2(Item.size / 2, Item.size / 2))
            item.bodyEdges.forEach(edge => {
                var absolute = centerCoordinates.add(edge)
                var rigidBodyPart = new RigidBodyPart(item.mass / item.bodyEdges.length, absolute, item.friction)
                rigidBodyPart.linkedItem = item;
                item.linkedRigidBodyParts.push(rigidBodyPart)
                bodyParts.push(rigidBodyPart)
            })
        })
        this.rigidBody = new RigidBody(bodyParts, [], position, new Vector2())

        //Funktionsbuttons für Items
        this.fbManager = new FunctionButtonManager(new Vector2(document.body.clientWidth / 2 - 50, -3 * document.body.clientHeight / 4))
        this.items.forEach(item => {
            this.fbManager.addFunction(item)
        })

        this.groundContact = false;

        //Übergeordetes Level
        this.level = undefined;
    }


    /**
     * Interagiert mit dem gegebenen Körper
     * @param {Body} body 
     */
    interactBody(body){
        if(body instanceof Terrain){
            this.rigidBody.parts.forEach(part => {
                var force = body.rigidBody.barriers[0].getForce(part, this.g, 0.13, 10, part.friction, 0)
                if(force.norm() > 0){
                    this.groundContact = true;
                }
                if(force.norm() > 5000){
                    Sounds.playHit();
                }
                if(force.norm() > part.linkedItem.strength){
                    this.crack(part);
                }
                part.addForce(force)
            })
        }
    }

    /**
     * Das Fahrzeug zerbricht
     * @param {RigidBodyPart} part der Teil des Fahrzeugs an dem es bricht
     */
    crack(part) {

        Sounds.playCrash();

        var gridX = part.linkedItem.gridX;
        var gridY = part.linkedItem.gridY;

        var breakeItem = this.items.find(item => item.gridX == gridX && item.gridY == gridY)
        if(breakeItem){
            var dummy = new DummyVehicle(this.rigidBody.position.add(Vector2.randomCenter(60)), this.rigidBody.velocity.add(Vector2.randomCenter(80)), [breakeItem])
            this.level.addBody(dummy)
            this.items = this.items.filter(e => e != breakeItem)
            this.fbManager.removeItem(breakeItem)
            this.rigidBody.parts = this.rigidBody.parts.filter(part => {
                return !breakeItem.linkedRigidBodyParts.includes(part)
            })
        }

        if(this.rigidBody.parts.length == 0){
            this.rigidBody.velocity = new Vector2()
        }
    }


    /**
     * Führt ein Zeitupdate durch
     * @param {number} dt 
     */
    update(dt){
        this.fbManager.update()

        this.items.forEach(i => {
            i.update(dt);
        })
        
        this.rigidBody.update(dt)

        //Gravitation
        this.rigidBody.addForce(new Vector2(0, -this.g * this.rigidBody.mass), new Vector2(0, 0))

        //Luftreibung
        this.rigidBody.parts.forEach(part => {
            part.addForce(part.velocity.mul(-0.015))
        })

        //Kräfte druch items
        this.items.forEach(item => {
            var itemForce = item.getVehicleForces(this)
            var itemPosition_rel = new Vector2(item.gridX, item.gridY).mul(Item.space + Item.size).add(new Vector2(Item.size/2, Item.size/2)).sub(this.rigidBody.center_of_mass_rel).rotate(this.rigidBody.phi)
            this.rigidBody.addForce(itemForce, itemPosition_rel)
        })
        
        this.groundContact = false;
    }

    /**
     * Zeichnet den Körper
     * @param {Context} ctx
     * @param {Vector2} campos Der Sichtversatz
     */
     render(ctx, campos){

        //this.rigidBody.render(ctx, campos)
        this.fbManager.render(ctx)

        var phi = this.rigidBody.phi;
        this.items.forEach(item => {
            var rel = new Vector2(item.gridX, item.gridY).mul(Item.size + Item.space).add(new Vector2(Item.size/2, Item.size/2)).sub(this.rigidBody.center_of_mass_rel)
            item.render(ctx, this.rigidBody.position.add(rel.rotate(phi)), phi, campos)
        })
    }
}