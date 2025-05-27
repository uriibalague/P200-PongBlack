class Display {
    constructor() {
        this.backgroundMusic = document.getElementById('background-music');
        this.botonMusica = document.getElementById('musica');
        this.iconoVolumenOn = this.botonMusica.querySelector('.fa-volume-high');
        this.iconoVolumenOff = this.botonMusica.querySelector('.fa-volume-xmark');

        this.botonEsborrar = document.getElementById('esborrar');
        this.iconoBroom = this.botonEsborrar.querySelector('.fa-broom');
        this.iconoCheck = this.botonEsborrar.querySelector('.fa-circle-check');

        this.popup = document.getElementById('popup-config');
        this.blurOverlay = document.getElementById('blur-overlay');
        this.botonConfiguracio = document.getElementById('configuracio');
        this.botonAjuda = document.getElementById('ajuda');

        this.init();
    }

    init() {
        this.initMusica();
        this.initTeclaSpace();
        this.initBotonEsborrar();
        this.initConfiguracioPopup();
        this.initBotonAjuda();
    }

    initMusica() {
        this.backgroundMusic.volume = 0.2;
        this.backgroundMusic.muted = false;

        this.backgroundMusic.play().catch(() => {
            console.warn("Autoplay ha sigut bloquejat pel navegador.");
        });

        this.botonMusica.addEventListener('click', () => {
            const isMuted = this.backgroundMusic.muted;
            this.backgroundMusic.muted = !isMuted;
            this.iconoVolumenOn.style.display = isMuted ? 'inline' : 'none';
            this.iconoVolumenOff.style.display = isMuted ? 'none' : 'inline';
        });
    }

    initTeclaSpace() {
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                if (this.popup.style.display === 'none' || this.popup.style.display === '') {
                    document.getElementById('menu').style.display = 'none';
                    document.getElementById('display').style.display = 'block';
                    document.getElementById('divjoc').style.display = 'block';
                    event.preventDefault();
                }
            }
        });
    }

    initBotonEsborrar() {
        this.botonEsborrar.addEventListener('click', () => {
            this.iconoBroom.style.display = 'none';
            this.iconoCheck.style.display = 'inline';
            setTimeout(() => {
                this.iconoCheck.style.display = 'none';
                this.iconoBroom.style.display = 'inline';
            }, 3000);
        });
    }

    initConfiguracioPopup() {
        this.botonConfiguracio.addEventListener('click', () => {
            const isVisible = this.popup.style.display === 'block';
            this.popup.style.display = isVisible ? 'none' : 'block';
            this.blurOverlay.style.display = isVisible ? 'none' : 'block';
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

    initBotonAjuda() {
        this.botonAjuda.addEventListener('click', () => {
            alert('Aquest és un joc de Pong. Utilitza les tecles per controlar la pala i marcar punts contra el teu oponent.');
        });
    }

}

// Inicializar al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    new Display();
});
