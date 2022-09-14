class Game{
    constructor(){
        Texture.loadTextures();
        Sounds.init();

        this.initialised = false;

        this.initialiseData(() => {
            this.menu = new Menu((startLevelIndex) => {
                this.menuCallback(startLevelIndex);
            });
    
            this.gamepaly = false; //MENU vs Level
            this.dt = 0.05;
    
            var date = new Date()
            var night = false;
            if(date.getHours() >= 19 || date.getHours() <= 7){
                night = true;
            }
            
            this.background = new Background(night = true)
    
            this.time = 0;

            this.initialised = true;
        })
    }

    /**
     * Lädt oder Initialisiert die Daten und fährt dann weiter fort
     * @param {Function} cont wird ausgeführt, wenn die Daten bereit sind
     */
    initialiseData(cont){
        Data.initialised(v => {
            if(!v){
                //Installationszeitpunkt
                Data.saveAttribute("installed", {date: Date.now()}, () => {
                     //Daten über gespielte Level
                    var levelData = [];
                    levelData.push({unlocked:true, time:100000})
                    for(var i = 1; i <= Level.lastLevelIndex; i++){
                        levelData.push({unlocked: false, time: 100000})
                    }
                    Data.saveAttribute("levels", levelData, () => {
                        console.log("INSTALLED")
                        cont();
                    })
                })
                
            } else {
                cont();
            }
        })
    }

    /**
     * Wird durch das Menu zurückgerufen. Startet das Gameplay.
     */
    menuCallback(levelIndex){
        console.log("STARTING LEVEL", levelIndex)
        this.level = new Level(Level.getLevelData(levelIndex), (time, code) => {
            this.levelEnded(time, code)
        })
        this.gamepaly = true;
    }

    /**
     * Wird durch das Level aufgerufen, wenn es zuende ist. Startet das Menu im jeweiligen Modus
     * @param {String} code Der Ausgangszustand des Spiels (succes, fail)
     * @param {number} time evtl. die gebrauchte Zeit
     */
    levelEnded(code, time){
        this.gamepaly = false;
        var realtime = time / this.dt / FPS

        Sounds.stopGameSounds();
        this.menu.open(code, realtime)
    }

    /**
     * Update des Spiels
     * @param {number} dt 
     */
    update(){
        if(this.initialised){
            if(this.gamepaly){
                this.level.update(this.dt);
            } else {
                this.menu.update(this.dt);
            }
    
            this.background.update(this.dt)
            this.time += this.dt;
            if(this.time > 1000){
                this.time = 0;
            }
        }
        
    }

    /**
     * Zeichnet alles im Spiel
     * @param {Context} ctx
     */
    render(ctx){
        if(this.initialised){
            ctx.fillStyle = this.background.backgroundColor
            ctx.fillRect(0, 0, screen.width, screen.height)


            if(this.gamepaly){
                this.background.render(ctx, this.level.cameraPosition)
                this.level.render(ctx)
            } else {
                this.background.render(ctx, new Vector2(this.time * 15, 0))
                this.menu.render(ctx)
            }
        }   
    }
}