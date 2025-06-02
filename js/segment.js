class Segment{
    constructor(puntA, puntB){
        this.puntA = puntA;
        this.puntB = puntB;
        this.color = "#3F3";
    }
    set colorSegment(color){
        this.color = color;
    }
    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.puntA.x, this.puntA.y);
        ctx.lineTo(this.puntB.x, this.puntB.y);
        ctx.stroke();
    }

    interseccioSegmentRectangle(rectangle){
        let segmentVoraSuperior = new  Segment(rectangle.puntPosicio,
            new Punt(rectangle.puntPosicio.x + rectangle.amplada, rectangle.puntPosicio.y));

        //vora inferior
        let segmentVoraInferior = new  Segment(
            new Punt(rectangle.puntPosicio.x,
                    rectangle.puntPosicio.y+rectangle.alcada),
            new Punt(rectangle.puntPosicio.x + rectangle.amplada,
                rectangle.puntPosicio.y+rectangle.alcada));

        let segmentVoraEsquerra = new  Segment(rectangle.puntPosicio,
            new Punt(rectangle.puntPosicio.x , rectangle.puntPosicio.y + rectangle.alcada));

        let segmentVoraDreta = new  Segment(
            new Punt(rectangle.puntPosicio.x + rectangle.amplada,
                rectangle.puntPosicio.y),
            new Punt(rectangle.puntPosicio.x + rectangle.amplada,
                rectangle.puntPosicio.y+rectangle.alcada));
        let puntI;
        let distanciaI;
        let puntIMin;
        let distanciaIMin = Infinity;
        let voraI;

        puntI = this.puntInterseccio(segmentVoraSuperior);
        if (puntI){
            distanciaI = Punt.distanciaDosPunts(this.puntA,puntI);
            if (distanciaI < distanciaIMin){
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "superior";
            }
        }
        puntI = this.puntInterseccio(segmentVoraInferior);
        if (puntI){
            distanciaI = Punt.distanciaDosPunts(this.puntA,puntI);
            if (distanciaI < distanciaIMin){
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "inferior";
            }
        }
        
        puntI = this.puntInterseccio(segmentVoraEsquerra);
        if (puntI){
            distanciaI = Punt.distanciaDosPunts(this.puntA,puntI);
            if (distanciaI < distanciaIMin){
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "esquerra";
            }
        }
        
        puntI = this.puntInterseccio(segmentVoraDreta);
        if (puntI){
            distanciaI = Punt.distanciaDosPunts(this.puntA,puntI);
            if (distanciaI < distanciaIMin){
                distanciaIMin = distanciaI;
                puntIMin = puntI;
                voraI = "dreta";
            }
        }
       

        if(voraI){
            return {pI: puntIMin, vora: voraI};
        }
        return null; 
    }

     puntInterseccio(segment){


        if (this.esTallen(segment)){
            var a1 = this.puntB.y - this.puntA.y;
            var b1 = this.puntA.x -  this.puntB.x;
            var c1 = a1 * this.puntA.x + b1 * this.puntA.y;

            var a2 = segment.puntB.y - segment.puntA.y;
            var b2 = segment.puntA.x - segment.puntB.x;
            var c2 = a2 * segment.puntA.x + b2 * segment.puntA.y;

            var d = a1*b2 - a2*b1;
            if (d != 0) {

                var x = (b2 * c1 - b1 * c2) / d;
                var y = (a1 * c2 - a2 * c1) / d;
                var puntInterseccio = new Punt(x, y);

                return puntInterseccio;

            }
        }

    }
    esTallen (segment){
        let s1p1 = this.puntA;
        let s1p2 = this.puntB;
        let s2p1 = segment.puntA;
        let s2p2 = segment.puntB;

        function control(punta, puntb, puntc){
            return(puntb.y-punta.y)*(puntc.x-punta.x)<(puntc.y-punta.y)*(puntb.x-punta.x);
        }
        return (control(s1p1,s1p2,s2p1) != control(s1p1,s1p2,s2p2) &&
                    control(s1p1,s2p1,s2p2) != control(s1p2,s2p1,s2p2));

    }
}