document.addEventListener('DOMContentLoaded', function() {
    const rollButton = document.getElementById("roll-dice");
    const diceImage = document.querySelector(".dice-img");
    const popupWinner = document.querySelector('.popup-winner');
    const winnerHeader = document.getElementById('winner-header');
    const discountCode = document.getElementById('discount-code');
    
    // Define valid dice numbers (1-20)
    const diceNumbers = Array.from({ length: 20 }, (_, i) => i + 1);
    
    // Localized variables (added via wp_localize_script in WordPress)
    const apiSettings = window.diceRollerApi || {};
    const { apiUrl, nonce } = apiSettings;

    // Track cooldown and animation state
    let isRolling = false;

    // Initialize button state
    updateButtonCooldown();

    // Check localStorage for cooldown
   function updateButtonCooldown() {
        const lastClick = localStorage.getItem('lastClick');
        const now = Date.now();
        const cooldown = 24 * 60 * 60 * 1000; // 24 hours

        if (lastClick && (now - lastClick < cooldown)) {
            disableButton();
        }
    }

    function disableButton() {
        rollButton.disabled = true;
        rollButton.classList.add('disabled');
        rollButton.textContent = 'فردا دوباره امتحان کن';
    }

    async function handleApiRequest(discount) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': nonce // WordPress REST API nonce
                },
                body: JSON.stringify({ discount })
            });

            if (!response.ok) throw new Error('API request failed');
            const data = await response.json();

            popupWinner.style.display = 'flex';
            winnerHeader.textContent = `${discount === 100 ? '20' : '16 تا 19'} اومد!`;
            discountCode.textContent = `کد تخفیف شما: ${data.coupon_code}`;
        } catch (error) {
            console.error('Error:', error);
            alert('خطا در تولید کد تخفیف. لطفا دوباره امتحان کنید.');
        } finally {
            isRolling = false;
        }
    }

    rollButton.addEventListener('click', async () => {
        if (isRolling) return; // Prevent multiple clicks
        isRolling = true;

        // Set cooldown
        localStorage.setItem('lastClick', Date.now());
        disableButton();

        // Trigger dice animation
        diceImage.classList.add('spin');

        // Wait for animation to finish
        diceImage.addEventListener('animationend', async () => {
            diceImage.classList.remove('spin');
            const randomNumber = diceNumbers[Math.floor(Math.random() * diceNumbers.length)];
            diceImage.src = `dice-${randomNumber}.png`;

            if (randomNumber === 20) {
                await handleApiRequest(100);
            } else if (randomNumber >= 16 && randomNumber <= 19) {
                await handleApiRequest(20);
            } else {
                isRolling = false;
            }
        }, { once: true });
    });
});