class Joc{
    constructor(myCanvas, myCtx){
        this.myCanvas = myCanvas;
        this.myCtx = myCtx;
        this.amplada = myCanvas.width;
        this.alcada = myCanvas.height;
        this.palaE = new Pala ();
        this.palaD = palaD;
        this.bola = bola;
        this.palaE = new Pala (new Punt (0+2, myCanvas.height/2-20/2),3,20);//2 marge
        this.palaD = new Pala (new Punt (myCanvas.width-2-3, myCanvas.height/2-20/2),3,20); //-3 pq amplada pala
        this.bola = new Bola (new Punt (myCanvas.width/2, myCanvas.height/2),5,5);

        //Elements del joc - FET CARLA
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

        /*********************************- FET CARLA
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
          this.bola.actualitza();              
          this.palaJugador.actualitza();      
          this.palaOrdinador.actualitza();     
        
          let segment = this.bola.getSegment(); 
          let xocPala = this.bola.revisaXocPales(segment, this.palaJugador, this.palaOrdinador);
          if (xocPala !== null) {
            this.bola.gestionaRebot(xocPala); 
          }
         
        this.draw();
    }

    draw(){
        this.clearCanvas();
        /********************************* 
         * Tasca. Dibuixar els elements del joc
         * al canva, un cop actualitzades
         * les seves posicions: Pales, bola, etc
        **********************************/  
        
    }
    //Neteja el canvas
    clearCanvas(){
        this.myCtx.clearRect(
            0,0,
            this.amplada, this.alcada
        )
    }


}