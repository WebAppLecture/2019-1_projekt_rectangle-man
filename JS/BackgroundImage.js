/*
    Diese Klasse ist ein Wrapper für die verwendeten Hintergrundbilder. Sie kümmert sich um das Anpassen der 
    Positionen an die aktuelle Spielerposition, das Scrolling der verschiedenen Hintergrundlayer und das 
    Zeichnen der Bilder auf dem Canvas.
*/
class BackgroundImage{
    constructor(canvas, x, y, width, height, imgPath){
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = document.createElement('img');
        this.img.src = imgPath;
        this.img.onload = this.draw.bind(this);
        this.totalOffsetX = 0;
        this.totalOffsetY = 0;
    }
    
    //Zeichnet das Bild auf dem Canvas
    draw(offsetX) {
        this.canvas.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    
    //Passt die x- und y-Koordinaten des Bilds an die Position des Spielers an
    updatePos(newX, newY){
        this.x = newX;
        this.y = newY;
    }
    
    //Ermöglicht das dynamische Scrollen der verschiednen Backgroundlayer
    scroll(offsetX, offsetY, speed){
        this.totalOffsetX += offsetX * speed;
        this.totalOffsetY += offsetY * speed;
        
        if(this.totalOffsetX >= this.width/2){
            this.totalOffsetX = 0;
        }
        
        this.x = this.totalOffsetX;
    }
    
}

export default BackgroundImage;