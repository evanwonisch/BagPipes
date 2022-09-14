class CollisionBarrier{
    constructor(initial_position, initial_normal, width, height){
        this.position_rel = initial_position;
        this.normal_rel = initial_normal.toUnitVector();

        this.width = width;
        this.height = height;
    }

    /**
     * Initalises the Body Part (Called by the parent)
     * @param {RigidBody} parent 
     * @param {Vector2} position //absolute
     * @param {Vector2} velocity //absolute
     * @param {Vector2} normal Normalenvektor (absolut)
     * @param {number} alpha_rel Winkel vom Schwerpunkt aus gesehen in körperfestem Bezugssystem
     * @param {number} dist_rel Entfernung vom Schwerpunkt aus gesehen
     * @param {number} normal_alpha_rel Winkel des Normalenvektors im Körpersystem
     */
     initialise(parent, position, velocity, normal, alpha_rel, dist_rel, normal_alpha_rel){
        this.parent = parent;
        this.position = position;
        this.velocity = velocity;
        this.normal = normal;
        this.alpha_rel = alpha_rel;
        this.dist_rel = dist_rel;
        this.normal_alpha_rel = normal_alpha_rel
    }

    /**
     * Gibt bei gegebenem RigidBodyPart die Collisionskraft zurück
     * @param {RigidBodyPart} part 
     * @param {number} g Gravitationskonstante
     */
    getForce(part, g, anti_impact = 0.05, anti_penetration = 2, friction = 4, elasticity = 0){
        var v_y_rel = this.normal.dot(part.velocity)
        var dist_rel = this.normal.dot(part.position.sub(this.position))
        var penetration = this.height / 2 - dist_rel;
        var offset_x = Math.abs(this.normal.cross(part.position.sub(this.position)))

        var v_x_rel = part.velocity.sub(this.normal.mul(v_y_rel)) //Vector

        if(penetration > 0 && penetration < this.height && offset_x < this.width/2){

            //Velocity impact
            var mass_coeff = Math.sqrt(part.parent.mass) / (1 + Math.exp(-anti_impact*part.parent.mass))

            var counter_impact = anti_impact * mass_coeff * Math.abs(v_y_rel * 4)

            //Anti-penetration
            var counter_penetration = anti_penetration * Math.atan(penetration / 20) * part.parent.mass * g

            var force = counter_impact + counter_penetration;

            if(v_y_rel < 0){
                return this.normal.mul(force).add(v_x_rel.mul(-friction))
            } else {
                return this.normal.mul(force*elasticity).add(v_x_rel.mul(-friction))
            }

        } else {
            return new Vector2();
        }
    }

    /**
     * Zeichnet die Blockade
     * @param {Context} ctx
     * @param {Vector2} campos Zeichenversatz
     */
    render(ctx, campos){
        ctx.translate(this.position.x - campos.x, -this.position.y + campos.y)
        ctx.rotate(Math.PI / 2 - Math.atan2(this.normal.y, this.normal.x))
        ctx.fillStyle = "rgba(100,255,100,0.3)"
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height)

        ctx.strokeStyle = "red"
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-this.width/2, -this.height/2)
        ctx.lineTo(this.width/2, -this.height/2)
        ctx.stroke()

        ctx.resetTransform();
    }
}