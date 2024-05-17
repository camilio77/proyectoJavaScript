document.addEventListener('DOMContentLoaded', () => {
    const mainButton = document.querySelector('.card1');
    const otherButtons = document.querySelectorAll('.card2, .card3, .card4');
    let menuOpen = false;

    mainButton.addEventListener('click', () => {
        if (menuOpen) {
            otherButtons.forEach((button, index) => {
                button.style.transform = 'translateY(0)';
                button.style.opacity = '0';
                setTimeout(() => {
                    button.style.display = 'none';
                }, 300);
            });
        } else {
            otherButtons.forEach((button, index) => {
                button.style.display = 'block';
                setTimeout(() => {
                    button.style.transform = `translateY(${(index + 1) * 50}px)`;
                    button.style.opacity = '1';
                }, 10);
            });
        }
        menuOpen = !menuOpen;
    });


    let left = document.querySelector(".left")
    let player = document.querySelector(".player")
    let right = document.querySelector(".track_list")
    for (let i = 0; i < otherButtons.length; i++) {
        otherButtons[i].addEventListener('click', () => {
            if(i == 0){
                left.style.order = "0"
                player.style.order = "0"
                right.style.order = "2"
            } else if(i == 1){
                right.style.order = "0"
                player.style.order = "1"
                left.style.order = "2"
            }
        });
    }
});