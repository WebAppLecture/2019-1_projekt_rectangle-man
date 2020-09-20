/*
    Hier wird der Hauptgameloop gesteuert (animate). Die gesamte Menülogik ist hier implementiert. Es wird Zugriff auf
    fast alle anderen Dateien benötigt. Um als Modul funktionieren zu könne werden diese am Anfang importiert. Die Logik
    für die Kollision findet sich hier. Wird eine Kollision registriert, so wird diese an die kollidierenden Objekte übergeben
    um diese korrekt auflösen zu können.
*/
import Player from "./Player.js";
import MapParser from "./MapParser.js";
import BackgroundImage from "./BackgroundImage.js";
import { Ladder, Block, Deathtrap, Coin } from "./Obstacle.js";
import TileSet from "./TileSet.js";
import StateManager from "./StateManager.js";

/*
    Diese Klasse wird Aum abspielen von sfx verwendet. Hierfür wird ein audio-Tag in das HTML-Dokument eingefügt.
    Wird ein Sound nochmal abgespielt, während er noch läuft, so wird die ältere Wiedergabe abgebrochen und neu
    gestartet. Das verhindert das "Stapeln" von Soundeffekten.
*/
class Sound {
    
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        
        this.play = function(){
            this.sound.currentTime = 0;
            this.sound.play();
        }
        this.stop = function(){
            this.sound.pause();
            this.sound.currentTime = 0;
        }
    } 
}

/*
    Diese Klasse wird zum abspielen der Hintergrundmusik verwendet. Hierfür wird ein audio-Tag in das HTML-Dokument eingefügt.
    Wird die Wiedergabe gestoppt, so startet sie bei erneutem Abspielen automatisch von vorne.
*/
class BGM {
    
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        this.sound.loop = true;
        document.body.appendChild(this.sound);
        
        this.play = function(){
            this.sound.play();
        }
        this.stop = function(){
            this.sound.pause();
            this.sound.currentTime = 0;
        }
    } 
}

//Diese Funktion setzt alle für den Levelstart notwendigen Variablen
function initiate(){
    setTileset();
    setMap();
    setBackground();
    setBGM();
    setPlayer();
    winSoundPlayed = 0;
    collectibles = getCollectibles(currentRawMap);
}

//Diese Funktion startet das aktuelle Level neu    
function restart(){
    initiate();
    restartSound.play();
    stateManager.setGameState("alive");
}

//Diese Funktion bereitet das nächste Level vor
function nextLevel(){
    stateManager.nextLevel();
    console.log(stateManager.levelNr);
    initiate();
}

//Initialisiert das Tileset
function setTileset(){
    currentTileSet = new TileSet(stateManager.getTileSetPath());
}

//Initialisiert die Karte
function setMap(){
    currentMap = MapParser.parse(stateManager.getMap(), currentTileSet);
    currentRawMap = currentMap.map;
}

//Initialisiert all zum Level gehörigen Backgroundlayer
function setBackground(){
    let path = stateManager.getBackgroundImagePath();
    let bg1 = new BackgroundImage(canvas, 0, 0, canvasWidth * 2, canvasHeight, path + "BackgroundLayer1.png");
    let bg2 = new BackgroundImage(canvas, 0, 0, canvasWidth * 2, canvasHeight, path + "BackgroundLayer2.png");
    let bg3 = new BackgroundImage(canvas, 0, 0, canvasWidth * 2, canvasHeight, path + "BackgroundLayer3.png");
    let bg4 = new BackgroundImage(canvas, 0, 0, canvasWidth * 2, canvasHeight, path + "BackgroundLayer4.png");
    backgroundLayers = [bg4, bg3, bg2, bg1];
}

//Initialisiert die Hintergrundmusik. Hat das nächste Level diesselbe Hintergrundmusik, so läuft dies nahtlos weiter.
function setBGM(){

    if(!bgm){
        bgm = new BGM(stateManager.getBackgroundMusicPath());
    }
    else{
        if(!bgm.sound.src.includes(stateManager.getBackgroundMusicPath().slice(1))){
            bgm.stop();
            bgm.sound.src = stateManager.getBackgroundMusicPath();
            bgm.sound.currentTime = 0;
            bgm.play();
        }
    }
    
}

//Initialisiert den Spieler
function setPlayer(){
    char = new Player(canvas, currentMap.startPosX, currentMap.startPosY, 30, 90, 0, 0, -65, 0, "#f00");
}

