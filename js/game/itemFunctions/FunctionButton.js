class FunctionButton{
    constructor(fbManager, item_id, variant, position, size){
        this.fbManager = fbManager;

        this.item_id = item_id;
        this.variant = variant;
        this.position = position;

        this.items = [];
        this.button = new Button(position, size, size)
        this.button.addClickListener(() => {
            this.call();
        })
    }

    /**
     * Fügt ein Verknüpftes Item hinzu
     * @param {Item} item 
     */
    addItem(item){
        this.items.push(item)
    }

    /**
     * Ruft alle Items an, dass der Button geklickt wurde
     */
    call(){
        this.items.forEach(item => {
            item.functionCall(this.fbManager, this)
        })
    }

    /**
     * Updated den Button
     */
    update(){
        this.button.update()
    }

    /**
     * Zeichnet den Button
     * @param {Context} ctx
     */
    render(ctx){
        this.button.render(ctx);
        var item = Item.createItem(this.item_id, this.variant)
        item.render(ctx, this.position.add(new Vector2(50,-50)), 0, new Vector2())
    }
}