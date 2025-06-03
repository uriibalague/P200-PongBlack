let joc;

$(function(){
    initTeclaSpace();
})

function animacio(){
    joc.update();
    requestAnimationFrame(animacio);
}

function actualizaTaulaPuntuacions() {
    const table = document.getElementById('taula-puntuacions');
    const tableBody = table ? table.querySelector('tbody') : null;
    if (!tableBody) return;
    tableBody.innerHTML = '';
    let puntuacio = JSON.parse(localStorage.getItem('puntuacio')) || [];
    puntuacio = puntuacio
        .sort((a, b) => (b.puntuacio || b.ColPuntuacio || 0) - (a.puntuacio || a.ColPuntuacio || 0))
        .slice(0, 5);
    puntuacio.forEach(p => {
        const row = document.createElement('tr');
        const ColNom = document.createElement('td');
        const ColPuntuacio = document.createElement('td');
        ColNom.textContent = p.nom || p.ColNom || '';
        ColPuntuacio.textContent = p.puntuacio || p.ColPuntuacio || '';
        row.appendChild(ColNom);
        row.appendChild(ColPuntuacio);
        tableBody.appendChild(row);
    });

    if (table) {
        table.classList.add('flash-score');
        setTimeout(() => {
            table.classList.remove('flash-score');
        }, 600);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    actualizaTaulaPuntuacions();

    const colorConfig = localStorage.getItem('pong_colors');
    if (colorConfig) {
        try {
            const { colorEsquerra, colorDreta, colorBola } = JSON.parse(colorConfig);
            if (colorEsquerra) document.getElementById('color-pala-esquerra').value = colorEsquerra;
            if (colorDreta) document.getElementById('color-pala-dreta').value = colorDreta;
            if (colorBola) document.getElementById('color-bola').value = colorBola;
        } catch (e) {}
    }

    const btnMaquina = document.getElementById('start-maquina');
    const btn2v2 = document.getElementById('start-2v2');
    if (btnMaquina && btn2v2) {
        btnMaquina.addEventListener('click', function(e) {
            btnMaquina.classList.add('selected-modo');
            btn2v2.classList.remove('selected-modo');
            localStorage.setItem('pong_mode', 'maquina');
        });
        btn2v2.addEventListener('click', function(e) {
            btn2v2.classList.add('selected-modo');
            btnMaquina.classList.remove('selected-modo');
            localStorage.setItem('pong_mode', '2v2');
        });

        const modoGuardado = localStorage.getItem('pong_mode');
        if (modoGuardado === '2v2') {
            btn2v2.classList.add('selected-modo');
            btnMaquina.classList.remove('selected-modo');
        } else {
            btnMaquina.classList.add('selected-modo');
            btn2v2.classList.remove('selected-modo');
        }
    }

    const removeStartGameListeners = () => {
        btnMaquina?.replaceWith(btnMaquina.cloneNode(true));
        btn2v2?.replaceWith(btn2v2.cloneNode(true));
    };
    removeStartGameListeners();

    const previewCanvas = document.getElementById('preview-canvas');
    const ctx = previewCanvas?.getContext('2d');
    const colorInputE = document.getElementById('color-pala-esquerra');
    const colorInputD = document.getElementById('color-pala-dreta');
    const colorInputBola = document.getElementById('color-bola');
    const wallpaperThumbs = document.querySelectorAll('.wallpaper-thumb');

    let wallpaperSrc = localStorage.getItem('pong_wallpaper') || "";
    let wallpaperImg = null;

    function loadWallpaper(src, cb) {
        if (!src) {
            wallpaperImg = null;
            if (cb) cb();
            return;
        }
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = function() {
            wallpaperImg = img;
            if (cb) cb();
        };
        img.onerror = function() {
            wallpaperImg = null;
            if (cb) cb();
        };
        img.src = src;
    }

    function drawPreview() {
        if (!ctx) return;
        ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

        if (wallpaperImg) {
            // Ajusta el wallpaper para cubrir todo el canvas (cover)
            const cw = previewCanvas.width, ch = previewCanvas.height;
            const iw = wallpaperImg.width, ih = wallpaperImg.height;
            const scale = Math.max(cw / iw, ch / ih);
            const tw = iw * scale;
            const th = ih * scale;
            const x = (cw - tw) / 2;
            const y = (ch - th) / 2;
            ctx.drawImage(wallpaperImg, x, y, tw, th);
        } else {
            ctx.fillStyle = "#181828";
            ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
        }

        // Linea
        ctx.strokeStyle = "#fff3";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(previewCanvas.width/2, 10);
        ctx.lineTo(previewCanvas.width/2, previewCanvas.height-10);
        ctx.stroke();
        ctx.setLineDash([]);

        // Pales
        ctx.fillStyle = colorInputE.value;
        ctx.fillRect(12, previewCanvas.height/2-18, 6, 36);
        ctx.strokeStyle = "#fff8";
        ctx.lineWidth = 1;
        ctx.strokeRect(12, previewCanvas.height/2-18, 6, 36);

        ctx.fillStyle = colorInputD.value;
        ctx.fillRect(previewCanvas.width-18, previewCanvas.height/2-18, 6, 36);
        ctx.strokeStyle = "#fff8";
        ctx.strokeRect(previewCanvas.width-18, previewCanvas.height/2-18, 6, 36);

        // Bola
        ctx.beginPath();
        ctx.arc(previewCanvas.width/2, previewCanvas.height/2, 7, 0, 2*Math.PI);
        ctx.fillStyle = colorInputBola.value;
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#fff8";
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    function selectWallpaper(src) {
        wallpaperSrc = src;
        localStorage.setItem('pong_wallpaper', src);
        wallpaperThumbs.forEach(img => img.classList.toggle('selected-wall', img.dataset.wall === src));
        loadWallpaper(src, drawPreview);
    }

    wallpaperThumbs.forEach(img => {
        img.addEventListener('click', () => {
            selectWallpaper(img.dataset.wall);
        });
    });

    const btnReset = document.getElementById('btn-reset-personalitzacio');
    const btnAplicar = document.getElementById('btn-aplicar-personalitzacio');
    const btnCerrar = document.getElementById('btn-cerrar-personalitzacio');
    const popupConfig = document.getElementById('popup-config');
    const blurOverlay = document.getElementById('blur-overlay');

    const DEFAULT_COLORS = {
        colorEsquerra: "#ffffff",
        colorDreta: "#ffffff",
        colorBola: "#eeeeee"
    };

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            colorInputE.value = DEFAULT_COLORS.colorEsquerra;
            colorInputD.value = DEFAULT_COLORS.colorDreta;
            colorInputBola.value = DEFAULT_COLORS.colorBola;
            localStorage.removeItem('pong_wallpaper');
            wallpaperSrc = "";
            wallpaperThumbs.forEach(img => img.classList.remove('selected-wall'));
            loadWallpaper("", drawPreview);
            drawPreview();
        });
    }

    if (btnAplicar) {
        btnAplicar.addEventListener('click', () => {
            localStorage.setItem('pong_colors', JSON.stringify({
                colorEsquerra: colorInputE.value,
                colorDreta: colorInputD.value,
                colorBola: colorInputBola.value
            }));
            if (wallpaperSrc) {
                localStorage.setItem('pong_wallpaper', wallpaperSrc);
            } else {
                localStorage.removeItem('pong_wallpaper');
            }
            if (popupConfig) popupConfig.style.display = "none";
            if (blurOverlay) blurOverlay.style.display = "none";
        });
    }

    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            if (popupConfig) popupConfig.style.display = "none";
            if (blurOverlay) blurOverlay.style.display = "none";
        });
    }

    [colorInputE, colorInputD, colorInputBola].forEach(input => {
        input.addEventListener('input', drawPreview);
    });

    loadWallpaper(wallpaperSrc, drawPreview);
});

