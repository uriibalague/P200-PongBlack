class Joc{
    constructor(myCanvas, myCtx, mode = "maquina", colorEsquerra = "#ffffff", colorDreta = "#ffffff", colorBola = "#eeeeee"){
        this.myCanvas = myCanvas;
        this.myCtx = myCtx;
        this.amplada = myCanvas.width;
        this.alcada = myCanvas.height;
        this.dimensioB = 7;
        this.palaE = new Pala (new Punt (5,this.alcada/2-14),5,28, colorEsquerra);
        this.palaD = new Pala (new Punt (this.amplada-5-5, this.alcada/2-14),5,28, colorDreta);
        this.bola = new Bola (new Punt (this.amplada/2, this.alcada/2),this.dimensioB,this.dimensioB, colorBola);
        this.mode = mode;
        this.key = {
            RIGHT: {code: 39, pressed: false},
            LEFT: {code: 37, pressed: false},
            DOWN: {code: 40, pressed: false},
            UP: {code: 38, pressed: false},
            W: {code: 87, pressed: false},
            S: {code: 83, pressed: false}
        }
        this.puntuacioJugador = 0;
        this.puntuacioMaquina = 0;
        this.totalScore = 0;
        this._lastSpeedUpScoreE = 0;
        this._lastSpeedUpScoreD = 0;
        this._lastSpeedUpScore = 0;
        this._nivellActual = "Fàcil";
        this._paused = false;
        this._gameOver = false;
    }

    set velocitat(velocitatJoc){
        this.velocitatJoc = velocitatJoc;
    }

    inicialitza(){
        $(document).on("keydown",{joc:this}, function(e){
            const joc = e.data.joc;
            if (e.keyCode == joc.key.RIGHT.code) joc.key.RIGHT.pressed = true;
            else if (e.keyCode == joc.key.LEFT.code) joc.key.LEFT.pressed = true;
            else if (e.keyCode == joc.key.DOWN.code) joc.key.DOWN.pressed = true;
            else if (e.keyCode == joc.key.UP.code) joc.key.UP.pressed = true;
            else if (e.keyCode == joc.key.W.code) joc.key.W.pressed = true;
            else if (e.keyCode == joc.key.S.code) joc.key.S.pressed = true;
        });
        $(document).on("keyup", {joc:this}, function(e){
            const joc = e.data.joc;
            if (e.keyCode == joc.key.RIGHT.code) joc.key.RIGHT.pressed = false;
            else if (e.keyCode == joc.key.LEFT.code) joc.key.LEFT.pressed = false;
            else if (e.keyCode == joc.key.DOWN.code) joc.key.DOWN.pressed = false;
            else if (e.keyCode == joc.key.UP.code) joc.key.UP.pressed = false;
            else if (e.keyCode == joc.key.W.code) joc.key.W.pressed = false;
            else if (e.keyCode == joc.key.S.code) joc.key.S.pressed = false;
        });

        window.addEventListener('DOMContentLoaded', () => {
            window.displayInstance = new Display();
            window.displayInstance.mostraPuntuacions();
        });

        this.draw();

        const colorEsquerra = document.getElementById('color-pala-esquerra')?.value || "#ffffff";
        const colorDreta = document.getElementById('color-pala-dreta')?.value || "#ffffff";
        const colorBola = document.getElementById('color-bola')?.value || "#eeeeee";
        this.palaE.color = colorEsquerra;
        this.palaD.color = colorDreta;
        this.bola.color = colorBola;
        localStorage.setItem('pong_colors', JSON.stringify({
            colorEsquerra,
            colorDreta,
            colorBola
        }));

        if (!window._pongAnimacioStarted) {
            window._pongAnimacioStarted = true;
            window._pongAnimacioStop = false;
            window._pongAnimacio = function animacio(){
                if (window._pongAnimacioStop) {
                    window._pongAnimacioStarted = false;
                    return;
                }
                if (window.joc) window.joc.update();
                requestAnimationFrame(window._pongAnimacio);
            };
            window._pongAnimacio();
        }

        if (!window._menuBtnCanvasHandlerSet) {
            const menuBtnCanvas = document.getElementById('menu-button-canvas');
            if (menuBtnCanvas) {
                menuBtnCanvas.addEventListener('click', () => {
                    location.reload();
                });
                window._menuBtnCanvasHandlerSet = true;
            }
        }

        const multBtn = document.getElementById('multiplica-bola');
        if (multBtn) {
            if (this.mode === "2v2") {
                multBtn.style.display = "";
                multBtn.onclick = () => {
                    const factor = 1.5;
                    let speed = Math.sqrt(this.bola.velocitatx * this.bola.velocitatx + this.bola.velocitaty * this.bola.velocitaty);
                    if (speed === 0) return;
                    this.bola.velocitatx *= factor;
                    this.bola.velocitaty *= factor;
                };
            } else {
                multBtn.style.display = "none";
                multBtn.onclick = null;
            }
        }

        const menuBtnCanvas = document.getElementById('menu-button-canvas');
        if (menuBtnCanvas) {
            menuBtnCanvas.onclick = () => {
                document.getElementById('menu').style.display = '';
                document.getElementById('divjoc').style.display = 'none';
                document.getElementById('display').style.display = 'none';
            };
        }
    }

    update(){
        if (this._paused || this._gameOver) return;

        if (this.mode === "2v2") {
            if (typeof this.palaD.velocitat === "undefined") this.palaD.velocitat = 2;
            if (typeof this.palaE.velocitat === "undefined") this.palaE.velocitat = 2;

            const baseVel = 1;
            const baseBall = 1;
            const maxScore = Math.max(this.puntuacioJugador, this.puntuacioMaquina);
            const mult = 1 + Math.floor(maxScore / 5); // x1, x2, x3, ...

            const vel = baseVel * mult;
            this.palaD.velocitat = vel;
            this.palaE.velocitat = vel;

            this.palaD.update(this.key, this.alcada);

            if (this.key.W.pressed && this.palaE.puntPosicio.y > 0) {
                this.palaE.puntPosicio.y -= vel;
                if (this.palaE.puntPosicio.y < 0) this.palaE.puntPosicio.y = 0;
            }
            if (this.key.S.pressed && this.palaE.puntPosicio.y + this.palaE.alcada < this.alcada) {
                this.palaE.puntPosicio.y += vel;
                if (this.palaE.puntPosicio.y + this.palaE.alcada > this.alcada)
                    this.palaE.puntPosicio.y = this.alcada - this.palaE.alcada;
            }

            const ballSpeed = baseBall * mult;
            const angle = Math.atan2(this.bola.velocitaty, this.bola.velocitatx);
            const signX = this.bola.velocitatx >= 0 ? 1 : -1;
            const signY = this.bola.velocitaty >= 0 ? 1 : -1;
            this.bola.velocitatx = Math.abs(ballSpeed * Math.cos(angle)) * signX;
            this.bola.velocitaty = Math.abs(ballSpeed * Math.sin(angle)) * signY;
        } else {
            this.palaD.update(this.key, this.alcada);
            this.palaE.updateAuto(this.alcada);
        }

        const prevJugador = this.puntuacioJugador;
        const prevMaquina = this.puntuacioMaquina;

        this.bola.update(this.amplada, this.alcada, this.palaE, this.palaD, this);

        if (this.mode !== "2v2") {
            if (this.puntuacioJugador > prevJugador) this.totalScore += 30;
            else if (this.puntuacioMaquina > prevMaquina) this.totalScore -= 10;
        }

        const totalScoreDiv = document.querySelector('.totalscore');
        if (totalScoreDiv) totalScoreDiv.textContent = this.totalScore;

        if (this.mode !== "2v2") {
            if (!this._gameOver && this.puntuacioMaquina >= 3) {
                this._gameOver = true;
                setTimeout(() => this.gameOver(false), 0);
                playGameOver();
                return;
            }
            if (!this._gameOver && this.totalScore < 0) {
                this._gameOver = true;
                setTimeout(() => this.gameOver(false), 0);
                playGameOver();
                return;
            }
            if (!this._gameOver && this.puntuacioJugador >= 50) {
                this._gameOver = true;
                setTimeout(() => this.gameOver(true), 0);
                playWin();
                return;
            }
        }

        this.draw();

        if (this.mode === "2v2") {
            if (this.puntuacioMaquina !== this._lastSpeedUpScoreE && this.puntuacioMaquina % 5 === 0 && this.puntuacioMaquina > 0) {
                this._speedUpAll();
                this._lastSpeedUpScoreE = this.puntuacioMaquina;
                playLevelUp();
            }
            // Pala derecha (jugador 2)
            if (this.puntuacioJugador !== this._lastSpeedUpScoreD && this.puntuacioJugador % 5 === 0 && this.puntuacioJugador > 0) {
                this._speedUpAll();
                this._lastSpeedUpScoreD = this.puntuacioJugador;
                playLevelUp();
            }
        } else {
            if (
                this.puntuacioJugador !== this._lastSpeedUpScore &&
                this.puntuacioJugador % 10 === 0 &&
                this.puntuacioJugador <= 50 &&
                this.puntuacioJugador > 0
            ) {
                const factor = 1.5;
                const speed = Math.sqrt(this.bola.velocitatx ** 2 + this.bola.velocitaty ** 2) * factor;
                const angle = Math.atan2(this.bola.velocitaty, this.bola.velocitatx);
                this.bola.velocitatx = speed * Math.cos(angle);
                this.bola.velocitaty = speed * Math.sin(angle);

                if (typeof this.palaD.velocitat === "undefined") this.palaD.velocitat = 1.5;
                if (typeof this.palaE.velocitat === "undefined") this.palaE.velocitat = 1.5;
                this.palaD.velocitat *= factor;
                this.palaE.velocitat *= factor;

                this._lastSpeedUpScore = this.puntuacioJugador;
                playLevelUp();
            }

            // Niveles solo en modo máquina
            let nivell = "Fàcil";
            if (this.puntuacioJugador >= 10 && this.puntuacioJugador < 20) {
                nivell = "Mitjà";
            } else if (this.puntuacioJugador >= 20 && this.puntuacioJugador < 30) {
                nivell = "Difícil";
            } else if (this.puntuacioJugador >= 30 && this.puntuacioJugador < 40) {
                nivell = "Molt difícil";
            } else if (this.puntuacioJugador >= 40 && this.puntuacioJugador < 50) {
                nivell = "Impossible";
            } else if (this.puntuacioJugador >= 50) {
                nivell = "Impossible+";
            }

            if (nivell !== this._nivellActual) {
                this._nivellActual = nivell;
                this.mostraNextLevel(nivell);
            }

            const nivellDiv = document.querySelector('.nivell');
            if (nivellDiv) nivellDiv.textContent = nivell;
        }
    }

    _speedUpAll() {
        const factor = 1.5;
        const speed = Math.sqrt(this.bola.velocitatx ** 2 + this.bola.velocitaty ** 2) * factor;
        const angle = Math.atan2(this.bola.velocitaty, this.bola.velocitatx);
        this.bola.velocitatx = speed * Math.cos(angle);
        this.bola.velocitaty = speed * Math.sin(angle);

        if (typeof this.palaD.velocitat === "undefined") this.palaD.velocitat = 2;
        if (typeof this.palaE.velocitat === "undefined") this.palaE.velocitat = 2;
        this.palaD.velocitat *= factor;
        this.palaE.velocitat *= factor;
    }

    gameOver(jugadorGuanya = false) {
        this._gameOver = true;
        const gameoverDiv = document.querySelector('.gameover');
        if (gameoverDiv) gameoverDiv.style.display = 'block';
        document.getElementById('display').style.display = 'none';
        document.getElementById('divjoc').style.display = 'none';

        document.getElementById('guanyador').textContent = jugadorGuanya ? "Jugador" : "Màquina";
        const puntuacioFinal = document.getElementById('puntuacio-final');
        if (puntuacioFinal) puntuacioFinal.textContent = this.totalScore;
        const nivellFinal = document.getElementById('nivell-final');
        if (nivellFinal) nivellFinal.textContent = this._nivellActual;

        const guardarSection = document.getElementById('guardar-section');
        const menuOnlySection = document.getElementById('menuonly-section');
        if (this.totalScore < 0) {
            if (guardarSection) guardarSection.style.display = 'none';
            if (menuOnlySection) menuOnlySection.style.display = 'block';
        } else {
            if (guardarSection) guardarSection.style.display = 'block';
            if (menuOnlySection) menuOnlySection.style.display = 'none';
        }

        const guardarBtn = document.getElementById('guardar');
        const restartBtn = document.getElementById('restart-button');
        const menuBtn = document.getElementById('menu-button');
        const restartBtn2 = document.getElementById('restart-button2');
        const menuBtn2 = document.getElementById('menu-button2');
        const inputNom = document.getElementById('nomjugador');

        if (guardarBtn) {
            guardarBtn.onclick = () => {
                const nom = inputNom.value.trim() || "Anònim";
                let puntuacio = JSON.parse(localStorage.getItem('puntuacio')) || [];
                puntuacio.push({
                    nom: nom,
                    puntuacio: this.totalScore
                });
                localStorage.setItem('puntuacio', JSON.stringify(puntuacio));
                if (window.displayInstance && typeof window.displayInstance.mostraPuntuacions === 'function') {
                    window.displayInstance.mostraPuntuacions();
                }
                guardarBtn.disabled = true;
            };
        }

        if (restartBtn) restartBtn.onclick = () => location.reload();
        if (menuBtn) menuBtn.onclick = () => location.reload();
        if (restartBtn2) restartBtn2.onclick = () => location.reload();
        if (menuBtn2) menuBtn2.onclick = () => location.reload();
    }

    mostraNextLevel(nomNivell) {
        this._paused = true;
        const ctx = this.myCtx;
        const canvas = this.myCanvas;
        let alpha = 0;
        let scale = 1.0; // Cambiado de 1.5 a 1.0 para que sea más pequeño
        let frame = 0;
        const maxFrames = 60;
        const text1 = "NIVELL SEGÜENT";
        const text2 = nomNivell.toUpperCase();

        const animate = () => {
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.draw();

            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            alpha = Math.min(1, frame / 15);
            scale = 1.0 - 0.2 * Math.min(1, frame / 20); // Animación más pequeña

            ctx.globalAlpha = alpha;
            ctx.fillStyle = "#fff";
            ctx.font = `${40 * scale}px Arial Black, Arial, sans-serif`; // Tamaño más pequeño
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.shadowColor = "#000";
            ctx.shadowBlur = 10;
            ctx.fillText(text1, canvas.width/2, canvas.height/2 - 20);

            ctx.font = `${28 * scale}px Arial Black, Arial, sans-serif`; // Tamaño más pequeño
            ctx.fillStyle = "#ff0";
            ctx.fillText(text2, canvas.width/2, canvas.height/2 + 15);

            ctx.globalAlpha = 1;
            ctx.restore();

            frame++;
            if (frame < maxFrames) {
                requestAnimationFrame(animate);
            } else {
                setTimeout(() => {
                    this._paused = false;
                }, 700);
            }
        };
        animate();
    }

    draw(){
        this.clearCanvas();

        const dpr = window.devicePixelRatio || 1;
        if (this.myCanvas.width !== this.amplada * dpr || this.myCanvas.height !== this.alcada * dpr) {
            this.myCanvas.width = this.amplada * dpr;
            this.myCanvas.height = this.alcada * dpr;
            this.myCanvas.style.width = this.amplada + "px";
            this.myCanvas.style.height = this.alcada + "px";
            this.myCtx.setTransform(1, 0, 0, 1, 0, 0);
            this.myCtx.scale(dpr, dpr);
        }

        const wallpaperSrc = localStorage.getItem('pong_wallpaper');
        const canvasBgColor = localStorage.getItem('pong_canvas_bgcolor') || "#101";
        if (wallpaperSrc === "color" || !wallpaperSrc) {
            this.myCtx.fillStyle = canvasBgColor;
            this.myCtx.fillRect(0, 0, this.amplada, this.alcada);
            this._drawGameElements();
        } else {
            if (!this._wallpaperImg || this._wallpaperImg._src !== wallpaperSrc) {
                this._wallpaperImg = new window.Image();
                this._wallpaperImg.crossOrigin = "anonymous";
                this._wallpaperImg._src = wallpaperSrc;
                this._wallpaperImg.onload = () => {
                    if (localStorage.getItem('pong_wallpaper') === this._wallpaperImg._src) {
                        this.clearCanvas();
                        this._drawWallpaperAndGame();
                    }
                };
                this._wallpaperImg.onerror = () => {
                    this._wallpaperImg = null;
                    this._drawGameElements();
                };
                this._wallpaperImg.src = wallpaperSrc;
                this._drawGameElements();
            } else if (this._wallpaperImg.complete && this._wallpaperImg.naturalWidth > 0) {
                this._drawWallpaperAndGame();
            } else {
                this._drawGameElements();
            }
        }
    }

    _drawWallpaperAndGame() {
        const img = this._wallpaperImg;
        if (!img) return this._drawGameElements();
        const dpr = window.devicePixelRatio || 1;
        const cw = this.myCanvas.width / dpr;
        const ch = this.myCanvas.height / dpr;
        const iw = img.width, ih = img.height;
        const scale = Math.max(cw / iw, ch / ih);
        const tw = iw * scale;
        const th = ih * scale;
        const x = (cw - tw) / 2;
        const y = (ch - th) / 2;

        // Canvas temporal para aplicar blur más suave y opacidad
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = cw;
        tempCanvas.height = ch;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(img, x, y, tw, th);

        this.myCtx.save();
        this.myCtx.globalAlpha = 0.75; // menos translúcido (más visible)
        this.myCtx.filter = 'blur(1.5px)'; // blur más suave
        this.myCtx.drawImage(tempCanvas, 0, 0, cw, ch);
        this.myCtx.filter = 'none';
        this.myCtx.globalAlpha = 1;
        this.myCtx.restore();

        this._drawGameElements();
    }

    _drawGameElements() {
        this.bola.draw(this.myCtx);
        this.palaD.draw(this.myCtx);
        this.palaE.draw(this.myCtx);

        const scoreMaquina = document.getElementById('score-jugador1');
        const scoreJugador = document.getElementById('score-jugador2');
        if (scoreMaquina) scoreMaquina.textContent = this.puntuacioMaquina;
        if (scoreJugador) scoreJugador.textContent = this.puntuacioJugador;

        const totalscoreJoc = document.getElementById('totalscore-joc');
        const nivellJoc = document.getElementById('nivell-joc');
        if (this.mode === "2v2") {
            if (totalscoreJoc) totalscoreJoc.style.display = "none";
            if (nivellJoc) {
                const maxScore = Math.max(this.puntuacioJugador, this.puntuacioMaquina);
                const mult = 1 + Math.floor(maxScore / 5);
                nivellJoc.textContent = "Velocitat: x" + mult;
            }
        } else {
            if (totalscoreJoc) {
                totalscoreJoc.style.display = "";
                totalscoreJoc.textContent = this.totalScore;
            }
            if (nivellJoc) nivellJoc.textContent = this._nivellActual;
        }
    }

    clearCanvas(){
        this.myCtx.clearRect(
            0,0,
            this.amplada, this.alcada
        )
    }
}