/*
    Diese Klasse verwaltet den Spielstatus, sowie alle Level. Der Spielstatus bestimmt, welche Möglichkeiten der Spieler zur Interaktion hat(Menü, Im Level, usw.).
*/

import BackgroundImage from "./BackgroundImage.js";

class StateManager{
    
    constructor(canvas, canvasWidth, canvasHeight, levelNr, gameState, mainMenuPos, gameMenuPos){
        this.canvas = canvas;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.levelNr = levelNr || 0;
        this.gameState = gameState || "mainMenu";
        
        this.mainMenuOptions = 3;
        this.gameMenuOptions = 2;
        this.mainMenuPos = mainMenuPos;
        this.gameMenuPos = gameMenuPos;
        this.deadScreen = new BackgroundImage(canvas, 0, 0, canvasWidth, canvasHeight, "./RES/DeadScreen.png");
        this.winScreen = new BackgroundImage(canvas, 0, 0, canvasWidth, canvasHeight, "./RES/WinScreen.png");
        this.gameFinishedScreen = new BackgroundImage(canvas, 0, 0, canvasWidth, canvasHeight, "./RES/GameFinished.png");
        this.gameMenuScreen = new BackgroundImage(canvas, 0, 0, canvasWidth, canvasHeight, "./RES/PauseScreen.png");
        this.mainMenuScreen = new BackgroundImage(canvas, 0, 0, canvasWidth, canvasHeight, "./RES/MainMenuTransparent.png");
        this.helpScreen = new BackgroundImage(canvas, 0, 0, canvasWidth, canvasHeight, "./RES/HelpScreen.png");
        this.mainMenuSelectorStartOffsetX= 440;
        this.mainMenuSelectorStartOffsetY= 490;
        this.mainMenuSelectorCurrentOffsetX= 440;
        this.mainMenuSelectorCurrentOffsetY= 490 + this.mainMenuPos * 96;
        this.mainMenuSelectorWidth= 370;
        this.mainMenuSelectorHeigth= 40;
        this.mainMenuSelectorColor = "#CC3333";
        
        this.allMaps = [];
        this.pushMaps();
    }
    
    drawLevelName(canvas) {
        canvas.drawImage(this.img.img, this.img.sx, this.img.sy, this.img.sWidth, this.img.sHeight, this.x + this.imgOffsetX, this.y + this.imgOffsetY, this.width, this.height);
    }
    
    //Startet das nächste Level
    nextLevel(){
        if(this.levelNr < this.allMaps.length - 1){
            this.levelNr += 1;
            this.setGameState("alive");
        }else{
            console.log("Hooray!");
            this.setGameState("gameFinished");
        }
    }
    
    //Setzt das aktuell gewählte Level auf das erste zurück
    firstLevel(){
        this.levelNr = 0;
    }
    
    //Gibt den Pfad der aktuellen Levekarte an(Element von allMaps)
    getMap(){
        return this.allMaps[this.levelNr];
    }
    
    //Gibt den Pfad zum aktuellen Tileset an(bestimmt Erscheinungsbild des Levels)
    getTileSetPath(){
        return this.allMaps[this.levelNr].tileset;
    }
    
    //Gibt den Pfad zu dem Hintergrundbildordner des Aktuellen Levels an. Dieser enthält die verschiedenen Hintergrundebenenbilder.
    getBackgroundImagePath(){
        return this.allMaps[this.levelNr].background;
    }
    
    //Gibt den Pfad zur Hintergrundmusik des aktuellen Levels an
    getBackgroundMusicPath(){
        return this.allMaps[this.levelNr].bgm;
    }
    
    setGameState(gameState){
        this.gameState = gameState;
    }
    
    getGameState(){
        return this.gameState;
    }
    
    //Ändert die Position des Aktuell aktiven Menüselektors
    updateMenuPos(direction){
        if(this.gameState === "gameMenu"){
                if(direction === 1){
                    if(this.gameMenuPos <= this.gameMenuOptions - 2){
                        this.gameMenuPos++;
                    }
                } else if(direction === -1){
                    if(this.gameMenuPos > 0){
                        this.gameMenuPos--;
                    }
                }
           } else if(this.gameState === "mainMenu"){
               if(direction === 1){
                    if(this.mainMenuPos <= this.mainMenuOptions - 2){
                        this.mainMenuPos++;
                    }
                } else if(direction === -1){
                    if(this.mainMenuPos > 0){
                        this.mainMenuPos--;
                    }
                }
               this.mainMenuSelectorCurrentOffsetY = this.mainMenuSelectorStartOffsetY + 96 * this.mainMenuPos;
        }
    }
    
