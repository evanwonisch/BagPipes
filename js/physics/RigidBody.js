class RigidBody{
    /**
     * Erstellt einen Festkörper
     * @param {RigidBody[]} parts Bestandteile des Körpers
     * @param {CollisionBarrier[]} barriers Undurchdringliche Bestandteile des Körpers
     * @param {Vector2} position Anfangsposition des Körpers (Schwerpunkt) 
     * @param {Vector2} velocity Anfangsgeschwindigkeit 
     * @param {number} phi Startwinkel zur X-Achse 
     * @param {number} omega Winkelgeschwindigkeit 
     */
    constructor(parts, barriers, position, velocity, phi = 0, omega = 0){
        this.parts = parts;
        this.barriers = barriers;

        this.position = position; //absolute
        this.velocity = velocity; //absolute
        this.phi = phi; //absolute to x-axis
        this.omega = omega; //absolute

        //Gesamtmasse
        this.mass = parts.reduce((acc, val) => acc + val.mass, 0)
        if(this.mass == 0){
            this.mass = 1;
        }

        //Schwerpunktskorrektur
        this.center_of_mass_rel = this.parts.reduce((acc, val) => acc.add(val.position_rel.mul(val.mass)), new Vector2()).div(this.mass)
        this.parts.forEach(part => {
            part.position_rel = part.position_rel.sub(this.center_of_mass_rel);
        })
        this.barriers.forEach(barrier => {
            barrier.position_rel = barrier.position_rel.sub(this.center_of_mass_rel);
        })

        //Trägheitsmoment
        this.moment_of_inertia = parts.reduce((acc, val) => {
            return acc + val.mass * val.position_rel.norm()**2
        }, 0);
        if(this.moment_of_inertia == 0){
            this.moment_of_inertia = 1;
        }

        //Körperbestandteile initialisieren (Absolutposition/-geschwindigkeit)
        //RigidBody Parts
        this.parts.forEach(part => {
            var part_alpha_rel = Math.atan2(part.position_rel.y, part.position_rel.x) //relative to rigid body
            var part_dist_rel = part.position_rel.norm(); //as well

            var part_position_abs = this.position.add(Vector2.fromPolar(part_alpha_rel + this.phi, part_dist_rel))
            var part_velocity_abs = this.velocity.add(new Vector2(-Math.sin(part_alpha_rel + this.phi), Math.cos(part_alpha_rel + this.phi)).mul(part_dist_rel*this.omega))

            part.initialise(this, part_position_abs, part_velocity_abs, part_alpha_rel, part_dist_rel);
        })
        //Collision Barriers
        this.barriers.forEach(barrier => {
            var barrier_alpha_rel = Math.atan2(barrier.position_rel.y, barrier.position_rel.x) //relative to rigid body
            var barrier_dist_rel = barrier.position_rel.norm(); //as well
            var barrier_normal_alpha_rel = Math.atan2(barrier.normal_rel.y, barrier.normal_rel.x) //Winkel des Normalenvektors im Körpersystem

            var barrier_position_abs = this.position.add(Vector2.fromPolar(barrier_alpha_rel + this.phi, barrier_dist_rel))
            var barrier_velocity_abs = this.velocity.add(new Vector2(-Math.sin(barrier_alpha_rel + this.phi), Math.cos(barrier_alpha_rel + this.phi)).mul(barrier_dist_rel*this.omega))
            var barrier_normal_abs = Vector2.fromPolar(barrier_normal_alpha_rel + this.phi, 1)

            barrier.initialise(this, barrier_position_abs, barrier_velocity_abs, barrier_normal_abs, barrier_alpha_rel, barrier_dist_rel, barrier_normal_alpha_rel);
        })

        this.force = new Vector2();
        this.torque = 0;
    }

    /**
     * Gaußische Integration
     * @param {number} dt Integrationsschritweite (standard: 0.1)
     */
    update(dt){
        this.velocity = this.velocity.add(this.force.div(this.mass).mul(dt))
        this.omega = this.omega + this.torque / this.moment_of_inertia * dt;

        this.position = this.position.add(this.velocity.mul(dt))
        this.phi = this.phi + this.omega * dt;

        //Werte der Bestandteile updaten
        //RigidBodyParts
        this.parts.forEach(part => {
            var part_alpha_rel = part.alpha_rel;
            var part_dist_rel = part.dist_rel;
            part.position = this.position.add(Vector2.fromPolar(part_alpha_rel + this.phi, part_dist_rel))
            part.velocity = this.velocity.add(new Vector2(-Math.sin(part_alpha_rel + this.phi), Math.cos(part_alpha_rel + this.phi)).mul(part_dist_rel*this.omega))
        })
        //Collision Barriers
        this.barriers.forEach(barrier => {
            var barrier_alpha_rel = barrier.alpha_rel;
            var barrier_dist_rel = barrier.dist_rel
            var barrier_normal_alpha_rel = barrier.normal_alpha_rel
            barrier.position = this.position.add(Vector2.fromPolar(barrier_alpha_rel + this.phi, barrier_dist_rel))
            barrier.velocity = this.velocity.add(new Vector2(-Math.sin(barrier_alpha_rel + this.phi), Math.cos(barrier_alpha_rel + this.phi)).mul(barrier_dist_rel*this.omega))
            barrier.normal = Vector2.fromPolar(barrier_normal_alpha_rel + this.phi, 1)
        })

        //Reset force and torque
        this.force = new Vector2();
        this.torque = 0;
    }

    /**
     * Fügt eine Kraft auf den Körper hinzu (Drehmoment wird berücksichtigt)
     * @param {Vector2} force (Raumkoordinaten)
     * @param {Vector2} attack_point (vom Schwerpunkt aus gesehen aber nicht mitrotiert)
     */
    addForce(force, attack_point){
        this.force = this.force.add(force)
        this.torque += attack_point.cross(force)
    }

    /**
     * Zeichnet das Objekt
     * @param {Context} ctx 
     * @param {Vector2} campos Zeichenversatz
     */
    render(ctx, campos){
        this.barriers.forEach(barrier => {
            barrier.render(ctx, campos)
        })

        this.parts.forEach(part => {
            part.render(ctx, campos)
        })

        ctx.fillStyle = "orange"
        ctx.fillRect(this.position.x-5 - campos.x,-this.position.y-5 + campos.y,10,10)
    }
}