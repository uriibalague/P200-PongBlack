class Pala extends Rectangle{
    constructor(puntPosicio, amplada, alcada, color = "#eee"){
        super(puntPosicio, amplada, alcada);
        this.velocitatX = 1;
        this.velocitatY = 1;
        this.color = color;
        this.velocitat = 1;
    }

    mou(x,y){
        this.puntPosicio.x += x;
        this.puntPosicio.y += y;
    }
    
    update(key, alcada){
        const vel = typeof this.velocitat !== "undefined" ? this.velocitat : this.velocitatY;
        if(key.DOWN.pressed){
            if(this.puntPosicio.y + this.alcada < alcada){
                this.mou(0, vel);
            }
            else {
                this.mou(0, -vel);
            }
        }
        if(key.UP.pressed){
            if (this.puntPosicio.y - this.alcada + 28 > 0){
                this.mou(0, -vel);
            }
            else {
                this.mou(0, vel);   
            }
        }
    }
    updateAuto(alcada){
        const vel = typeof this.velocitat !== "undefined" ? this.velocitat : this.velocitatY;
        if (this.puntPosicio.y + vel + this.alcada >= alcada || this.puntPosicio.y + vel <= 0){
            this.velocitat = -vel;
        }
        this.mou(0, this.velocitat);
    }

}