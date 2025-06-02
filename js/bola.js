class Bola extends Rectangle {
    constructor(puntPosicio, amplada, alcada, color = "#eee") {
        super(puntPosicio, amplada, alcada);
        this.velocitatx = 0.1;
        this.velocitaty = 0.1;
        this.color = color;
    }

    mou(mouX, mouY) {
        this.puntPosicio.x += mouX;
        this.puntPosicio.y += mouY;
    }

    reset(amplada, alcada) {
        this.puntPosicio.x = amplada / 2;
        this.puntPosicio.y = alcada / 2;
        let speed = Math.sqrt(this.velocitatx * this.velocitatx + this.velocitaty * this.velocitaty);
        if (!speed || isNaN(speed)) speed = 0.1;
        let angle = Math.random() * Math.PI / 2 - Math.PI / 4;
        let dir = Math.random() < 0.5 ? -1 : 1;
        this.velocitatx = speed * Math.cos(angle) * dir;
        this.velocitaty = speed * Math.sin(angle);
    }

    update(amplada, alcada, palaE, palaD, joc) {
        let xoc = false;
        let puntActual = new Punt(this.puntPosicio.x, this.puntPosicio.y);
        let puntSeguent = new Punt(this.puntPosicio.x + this.velocitatx, this.puntPosicio.y + this.velocitaty);
        let segmentTrajectoria = new Segment(puntActual, puntSeguent);

        if (this.revisaXocTop(segmentTrajectoria)) {
            if (typeof playChoque === "function") playChoque();
            return;
        }
        if (this.revisaXocInferior(segmentTrajectoria, alcada)) {
            if (typeof playChoque === "function") playChoque();
            return;
        }

        if (this.puntPosicio.x > amplada) {
            joc.puntuacioMaquina++;
            this.reset(amplada, alcada);
            return;
        }
        if (this.puntPosicio.x < 0) {
            joc.puntuacioJugador++;
            this.reset(amplada, alcada);
            return;
        }

        // Revisar xoc amb pales (usa los arguments correctes)
        // --- AJUSTE: comprobar colisión manualmente antes de mover la bola ---
        // Calcula els rectangles de la bola i les pales després del següent moviment
        let nextBola = {
            left: this.puntPosicio.x + this.velocitatx,
            right: this.puntPosicio.x + this.velocitatx + this.amplada,
            top: this.puntPosicio.y + this.velocitaty,
            bottom: this.puntPosicio.y + this.velocitaty + this.alcada
        };
        let palaDRect = {
            left: palaD.puntPosicio.x,
            right: palaD.puntPosicio.x + palaD.amplada,
            top: palaD.puntPosicio.y,
            bottom: palaD.puntPosicio.y + palaD.alcada
        };
        let palaERect = {
            left: palaE.puntPosicio.x,
            right: palaE.puntPosicio.x + palaE.amplada,
            top: palaE.puntPosicio.y,
            bottom: palaE.puntPosicio.y + palaE.alcada
        };

        // Col·lisió amb pala dreta
        if (
            nextBola.left < palaDRect.right &&
            nextBola.right > palaDRect.left &&
            nextBola.top < palaDRect.bottom &&
            nextBola.bottom > palaDRect.top
        ) {
            // Rebot lateral esquerre de la pala dreta
            this.velocitatx = -Math.abs(this.velocitatx);
            this.puntPosicio.x = palaD.puntPosicio.x - this.amplada;
            if (typeof playChoque === "function") playChoque();
            return;
        }
        // Col·lisió amb pala esquerra
        if (
            nextBola.right > palaERect.left &&
            nextBola.left < palaERect.right &&
            nextBola.top < palaERect.bottom &&
            nextBola.bottom > palaERect.top
        ) {
            // Rebot lateral dret de la pala esquerra
            this.velocitatx = Math.abs(this.velocitatx);
            this.puntPosicio.x = palaE.puntPosicio.x + palaE.amplada;
            if (typeof playChoque === "function") playChoque();
            return;
        }

        let xocPala = this.revisaXocPales(segmentTrajectoria, palaE, palaD);
        if (xocPala) {
            xoc = true;
            if (xocPala.vora === "superior") {
                this.velocitaty = -Math.abs(this.velocitaty);
                this.puntPosicio.y = xocPala.pI.y - this.alcada;
            } else if (xocPala.vora === "inferior") {
                this.velocitaty = Math.abs(this.velocitaty);
                this.puntPosicio.y = xocPala.pI.y;
            }
            if (typeof playChoque === "function") playChoque();
            return;
        }

        if (!xoc) {
            this.mou(this.velocitatx, this.velocitaty);
        }
    };

    revisaXocTop(segmentTrajectoria) {
        if (segmentTrajectoria.puntB.y < 0) {
            let exces = (segmentTrajectoria.puntB.y) / this.velocitaty;
            this.puntPosicio.x = segmentTrajectoria.puntB.x - exces * this.velocitatx;
            this.puntPosicio.y = 0;
            this.velocitaty = -this.velocitaty;
            return true;
        }
        else {
            return false;
        }
    };

    revisaXocInferior(segmentTrajectoria, altCanva) {
        if (segmentTrajectoria.puntB.y + this.alcada > altCanva) {
            let exces = (segmentTrajectoria.puntB.y + this.alcada - altCanva) / this.velocitaty;
            this.puntPosicio.x = segmentTrajectoria.puntB.x - exces * this.velocitatx;
            this.puntPosicio.y = altCanva - this.alcada;
            this.velocitaty = -this.velocitaty;
            return true;
        }
        else {
            return false;
        }
    };

    revisaXocEsquerra(segmentTrajectoria, ampleCanva, altCanva, joc){
        // Ja no fa falta sumar punts ni reiniciar aquí
        if(segmentTrajectoria.puntB.x  <= 0){
            return true;
        }
        return false;
    };

    revisaXocDreta(segmentTrajectoria, ampleCanva, altCanva, joc) {
        // Ja no fa falta sumar punts ni reiniciar aquí
        if (segmentTrajectoria.puntB.x >= ampleCanva) {
            return true;
        }
        return false;
    };

    revisaXocPales(segmentTrajectoria, palaE, palaD) {
        let interseccioE = segmentTrajectoria.interseccioSegmentRectangle(palaE);
        if (interseccioE) {
            return {
                pI: interseccioE.pI,
                vora: interseccioE.vora,
                pala: "esquerra"
            };
        }
        let interseccioD = segmentTrajectoria.interseccioSegmentRectangle(palaD);
        if (interseccioD) {
            return {
                pI: interseccioD.pI,
                vora: interseccioD.vora,
                pala: "dreta"
            };
        }
        return null;
    }
}
