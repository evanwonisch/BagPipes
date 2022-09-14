/**
 * Modelliert ein funktionsunfähiges Fahrzeug
 */
class DummyVehicle extends Body{
    constructor(position, velocity, items, g = 120){
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
                bodyParts.push(rigidBodyPart)
            })
        })
        this.rigidBody = new RigidBody(bodyParts, [], position, velocity)

    }


    /**
     * Interagiert mit dem gegebenen Körper
     * @param {Body} body 
     */
    interactBody(body){
        if(body instanceof Terrain){
            this.rigidBody.parts.forEach(part => {
                var force = body.rigidBody.barriers[0].getForce(part, this.g, 0.13, 10, part.friction, 0)
                part.addForce(force)
            })
        }
        if(body instanceof DummyVehicle){
            if(this.rigidBody.position.sub(body.rigidBody.position).norm() < Item.size){
                this.rigidBody.addForce(this.rigidBody.position.sub(body.rigidBody.position).mul(0.4), new Vector2())
            }
        }
    }


    /**
     * Führt ein Zeitupdate durch
     * @param {number} dt 
     */
    update(dt){
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

        this.items.forEach(item => {
            item.update(dt)
        })
    }

    /**
     * Zeichnet den Körper
     * @param {Context} ctx
     * @param {Vector2} campos Der Sichtversatz
     */
     render(ctx, campos){
        //this.rigidBody.render(ctx, campos)

        var phi = this.rigidBody.phi;
        this.items.forEach(item => {
            var rel = new Vector2(item.gridX, item.gridY).mul(Item.size + Item.space).add(new Vector2(Item.size/2, Item.size/2)).sub(this.rigidBody.center_of_mass_rel)
            item.render(ctx, this.rigidBody.position.add(rel.rotate(phi)), phi, campos)
        })
    }
}