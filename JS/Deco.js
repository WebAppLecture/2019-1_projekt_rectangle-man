/*
    Eine Klasse für das verwalten von Dekoobjekten. Dekoobjekte werden im Spiel gezeichnet, der Spieler kann allerdings
    nicht mit Ihnen kollidieren. Ein Dekoobjekt kann sich im Vordergrund (verdeckt den Spieler) oder im Hintergrund (Spieler
    verdeckt Deko) befinden. Die Dekoobjekte sollen zufällig generiert in der Spielumgebung platziert werden. Bisher ist die
    dafür notwendige Logik noch nicht implementiert.
*/

class Deco {
    
    constructor(objectX, objectY, objectWidth, objectHeight, img, layer, color, imgOffsetX, imgOffsetY){
        
        this.canCollide = false;
        this.width = objectWidth;
        this.height = objectHeight;
        this.x = objectX;
        this.y = objectY;
        this.color = color || "rgba(255,0,0,0.5)";
        this.layer = layer || Deco.background;
        this._isInForeground = this.layer === Deco.foreground; 
        this._isInBackground = this.layer === Deco.background; 
        if(img){
            this.img = img;
        } else {
            this.draw = this.fallbackDraw;
        }    
        this.imgOffsetX = imgOffsetX || 0;
        this.imgOffsetY = imgOffsetY || 0;
    }
    
    //Zeichnet das Dekoobjekt auf dem canvas
    draw(canvas) {
        canvas.drawImage(this.img.img, this.img.sx, this.img.sy, this.img.sWidth, this.img.sHeight, this.x + this.imgOffsetX, this.y + this.imgOffsetY, this.width, this.height);
    }
    
    //Falls auf das zugehörige Bild nicht zugegriffen werden kann, zeichnet diese Funktion einen Ersatz auf den Canvas. So können leicht fehlende Bilder indentifiziert werden.
    fallbackDraw(canvas) {
       canvas.fillStyle = this.color;
       canvas.fillRect(this.x + this.imgOffsetX, this.y + this.imgOffsetY, this.width, this.height); 
    }
    
    get isInForeground() {
       return this._isInForeground;
    }
    
    get isInBackground() {
        return this._isInBackground;
    }
    
    static get foreground() {
        return 0;
    }
    
    static get background() {
        return 1;
    }

}

export default Deco;