const audioChoque = new Audio('media/choque.mp3');
const audioCompteEnrere = new Audio('media/compteenrere.mp3');
const audioGameOver = new Audio('media/gameover.mp3');
const audioLevelUp = new Audio('media/levelup.mp3');
const audioWin = new Audio('media/win.mp3');

function playChoque() {
    audioChoque.currentTime = 0;
    audioChoque.play();
}
function playCompteEnrere() {
    audioCompteEnrere.currentTime = 0;
    audioCompteEnrere.play();
}
function playGameOver() {
    audioGameOver.currentTime = 0;
    audioGameOver.play();
}
function playLevelUp() {
    audioLevelUp.currentTime = 0;
    audioLevelUp.play();
}
function playWin() {
    audioWin.currentTime = 0;
    audioWin.play();
}

function initTeclaSpace() {
    let juegoIniciado = false;
    let modoSeleccionado = localStorage.getItem('pong_mode') || "maquina";

    const btnMaquina = document.getElementById('start-maquina');
    const btn2v2 = document.getElementById('start-2v2');
    if (btnMaquina && btn2v2) {
        btnMaquina.addEventListener('click', function() {
            modoSeleccionado = "maquina";
            btnMaquina.classList.add('selected-modo');
            btn2v2.classList.remove('selected-modo');
            localStorage.setItem('pong_mode', 'maquina');
        });
        btn2v2.addEventListener('click', function() {
            modoSeleccionado = "2v2";
            btn2v2.classList.add('selected-modo');
            btnMaquina.classList.remove('selected-modo');
            localStorage.setItem('pong_mode', '2v2');
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && !juegoIniciado) {
            startGame();
            event.preventDefault();
        }
    });

    function startGame() {
        const menu = document.getElementById('menu');
        const personalitzacio = document.getElementById('personalitzacio');
        const personalitzacioVisible = personalitzacio && window.getComputedStyle(personalitzacio).display !== 'none';
        if (
            menu && (menu.style.display !== 'none') &&
            !personalitzacioVisible &&
            !juegoIniciado
        ) {
            menu.style.display = 'none';
            document.getElementById('display').style.display = 'block';
            document.getElementById('divjoc').style.display = 'block';
            let myCanvas = document.getElementById("joc");
            if (myCanvas) {
                let myCtx = myCanvas.getContext("2d");
                cuentaAtras(myCanvas, myCtx, () => {
                    const colorEsquerra = document.getElementById('color-pala-esquerra')?.value || "#ffffff";
                    const colorDreta = document.getElementById('color-pala-dreta')?.value || "#ffffff";
                    const colorBola = document.getElementById('color-bola')?.value || "#eeeeee";
                    window.joc = joc = new Joc(myCanvas, myCtx, modoSeleccionado, colorEsquerra, colorDreta, colorBola);
                    joc.inicialitza();
                    animacio();
                    juegoIniciado = true;
                });
            }
        }
    }
}

