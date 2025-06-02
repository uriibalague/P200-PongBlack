class Display {
    constructor() {
        this.backgroundMusic = document.getElementById('background-music');
        this.botoMusica = document.getElementById('musica');
        this.iconaVolumOn = this.botoMusica.querySelector('.fa-volume-high');
        this.iconaVolumOff = this.botoMusica.querySelector('.fa-volume-xmark');
        this.botoEsborrar = document.getElementById('esborrar');
        this.iconaBroom = this.botoEsborrar.querySelector('.fa-broom');
        this.iconaCheck = this.botoEsborrar.querySelector('.fa-circle-check');
        this.popup = document.getElementById('popup-config');
        this.blurOverlay = document.getElementById('blur-overlay');
        this.botoConfiguracio = document.getElementById('configuracio');
        this.botoAjuda = document.getElementById('ajuda');
        this.init();
    }

    init() {
        this.initMusica();
        this.initBotoEsborrar();
        this.initPopupConfiguracio();
        this.initBotoAjuda();
    }

    initMusica() {
        let musicaOn = localStorage.getItem('pong_music') !== 'off';
        let iniciada = false;
        const actualitzaUI = () => {
            if (musicaOn) {
                this.iconaVolumOn.style.display = '';
                this.iconaVolumOff.style.display = 'none';
            } else {
                this.iconaVolumOn.style.display = 'none';
                this.iconaVolumOff.style.display = '';
            }
        };
        const setEstatMusica = (on) => {
            musicaOn = on;
            localStorage.setItem('pong_music', on ? 'on' : 'off');
            actualitzaUI();
            if (this.backgroundMusic) {
                if (on) {
                    this.backgroundMusic.muted = false;
                    this.backgroundMusic.volume = 0.05;
                    this.backgroundMusic.play().catch(()=>{});
                } else {
                    this.backgroundMusic.pause();
                }
            }
        };
        this.botoMusica.addEventListener('click', () => {
            setEstatMusica(!musicaOn);
        });
        setEstatMusica(musicaOn);

        const intentaReproduir = () => {
            if (this.backgroundMusic && musicaOn && !iniciada) {
                this.backgroundMusic.play().then(() => {
                    iniciada = true;
                }).catch(() => {
                    const resume = () => {
                        if (!iniciada && musicaOn) {
                            this.backgroundMusic.play().then(() => { iniciada = true; }).catch(()=>{});
                        }
                        document.removeEventListener('keydown', resume);
                        document.removeEventListener('mousedown', resume);
                        document.removeEventListener('touchstart', resume);
                    };
                    document.addEventListener('keydown', resume, { once: true });
                    document.addEventListener('mousedown', resume, { once: true });
                    document.addEventListener('touchstart', resume, { once: true });
                });
            }
        };
        intentaReproduir();
        this.backgroundMusic.volume = 0.05;
    }

    initBotoEsborrar() {
        this.botoEsborrar.addEventListener('click', () => {
            localStorage.removeItem('puntuacio');
            if (typeof this.mostraPuntuacions === 'function') {
                this.mostraPuntuacions();
            }
            this.iconaBroom.style.display = 'none';
            this.iconaCheck.style.display = 'inline';
            setTimeout(() => {
                this.iconaCheck.style.display = 'none';
                this.iconaBroom.style.display = 'inline';
            }, 3000);
        });
    }

    initPopupConfiguracio() {
        this.botoConfiguracio.addEventListener('click', () => {
            const visible = this.popup.style.display === 'block';
            this.popup.style.display = visible ? 'none' : 'block';
            this.blurOverlay.style.display = visible ? 'none' : 'block';
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === "Escape" && this.popup.style.display === 'block') {
                this.popup.style.display = 'none';
                this.blurOverlay.style.display = 'none';
            }
        });

        document.addEventListener('click', (event) => {
            if (
                this.popup.style.display === 'block' &&
                !this.popup.contains(event.target) &&
                !event.target.closest('#configuracio')
            ) {
                this.popup.style.display = 'none';
                this.blurOverlay.style.display = 'none';
            }
        });
    }

    initBotoAjuda() {
        this.botoAjuda.addEventListener('click', () => {
            alert('Aquest és un joc de Pong. Utilitza les tecles per controlar la pala i marcar punts contra el teu oponent.');
        });
    }

    mostraPuntuacions() {
        const taula = document.querySelector('#taula-puntuacions tbody');
        if (!taula) return;
        taula.innerHTML = '';
        const puntuacions = JSON.parse(localStorage.getItem('puntuacions')) || [];
        puntuacions
            .sort((a, b) => b.puntuacio - a.puntuacio)
            .forEach(p => {
                const fila = document.createElement('tr');
                const ColNom = document.createElement('td');
                const ColPuntuacio = document.createElement('td');
                ColNom.textContent = p.nom;
                ColPuntuacio.textContent = p.puntuacio;
                fila.appendChild(ColNom);
                fila.appendChild(ColPuntuacio);
                taula.appendChild(fila);
            });
    }
}

function dibuixaPreviewPong(colorPalaE, colorPalaD, colorBola, fons) {
    const canvas = document.getElementById('preview-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (fons) {
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            dibuixaElements();
        };
        img.src = fons;
    } else {
        ctx.fillStyle = "#101";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        dibuixaElements();
    }

    function dibuixaElements() {
        ctx.fillStyle = colorPalaE;
        ctx.fillRect(10, canvas.height / 2 - 20, 8, 40);
        ctx.fillStyle = colorPalaD;
        ctx.fillRect(canvas.width - 18, canvas.height / 2 - 20, 8, 40);
        ctx.fillStyle = colorBola;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 7, 0, 2 * Math.PI);
        ctx.fill();
    }
}

dibuixaPreviewPong("#fff", "#fff", "#eee");

document.getElementById('color-pala-jugador')?.addEventListener('input', () => {
    dibuixaPreviewPong(
        document.getElementById('color-pala-jugador').value,
        document.getElementById('color-pala-maquina').value,
        document.getElementById('color-bola').value
    );
});
document.getElementById('color-pala-maquina')?.addEventListener('input', () => {
    dibuixaPreviewPong(
        document.getElementById('color-pala-jugador').value,
        document.getElementById('color-pala-maquina').value,
        document.getElementById('color-bola').value
    );
});
document.getElementById('color-bola')?.addEventListener('input', () => {
    dibuixaPreviewPong(
        document.getElementById('color-pala-jugador').value,
        document.getElementById('color-pala-maquina').value,
        document.getElementById('color-bola').value
    );
});

window.addEventListener('DOMContentLoaded', () => {
    new Display();
});