function getCollectibles(rawMap){
    let currentCollectibles = Array();
    for(let i=rawMap.length - 1; i>0; i--) {
        if(rawMap[i].isCollectible === true){ 
            currentCollectibles.push(rawMap.splice(i, 1)[0]);    
        }
    }
    return currentCollectibles;
}

//_____________________StartGame_____________________

//Diese Variablen sind zum Start immer gleich
let canvasHeight = 768;
let canvasWidth = 1280;
let canvas = document.querySelector("#mainframe").getContext("2d");
let stateManager = new StateManager(canvas, canvasWidth, canvasHeight, 0, "mainMenu", 0, 0);
let offsetX = 0;

let winSoundPlayed = 0;
let animationTick = 0;
let winSound = new Sound("./RES/sound/win.mp3");
let menuBlockSound = new Sound("./RES/sound/menuAbort.mp3");
let menuSwitchSound = new Sound("./RES/sound/switch.mp3");
let menuSelectSound = new Sound("./RES/sound/menuSelect.mp3");
let restartSound = new Sound("./RES/sound/restart.mp3");
let collectSound = new Sound("./RES/sound/collect.mp3");
let menuMusic = new BGM("./RES/sound/menuBGMcompressed.mp3");
menuMusic.play();

//Diese Variablen werden von der Funktion initiate() gesetzt, da sie vom aktuellen Level  abhängen
let currentTileSet;
let currentMap;
let currentRawMap;
let collectibles;
let char;
let bgm;
let backgroundLayers;

initiate();

/*
    Nützlicher Debug-Block
    console.log(currentRawMap);
    console.log(collectibles);
    console.log(document.querySelector("#mainframe"));
    console.log(currentTileSet);
    console.log(currentRawMap);
*/

/*
    Über die Keyevents wird die gesamte Menülogik gesteuert
*/
document.addEventListener("keydown", function(e) {
    if(e.repeat) {
        e.preventDefault;
    } else {
        if(stateManager.getGameState() == "alive"){
            switch(e.which){
                    case 87: //oben
                        char.moveUp = true;
                        break;
                    case 83: //unten
                        char.moveDown = true;
                        break;
                    case 65: //links
                        char.moveLeft = true;
                        break;
                    case 68: //rechts
                        char.moveRight = true;
                        break;
                }
        
            }
    }
    
});

document.addEventListener("keyup", function(e) {
    if(stateManager.getGameState() == "alive"){
        switch(e.which){
            case 87: //oben
                char.moveUp = false;
                break;
            case 83: //unten
                char.moveDown = false;
                break;
            case 65: //link
                char.moveLeft = false;
                break;
            case 68: //rechts
                char.moveRight = false;
                break;
            case 82: //Neustart
                restart();
                break;
            case 27: //toggle gameMenu on
            	menuSelectSound.play();
                stateManager.setGameState("gameMenu");
                break;
        }
        
    }else if(stateManager.getGameState() == "dead"){
        switch(e.which){
            case 82: //Neustart
                restart();
                break;
            case 27: //Zurück zum Menü
                stateManager.setGameState("mainMenu");
                menuSelectSound.play();
                bgm.stop();
            	menuMusic.play();
                break;
        }
    } else if(stateManager.getGameState() == "win"){
        switch(e.which){
            case 13: //Nächstes Level
                nextLevel();
                break;
            case 27: //Zurück zum Menü
                stateManager.setGameState("mainMenu");
                menuSelectSound.play();
                bgm.stop();
                menuMusic.play();
                break;
        }
    } else if(stateManager.getGameState() == "gameMenu"){
        switch(e.which){
            case 27: //toggle gameMenu off
            	menuBlockSound.play();
                stateManager.setGameState("alive");
                break;
            case 81: //back to MainMenu
                stateManager.setGameState("mainMenu");
                menuSelectSound.play();
                bgm.stop();
                menuMusic.play();
                break;
        }
    } else if(stateManager.getGameState() == "mainMenu"){
        switch(e.which){
            case 13: //Enter
                switch(stateManager.mainMenuPos){
                    case 0:
                        stateManager.firstLevel();
                        initiate();
                        menuSelectSound.play();
                        menuMusic.stop();
                        bgm.play();
                        stateManager.setGameState("alive");
                        break;
                    case 1:
                        if(stateManager.levelNr > 0){
                            console.log("Load Game");
                            initiate();
                            menuSelectSound.play();
                            menuMusic.stop();
                        	bgm.play();
                            stateManager.setGameState("alive");
                        }else{
                            menuBlockSound.play();
                        }
                        break;
                    case 2:
                    	menuSelectSound.play();
                        stateManager.setGameState("help");
                        break;
                }
                break;
            case 87: //oben
            	menuSwitchSound.play();
                stateManager.updateMenuPos(-1);
                console.log(stateManager.mainMenuPos);
                break;
            case 83: //unten
            	menuSwitchSound.play();
                stateManager.updateMenuPos(1);
                console.log(stateManager.mainMenuPos);
                break;
        }    
    } else if(stateManager.getGameState() == "help"){
                if(e.which === 27){
                	menuSelectSound.play();
                    stateManager.setGameState("mainMenu");
                }
    } else if(stateManager.getGameState() == "gameFinished"){
                if(e.which === 27){
                    stateManager.setGameState("mainMenu");
                    menuSelectSound.play();
                    bgm.stop();
                	menuMusic.play();
                }
    }
         
});

