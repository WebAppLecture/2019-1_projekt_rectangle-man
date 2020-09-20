/*
    Diese Klasse wird benutzt um aus einem Level in Textform Objekt auf dem Canvas zu erstellen. Der Spieler kann dann mit diesen Objekten interagieren.
    Um ein Level generieren zu können benötigt diese Klasse ein Level in Textform sowie ein Tileset, damit die richtigen Bilder und Objekttypen zugewiesen
    werden können. Jedes Objekt wird blockweise generiert. Ein Block ist so groß wie in dem zugehörigen Tileset definiert. Das erleichtert das Verwenden
    von verschiedenen Themen(z.B. Dschungel, Wüste, Schnee etc.), da die zugehörigen Bilder leicht ersetzt werden können.
*/

import {Block, Ladder, Coin, Deathtrap} from "./Obstacle.js";
import Deco from "./Deco.js";

class MapParser{
        
    static parse(rawMap, tileSet) {
        this.mapWrapper = {};
        let map = [];
        this.tiles = tileSet.tiles;
        this.mapping = tileSet.mapping;
        this.tileSize = tileSet.tileSize;
        this.mapWrapper.startPosX = 0;
        this.mapWrapper.startPosY = 0;
        this.maplength = 0;
    
        let mapData = rawMap.map;
        for(let i=0; i < mapData.length; i++) {
            for(let j = 0; j < mapData[i].length; j++) {
                let obj = this.generateObject(mapData, i, j);
                if(obj) {
                    map.push(obj);
                }
            }
        }
        this.mapWrapper.maplength = mapData.length * this.tileSize;
        this.mapWrapper.tileSize = this.tileSize;
        this.mapWrapper.map = map;
        return this.mapWrapper;
    }
    
    //Hier werden die Objekte generiert
    static generateObject(mapData, i, j) {
        let reverse = mapData[i].length - (j + 1); // Switches direction of map generation so up=up;
        switch(mapData[i][j]) {
            case this.mapping.leftWall:
            case this.mapping.rightWall:
            case this.mapping.leftBlock:
            case this.mapping.rightBlock:
            case this.mapping.block:
                return this.generateBlock(this.tiles[mapData[i][j]], i, reverse);
            case this.mapping.ladderTop:
            case this.mapping.ladder:
            case this.mapping.ladderBottom:
                return this.generateLadder(this.tiles[mapData[i][j]], i, reverse);
            case this.mapping.leftEdge:
            case this.mapping.rightEdge:
                return this.generateDecoBlock(this.tiles[mapData[i][j]], Deco.background, i, reverse);
            case this.mapping.air:
                return this.generatePossibleDeco(mapData, i, reverse);
            case this.mapping.coin:
                return this.generateCoin(this.tiles[mapData[i][j]], i, reverse);
            case this.mapping.deathtrap:
                return this.generateDeathtrap(this.tiles[mapData[i][j]], i, reverse);
            case this.mapping.startPosition:
                this.generateStartPosition(i, reverse);
                return false;
            default:
                return this.generateDefault(i,reverse);
        }
    }
                
    static generateBlock(type, i, j) {
        return new Block(this.tileSize * i, this.tileSize * j, this.tileSize, this.tileSize, type);
    }

    static generateLadder(type, i, j) {
        return new Ladder(this.tileSize * i, this.tileSize * j, this.tileSize, this.tileSize, type);
    }
    
    static generateLadderTop(type, i, j) {
        return new Ladder(this.tileSize * i, this.tileSize * j, this.tileSize, this.tileSize, type);
    }
    
    static generateLadderBot(type, i, j) {
        return new Ladder(this.tileSize * i, this.tileSize * j, this.tileSize, this.tileSize, type);
    }
    
    static generateCoin(type, i, j) {
        return new Coin(this.tileSize * i, this.tileSize * j, this.tileSize, this.tileSize, type);
    }
    
    static generateDeathtrap(type, i , j){
        return new Deathtrap(this.tileSize * i, this.tileSize * j, this.tileSize, this.tileSize, type, this.tileSize);
    }

    static generatePossibleDeco(mapData, i, j) {
        let blocks = [this.mapping.leftBlock, this.mapping.rightBlock, this.mapping.block];
        if(blocks.includes(mapData[i][j-1])) {
            
        }
    }

    static generateDecoBlock(type, layer, i, j) {
        return new Deco(this.tileSize * i, this.tileSize * j, this.tileSize, this.tileSize, type, layer);
    }

    static generateDefault(layer, i, j) {
        return new Deco(this.tileSize * i, this.tileSize * j, this.tileSize, this.tileSize, null, layer, "#00f");
    }
    
    static generateStartPosition(i, j){
        this.mapWrapper.startPosX = this.tileSize * i + this.tileSize/4;
        this.mapWrapper.startPosY = this.tileSize * j;
    }
    
}

export default MapParser;