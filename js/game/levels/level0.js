function generateLevel0(){
    var level = {

        level_index: 0,

        origin: new Vector2(500,-650),
        gridWidth : 5,
        gridHeight : 3,
        available_items: {
            woodBox: 4,
            woodWheel: 2,
            motorWheel:2,
            rocket:1,
        },
        
        cameraPosition: new Vector2(),
        viewXMax: 2400,
        viewXMin: 30,
        viewYMax: 5000,
        viewYMin: 0,
    
        terrain: [
            new Terrain(new Vector2(2000,-640), new Vector2(-0.1,1), 600,20),
            new Terrain(new Vector2(2290,-650), new Vector2(-0.1,1).rotate(-Math.PI/2), 80,20),
        ],
        groundLevel: -690,
        groundWidth: 198000,
        target: new Target(new Vector2(2900, -620)),
    }
    return level;
}