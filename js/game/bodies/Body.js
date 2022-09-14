/**
 * Oberklasse für Objekte in einem Level
 */
class Body{
    /**
     * Interagiert mit dem gegebenen Körper
     * @param {Body} body 
     */
    interactBody(body){};

    /**
     * Führt ein Zeitupdate durch
     * @param {number} dt 
     */
    update(dt){};

    /**
     * Zeichnet den Körper
     * @param {Context} ctx
     * @param {Vector2} cameraPosition Der Sichtversatz
     */
    render(ctx, cameraPosition){};
}