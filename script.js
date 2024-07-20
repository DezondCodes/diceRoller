document.addEventListener('DOMContentLoaded', function() {
    const rollButton = document.getElementById("roll-dice");
    const diceImage = document.querySelector(".dice-img");
    const diceNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; // Array of dice numbers

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
                        alert(`Congratulations! You won a 100% off coupon: ${data.coupon_code}`);
                    })
                    .catch(error => console.error('Error:', error));
            } else if (randomNumber >= 16 && randomNumber <= 19) {
                fetch('/wp-json/custom/v1/generate-coupon?discount=20')
                    .then(response => response.json())
                    .then(data => {
                        alert(`Congratulations! You won a 20% off coupon: ${data.coupon_code}`);
                    })
                    .catch(error => console.error('Error:', error));
            }
        }, {once: true});
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const rollButton = document.getElementById("roll-dice");
    const diceImage = document.querySelector(".dice-img");
    const diceNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; // Array of dice numbers

    rollButton.addEventListener('click', () => {
        console.log('Roll button clicked');
        diceImage.classList.add('spin');

        diceImage.addEventListener('animationend', () => {
            console.log('Animation ended');
            diceImage.classList.remove('spin');
            const randomNumber = diceNumbers[Math.floor(Math.random() * diceNumbers.length)];
            console.log('Random number generated:', randomNumber);
            diceImage.src = `dice-${randomNumber}.png`;

            if (randomNumber === 20) {
                console.log('Rolled a 20, fetching 100% off coupon');
                fetch('/wp-json/custom/v1/generate-coupon?discount=100')
                    .then(response => {
                        console.log('Response received:', response);
                        return response.json();
                    })
                    .then(data => {
                        console.log('Coupon data:', data);
                        alert(`Congratulations! You won a 100% off coupon: ${data.coupon_code}`);
                    })
                    .catch(error => console.error('Error:', error));
            } else if (randomNumber >= 16 && randomNumber <= 19) {
                console.log('Rolled between 16 and 19, fetching 20% off coupon');
                fetch('/wp-json/custom/v1/generate-coupon?discount=20')
                    .then(response => {
                        console.log('Response received:', response);
                        return response.json();
                    })
                    .then(data => {
                        console.log('Coupon data:', data);
                        alert(`Congratulations! You won a 20% off coupon: ${data.coupon_code}`);
                    })
                    .catch(error => console.error('Error:', error));
            }
        }, {once: true});
    });
});