function cuentaAtras(canvas, ctx, callback) {
    playCompteEnrere();
    let count = 3;
    let maxFont = 120;
    let minFont = 40;
    let duration = 1000;
    let startTime = null;

    function drawCountdown(num, scale) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.fillStyle = "#fff";
        ctx.font = `${minFont + (maxFont-minFont)*scale}px Arial Black, Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 10;
        ctx.fillText(num, canvas.width/2, canvas.height/2);
        ctx.restore();
    }

    function animateCountdown(timestamp) {
        if (!startTime) startTime = timestamp;
        let elapsed = timestamp - startTime;
        let scale = Math.min(1, elapsed / duration);
        drawCountdown(count, scale);

        if (elapsed < duration) {
            requestAnimationFrame(animateCountdown);
        } else {
            count--;
            if (count > 0) {
                startTime = null;
                requestAnimationFrame(animateCountdown);
            } else {
                drawCountdown("GO!", 1);
                setTimeout(() => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    callback();
                }, 600);
            }
        }
    }
    requestAnimationFrame(animateCountdown);
}

function selectColor(color) {
    console.log('Color seleccionat:', color);
}

document.getElementById('color-pala-esquerra').addEventListener('input', function(e) {
    if (window.joc) window.joc.palaE.color = e.target.value;
});
document.getElementById('color-pala-dreta').addEventListener('input', function(e) {
    if (window.joc) window.joc.palaD.color = e.target.value;
});
document.getElementById('color-bola').addEventListener('input', function(e) {
    if (window.joc) window.joc.bola.color = e.target.value;
});