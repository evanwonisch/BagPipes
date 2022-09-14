class Page{
    /**
     * Erzeugt eine Menu Seite
     * @param {Vector2} position 
     * @param {number} width 
     * @param {number} height 
     * @param {String} color Hintergrundfarbe oder undefined für keinen Hintergrund 
     */
    constructor(position, width, height, color = "lightgray"){
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;


        this.active = false;
        this.items = [];
    }

    /**
     * Zeigt die Seite
     */
    show(){
        this.active = true;
    }

    /**
     * Versteckt die Seite
     */
    hide(){
        this.active = false;
    }

    /**
     * Fügt ein Item hinzu
     * @param {UI} item 
     */
    addItem(item){
        this.items.push(item)
    }

    /**
     * Entfernt ein Item der Page
     * @param {UI} item 
     */
    removeItem(item){
        this.items = this.items.filter(e => e != item)
    }

    /**
     * Fügt eine Schaltfläche hinzu
     * @param {number} relX Anteil an der Page Breite 
     * @param {number} relY Anteil an der Page Höhe 
     * @param {number} width 
     * @param {number} height 
     * @returns der erzeugte Button
     */
    addButton(relX, relY, width, height){
        var button = new Button(this.position.add(new Vector2(relX * this.width - width / 2, -relY * this.height + height/2)), width, height, undefined, undefined)
        this.addItem(button)
        return button
    }

    /**
     * Fügt ein Label hinzu
     * @param {number} relX 
     * @param {number} relY 
     * @param {String} text 
     * @returns 
     */
    addLabel(relX, relY, text = ""){
        var label = new Label(this.position.add(new Vector2(relX * this.width, -relY * this.height)), text)
        this.addItem(label)
        return label;
    }

    /**
     * Updated die Seite
     * @param {number} dt 
     */
    update(dt){
        if(this.active){
            this.items.forEach(item => {
                item.update()
            })
        }
    }

    /**
     * Zeichnet die Seite
     * @param {Context} ctx 
     * @param {Vector2} campos
     */
    render(ctx, campos = new Vector2()){
        if(this.active){
            if(this.color){
                ctx.fillStyle = this.color
                ctx.fillRect(this.position.x - campos.x, -this.position.y + campos.y, this.width, this.height)
            }   

            this.items.forEach(item => {
                item.render(ctx, campos)
            })
        }
    }
}