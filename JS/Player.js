/*
    Die Spielerklasse. Hier werden alle Variablen, die den Spieler betreffen, festgelegt. Durch Anpassung lässt sich so schnell das Spielerverhalten testen.
    Der Spieler hat außerdem eine eigene Kolissionsauflösung, um richtig auf Kollisionen mit verschiedensten Objekten reagieren zu können.
*/
class Player{
    
    constructor(canvas, x, y, width, height, vx, vy, imgOffsetX, imgOffsetY,color){
        this.canvas = canvas;
        this.img = document.createElement('img');
        //this.img.src = "./RES/slj.png"
        this.img.onload = this.draw.bind(this);
        this.imgOffsetX = imgOffsetX;
        this.imgOffsetY = imgOffsetY;
        this.width = width;
        this.height = height;

        this.maxXSpeed = 15;
        this.minXSpeed = -15;
        this.maxYSpeed = 30;
        this.minYSpeed = -15;
        this.jumpSpeed = 15;
        
        this.jumping = true;
        this.walljumpingLeft = false;
        this.walljumpingRight = false;
        
        this.wallSlideSpeed = 3;
        this.wallJumpSpeed = 15;
        this.wallJumpAcceleration = 0.29;
        this.wallJumpSpeedMod = 1.1;
        
        this.maxGooSpeed = 3;
        this.gooJumpMultiplicator = 0.6;
        this.gooDecelarationMultiplicator = 0.9;
        
        this.maxLadderSpeed = 8;
        this.onLadder = false;
        
        this.onGround = false;
        this.onCeiling = false;
        this.onLeft = false;
        this.onRight = false;
        this.movingOnWall = false;
        this.movingOnGround = false;
        this.movingOnCeiling = false;
        
        this.x = x;
        this.y = y;
        this.ySpeed = 1;
        this.xSpeed = 1.8;
        this.vy = vy;
        this.vx = vx;
        this.gravity = 0.8;
        this.friction = 0.8;
        this.moveUp = false;
        this.moveDown = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.color = color;
    }
    
    draw() {
        //this.canvas.drawImage(this.img, this.x + this.imgOffsetX, this.y + this.imgOffsetY, 200, 200);
        this.canvas.fillStyle = this.color;
        this.canvas.fillRect(this.x, this.y, this.width, this.height);
    }
    
    /*
        Updatet die Spielerposition basierend auf seiner jetzigen Geschwindigkeit. Reibung wird angewendet und Gravitation, sofern sich der Spieler nicht auf 
        einer Leiter befindet. Außerdem wird gewährleistet, dass der Spieler die festgelegte Maximalgeschwindigkeit durch Gravitationseinwirkung nicht überschreitet.
    */
    update(){
        this.y += this.vy;
        this.x += this.vx;
        this.vx = this.vx * this.friction;
        if(!this.onGround && !this.onLadder){
            this.vy = this.vy + this.gravity;
            if(this.vy > this.maxYSpeed){
                this.vy = this.maxYSpeed;
            }
        }
    }
    
    //Der Spieler springt. Mithilfe des speedMods lassen sich Sprüngen von verschiedenen Blöcken simulieren.
    jump(speedMod){
        
        if(this.vy > this.minYSpeed && speedMod == null){
            this.vy -= this.jumpSpeed;
            if(this.vy < this.minYSpeed){
                this.vy = this.minYSpeed;
            }
        }
        
        if(this.vy > this.minYSpeed && speedMod != null){
            this.vy -= this.jumpSpeed * speedMod;
            if(this.vy < this.minYSpeed){
                this.vy = this.minYSpeed;
            }
        }
    }
    
    //Ein Wandsprung. Kollidiert der Spieler mit einer Wand, so kann er von dieser in die entgegengesetzte Richtung davon abspringen.
    wallJump(wallOnRight){
        if(!this.onLadder && !this.walljumping){
            if(wallOnRight){ //Wall on right -> Jump left
                this.vx = -this.wallJumpSpeed;
                this.walljumpingLeft = true;
            } else{ //Wall on left -> Jump right
                this.vx = this.wallJumpSpeed;
                this.walljumpingRight = true;
            }
            this.jump(this.wallJumpSpeedMod);
        }
    }
    
    //Hier werden alle registrierten Kollisionen des Spielers verarbeitet
    handleCollision(collisionArray, handleGoo, handleLadder){
        this.walljumpingLeft = false;
        this.walljumpingRight = false;
        this.checkJoinedBlocks(collisionArray);
        this.handleFloorBlocks(collisionArray);   
        if(handleGoo){
            this.handleGooBlocks();
        }
        if(handleLadder){
            this.handleLadderBlocks();
        }
    }
        
