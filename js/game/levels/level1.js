function generateLevel1(){
    var level = {

        level_index: 1,

        origin: new Vector2(500,-650),
        gridWidth : 12,
        gridHeight : 8,
        available_items: {
            woodBox: 9,
            woodWheel: 2,
            rocket:2,
            motorWheel:3,
            blueRocket:3,
            greenRocket:15,
            wing:4,
            metalBox:9,
            wingTail:3,
            propeller:3,
            aluBox:10,
        },
        
        cameraPosition: new Vector2(),
        viewXMax: 24000,
        viewXMin: 30,
        viewYMax: 5000,
        viewYMin: 0,
    
        terrain: [
            new Terrain(new Vector2(2000,-640), new Vector2(-0.1,1), 600,20),
            new Terrain(new Vector2(2890,-610), new Vector2(0,1), 1200,20),
        ],
        groundLevel: -670,
        groundWidth: 180000,
        target: new Target(new Vector2(300300, -520)),
    }
    return level;
}