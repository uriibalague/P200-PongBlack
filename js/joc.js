class Joc{
    constructor(myCanvas, myCtx){
        this.myCanvas = myCanvas;
        this.myCtx = myCtx;
        this.amplada = myCanvas.width;
        this.alcada = myCanvas.height;
        this.palaE = new Pala (new Punt (4,myCanvas.height/2-13),4,26);//2 marge - per mides variables? millor q constants (26)
        this.palaD = new Pala (new Punt (myCanvas.width-4-3, myCanvas.height/2-13),4,26); //-3 pq amplada pala
        this.bola = new Bola (new Punt (myCanvas.width/2, myCanvas.height/2),7,7);

        //Elements del joc - FET CARLA - revisar
        /********************************* 
         * Tasca. Crear els elements del joc
         * Pales, bola, etc
        **********************************/
       

        //Tecles de control
         //tecles del Joc. Només fem servir up i down
        this.key = {
            RIGHT: {code: 39, pressed: false},
            LEFT: {code: 37, pressed: false},
            DOWN: {code: 40, pressed: false},
            UP: {code: 38, pressed: false}
        }
    }
    set velocitat(velocitatJoc){
        this.velocitatJoc = velocitatJoc;
    }

    inicialitza(){

        $(document).on("keydown",{joc:this}, function(e){
             /********************************* - FET CARLA
             * Tasca. Indetificar la tecla premuda si és alguna
             * de les definides com a tecla de moviment
             * Actualitzar la propietat pressed a true 
            **********************************/
           if (e.keyCode == joc.key.RIGHT.code){
                joc.key.RIGHT.pressed = true;
            }
            else if (e.keyCode == joc.key.LEFT.code){
                joc.key.LEFT.pressed = true;
            }
            else if (e.keyCode == joc.key.DOWN.code){
                joc.key.DOWN.pressed = true;
            }
            else if (e.keyCode == joc.key.UP.code){
                joc.key.UP.pressed = true;
            }
           
        });
        $(document).on("keyup", {joc:this}, function(e){
            /********************************* - FET CARLA
             * Tasca. Indetificar la tecla que ja no està premuda,
             * si és alguna de les definides com a tecla de moviment
             * Actualitzar la propietat pressed a false
            **********************************/
           if (e.keyCode == joc.key.RIGHT.code){
                joc.key.RIGHT.pressed = false;
            } else if (e.keyCode == joc.key.LEFT.code){
                joc.key.LEFT.pressed = false;
            } else if (e.keyCode == joc.key.DOWN.code){
                joc.key.DOWN.pressed = false;
            } else if (e.keyCode == joc.key.UP.code){
                joc.key.UP.pressed = false;
            }
            
        });

        /********************************* - FET CARLA
         * Tasca. Dibuixar inicialment els elements del joc
         * al canva: Pales, bola, etc
        **********************************/
        this.draw();
       //Màtode de crida recursiva per generar l'animació dels objectes
        requestAnimationFrame(animacio);

    }

    update(){
          /********************************* M 
         * Tasca. Actualitzar les posicions 
         * dels elements del joc
         * al canva: Pales, bola, etc
        **********************************/                
          this.palaD.update(this.key, this.alcada);      
          this.palaE.updateAuto(this.alcada);
          this.bola.update(this.amplada, this.alcada, this.palaE, this.palaD);        
         
        this.draw();
    }

    draw(){
        this.clearCanvas();
        /********************************* - FET CARLA
         * Tasca. Dibuixar els elements del joc
         * al canva, un cop actualitzades
         * les seves posicions: Pales, bola, etc
        **********************************/  
       this.bola.draw(this.myCtx);
       this.palaD.draw(this.myCtx);
       this.palaE.draw(this.myCtx);

        
    }
    //Neteja el canvas
    clearCanvas(){
        this.myCtx.clearRect(
            0,0,
            this.amplada, this.alcada
        )
    }


}