class Menu{
    constructor(callback){
        this.callback = callback;

        this.pageWidth = screen.width * 0.35;
        this.pageHeight = screen.height
        this.pageOrigin = new Vector2(document.body.clientWidth / 2 - this.pageWidth / 2, 0)
        this.pageCenter = this.pageOrigin.add(this.pageWidth / 2, -this.pageHeight / 2)

        this.page = new Page(this.pageOrigin, this.pageWidth, this.pageHeight, "#4c646b");
        
        this.scoreLabel = this.page.addLabel(0.5,0.3,"PLAY")
        this.scoreLabel.size = 70;
        this.scoreLabel.color = "whitesmoke"

        this.playbutton = this.page.addButton(0.5,0.65,130,130)
        this.playbutton.addTexture(Texture.play)
        this.playbutton.addClickListener(() => {
            this.playButtonCall();
        })

        this.loadLevelData();

        this.page.show();
    }


    /**
     * Lädt die Daten über Spielstände und wertet diese aus.
     */
    loadLevelData(){
        Data.getAttribute("levels", (data => {
            this.levelData = data;
            for(var i = 0; i < this.levelData.length; i++){
                if(this.levelData[i].unlocked == true){
                    this.maximumAllowedLevel = i;
                    this.currentLevel = i;
                    console.log("CURRENT LEVEL", this.currentLevel)
                }
            }
        }))
    }

    /**
     * Speichert die neuen LevelDaten
     */
    saveLevelData(){
        Data.saveAttribute("levels", this.levelData)
    }

    /**
     * Wird aufgerufen, wenn zum ersten Mal Play gedrückt wird
     */
    playButtonCall(){
        this.callback(this.currentLevel)
        this.page.hide();
        this.page.removeItem(this.playbutton)
        this.playbutton = undefined;
    }

    /**
     * Öffnet das Menu unter Angabe, ob das Level erfolgreich abgeschlossen wurde und falls ja die gebrauchte Zeit
     * @param {String} code Der End-code
     * @param {number} time evtl. die gebrauchte Zeit 
     */
    open(code, time){
        if(code == "success"){
            var oldTime = this.levelData[this.currentLevel].time

            //Neue Zeit eintragen
            if(time < oldTime){
                console.log("NEW HIGHSCORE")
                this.levelData[this.currentLevel].time = time;
            }

            //Nächstes Level freischalten, falls am oberen Limit gespielt wurde
            if(this.currentLevel == this.maximumAllowedLevel){
                console.log("NEW LEVEL UNLOCKED")
                this.maximumAllowedLevel ++;
                this.levelData[this.currentLevel + 1].unlocked = true;
                this.saveLevelData();
            }

            this.openSuccess(time)
        } 
        if(code == "fail") this.openFail()
    }

    /**
     * Zeigt das Menu im Fall des Success
     * @param {number} time die Gebrauchte Zeit
     */
    openSuccess(time){

        //Möglichkeit des Wiederholens
        this.retrybutton = this.page.addButton(0.35,0.65,130,130)
        this.retrybutton.addTexture(Texture.retry_2)
        this.retrybutton.addClickListener(() => {
            this.close();
            this.callback(this.currentLevel);
        })

        //Da Success -> nächstes Level frei
        this.nextbutton = this.page.addButton(0.65,0.65,130,130)
        this.nextbutton.addTexture(Texture.play)
        this.nextbutton.addClickListener(() => {
            this.currentLevel++;
            this.close();
            this.callback(this.currentLevel);
        })

        this.scoreLabel.text = time.toFixed(2) + "s";

        this.page.show();
    }

    /**
     * Zeigt das Menu im Fall des Versagens
     */
    openFail(){
        this.scoreLabel.text = "FAIL..."

        //letztes freigeschaltetes level nicht bestanden -> nur erneut versuchen möglich
        if(this.currentLevel == this.maximumAllowedLevel){
            this.retrybutton = this.page.addButton(0.5,0.65,130,130)
            this.retrybutton.addTexture(Texture.retry_2)
            this.retrybutton.addClickListener(() => {
                this.close();
                this.callback(this.currentLevel);
            })
        } else { //sonst ist das nächste level bereits freigeschaltet worden

            this.retrybutton = this.page.addButton(0.35,0.65,130,130) //nochmal versuchen
            this.retrybutton.addTexture(Texture.retry_2)
            this.retrybutton.addClickListener(() => {
                this.close();
                this.callback(this.currentLevel);
            })

            this.nextbutton = this.page.addButton(0.65,0.65,130,130) //Nächstes level
            this.nextbutton.addTexture(Texture.play)
            this.nextbutton.addClickListener(() => {
                this.currentLevel++;
                this.close();
                this.callback(this.currentLevel)
            })
        }

        this.page.show();
    }

    /**
     * Schließt das Menu graphisch und startet das angebene Level
     * @param {number} index Der Index des zu startenden Levels
     */
     close(){
        this.page.removeItem(this.nextbutton)
        this.page.removeItem(this.retrybutton)
        this.playbutton = undefined;
        this.retrybutton = undefined;
        this.page.hide();
    }

    /**
     * Updated das Menu
     * @param {number} dt 
     */
    update(dt){
        if(this.page.active){
            this.page.update(dt)
        }   
    }

    /**
     * Zeichnet das Menu
     * @param {Context} ctx 
     */
    render(ctx){
        if(this.page.active){
            this.page.render(ctx)
        }
    }
}