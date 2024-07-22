document.addEventListener('DOMContentLoaded', function() {
    const rollButton = document.getElementById("roll-dice");
    const diceImage = document.querySelector(".dice-img");
    const diceNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; // Array of dice numbers
    const popupWinner = document.querySelector('.popup-winner');
    const winnerHeader = document.getElementById('winner-header');
    const discountCode = document.getElementById('discount-code');
    var button = document.getElementById('roll-dice'); // Replace with your button's ID
    var lastClick = localStorage.getItem('lastClick');
    var now = new Date().getTime();


    if (lastClick && (now - lastClick) < 24 * 60 * 60 * 1000) {
        button.disabled = true;
        button.style.backgroundColor = 'gray';
        button.textContent = 'فردا دوباره امتحان کن';
    }

    button.addEventListener('click', function() {
        localStorage.setItem('lastClick', new Date().getTime());
        button.disabled = true;
        button.style.backgroundColor = 'gray';
    });

    rollButton.addEventListener('click', () => {
        diceImage.classList.add('spin');

        diceImage.addEventListener('animationend', () => {
            diceImage.classList.remove('spin');
            const randomNumber = diceNumbers[Math.floor(Math.random() * diceNumbers.length)];
            diceImage.src = `dice-${randomNumber}.png`; // Assuming you have images named dice-1.png, dice-2.png, ... dice-6.png

            if (randomNumber === 20) {
                fetch('/wp-json/custom/v1/generate-coupon?discount=100')
                    .then(response => response.json())
                    .then(data => {
                        popupWinner.style.display = 'flex';
                        winnerHeader.textContent = '20 اومد!';
                        discountCode.textContent = `کد تخفیف شما: ${data.coupon_code}`;
                    })
                    .catch(error => console.error('Error:', error));
            } else if (randomNumber >= 16 && randomNumber <= 19) {
                fetch('/wp-json/custom/v1/generate-coupon?discount=20')
                    .then(response => response.json())
                    .then(data => {
                        popupWinner.style.display = 'flex';
                        winnerHeader.textContent = '16 تا 19 اومد!';
                        discountCode.textContent = `کد تخفیف شما: ${data.coupon_code}`;
                    })
                    .catch(error => console.error('Error:', error));
            }
        }, {once: true});
    });
});