class Constructor{
    /**
     * Erzeugt einen Vehilce Bauer
     * @param {number} gridWidth 
     * @param {number} gridHeight 
     * @param {Dictionary} available_items 
     * @param {Vector2} origin 
     * @param {Function} callback Wird aufgerufen, wenn das Fahrzeug fertig ist
     */
    constructor(gridWidth, gridHeight, available_items, origin, callback){
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;

        this.originalAvalableItems = JSON.parse(JSON.stringify(available_items))
        this.available_items = available_items;
        this.available_item_ids = Object.keys(available_items)

        this.constructionOrigin = origin;
        this.itemButtonCenter = new Vector2(document.body.clientWidth / 2, -4*document.body.clientHeight / 5) //Item buttons

        //Callback
        this.callback = callback;

        // Buttons für das Baugitter
        this.gridButtons = [];
        for(var y = 0; y < gridHeight; y ++){
            this.gridButtons[y] = [];
            for(var x = 0; x < gridWidth; x++){
                var button = new Button(origin.add(new Vector2(x,y).mul(Item.size + Item.space)).add(new Vector2(0, Item.size)), Item.size, Item.size)

                button.addClickListener((pos) => {
                    this.gridButtonCall(pos)
                }, new Vector2(x,y))

                button.backgroundColor = "rgba(120,120,120,0.7)"
                this.gridButtons[y].push(button)
            }
        }

        // Buttons für verfügbare Items und Ihre Anzahlen
        this.itemButtons = [];
        this.itemButtonLabels = [];
        for(var i = 0; i < this.available_item_ids.length; i++){
            var position = this.itemButtonCenter.add(new Vector2(-this.available_item_ids.length * 70,0)).add(new Vector2(120 * i, 0))

            var label = new Label(position.add(new Vector2(5,5)), this.available_items[this.available_item_ids[i]], "rgb(50,50,50)", 25, "orange")
            this.itemButtonLabels.push(label)

            var button = new Button(position, 100, 100)
            button.backgroundColor = "rgba(120,120,120,0.7)"
            button.addClickListener((index) => {
                this.selectItem(index)
            }, i)
            this.itemButtons.push(button)
        }


        var position = this.itemButtonCenter.add(new Vector2(-this.available_item_ids.length * 70,0)).add(new Vector2(-120, 0))
        this.emptyButton = new Button(position, 100, 100)
        this.emptyButton.backgroundColor = "rgba(120,120,120,0.7)"
        this.emptyButton.addClickListener(() => {
            this.selectItem(-1)
        }) 

        //Finish Button
        this.finishButton = new Button(this.constructionOrigin.add(new Vector2(gridWidth * (Item.size + Item.space) + 40, 0.5 * (gridHeight + 1) * (Item.size + Item.space) + 45)), 80,80)
        this.finishButton.addClickListener(() => {
            this.finishButtonCall();
        })
        this.finishButton.addTexture(Texture.check)

        //Delete Button
        this.deleteButton = new Button(this.constructionOrigin.add(new Vector2(gridWidth * (Item.size + Item.space) + 40, 0.5 * (gridHeight + 1) * (Item.size + Item.space) - 45)), 80,80)
        this.deleteButton.addClickListener(() => {
            this.deleteButtonCall();
        })
        this.deleteButton.addTexture(Texture.delete)

        //UI
        this.selectedItemIndex = 0;
        this.selectedItemName = this.available_item_ids[0];
        this.itemButtons[0].setSelect(true);

        //Gitter zum Aufbau
        this.grid = new Grid(gridWidth, gridHeight, origin)
    }

    /**
     * Setzt das aktuelle Item-Grid auf einen bestimmten Wert
     * @param {Grid} grid das neue Grid 
     */
    setGrid(grid){
        if(grid.width == this.gridWidth){
            if(grid.height == this.gridHeight){
                this.grid = grid;
                for(var y = 0; y < this.gridHeight; y++){
                    for(var x = 0; x < this.gridWidth; x++){
                        if(grid.grid[y][x] != undefined){
                            var id = Item.getItemID(grid.grid[y][x])
                            if(this.available_item_ids.includes(id)){
                                this.available_items[id]--;
                            }
                        }
                    }
                }
                this.updateItemButtonLabels();
            }
        }
    }


