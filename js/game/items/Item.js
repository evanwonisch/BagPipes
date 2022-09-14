/**
 * Implementiert ein Item (Baustein für das Fahrzeug)
 */
 class Item{

    static size = 30;
    static space = 3;

    constructor(){
        this.bodyEdges = []; //Vector2[] vom Mittelpunkt aus in Pixeleinheiten
        this.mass = 0; //Gesamtmasse
        this.friction = 0; //Reibung

        this.variant = 0; //Variante des Items
        this.function_available = false;

        this.strength = 10000;

        this.gridX = 0; //Falls das Item verbaut wird, wird sich hier gemerkt an welcher Stelle
        this.gridY = 0;

        this.linkedRigidBodyParts = []; ///Falls das Item verbaut wird, wird sich hier gemerkt welche Körperteilchen zu diesem Item gehören
    }

    /**
     * Ruft die Itemfunktionen auf
     * @param {FunctionButtonManager} fbManager 
     * @param {FunctionButton} functionButton 
     */
    functionCall(fbManager, functionButton){}

    /**
     * Berechnet die Kräfte, die dieses Item auf das Vehicle ausüben würde
     * @param {Vehicle} vehicle das betreffende Fahrzeug
     * @returns {Vector2} die Kraft
     */
    getVehicleForces(vehicle){
        return new Vector2()
    }

    /**
     * Führt ein Zeitupdate durch
     * @param {number} dt 
     */
    update(dt){}

    /**
     * Zeichnet das Item
     * @param {Context} ctx 
     * @param {Vector2} position Mittelpunktsposition
     * @param {number} phi Winkel zur X-Achse 
     * @param {Vector2} campos Sichtversatz 
     */
    render(ctx, position, phi, campos){}


    /**
     * Erzeugt ein Item aus einer gegeben ID
     * @param {String} id 
     * @param {number} variant 
     * @returns {Item} das Item
     */
    static createItem(id, variant){
        switch (id) {
            case "metalBox":
                return new MetalBox(variant)
            case "aluBox":
                return new AluBox(variant)
            case "motorWheel":
                return new MotorWheel(variant)
            case "propeller":
                return new Propeller(variant)
            case "rocket":
                return new Rocket(variant)
            case "blueRocket":
                return new BlueRocket(variant)
            case "greenRocket":
                return new GreenRocket(variant)
            case "stoneBox":
                return new StoneBox(variant)
            case "woodBox":
                return new WoodBox(variant)
            case "woodWheel":
                return new WoodWheel(variant)
            case "wing":
                return new Wing(variant)
            case "wingTail":
                return new WingTail(variant)
        }
    }

    /**
     * Gibt die ItemID eines Items zurück
     * @param {Item} item 
     */
    static getItemID(item){
        if(item instanceof MetalBox){
            return "metalBox"
        }
        if(item instanceof AluBox){
            return "aluBox"
        }
        if(item instanceof MotorWheel){
            return "motorWheel"
        }
        if(item instanceof Propeller){
            return "propeller"
        }
        if(item instanceof Rocket){
            return "rocket"
        }
        if(item instanceof BlueRocket){
            return "blueRocket"
        }
        if(item instanceof GreenRocket){
            return "greenRocket"
        }
        if(item instanceof StoneBox){
            return "stoneBox"
        }
        if(item instanceof WoodBox){
            return "woodBox"
        }
        if(item instanceof WoodWheel){
            return "woodWheel"
        }
        if(item instanceof Wing){
            return "wing"
        }
        if(item instanceof WingTail){
            return "wingTail"
        }
    }

    /**
     * Gibt eine Liste mit notwendigen Nachbar Item-IDs aus
     * @param {String} itemID 
     */
    static getRequiredItemIDs(itemID){
        return ["metalBox", "woodBox", "stoneBox", "aluBox"] //nicht endgültig XD
    }
}