/*  
    Hier wird animate() zum ersten mal aufgerufen. Diese Funktion ist der Hauptloop des Spiels und ruft sich ohne Bedingung selber
    auf. Es werden alle draw()-Aufrufe für den Canvas gehandelt, gecheckt ob der Spieler gewonnen hat (einsammeln aller Sammelgegen-
    stände). Zudem wir hier die Kollisionsabfrage aufgerufen.
*/
animate();

//Eben erläuterte Funktion
function animate() {
    
    let collisionDetected = false;
    let collidingObjects = [];
    let handleLadders = false;
    let handleGoo = false;
    
    //Der animationTick wird von anderen Objekten(z.B. Coins) verwendet, um den korrekten Animationsframe anzuzeigen
    animationTick++;
    if(animationTick === 1000) {
        animationTick = 0;
    }

    /*
        Der x-Offset des Spielers wird bestimmt, um das Scrollen der Map zu ermöglichen und um die Position der Hintergrundbilder
        korrekt setzen zu können.
    */
    canvas.save();
    if(offsetX + canvasWidth/8 > char.x ) {
        offsetX = char.x - canvasWidth/8;
    }
    if(offsetX + canvasWidth * 6/8 < char.x ) {
        offsetX = char.x - canvasWidth*6/8;
    }

    if(offsetX < 0){
        offsetX = 0;
    }
    if(offsetX > currentMap.maplength - canvasWidth){
        offsetX = currentMap.maplength - canvasWidth;       
    }

    //Hier werden die Positionen der Hintergrundbildergeupdatet. Jeder Layer scrollt mit einer eigenen Geschwindigkeit um einen Parallax-Effekt zu erzuegen.
    if(offsetX > 0 && offsetX < currentMap.maplength - canvasWidth && (offsetX + canvasWidth * 6/8 <= char.x || offsetX + canvasWidth/8 >= char.x )) {
        backgroundLayers[0].scroll(-char.vx, 0, 0.005);
        backgroundLayers[1].scroll(-char.vx, 0, 0.01);
        backgroundLayers[2].scroll(-char.vx, 0, 0.02);
        backgroundLayers[3].scroll(-char.vx, 0, 0);
    }
    canvas.translate(-offsetX, 0);

    canvas.fillStyle = "#FFFFFF";
    canvas.fillRect(offsetX, 0, canvasWidth, canvasHeight);
    
    //Der Hintergrund muss nur gezeichnet werden, wenn der Spieler lebt(das tut er auch während des Pausemenüs und des win-Screens)
    if(stateManager.getGameState() === "alive" || stateManager.getGameState() === "gameMenu" || stateManager.getGameState() === "win"){
        for(let bg of backgroundLayers){
            bg.draw();
        }
    }
    
    /*
        Wenn der Spieler lebt wird seine Position basierend auf seiner Geschwindigkeit geupdatet. Anschließend wird gecheckt
        ob er bereits gewonnen hat (durch das Einsammeln aller Sammelgegenstände).
    */
    if(stateManager.getGameState() === "alive"){
        char.update();

        char.onGround = false;
        char.onCeiling = false;
        char.onLeft = false;
        char.onRight = false;

        stateManager.setGameState("win");
        for(let obj of collectibles){
            let check = collisonCheck(char, obj);
            if(check){
                if(obj.isVisible){
                    obj.isVisible = false;
                    collectSound.stop();
                    collectSound.play();
                }
            }
            if(obj.isVisible){
                obj.draw(canvas, currentMap.tileSize, animationTick);
                stateManager.setGameState("alive");
            }
        }
        if(stateManager.getGameState() === "win" && !winSoundPlayed){
        	//play level win Sound
            winSound.play();
            winSoundPlayed = 1;
        }
    }

        //Hier wird die Kollision des Spielers mit den Objekten auf der Karte überprüft
        for(let obj of currentRawMap) {
            if(stateManager.getGameState() === "alive"){
                if(obj.canCollide) {
                    let check = collisonCheck(char, obj);
                    if(check) {
                        collisionDetected = true;

                        if(obj.obstacleType === Deathtrap.type){
                            stateManager.setGameState("dead");
                        } else if(obj.obstacleType === Block.type) {
                            if(check.collision[0]){
                                char.onGround = true;
                                collidingObjects[0] = obj;
                            }

                            if(check.collision[1]){
                                char.onCeiling = true;
                                collidingObjects[1] = obj;
                            }

                            if(check.collision[2]){
                                char.onRight = true;
                                collidingObjects[2] = obj;
                            }

                            if(check.collision[3]){
                                char.onLeft = true;
                                collidingObjects[3] = obj;
                            }
                        } else if(obj.obstacleType === Ladder.type){
                            handleLadders = true;
                        }
                    }
                }
            }
            if(stateManager.getGameState() === "alive" || stateManager.getGameState() === "gameMenu" || stateManager.getGameState() === "win"){
                obj.draw(canvas);
            }
        }
        
        if(stateManager.getGameState() === "alive"){
            char.onLadder = handleLadders;

            if(!collisionDetected){
                char.moveFree();
            }
            else{
                char.handleCollision(collidingObjects, handleGoo, handleLadders);
            }
        }
    
    if(stateManager.getGameState() === "alive" || stateManager.getGameState() === "gameMenu" || stateManager.getGameState() === "win"){
        char.draw();
    }

    stateManager.drawScreen(offsetX);
    canvas.restore();
    window.requestAnimationFrame(animate);
}

