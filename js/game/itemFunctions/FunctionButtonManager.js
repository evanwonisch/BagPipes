class FunctionButtonManager{
    constructor(center_position){
        this.center_position = center_position;
        this.functionbuttons = [];
    }

    /**
     * Fügt eine Funktion hinzu
     * @param {String} function_id 
     * @param {Item} item 
     */
    addFunction(item){
        if(item.function_available){ //Falls das Item eine verfügbare Funktion hat, füge sie hinzu
            var item_id = Item.getItemID(item)
            var variant = item.variant;

            var potential_fb = this.functionbuttons.find(fb => fb.item_id == item_id && fb.variant == variant)
            if(potential_fb){
                potential_fb.addItem(item)
            } else {    
                var new_fb = new FunctionButton(this, item_id, variant, new Vector2(0, this.center_position.y), 100)
                new_fb.addItem(item)
                this.functionbuttons.push(new_fb)

                this.updatePositions();
            }
        }
    }

    /**
     * Entfernt ein Item aus dem Funktionsmechanismus
     * @param {Item} item 
     */
    removeItem(item){
        this.functionbuttons.forEach(fb =>{
            fb.items = fb.items.filter(e => e != item)
        })
        this.functionbuttons = this.functionbuttons.filter(fb => fb.items.length != 0)

        this.updatePositions();
    }

    /**
     * Entfernt einen Funktionsbutton
     * @param {FunctionButton} button
     */
    removeFunctionButton(button){
        this.functionbuttons = this.functionbuttons.filter(e => e!= button)
        setTimeout(() => {
            this.updatePositions()
        }, 20)
    }

    /**
     * Updated die Positionen
     */
    updatePositions(){
        var total_length = this.functionbuttons.length * 140
        for(var i = 0; i < this.functionbuttons.length; i++){
            this.functionbuttons[i].button.position.x = this.center_position.x - total_length / 2 + i * 120
        }
    }

    /**
     * Updated die Funktionsbuttons
     */
    update(){
        this.functionbuttons.forEach(fb => {
            fb.update();
        })
    }

    /**
     * Zeichnet alle Komponenten
     * @param {Context} ctx 
     */
    render(ctx){
        this.functionbuttons.forEach(fb => {
            fb.render(ctx)
        })
    }
}