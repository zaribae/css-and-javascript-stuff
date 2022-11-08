function randomDice() {
    // Create random variable
    let randomNumber1 = Math.floor(Math.random() * 6) + 1;
    // Create random dice img through src
    let randomDiceImg1 = "./images/dice" + randomNumber1 + ".png";
    // Set random dice image
    document.querySelectorAll("img")[0].setAttribute("src", randomDiceImg1);


    // Create random variable
    let randomNumber2 = Math.floor(Math.random() * 6) + 1;
    // Create random dice img through src
    let randomDiceImg2 = "./images/dice" + randomNumber2 + ".png";
    // Set random dice image
    document.querySelectorAll("img")[1].setAttribute("src", randomDiceImg2);

    // Winning Condition
    if (randomNumber1 > randomNumber2) {
        document.querySelector("h1").innerHTML = "Player 1 Wins!";
    } else if (randomNumber2 > randomNumber1) {
        document.querySelector("h1").innerHTML = "Player 2 Wins!";
    } else {
        document.querySelector("h1").innerHTML = "Draw!";
    }
}

console.log(Math.floor(Math.random() * 6));
