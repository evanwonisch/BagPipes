class Background{
    constructor(night = false){
        this.time = 0;
        this.night = night;

        if(this.night){
            this.stars = [];
            for(var i = 0; i < 100; i++){
                var randomPosition = new Vector2(Math.random() * screen.width, Math.random() * -100)
                this.stars.push(new Star(randomPosition))
            }
        }

        this.backgroundColor = night ?  "rgb(0,68,98)" : "rgb(255,248,153)"
    }

    /**
     * Führt ein Update durch
     */
    update(dt){
        this.time += dt;

        Sounds.playAmbient(this.night);

        if(this.night){
            this.stars.forEach(star => {
                star.update(dt);
            })
        }
    }

    /**
     * Zeichnet den Background
     * @param {Context} ctx 
     * @param {Vector2} campos 
     */
    render(ctx, campos){
        ctx.resetTransform();
    
        if(this.night){
            this.renderNight(ctx, campos);
        } else {
            for(var i = -5; i < 40; i++){
                var scale = 0.7;
                var width = 1800 * scale
                var yShift = Math.sin(this.time / 4) * 10
                ctx.drawImage(Texture.back1, width * i - campos.x / 8, campos.y / 8, 1800 * scale, 2000 * scale)
                ctx.drawImage(Texture.back0, width * i - campos.x / 2, 280 + campos.y / 2, 1800 * scale, 2000 * scale)
                ctx.drawImage(Texture.beach, width * i - campos.x, 510 + campos.y, 1800 * scale,250 * scale)
                ctx.drawImage(Texture.sea, width * i - campos.x, 670 + yShift + campos.y,1800*scale, 600*scale)
            }
        }

        
    }

    renderNight(ctx, campos){
        var scale = 0.7;
        var width = 1800 * scale
        var yShift = Math.sin(this.time / 4) * 10
        for(var i = -5; i < 40; i++){
            ctx.drawImage(Texture.back1_night, width * i - campos.x / 8, campos.y / 8, 1800 * scale,2000 * scale)
        }
        this.stars.forEach(star => {
            star.render(ctx);
        })
        for(var i = -5; i < 40; i++){
            ctx.drawImage(Texture.back0_night, width * i - campos.x / 2, 280 + campos.y / 2,1800 * scale,2000 * scale)
            ctx.drawImage(Texture.beach_night, width * i - campos.x, 510 + campos.y,1800 * scale,250 * scale)
            ctx.drawImage(Texture.sea_night, width * i - campos.x, 670 + yShift + campos.y,1800*scale, 600*scale)
        }
    }
}