    //Kollidiert der Spieler seitlich mit einer Wand, so gleitet er langsam daran herab.
    applyWallSlideSpeed(){
        if(this.vy > this.wallSlideSpeed && !this.onLadder && !this.onGround && !this.movingOnGround){
            this.vy = this.wallSlideSpeed; 
        } 
    }
    
    //Kollidiert der Spieler mit nichts, so kann er sich frei bewegen
    moveFree(){
        
        this.jumping = true;
        this.onGround = false;
        this.onLadder = false;
        
        if(this.moveLeft) {
            this.moveL();
        }
        
        if(this.moveRight) {
            this.moveR();
        }
    }
    
    /*
        Damit der Spieler nicht an einzelnen Blöcken einer zusammengehörigen Wand stecken bleibt wird überprüft, ob er mit mehreren verbundenen Blöcken kollidiert.
        Ist dies der Fall, so wird nur eine Kollisionauflösung für das kombinierte Objekt durchgeführt.
    */
    checkJoinedBlocks(collidingObjects){
        //Bot Top Right Left
        //Check joined blocks for wall
        this.movingOnWall = false;
        this.movingOnGround = false;
        this.movingOnCeiling = false;
        
        if(collidingObjects[0] != null && collidingObjects[2] != null){
            if(collidingObjects[0].x == collidingObjects[2].x){
                this.movingOnWall = true;
            }
        }else if(collidingObjects[0] != null && collidingObjects[3] != null){
            if(collidingObjects[0].x == collidingObjects[3].x){
                this.movingOnWall = true;
            }
        }
        
        //Check joined blocks for ground 
        if(collidingObjects[0] != null && collidingObjects[2] != null){
            if(collidingObjects[0].y == collidingObjects[2].y){
                this.movingOnGround = true;
            }
        }else if(collidingObjects[0] != null && collidingObjects[3] != null){
            if(collidingObjects[0].y == collidingObjects[3].y){
                this.movingOnGround = true;
            }
        }
        
        //Check joined blocks for ceiling 
        if(collidingObjects[1] != null && collidingObjects[2] != null){
            if(collidingObjects[1].y == collidingObjects[2].y){
                this.movingOnCeiling = true;
            }
        }else if(collidingObjects[1] != null && collidingObjects[3] != null){
            if(collidingObjects[1].y == collidingObjects[3].y){
                this.movingOnCeiling = true;
            }
        }
    }
    
    //Hier wird die Reaktion des Spielers auf eine Kollision mit einem normalen festen Block beschrieben
    handleFloorBlocks(collidingObjects){
        //0=BotObj 1=TopObj 2=RightObj 3=LeftObj
        
        if(this.onCeiling){ //TopCollision
            if(this.vy <= 0) {
                this.y = collidingObjects[1].y + collidingObjects[1].height + 1;
                this.vy = -0.1;
            }
            
            if(this.moveLeft && !this.onLeft) {
                this.moveL();
            }

            if(this.moveRight && !this.onRight) {
                this.moveR();
            }
            
            if(this.moveDown && !this.onGround && !this.movingOnGround) {
                this.moveD();
            }
        }
        
        if(this.onRight){ //RightCollision
            if(!this.onLadder && !this.onGround){
                this.applyWallSlideSpeed();
            }
            if(this.vx > 0) {
                this.x = collidingObjects[2].x - this.width - 1;
                this.vx = 0;
            }
            
            if(this.moveUp && !this.onGround  && !this.onLadder && !this.movingOnCeiling && !this.movingOnGround){
                this.wallJump(true);
            }
            
            if(this.moveLeft && !this.onLeft) {
                this.moveL();
            }
            
        }
        
        if(this.onLeft){ //LeftCollision
            if(!this.onLadder && !this.onGround){
                this.applyWallSlideSpeed();
            }
            
            if(this.vx < 0) {
                this.x = collidingObjects[3].x + collidingObjects[3].width + 1;
                this.vx = 0;
            }
            
            if(this.moveUp && !this.onGround  && !this.onLadder && !this.movingOnCeiling && !this.movingOnGround) {
                this.wallJump(false);
                }
            
            if(this.moveRight && !this.onRight) {
                this.moveR();
            }
        }
        
        if(this.onGround && (this.jumping||this.onLadder) && !this.movingOnWall){ //BotCollision
            this.onLadder = false;
            this.jumping= false;
            if(this.vy > 0) {
                this.y = collidingObjects[0].y - this.height;
                this.vy = 0;
            }
        } if(this.onGround && !this.jumping){ 
            if(this.moveLeft && !this.onLeft) {
                this.moveL();
            }

            if(this.moveRight && !this.onRight) {
                this.moveR();
            }

            if(this.moveUp && !this.onCeiling) { //Jump
                this.jump();
            }
        }
    }
    
