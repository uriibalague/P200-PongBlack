class Pala extends Rectangle{
    constructor(puntPosicio, amplada, alcada){
        super(puntPosicio, amplada, alcada);
        this.velocitatX = 1;
        this.velocitatY = 1;
        this.color = "#eee";
    }

    mou(x,y){
        this.puntPosicio.x += x;
        this.puntPosicio.y += y;
    }
    
    update(key, alcada){
        if(key.DOWN.pressed){
         /********************************* -FET CARLA
         * Tasca. Definir el moviment de la pala
         * en funció de la tecla premuda
        **********************************/
        if(this.puntPosicio.y + this.alcada < alcada){
            this.mou(0,this.velocitatY);
        }
        else {
             this.mou(0,-this.velocitatY);
        }

        }
        if(key.UP.pressed){
       /********************************* - FET CARLA
         * Tasca. Definir el moviment de la pala
         * en funció de la tecla premuda
        **********************************/
       if (this.puntPosicio.y - this.alcada + 28 > 0){
        this.mou(0, - this.velocitatY);
       }
       else {
        this.mou(0, this.velocitatY);   
       }
        }
    }
    updateAuto(alcada){
        /********************************* - FET CARLA - PREGUNTAR
         * Tasca. Definir el moviment de la pala
         * automàtica en moviment constant 
         * o amb variacions aleatories
        **********************************/
       //update? - el -28 pq alcada pala - preguntar si esta be i si fer variable o utilitzar constants com fins ara
       if (this.puntPosicio.y + this.velocitatY + this.alcada >= alcada || this.puntPosicio.y + this.velocitatY + this.alcada - 28 <= 0){
        this.velocitatY = -this.velocitatY;
       }
        this.mou(0, this.velocitatY);
    }

}