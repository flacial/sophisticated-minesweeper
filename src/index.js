import Minesweeper from "./utils/minesweeper.js"
import { endCountdown } from './utils/countdown.js';

const modesHtml =  `
    <h1>Pick mode</h1>
    <hr class="card-line">
    <ul class="modes">
    <li>4x4</li>
    <li>8x8</li>
    <li>10x10</li>
    </ul>
    `

const blocks = document.querySelector('.blocks');
const countdownEl = document.querySelector('.countdown');

const initRestartButton = (gridNum) => {
    const restartEl = document.querySelector('.restart__cont');

    restartEl.addEventListener('click', () => {
        blocks.innerHTML = "";
        endCountdown(countdownEl);
        new Minesweeper(gridNum);
    });
}

const startGame = (gridNum) => {
    blocks.classList.remove('selectMode');
    blocks.innerHTML = ''
    document.querySelector('.status__cont').style.display = 'flex'
    new Minesweeper(gridNum)

    document.querySelector('.pickModes__cont').addEventListener('click', () => {
        localStorage.setItem('mode', null)
        return renderModes()
    })

    initRestartButton(gridNum)
}

const registerModesEvents = () => {
    blocks.querySelectorAll('li').forEach(li => {
        const gridNum = +li.innerText.split('x')[0];
        let initialValue;

        li.addEventListener('mouseover', () => {
            initialValue = li.innerText;
            li.innerText = gridNum * gridNum + ' Blocks'
        })

        li.addEventListener('mouseleave', () => li.innerText = initialValue)

        li.addEventListener('click', () => {
            startGame(gridNum)
            localStorage.setItem('mode', gridNum);
        })
    })
}

const renderModes = () => {
    const storedGridNum = JSON.parse(localStorage.getItem('mode'));
    if (storedGridNum) return startGame(storedGridNum);

    document.querySelector('.status__cont').style.display = 'none'
    
    blocks.classList.add('selectMode')
    blocks.style.maxWidth = '300px'
    blocks.innerHTML = modesHtml;

    localStorage.setItem('mode', null);
    endCountdown(countdownEl);

    registerModesEvents()
}

renderModes()