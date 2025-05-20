class Bola extends Rectangle {
    constructor(puntPosicio, amplada, alcada) {
        super(puntPosicio, amplada, alcada);       
        this.velocitatx = 0.5;
        this.velocitaty = 0.5;
        this.color = "#eee";
       
    };
    mou(mouX,mouY){
        this.puntPosicio.x += mouX;
        this.puntPosicio.y += mouY;
    }

    update(ampleCanva, altCanva, palaJugador, palaOrdinador){
    /********************************* 
     * Tasca. Actualitzar la posició de la bola tenin en  compte
     * Si xoca o no amb els marges del canvas
     * Si xoca o no amb les pales dels jugadors 
    ********************************** JA HO MIREM EN UN ALTRE METODE*/                         

         
    /********************************* 
     * Identifica el punt actual
     * Defineix el punt següent. On ha d'anar la bola
     * Definiex un SEGMENT que vagi del PuntActual al PuntSegüent
     * Revisar si xoca amb les vores del canvas 
     * Si xoca amb una vora superior o inferior, canviar el sentit i sortir
     * Si xoca amb una vora lateral, identificar punt aconseguit i reiniciar
     * Revisar si xoca amb una Pala
     * Si xoca, canviar el sentit en funció de si ha xocar
     * a dreta, esquerra, a dalt o a baix de la pala
     * canviar el sentit en ió d'on ha xocat i sortir
     * FET M *********************************/  
        let xoc = false; 
        let puntActual = new Punt(this.puntPosicio.x, this.puntPosicio.y);
        let puntSeguent = new Punt(this.puntPosicio.x + this.velocitatx, this.puntPosicio.y + this.velocitaty);
        let segmentTrajectoria = new Segment(puntActual, puntSeguent);

     /********************************* 
     * Tasca. Revisar si xoca amb tots els marges del canva
     * COMENÇAT M - REVISAR*********************************/ 
         xoc = this.revisaXocTop(segmentTrajectoria);
         if(!xoc) xoc = this.revisaXocInferior(segmentTrajectoria, altCanva);
         if(!xoc) xoc = this.revisaXocEsquerra(segmentTrajectoria); 
         if(!xoc) xoc = this.revisaXocDreta(segmentTrajectoria, ampleCanva); 
    
              /********************************* 
             * Tasca. Revisar si xoca amb alguna pala i 
             * en quina vora de la pala xoca 
                **********************************/ 
            let xocPala = this.revisaXocPales(segmentTrajectoria,palaJugador, palaOrdinador);
            if(xocPala){
                xoc = true;
            
                 /********************************* 
                 * Tasca. Si xoca amb alguna pala 
                 * canviar el sentit en funció de si ha xocar
                * a dreta, esquerra, a dalt o a baix de la pala 
                * Poder heu de tenir en compte en quina pala s'ha produït el xoc
                **********************************/ //FET URI

                if (xocPala.vora === "vorasuperior??") {
                    // Si xoca a la vora superior de la pala
                    this.velocitaty = -this.velocitaty;
                    this.puntPosicio.y = xocPala.pI.y - this.alcada;
                } else if (xocPala.vora === "vorainferior??") {
                    // Si xoca a la vora inferior de la pala 
                    this.velocitaty = -this.velocitaty;
                    this.puntPosicio.y = xocPala.pI.y + this.alcada;                    
                } else if (xocPala.vora === "voraesquerra??") {
                    // Si xoca a la vora esquerra de la pala
                    this.velocitatx = -this.velocitatx;
                    this.puntPosicio.x = xocPala.pI.x - this.amplada;
                } else if (xocPala.vora === "voradreta??") {
                    // Si xoca a la vora dreta de la pala
                    this.velocitatx = -this.velocitatx;
                    this.puntPosicio.x = xocPala.pI.x + this.amplada;
                }
        }
        if(!xoc){
            // Si no hi ha xoc, actualitzem la posició de la bola
            this.mou(this.velocitatx, this.velocitaty);
            // Actualitzem la posició de la bola al punt següent
            this.puntPosicio.x = segmentTrajectoria.puntB.x;
            this.puntPosicio.y = segmentTrajectoria.puntB.y;
        } else {
            // Si hi ha xoc, actualitzem la posició de la bola a la posició d'intersecció i canviem velocitat
            this.velocitatx = -this.velocitatx;
            this.velocitaty = -this.velocitaty;
            // Actualitzem la posició de la bola al punt d'intersecció
            this.puntPosicio.x = xocPala.pI.x;
            this.puntPosicio.y = xocPala.pI.y;
            // Actualitzem la posició de la bola al punt d'intersecció
            this.puntPosicio.x = segmentTrajectoria.puntB.x;
            this.puntPosicio.y = segmentTrajectoria.puntB.y;
        };
    };

    /********************************* 
     * Tasca. Mètode que utilitza un objecte SEGMENT
     * i identifica si hi ha un xoc amb alguna de les
     * vores del camp
     * Aquí un exemple de com identificar un xoc al marge superior
     * Com a paràmetre accepta un SEGMENT que heu de crear anteriorment
     * Cal fer un mètode per cada lateral que manca: esquerra, dret i inferior
     * El el cas dels laterals caldrà assignar puntuació i reiniciar un nou joc
    **********************************/ // FET CARLA  - REVISAR      
        
        revisaXocTop(segmentTrajectoria){
            if(segmentTrajectoria.puntB.y <0){
                let exces = (segmentTrajectoria.puntB.y)/this.velocitaty;
                this.puntPosicio.x = segmentTrajectoria.puntB.x - exces*this.velocitatx;
                this.puntPosicio.y = 0;
                this.velocitaty = -this.velocitaty;
                return true;
            }
        };

        revisaXocInferior(segmentTrajectoria, altCanva){
            if(segmentTrajectoria.puntB.y > altCanva){
                let exces = (segmentTrajectoria.puntB.y)/this.velocitaty;
                this.puntPosicio.x = segmentTrajectoria.puntB.x - exces*this.velocitatx;
                this.puntPosicio.y = altCanva;
                this.velocitaty = -this.velocitaty;
                return true;
            }
        };
        
        //canviar reiniciar
        revisaXocEsquerra(segmentTrajectoria){
            if(segmentTrajectoria.puntB.x < 0){
                //torna a posar al centre la bola
                //puntuacions
                return true;
            }
        };

        revisaXocDreta(segmentTrajectoria) {
            if (segmentTrajectoria.puntB.x > this.amplada) {
                //torna a posar al centre la bola
                //puntuacions
                return true;
            }
        };
            
    
     /********************************* FET M 
     * Tasca. Mètode que utilitza un objecte SEGMENT
     * i el seu  INTERSECCIOSEGMENTRECTANGLE per determinar
     * a quina vora del rectangle s'ha produït la col·lisió
     * i quin ha sigut el punt d'intersecció
     * Complemem la informació retornada amb la identificació
     * de quina pala (jugador o màquina) ha provocat el xoc
     * retorna PuntVora, que conté:
     * -El punt d'intersecció
     * -El costat de la pala on s'ha donat la col·lisió
     * -Un identificador de quina pala ha col.lisionat
    **********************************/

    revisaXocPales(segmentTrajectoria, palaJugador, palaOrdinador) {
        let interseccioJugador = segmentTrajectoria.interseccioSegmentRectangle(palaJugador);
        if (interseccioJugador) {
            return {
                pI: interseccioJugador.pI,
                vora: interseccioJugador.vora,
                pala: "jugador"
            };
        }
        let interseccioOrdinador = segmentTrajectoria.interseccioSegmentRectangle(palaOrdinador);
        if (interseccioOrdinador) {
            return {
                pI: interseccioOrdinador.pI,
                vora: interseccioOrdinador.vora,
                pala: "màquina"
            };
        }
        // Si no hi ha intersecció amb cap pala, retornem null
        // o un objecte amb informació per identificar que no hi ha xoc
            return null; // No hi ha xoc amb cap pala
        }
        
}
    