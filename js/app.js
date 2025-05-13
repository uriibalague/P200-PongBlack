//Variables i constants globals
//Main de l'aplicatiu
var joc;
$(function(){

    let myCanvas = $("#joc")[0];
    let myCtx = myCanvas.getContext("2d");

    /********************************* - COMENÇAT CARLA - revisar
     * Tasca. Inicialitza la classe JOC les posicions 
     * dels elements del joc
     * al canva: Pales, bola, etc
    **********************************/  
    joc = new Joc(myCanvas, myCtx);
    joc.inicialitza();
    animacio();

})

function animacio(){
    joc.update();
    //Oportunitat per actualitzar les puntuacions
    //revisar si seguim jugant o no
    //Si pujem de nivell, etc

    //Crida recursiva per generar animació
    requestAnimationFrame(animacio);
}

document.addEventListener('DOMContentLoaded', function () {
    const table = document.querySelector('#menu table');

    const puntuacio = JSON.parse(localStorage.getItem('puntuacio')) || [];

    puntuacio.forEach(puntuacio => {
        const row = document.createElement('tr');
        const ColNom = document.createElement('td');
        const ColPuntuacio = document.createElement('td');

        ColNom.textContent = puntuacio.ColNom;
        ColPuntuacio.textContent = puntuacio.ColPuntuacio;

        row.appendChild(ColNom);
        row.appendChild(ColPuntuacio);
        table.appendChild(row);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'cyan', 'brown'];
    const container = document.querySelector('.colorspilota');

    colors.forEach(color => {
        const ball = document.createElement('div');
        ball.className = 'ball';
        ball.style.backgroundColor = color;
        ball.onclick = () => selectColor(color);
        container.appendChild(ball);
    });

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.className = 'color-picker';
    colorInput.onchange = (e) => selectColor(e.target.value);
    container.appendChild(colorInput);
});

function selectColor(color) {
    console.log('Color seleccionat:', color);
}

document.addEventListener('DOMContentLoaded', function () {
    const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'cyan', 'brown'];
    const container = document.querySelector('.wallpapers');

    colors.forEach(color => {
        const ball = document.createElement('div');
        ball.className = 'ball';
        ball.style.backgroundColor = color;
        ball.onclick = () => selectColor(color);
        container.appendChild(ball);
    });

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.className = 'color-picker';
    colorInput.onchange = (e) => selectColor(e.target.value);
    container.appendChild(colorInput);
});
