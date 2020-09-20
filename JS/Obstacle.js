/*
    Die hier aufgelisteten Klassen sind die Objekte, die im Spiel verwendet werden. Die super-Klasse liefert die draw-Funktionen und Standardattribute.
*/

class Obstacle{
    
    constructor(objectX, objectY, objectWidth, objectHeight, obstacleType, img, isCollectible, imgOffsetX, imgOffsetY, color){
        this.canCollide = true;
        this.width = objectWidth;
        this.height = objectHeight;
        this.x = objectX;
        this.y = objectY;
        this.isCollectible = isCollectible || false;
        this.color = color || "#f00";
        this.obstacleType = obstacleType; // 0=Floor 1=GooBlock 2=Ladder 3=Coin 4=Deathtrap
        if(img){
            this.img = img;
        } else {
            this.draw = fallbackDraw;
        }    
        this.imgOffsetX = imgOffsetX || 0;
        this.imgOffsetY = imgOffsetY || 0;
    }
    
    draw(canvas) {
        canvas.drawImage(this.img.img, this.img.sx, this.img.sy, this.img.sWidth, this.img.sHeight, this.x + this.imgOffsetX, this.y + this.imgOffsetY, this.width, this.height);
    }
    
    fallbackDraw(canvas) {
       canvas.fillStyle = this.color;
       canvas.fillRect(this.x + this.imgOffsetX, this.y + this.imgOffsetY, this.width, this.height); 
    }

}

//Ein Block mit dem der Spieler kollidieren kann. Wird verwendet um Boden, Decke und Wände zu generieren.
class Block extends Obstacle {
    
    constructor(x, y, width, height, imgPath) {
        super(x, y, width, height, Block.type, imgPath, false);
    }
    
    static get type() {
        return 0;
    }
}

//Eine Leiter
class Ladder extends Obstacle {
    
    constructor(x, y, width, height, imgPath) {
        super(x, y, width, height, Ladder.type, imgPath, false);
    }
    
    static get type() {
        return 2;
    }
}

//Eine Münze. Sammelt der Spieler alle in einem Level, so schließt er es erfolgreich ab. Münzen werden animiert basierend auf dem  animationTick in GameController.js
class Coin extends Obstacle {
    
    constructor(x, y, width, height, imgPath) {
        super(x, y, width, height, Coin.type, imgPath, true);
        this.isVisible = true;
        this.animationPos = 0;
        this.runningReverse = false;
    }
    
    static get type() {
        return 3;
    }
    
    draw(canvas, tileSize, animationTick){
        this.tileSize = tileSize || 0;
        this.updateAnimationPos(animationTick);
        canvas.drawImage(this.img.img, this.img.sx + (this.animationPos * this.tileSize), this.img.sy, this.img.sWidth, this.img.sHeight, this.x + this.imgOffsetX , this.y + this.imgOffsetY, this.width, this.height);
    }
    
    //Animation
    updateAnimationPos(animationTick){
        if((animationTick % 8) === 0){
            
            if(this.runningReverse){
                this.animationPos--;
            } else{
                this.animationPos++;
            }
            if(this.animationPos > 4){
                this.animationPos = 3;
                this.runningReverse = true;
            }else if(this.animationPos < 0){
                this.animationPos = 1;
                this.runningReverse = false;
            }
        }
    }
}

//Berührt der Spieler einen Block dieses Typ, stirbt er und verliert das Spiel
class Deathtrap extends Obstacle {
    
    constructor(x, y, width, height, imgPath, tileSize) {
        super(x, y + tileSize/4, width, height, Deathtrap.type, imgPath, false, 0, -tileSize/4);
    }
    
    static get type() {
        return 4;
    }
}

export {Block, Ladder, Coin, Deathtrap};