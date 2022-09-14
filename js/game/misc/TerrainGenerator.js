class TerrainGenerator{
    constructor(){
        this.terrain = [];
        this.mouseDown = false;
        this.mouseDisplayPosition = new Vector2();

        this.oldMousePosition = new Vector2();
        this.oldNormal = new Vector2(0, 1);
        this.oldWidth = 0;
        this.height = 40;

        document.addEventListener("mousedown", e => {
            this.mouseDown = true;
            
        })

        document.addEventListener("mouseup", e => {
            this.mouseDown = false;
        })

        document.addEventListener("mousemove", e => {
            this.mouseDisplayPosition = new Vector2(e.pageX, -e.pageY);
        })
    }

    /**
     * Updated den Terrain Generator
     * @param {Vector2} campos der Sichtversatz
     */
    update(campos){
        if(this.mouseDown){
            var mousePosition = this.mouseDisplayPosition.add(campos)
            var v = mousePosition.sub(this.oldMousePosition)

            var oldCorner = this.oldMousePosition.add(new Vector2(this.oldWidth/2, this.height/2).rotate(this.oldNormal.alpha() - Math.PI / 2))
            var r = mousePosition.sub(oldCorner).norm();

            var d =  90;
            //Distanz erreicht
            if(v.norm() > d && r > this.height / 2){
                var newWidth = Math.sqrt(4 * r * r - this.height ** 2)
                var alpha1 = oldCorner.sub(mousePosition).alpha();
                var alpha2 = new Vector2(-newWidth/2, height/2).alpha();
                var newAlpha = alpha1 - alpha2;

                var newNormal = Vector2.fromPolar(newAlpha, 1)

                var terrain = new Terrain(mousePosition, newNormal, newWidth, this.height)
                this.terrain.push(terrain)
                
                this.oldMousePosition = Vector2.copy(mousePosition)
                this.oldNormal = Vector2.copy(newNormal)
                this.oldWidth = newWidth;
            }

        } else {
            this.oldMousePosition = this.mouseDisplayPosition.add(campos);

            this.oldNormal = new Vector2(0,1)
            this.oldWidth = 0;
        }  
    }

    /**
     * Zeichnet das bisherige
     * @param {Context} ctx 
     * @param {Vector2} campos
     */
    render(ctx, campos){
        this.terrain.forEach(terrain => {
            terrain.render(ctx, campos);
        })
    }
}