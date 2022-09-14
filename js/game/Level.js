class Level{
    constructor(levelData, callback){
        
        /// ---- LevelData Attribute -----  ////

        //Level-ID
        this.level_index = levelData.level_index;
         
        //Construction
        this.available_items = levelData.available_items
        this.origin = levelData.origin
        this.gridWidth = levelData.gridWidth
        this.gridHeight = levelData.gridHeight

        //X-Position Grenzen der Kamera
        this.viewXMax = levelData.viewXMax;
        this.viewXMin = levelData.viewXMin;

        //Y-Position Grenzen der Kamera
        this.viewYMax = levelData.viewYMax;
        this.viewYMin = levelData.viewXMin;

        //Cameraposition
        this.cameraPosition = levelData.cameraPosition;

        //Ziel
        this.target = levelData.target
        this.reachedCooldown = 5;

        //Terrain
        this.terrain = levelData.terrain;

        //Ultimatives Bodenlevel
        this.groundLevel = levelData.groundLevel;
        this.groundWidth = levelData.groundWidth;
        this.mainGround = new Terrain(new Vector2(0, this.groundLevel), new Vector2(0,1), this.groundWidth, 60, true, "rgba(200,200,200,0.2)")

        //Level beendet
        this.callback = callback;

        //  ----------------------------- //

        //Körper initialisieren
        this.bodies = [];
        this.bodies.push(this.mainGround) //Hauptboden einlegen
        this.bodies.push(this.target) //Ziel hinzufügen
        this.terrain.forEach(terrain => this.bodies.push(terrain)) //Terrain hinzufügen

        //Vehicle constructor
        this.cons = new Constructor(this.gridWidth, this.gridHeight, this.available_items, this.origin, () => {
            this.startRide();
        })
        //Load old Vehicle if available
        Data.getAttribute("vehicle_" + this.level_index, (data) => {
            if(data){
                var grid = Grid.fromJSON(data, this.origin)
                this.cons.setGrid(grid)
            }
        })
        
        //Level-Fahrt läuft
        this.riding = false; //Construction oder Fahrt
        this.ridingTime = 0;

        //Level beendet
        this.finished = false;

        //Bildschirmgrößen
        this.screenWidth = screen.width;
        this.screenHeight = screen.height;

        //Initialisierung des Mauszuhörers
        this.mouseX = this.screenWidth / 2;
        this.mouseY = this.screenHeight / 2;
        document.addEventListener("mousemove", e => {
            this.mouseX = e.screenX
            this.mouseY = e.screenY
        })

        //Während-des-Levels-beende-Button
        this.retryButton = new Button(new Vector2(50,-50), 80,80)
        this.retryButton.addClickListener(() => {
            this.finished = true;
            this.riding = false;
            this.callback("fail")
        })
        this.retryButton.texture = Texture.retry;


        //Physik-Label
        this.statusLabel = new Label(new Vector2(200,-200), "")
    }

    /**
     * Fügt einen Körper der Physik hinzu
     * @param {Body} body 
     */
    addBody(body){
        this.bodies.push(body)
    }

    /**
     * Entfernt einen Körper
     * @param {Body} body 
     */
    removeBody(body){
        this.bodies = this.bodies.filter(b => b != body)
    }

    /**
     * Startet die Level-Fahrt. Wird durch den entsprechenden Button aufgerufen
     */
    startRide(){
        Data.saveAttribute("vehicle_" + this.level_index, this.cons.grid.toJSON())
        this.vehicle = this.cons.getVehicle();
        this.vehicle.level = this;
        this.bodies.push(this.vehicle)
        this.riding = true;
    }

    /**
     * Führt ein Zeitupdate des Levels durch
     * @param {number} dt Integrationsschrittweite
     */
    update(dt){
        if(!this.riding){
            this.cons.update(dt, this.cameraPosition)
        } else {

            //Fahrzeitmessung
            if(!this.target.reached){
                this.ridingTime += dt
            }

            this.retryButton.update();   

            this.statusLabel.text = "X: " + this.vehicle.rigidBody.position.x.toFixed(2) + "\nY: " + this.vehicle.rigidBody.position.y.toFixed(2) + "\nv: " + this.vehicle.rigidBody.velocity.norm().toFixed(2)
        }

        //Bei erreichen des Ziels: Schluss
        if(!this.finished){
            if(this.target.reached){
                this.reachedCooldown -= dt;
            }
            if(this.reachedCooldown < 0){
                this.finished = true;
                this.callback("success", this.ridingTime);
            }
        }

        this.updateBodies(dt);
        this.moveCamera();
    }

    /**
     * Führt ein Zeitupdate der Physik der Körper durch
     * @param {number} dt Integrationsschrittweite
     */
    updateBodies(dt){
        //Körper->Körper Beziehung
        this.bodies.forEach(b1 => {
            this.bodies.forEach(b2 => {
                if(b1 != b2){
                    b1.interactBody(b2);
                }
            })
        })

        this.bodies.forEach(body => {
            body.update(dt)
        })
    }


    /**
     * Bewegt die Kamera (viewX, viewY) entsprechend der Vorgaben in levelData
     */
    moveCamera(){

        ///X
        if(this.mouseX < this.screenWidth / 6){ //Links
            if(this.cameraPosition.x > this.viewXMin){
                this.cameraPosition.x -= (this.screenWidth / 6 - this.mouseX) * 0.08;
            }
        } else if(this.mouseX > 5 * this.screenWidth / 6){ //Rechts
            if(this.cameraPosition.x < this.viewXMax){
                this.cameraPosition.x += (this.mouseX - 5 * this.screenWidth / 6) * 0.08;
            }
        } else { //Mitfahren
            if(this.riding){
                var move = 0.1*(this.vehicle.rigidBody.position.x - this.screenWidth / 2 - this.cameraPosition.x)
                if(this.cameraPosition.x + move < this.viewXMax && this.cameraPosition.x + move > this.viewXMin){
                    this.cameraPosition.x += move;
                }
            }
        }

        if(this.riding){
            var move = 0.1*(this.vehicle.rigidBody.position.y + this.screenHeight / 2 - this.cameraPosition.y)
            if(this.cameraPosition.y + move < this.viewYMax && this.cameraPosition.y + move > this.viewYMin){
                this.cameraPosition.y += move;
            }
        }
    }

    /**
     * Zeichnet alle Bestandteile
     * @param {Context} ctx 
     */
    render(ctx){
        this.bodies.forEach(b => {
            b.render(ctx, this.cameraPosition);
        })

        if(!this.riding){
            this.cons.render(ctx, this.cameraPosition);
        } else {
            this.retryButton.render(ctx)
        }

        this.statusLabel.render(ctx)
    }


    // ----- statische Member ----- //

    static getLevelData(index){
        switch(index){
            case 0:
                return generateLevel0();
            case 1:
                return generateLevel1();
            case 2:
                return generateLevel1();
            case 3:
                return generateLevel1();
            case 4:
                return generateLevel1();
            case 5:
                return generateLevel1();
            case 6:
                return generateLevel1();
            case 7:
                return generateLevel1();
        }
    }

    static lastLevelIndex = 6;
}