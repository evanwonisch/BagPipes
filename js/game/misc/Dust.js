/**
 * Modelliert eine Staubwolke oder eine Abgase
 */
class Dust{
    /**
     * Erzeugt eine Staubwolke
     * @param {number} n_particle 
     * @param {number} lifespan 
     */
    constructor(lifespan, r = 250, g = 250, b = 250){
        this.lifespan = lifespan;
        this.viscosity = 0.1;

        this.r = r;
        this.g = g;
        this.b = b;

        this.particles_lifespan = []; //number
        this.particles_position = []; //vector
        this.particles_velocity = []; //vector
    }

    /**
     * Updated die Staubwolke
     * @param {number} dt Integrationsschrittweite 
     */
    update(dt){
        for(var i = 0; i < this.particles_position.length; i++){
            this.particles_velocity[i] = this.particles_velocity[i].add(this.particles_velocity[i].mul(-this.viscosity * dt))
            this.particles_position[i] = this.particles_position[i].add(this.particles_velocity[i].mul(dt))
            this.particles_lifespan[i] -= dt;

            if (this.particles_lifespan[i] < 0){
                this.particles_position.splice(i, 1)
                this.particles_velocity.splice(i, 1)
                this.particles_lifespan.splice(i, 1)
            }
        }
    }

    /**
     * Fügt Staubpartikel hinzu
     * @param {Vector2} position 
     * @param {Vector2} velocity 
     */
    insertDust(position, velocity){
        this.particles_position.push(position)
        this.particles_velocity.push(velocity)
        this.particles_lifespan.push(this.lifespan)
    }

    /**
     * Zeichnet die Staubwolke
     * @param {Context} ctx 
     * @param {Vector2} campos 
     */
    render(ctx, campos){
        ctx.resetTransform()
        for(var i = 0; i < this.particles_position.length; i++){
            var alpha = this.particles_lifespan[i] / this.lifespan
            ctx.fillStyle = "rgba("+this.r+","+this.g+","+this.b+"," + alpha + ")"
            ctx.fillRect(this.particles_position[i].x - campos.x, -this.particles_position[i].y + campos.y, 5, 5)
        }
    }
}