    /*
        Hier wird die Kollisionsauflösung des Spieler mit einem "Goo-Block" beschrieben. Ein solcher Block bremst die Bewegung des Spielers und ermöglicht
        eine kontinuierliche Bewegung nach oben(ähnlich wie Wasser).
    */
    handleGooBlocks(){ //Handle GooBlock
        
        //No KeyInputs
        if(this.vx > this.maxGooSpeed){
            this.vx = this.maxGooSpeed;
        } else if(this.vx < -this.maxGooSpeed){
            this.vx = -this.maxGooSpeed;
        } else{
            this.vx = this.vx * this.gooDecelarationMultiplicator;
        }
        
        //KeyInputs
        if(this.moveDown && !this.onGround){
            this.vy = this.maxGooSpeed;
            if(this.onGround){
                this.vy = 0;
            }
        }
        
        if(this.moveUp && !this.onCeiling){
            this.vy = -this.maxGooSpeed;
            this.jumping = true;
            if((this.y + this.height) <= (obstacleBoundaries[1] + this.maxGooSpeed)){
                this.y -= 5;
                this.jump(this.gooJumpMultiplicator);
            }
        } else if(!this.onGround) {
            this.vy += this.gravity;
            if(this.vy > this.maxGooSpeed){
                this.vy = this.maxGooSpeed;
            }
        }
        
        if(this.moveLeft && !this.onLeft){
                this.vx = -this.maxGooSpeed;
        }
        
        if(this.moveRight && !this.onRight){
                this.vx = this.maxGooSpeed;
        }
        
    }
    
    //Hier wird die Kollisionsauflösung des Spielers mit Leitern beschrieben. Leitern schalten Gravitation für den Spieler aus und ermöglichen das Klettern nach oben und unten.
    handleLadderBlocks(){
        
        if(!this.moveDown && !this.moveLeft && !this.moveRight && !this.moveUp){
            this.vy = 0;
            this.vx = 0;
        }
        
        if(this.moveDown && !this.onGround && !this.movingOnGround){
            this.vy += this.ySpeed;
            if(this.vy > this.maxLadderSpeed){
                this.vy = this.maxLadderSpeed;
            }      
            if(this.vy < -this.maxLadderSpeed){
                this.vy = 0;
            }
        }
        
        if(this.moveUp && !this.onCeiling){
            this.vy -= this.ySpeed;
            if(this.vy < -this.maxLadderSpeed){
                this.vy = -this.maxLadderSpeed;
            }
            if(this.vy > this.maxLadderSpeed){
                this.vy = 0;
            }
        }
        
        if(this.moveLeft && !this.onLeft){
                this.vx -= this.xSpeed;
                if(this.vx < -this.maxLadderSpeed){
                   this.vx = -this.maxLadderSpeed;
                }
                this.vx = -this.maxLadderSpeed;
        }
        
        if(this.moveRight && !this.onRight){
                this.vx += this.xSpeed
                if(this.vx > this.maxLadderSpeed){
                    this.vx = this.maxLadderSpeed;
                }
        }
        
        if(!this.moveDown && !this.moveUp){
            this.vy = 0;
        }
        
    }
    
    //Bewegung nach Links. Ist der Spieler von einer Wand rechts von ihm abgesprungen, so ist die Linksbewegung verlangsamt(verhindert unendliches Klettern an Wänden)
    moveL(){
        
        if(this.walljumpingRight){
            if(this.vx > this.minXSpeed){
                this.vx -= this.xSpeed * this.wallJumpAcceleration;
                if(this.vx < this.minXSpeed){
                    this.vx = this.minXSpeed;
                } 
            }      
        } else if(this.vx > this.minXSpeed){
                this.vx -= this.xSpeed;
                if(this.vx < this.minXSpeed){
                    this.vx = this.minXSpeed;
                }
            }
    }
    
    //Wie Links
    moveR(){
        if(this.walljumpingLeft){
            if(this.vx < this.maxXSpeed){
                this.vx += this.xSpeed * this.wallJumpAcceleration;
                if(this.vx < this.minXSpeed){
                    this.vx = this.minXSpeed;
                }
            }
        } else if(this.vx < this.maxXSpeed){
                this.vx += this.xSpeed;
                if(this.vx < this.minXSpeed){
                    this.vx = this.minXSpeed;
                }
            }
    }
    
    //Bewegung nach unten, momentan nur auf Leitern möglich
    moveD(){
        if(this.vy < this.maxYSpeed){
                this.vy += this.ySpeed;
                if(this.vy < this.minYSpeed){
                    this.vy = this.minYSpeed;
                }
            }
    }
    
    //Bewegung nach Oben
    moveU(){
        if(this.vy > this.minYSpeed){
                this.vy -= this.ySpeed;
                if(this.vy < this.minYSpeed){
                    this.vy = this.minYSpeed;
                }
            }
    }   
}

export default Player;