    /**
     * Wird aufgerufen wenn der Löschbutton geklickt wird
     */
    deleteButtonCall(){
        this.grid = new Grid(this.gridWidth, this.gridHeight, this.constructionOrigin)
        this.available_items = JSON.parse(JSON.stringify(this.originalAvalableItems))
        this.updateItemButtonLabels();
    }

    /**
     * Wird aufgerufen, wenn der FinishButton geklickt wird. Ruft das Level Objekt zurück.
     */
    finishButtonCall(){
        this.callback()
    }

    /**
     * Baut das Fahrzeug
     * @returns {Vehicle} Das Fahrzeug
     */
    getVehicle(){
        return this.grid.buildVehicle();
    }

    /**
     * Wird aufgerufen wenn ein Gitterbestandteil geklickt wird.
     * @param {Vector2} position die Koordinaten des Kästchens 
     */
    gridButtonCall(position){
        var x = position.x;
        var y = position.y;

        if(this.selectedItemIndex != -1){
            if(this.available_items[this.selectedItemName] > 0){
                var trySet = this.grid.setItem(x,y, this.selectedItemName)
                if(trySet){
                    this.available_items[this.selectedItemName] -= 1;
                } else {
                    var oldItem = this.grid.getItem(x, y)
                    if(oldItem && Item.getItemID(oldItem) == this.selectedItemName){
                        this.grid.changeVariant(x, y)
                    }
                }
            } else {
                var oldItem = this.grid.getItem(x, y)
                if(oldItem && Item.getItemID(oldItem) == this.selectedItemName){
                    this.grid.changeVariant(x, y)
                }
            }
        } else {
            var oldItem = this.grid.getItem(x, y)
            if(oldItem){
                var oldID = Item.getItemID(oldItem);
                if(this.grid.deleteItem(x, y)){
                    this.available_items[oldID]++;
                }
            }
        }

        this.updateItemButtonLabels();
    }

    /**
     * Updated den Text der Item Anzahl Labels
     */
    updateItemButtonLabels(){
        for(var i = 0; i < this.available_item_ids.length; i++){
            this.itemButtonLabels[i].text = this.available_items[this.available_item_ids[i]]
        }
    }

    /**
     * Wählt ein Item aus der Liste als aktiv aus
     * @param {number} index Index des zugehörigen Buttons bzw Stelle oder -1 für löschung
     */
    selectItem(index){
        this.selectedItemIndex = index;
        if(index != -1){
            this.selectedItemName = this.available_item_ids[index]
        } else {
            this.selectedItemName = undefined;
        }

        for(var i = 0; i < this.itemButtons.length; i++){
            if(i != index){
                this.itemButtons[i].setSelect(false)
            } else {
                this.itemButtons[i].setSelect(true)
            }
        }

        if(index == -1){
            this.emptyButton.setSelect(true)
        } else {
            this.emptyButton.setSelect(false)
        }
    }


    /**
     * Führt ein Zeitupdate durch
     * @param {Vector2} campos 
     */
    update(dt, campos){
        this.gridButtons.forEach(row => {
            row.forEach(button => {
                button.update(campos)
            })
        })
        this.itemButtons.forEach(b => {
            b.update(campos);
        })
        this.finishButton.update(campos)
        this.deleteButton.update(campos)
        this.emptyButton.update(campos)
    }


    /**
     * Zeichnet den Aufbauprozess
     * @param {Context} ctx
     * @param {Vector2} campos
     */
    render(ctx, campos){
        this.gridButtons.forEach(row => {
            row.forEach(button => {
                button.render(ctx, campos)
            })
        })

        this.itemButtons.forEach(button => {
            button.render(ctx, campos)
        })

        this.itemButtonLabels.forEach(label => {
            label.render(ctx, campos)
        })

        for(var i = 0; i < this.available_item_ids.length; i++){
            var position = this.itemButtonCenter.add(new Vector2(-this.available_item_ids.length * 70,0)).add(new Vector2(120 * i + 50, -50))
            var item = Item.createItem(this.available_item_ids[i], 0)
            item.render(ctx, position, 0, campos)
        }


        this.grid.render(ctx, campos);
        this.finishButton.render(ctx,campos)
        this.deleteButton.render(ctx,campos)
        this.emptyButton.render(ctx, campos)
    }
}