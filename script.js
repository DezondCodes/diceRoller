
const rollButton = document.getElementById("roll-dice");
const diceImage = document.querySelector(".dice-img");
const resultParagraph = document.getElementById("result");
const diceNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; // Array of dice numbers

rollButton.addEventListener('click', () => {
    diceImage.classList.add('spin');

    diceImage.addEventListener('animationend', () => {
        diceImage.classList.remove('spin');
        const randomNumber = diceNumbers[Math.floor(Math.random() * diceNumbers.length)];
        resultParagraph.textContent = `${randomNumber}`;
    }, {once: true});
});