class RigidBodyPart{
    constructor(mass, initial_coordinate, friction = 6){
        this.mass = mass;
        this.position_rel = initial_coordinate; //relative to center of mass in a coordinate system fixed to the body
        this.friction = friction;

        this.linkedItem = undefined; //Hier kann sich eine Verknüpfung gemerkt werden
    }

    /**
     * Initalises the Body Part (Called by the parent)
     * @param {RigidBody} parent 
     * @param {Vector2} position //absolute
     * @param {Vector2} velocity //absolute
     * @param {number} alpha_rel Winkel vom Schwerpunkt aus gesehen in körperfestem Bezugssystem
     * @param {number} dist_rel Entfernung vom Schwerpunkt aus gesehen
     */
    initialise(parent, position, velocity, alpha_rel, dist_rel){
        this.parent = parent;
        this.position = position;
        this.velocity = velocity;
        this.alpha_rel = alpha_rel;
        this.dist_rel = dist_rel;
    }

    /**
     * Adds a force to the Rigid Body at this parts position
     * @param {Vector2} force 
     */
    addForce(force){
        this.parent.addForce(force, this.position.sub(this.parent.position))
    }

    /**
     * Renders the body part
     * @param {Context} ctx
     * @param {Vector2} campos Zeichenversatz
     */
    render(ctx, campos){
        ctx.fillStyle = "white"
        ctx.resetTransform()
        ctx.fillRect(this.position.x-2 - campos.x, -this.position.y-2 + campos.y, 4, 4)
    }
}