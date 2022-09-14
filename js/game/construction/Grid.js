class Grid{
    constructor(width, height, origin){
        this.grid = [];
        this.origin = origin;
        this.width = width;
        this.height = height;

        for(var y = 0; y < height; y++){
            this.grid[y] = [];
            for(var x = 0; x < width; x++){
                this.grid[y].push(undefined)
            }
        }
    }

    /**
     * Setzt ein Item fest oder ändert dessen Variante
     * @param {number} gridX 
     * @param {number} gridY 
     * @param {String} item_id 
     * @param {number} variant 
     * @returns {boolen} Ob das Item verbaut wurde
     */
    setItem(gridX, gridY, item_id){
        if(!this.getItem(gridX, gridY)){
            var allowed =  this.checkAllowed(item_id, gridX, gridY);
            if(allowed || this.countItems() == 0){
                this.grid[gridY][gridX] = Item.createItem(item_id, 0)
                return true;
            }
        }
        return false;
    }

    /**
     * Gibt das Item an der jeweiligen Stelle zurück
     * @param {number} gridX 
     * @param {number} gridY
     * @returns {Item} Das Item, oder undefined falls leer
     */
    getItem(gridX, gridY){
        if(gridX >= 0 && gridX < this.width){
            if(gridY>= 0 && gridY < this.height){
               return this.grid[gridY][gridX]
            }
        }
        return undefined;
    }

    /**
     * Ändert die Variante des Items
     * @param {number} gridX 
     * @param {number} gridY 
     */
    changeVariant(gridX, gridY){
        var item = this.getItem(gridX, gridY)
        if(item){
            var id = Item.getItemID(item)
            var variant = item.variant;
            this.grid[gridY][gridX] = Item.createItem(id, variant + 1)
        }
    }

    /**
     * Löscht das Item an der Stelle und gibt zurück ob es tatsächlich gelöscht wurde
     * @param {number} gridX 
     * @param {number} gridY 
     * @returns {boolean} ob es gelöscht wurde
     */
    deleteItem(gridX, gridY){
        if(gridX >= 0 && gridX < this.width){
            if(gridY>= 0 && gridY < this.height){
                var oldValue = this.grid[gridY][gridX]
                this.grid[gridY][gridX] = undefined;

                var legit = true;

                if(this.grid[gridY + 1]){
                    var entry = this.grid[gridY + 1][gridX]
                    if(entry != undefined){
                        var entry_Id = Item.getItemID(entry)
                        var value = this.checkAllowed(entry_Id, gridX, gridY + 1)
                        legit = legit && value
                    }
                }

                if(this.grid[gridY - 1]){
                    var entry = this.grid[gridY - 1][gridX]
                    if(entry != undefined){
                        var entry_Id = Item.getItemID(entry)
                        var value = this.checkAllowed(entry_Id, gridX, gridY - 1)
                        legit = legit && value
                    }
                }

                if(this.grid[gridY][gridX - 1] != undefined){
                    var entry_Id = Item.getItemID(this.grid[gridY][gridX - 1])
                    var value = this.checkAllowed(entry_Id, gridX - 1 , gridY)
                    legit = legit && value
                }

                if(this.grid[gridY][gridX + 1] != undefined){
                    var entry_Id = Item.getItemID(this.grid[gridY][gridX + 1])
                    var value = this.checkAllowed(entry_Id, gridX + 1 , gridY)
                    legit = legit && value
                }

                if(legit == true){
                    return true;
                } else {
                    this.grid[gridY][gridX] = oldValue;
                    return false;
                }
            }
        }
    }

    /**
     * Zählt die bisher verbauten Items
     * @returns die Anzahl
     */
    countItems(){
        var n = 0;
        for(var y = 0; y < this.height; y++){
            for(var x = 0; x < this.width; x++){
               if(this.grid[y][x] != undefined){
                   n++;
               }
            }
        }
        return n;
    }

    /**
     * Überprüft, ob das einsetzen des Items an der Stelle legitim wäre
     * @param {String} itemId 
     * @param {number} gridX 
     * @param {number} gridY 
     */
    checkAllowed(itemId, gridX, gridY){
        var required = Item.getRequiredItemIDs(itemId)

        var top, bot, left, right = undefined;

        if(this.grid[gridY + 1]){
            top = this.grid[gridY + 1][gridX]
        }
        
        if(this.grid[gridY - 1]){
            bot = this.grid[gridY - 1][gridX]
        }

        left = this.grid[gridY][gridX - 1]
        right = this.grid[gridY][gridX + 1]

        var neighbours = [top, bot, left, right]

        var allowed = false;

        neighbours.forEach(neighbour => {
            if(neighbour){
                var neighbourID = Item.getItemID(neighbour)
                if(required.includes(neighbourID)){
                    allowed = true;
                }
            }
        })

        return allowed;
    }

    /**
     * Baut das Fahrzeug
     */
    buildVehicle(){
        var items = [];
        for(var y = 0; y < this.height; y++){
            for(var x = 0; x < this.width; x++){
                if(this.grid[y][x] != undefined){
                    var item = this.grid[y][x]
                    item.gridX = x;
                    item.gridY = y;
                    items.push(item)
                }
            }
        }

        var vehicle = new Vehicle(this.origin.add(new Vector2(this.width, this.height).mul(Item.size + Item.space).mul(0.5)), items)
        return vehicle;
    }

    /**
     * Zeichnet ein Preview
     * @param {Context} ctx 
     * @param {Vector2} campos 
     */
    render(ctx, campos){
        for(var y = 0; y < this.height; y++){
            for(var x = 0; x < this.width; x++){
                if(this.grid[y][x] != undefined){
                    var item = this.grid[y][x];
                    var position = this.origin.add(new Vector2(x,y).mul(Item.size + Item.space)).add(new Vector2(Item.size/2, Item.size/2))
                    item.render(ctx, position, 0, campos)
                }
            }
        }
    }

    /**
     * Konvertiert das Grid Objekt in ein JSON Format
     */
    toJSON(){
        var grid = [];
        for(var y = 0; y < this.height; y++){
            grid[y] = [];
            for(var x = 0; x < this.width; x++){
                var item = this.grid[y][x]
                if(item){
                    var id = Item.getItemID(item)
                    var variant = item.variant;
                    grid[y][x] = [id, variant];
                } else{
                    grid[y][x] = "empty";
                }
            }
        }
        return {width : this.width, height: this.height, grid: grid};
    }

    /**
     * Erzeugt ein Grid-Objekt aus einem JSON Code
     * @param {Object} json 
     */
    static fromJSON(json, origin){
        var newGrid = new Grid(json.width, json.height, origin)

        for(var y = 0; y < json.height; y++){
            for(var x = 0; x < json.width; x++){
                if(json.grid[y][x] != "empty"){
                    var item = Item.createItem(json.grid[y][x][0], json.grid[y][x][1])
                    newGrid.grid[y][x] = item;
                }
            }
        }

        return newGrid;
    }
}