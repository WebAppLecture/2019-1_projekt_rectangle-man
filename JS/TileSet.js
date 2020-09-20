/*
    Diese Klasse bestimmt, wie die Textdaten der Levels zu interpretieren sind. Dafür werden Textsymbole mit später interpretierbaren Objekttypen verknüpft.
    Mit der tileSize werden die Seitenkantenlängen der zu rendernden Objekte angegeben. Zustäzlich werden die zugehörigen Bildpositionen der einzelnen Blöcke
    auf dem Gesamtblatt errechnet.
*/
class TileSet {
    
    constructor(imgPath, mapping, tiles, tileSize) {
        this.img = document.createElement("img");
        this.img.src = imgPath;
        this.mapping = mapping || { "leftWall": "L",
                                    "rightWall": "T",
                                    "leftBlock": "*",
                                    "rightBlock": "+",
                                    "block": "#",
                                    "ladderTop": "h",
                                    "ladder": "H",
                                    "ladderBottom": "z",
                                    "leftEdge": "&",
                                    "rightEdge": "%",
                                    "air": "_",
                                    "startPosition": "S",
                                    "coin": "c",
                                    "deathtrap": "d"};
        this.tiles = tiles || { "L": {"sx": 0,"sy": 2},
                                "T": {"sx": 0,"sy": 1},
                                "*": {"sx": 1,"sy": 0},
                                "+": {"sx": 3,"sy": 0},
                                "#": {"sx": 2,"sy": 0},
                                "h": {"sx": 4,"sy": 1},
                                "H": {"sx": 4,"sy": 2},
                                "z": {"sx": 4,"sy": 4},
                                "&": {"sx": 0,"sy": 0},
                                "%": {"sx": 4,"sy": 0},
                                "c": {"sx": 5,"sy": 4},
                                "d": {"sx": 5,"sy": 3},
                                "S": {"sx": null, "sy": null}};
        this.tileSize = tileSize || 64;
        this.calculateTiling();
    }    
    
    //Errechnet basierend auf der tileSize die Bildpositionen der Objekte auf dem Tileset
    calculateTiling() {
        for(let index in this.tiles) {
            this.tiles[index].img = this.img;
            this.tiles[index].sx *= this.tileSize;
            this.tiles[index].sy *= this.tileSize;
            this.tiles[index].sWidth = this.tileSize;
            this.tiles[index].sHeight = this.tileSize;
        }
    }
    
    setImgSrc(imgPath){
     this.img.src = imgPath;
    }
    
}

export default TileSet;