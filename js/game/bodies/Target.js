/**
 * Ziel
 */
 class Target{

    constructor(position) {
        this.position = position;
        this.reached = false;

        this.time = 0;
        this.alpha = 0.7;
    }

    /**
     * Interagiert mit dem gegebenen Körper
     * @param {Body} body 
     */
    interactBody(body){
        if(body instanceof Vehicle){
            var dist = body.rigidBody.position.sub(this.position).norm()
            if(dist < 300){
                this.reached = true;
            }
        }
    }

    /**
     * Führt ein Zeitupdate durch
     * @param {number} dt 
     */
    update(dt){
        this.time += dt
        this.position.y += Math.sin(this.time)

        if(this.reached){
            this.alpha *= 0.93
            this.position.y += 6;
            Sounds.ringBell();
        }
    }

    /**
     * Zeichnet den Körper
     * @param {Context} ctx
     * @param {Vector2} cameraPosition Der Sichtversatz
     */
    render(ctx, campos){
        ctx.resetTransform()
        ctx.translate(this.position.x - campos.x, -this.position.y + campos.y)
        ctx.fillStyle = "rgba(100,100,255,"+this.alpha+")"
        ctx.fillRect(-100,-100,200,200)
        ctx.resetTransform();
    }
}