/*
    Die Kollisionsfunktion. Funktioniert auf dem Prinzip von Überschneidung. Zusätzlich gibt die Funktion ein Array zurück, dass
    die Seite der Kollision angibt, sowie die Position des Hindernisses, um den Spieler herrauszusetzen.
*/
function collisonCheck(a, b){ //a=Spieler, b=Objekt
    let collisionArray = []; // 0=BotCol 1=TopCol 2=RightCol 3=LeftCol
    let obstacleBoundaries = [b.x, b.y, b.x + b.width, b.y + b.height]; //LeftBoundary, TopBoundary, RightBoundary, BotBoundary
    
    if (a.x <= b.x + b.width &&
       a.x + a.width >= b.x &&
       a.y <= b.y + b.height &&
       a.height + a.y >= b.y) {
            let a_bottom = a.y + a.height;
            let b_bottom = b.y + b.height;
            let a_right = a.x + a.width;
            let b_right = b.x + b.width;

            let b_collision = b_bottom - a.y;
            let t_collision = a_bottom - b.y;
            let l_collision = a_right - b.x;
            let r_collision = b_right - a.x;

            if (t_collision <= b_collision && t_collision <= l_collision && t_collision <= r_collision )
            {   
                collisionArray.push(true);
                //console.log("Bot");
            //Bot collision
            } else{
                collisionArray.push(false);
            }
        
            if (b_collision <= t_collision && b_collision <= l_collision && b_collision <= r_collision)                        
            {
                collisionArray.push(true);
                //console.log("Top");
            //Top collision
            } else{
                collisionArray.push(false);
            }
        
            if (l_collision <= r_collision && l_collision <= t_collision && l_collision <= b_collision)
            {
                collisionArray.push(true);
                //console.log("Right");
            //Right collision
            } else{
                collisionArray.push(false);
            }
        
            if (r_collision <= l_collision && r_collision <= t_collision && r_collision <= b_collision )
            {
                collisionArray.push(true);
                //console.log("Left");
            //Left collision
            } else{
                collisionArray.push(false);
            }
        
        return {
            "collision": collisionArray, 
            "obstacleBoundaries": obstacleBoundaries,
            "obstacleType": b.obstacleType,
        };
    } else {
        return false;
    };
}
