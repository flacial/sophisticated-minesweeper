let timeVal = 0;
let isRunning = false;

const display = (num) => {
    const totalSeconds = +`${Math.floor(num / 10000)}${Math.floor((num / 1000) % 10)}`;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${ hours ? hours + ':' : '' }${ minutes }:${ seconds < 10 ? 0 : '' }${ seconds }`
}

const setTimer = (display, num, el) => {
    if (isRunning) {
        timeVal += 10

        setTimeout(() => {
            el.innerText = display(timeVal)
            setTimer(display, num, el)
        }, num)
    }

}

export const startCountdown = (el) => {
    if (isRunning) return
    isRunning = true;

    setTimer(display, 10, el)
}

export const endCountdown = (el) => {
    isRunning = false
    el.innerText = '0:00'
    timeVal = 0
}

export const pauseCountdown = () => isRunning && (isRunning = false);