    //Zeichnet alle Eventscreens, basierend auf dem Spielstatus
    drawScreen(offsetX){
        switch(this.gameState){
            case "win":
                this.winScreen.updatePos(offsetX, 0);
                this.winScreen.draw();
                break;
            case "dead":
                this.deadScreen.updatePos(offsetX, 0);
                this.deadScreen.draw();
                break;
            case "help":
                this.helpScreen.updatePos(offsetX, 0);
                this.helpScreen.draw();
                break;
            case "mainMenu":
                this.canvas.fillStyle = this.mainMenuSelectorColor;
                this.canvas.fillRect(this.mainMenuSelectorCurrentOffsetX + offsetX, this.mainMenuSelectorCurrentOffsetY, this.mainMenuSelectorWidth, this.mainMenuSelectorHeigth);
                this.mainMenuScreen.updatePos(offsetX, 0);
                this.mainMenuScreen.draw();
                break;
            case "gameMenu":
                this.gameMenuScreen.updatePos(offsetX, 0);
                this.gameMenuScreen.draw();
                break;
            case "gameFinished":
                this.gameFinishedScreen.updatePos(offsetX, 0);
                this.gameFinishedScreen.draw();
                break;
            default:
                break;
        }
    }
    
    //Lädt alle vordefinierten Levels in das Array allMaps
    pushMaps(){

        this.allMaps.push({'map' :[
            'LLLLLLLLLLLL',
            '#___________',
            '#__S________',
            '#___________',
            '#_c_________',
            '#_c_________',
            '#_c_________',
            '#___________',
            '#___________',
            '#_c_________',
            '#__c________',
            '#__&________',
            '#__#_c______',
            '#__#_c______',
            '#__%________',
            '#___________',
            '#TTTTTT_____',
            'd_____#_c___',
            'd_____#_c___',
            'TTTTTTTTTTTT'],
            'tileset': './RES/JungleTiles.png',
            'background': './RES/Parallax/Jungle/',
            'bgm': './RES/sound/jungleBGM.mp3'});

        this.allMaps.push({'map' :[
            'LLLLLLLLLLLL',
            '##____c_c___',
            '##__S_c_c___',
            '##____c_c___',
            '#HHHHHHh____',
            '#TTTTTT#____',
            'd_c____#____',
            'd___c__%____',
            '#___________',
            '#__TTTTTTTTT',
            '#__LLLLLLLLL',
            '#____c____c_',
            '#_c_____c___',
            '#TTTTTTTT___',
            '#LLLLLLLL_c_',
            'd__&________',
            'd__#_c______',
            'd__%________',
            '#_c_________',
            'TTTTTTTTTTTT'],
            'tileset': './RES/JungleTiles.png',
            'background': './RES/Parallax/Jungle/',
            'bgm': './RES/sound/jungleBGM.mp3'});

        this.allMaps.push({'map' :[
            'LLLLLLLLLLLL',
            '#_____c_c___',
            '#__S__c_c___',
            '#_____c_c___',
            '#__TTTTTT___',
            '#____#__#_c_',
            '#____#______',
            '#HHHHh______',
            'd___________',
            'd___________',
            'd_____&_____',
            'd__&__*_c___',
            'd__*__+_c___',
            'd__#__%_____',
            'd__#________',
            'd__zHHHh____',
            'd_____+_____',
            'd__c__%_c___',
            'd__c____c___',
            'TTTT___TTTTT',
            'LLLL___LLLLL',
            'd_______cc__',
            'd___________',
            'd___________',
            '#TTT____c___',
            '#LLL____c___',
            '#___________',
            '#HHHHHHh____',
            '#TTTTTTc_c__',
            '#LLLLLLc_c__',
            '#_c_________',
            '#_c_________',
            '#_c_________',
            '#TTTTTTTTTTT'],
            'tileset': './RES/JungleTiles.png',
            'background': './RES/Parallax/Jungle/',
            'bgm': './RES/sound/jungleBGM.mp3'});

        this.allMaps.push({'map' :[
            'LLLLLLLLLLLL',
            'd___________',
            'd_&_________',
            'd_#c_____S__',
            'd_#c________',
            'd_%_________',
            'd_______LLLL',
            'd___________',
            'd___&_______',
            'd___#___#_c_',
            'd___%_______',
            'd___________',
            'd___________',
            'd___________',
            'd___________',
            'd___________',
            'd__&___LLLLL',
            'd__#_____&__',
            'd__%_____#_c',
            '#TTTd____%__',
            'd__&____#___',
            'LLL#________',
            'd__%___TTTT_',
            'd______LLLL_',
            'LLLLLd______',
            'd___________',
            '#___TTTTTd__',
            '#___LLLLLLLL',
            '#___________',
            'd___________',
            'd___________',
            'd__c________',
            'd___________',
            'TTTTTTTTTTTT'],
            'tileset': './RES/RainforestTiles.png',
            'background': './RES/Parallax/Rainforest/',
            'bgm': './RES/sound/rainforestBGM.mp3'});
        
        this.allMaps.push({'map' :[
            'LLLLLLLLLLLL',
            '#___________',
            '#__S________',
            '#_c_________',
            '#_c_________',
            '#_c_________',
            '#_c_________',
            '#_c_________',
            '#_c_________',
            '#_c_________',
            '#_c_________',
            '#_c_________',
            '#_c_________',
            '#_c_________',
            '#_c_________',
            '#_c_________',
            '#_c_________',
            '#_c_________',
            '#_c_________',
            '#HHHHHh_____',
            '#TTTTTTccTTT'],
            'tileset': './RES/EgyptianTiles.png',
            'background': './RES/Parallax/Desert/',
            'bgm': './RES/sound/desertBGM.mp3'});
    }
}

export default StateManager;