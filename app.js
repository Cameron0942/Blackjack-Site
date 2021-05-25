//no idea how to link javascript files together
//import * as time from '/timer.js';
const req = new XMLHttpRequest();
req.open("GET", "https://deckofcardsapi.com/api/deck/new/draw/?count=52");
var fullDeck;
var firstDraw = true;
var playerTotal = 0;
var dealerTotal = 0;
var playerFirstDraw = true;
var dealerHiddenCard = 0;
var playerCanHit = true;
var firstStay = true;
var playerBlackjack = false;
var dealerBlackjack = false;

req.onload = function() {
    
    if(req.response) {
        let success = document.querySelector(".success");
        success.setAttribute("style", "display: block;");
        
    }
    else {
        let error = document.querySelector(".error");
        error.setAttribute("style", "display: block;");
        success.setAttribute("style", "display: none;");
    }

    let data = JSON.parse(req.response);

    fullDeck = data["cards"];

    document.querySelector(".userChoices").setAttribute("style", "display: none;");

};
req.send();

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

function drawPlayerCards() {
    var card = fullDeck[0];
    var playerHandValue;
    

    fullDeck.shift();
    document.querySelector("#playerHand").querySelector("#card1").src = card["image"];
    playerHandValue = card["value"];

    
    switch (playerHandValue) {
        case "JACK":
            playerHandValue = 10;
            break;
        case "QUEEN":
            playerHandValue = 10;
            break;
        case "KING":
            playerHandValue = 10;
            break;
        case "ACE":
            playerHandValue = 11;
            break;
        default:
            playerHandValue = parseInt(card["value"]);
    }

    

    card = fullDeck[0];
    fullDeck.shift();
    document.querySelector("#playerHand").querySelector("#card2").src = card["image"];
    var total = playerHandValue;
    playerHandValue = card["value"];

    switch (playerHandValue) {
        case "JACK":
            total += 10;
            break;
        case "QUEEN":
            total += 10;
            break;
        case "KING":
            total += 10;
            break;
        case "ACE":
            if(playerHandValue == 11) {
            total += 1;
            }
            else {
                total += 11;
            }
            break;
        default:
            total += parseInt(card["value"]);
    }


    document.querySelector("#playerValue").innerText = "Player hand: " + total;

    document.querySelector(".deal").setAttribute("style", "display: none;");

    document.querySelector(".tableContainer").classList.remove("tableContainer");
    
    playerTotal = total;

    if (playerTotal == 21) {
        document.querySelector("#playerValue").innerText = "Player hand: BLACKJACK";
        document.querySelector("#back").remove();
        document.querySelector(".field").querySelector("#card2").style = "display: show;";
        document.querySelector("#dealerValue").innerText = "Dealer hand: " + dealerTotal;
        playerBlackjack = true;

        var text = document.createElement("p");
        document.getElementById("winner").appendChild(text);
        document.querySelector("#winner").innerText = "Player wins";
        document.querySelector("#winner").style = "display: flex;";
        return;
    }

    document.querySelector(".success").style = "color: red;";

    return;
}

function drawDealerCards() {
    var card = fullDeck[0];
    var dealerHandValue = 0;
    fullDeck.shift();
    document.querySelector("#dealerHand").querySelector("#card1").src = card["image"];
    card2 = fullDeck[0];
    dealerHiddenCard = card2["value"];
    fullDeck.shift();
    document.querySelector("#dealerHand").querySelector("#card2").src = card2["image"];

    if(firstDraw) {
        document.querySelector("#dealerHand").querySelector("#back").src = "images/back.png";
        document.querySelector("#dealerHand").querySelector("#back").style = "height: 314px; width: 226px;";
        document.querySelector("#dealerHand").querySelector("#card2").style = "height: 314px; width: 226px;";
        document.querySelector("#dealerHand").querySelector("#card2").style = "display: none;";

        document.querySelector(".userChoices").setAttribute("style", "display: flex;");
    }

    switch (card["value"]) {
        case "JACK":
            dealerHandValue = 10;
            break;
        case "QUEEN":
            dealerHandValue = 10;
            break;
        case "KING":
            dealerHandValue = 10;
            break;
        case "ACE":
            dealerHandValue = 11;
            break;
        default:
            dealerHandValue = parseInt(card["value"]);
    }

    document.querySelector("#dealerValue").innerText = "Dealer hand: " + dealerHandValue;

    var total = dealerHandValue;

    switch (card2["value"]) {
        case "JACK":
            total += 10;
            break;
        case "QUEEN":
            total += 10;
            break;
        case "KING":
            total += 10;
            break;
        case "ACE":
            if(dealerHandValue == 11) {
            total += 1;
            }
            else {
                total += 11;
            }
            break;
        default:
            total += parseInt(card2["value"]);
    }
    
    dealerTotal = total;

    if (dealerTotal == 21){
        console.log("Dealer BlackJack");

        setTimeout(()=> {
            document.querySelector("#back").remove();
            document.querySelector(".field").querySelector("#card2").style = "display: show;";
            document.querySelector("#dealerValue").innerText = "Dealer hand: Blackjack";
        }, 1000);

        dealerBlackjack = true;
        return;
    }

    return;
}


function hit() {
    if (!playerCanHit) {
        return;
    }

    if (playerBlackjack || dealerBlackjack) {
        return;
    }

    if (playerTotal == 21) {
        return;
    }

    var cardPulled;

    if (playerTotal <= 21) {
        cardPulled = fullDeck[0];
        fullDeck.shift();
        var img = document.createElement("img");
        img.src = cardPulled["image"];
        document.getElementById("playerHand").appendChild(img);

        switch (cardPulled["value"]) {
            case "JACK":
                playerTotal += 10;
                break;
            case "QUEEN":
                playerTotal += 10;
                break;
            case "KING":
                playerTotal += 10;
                break;
            case "ACE":
                if(playerTotal <= 10) {
                    playerTotal += 11;
                }
                else {
                    playerTotal += 1;
                }
                break;
            default:
                playerTotal += parseInt(cardPulled["value"]);
        }

        document.querySelector("#playerValue").innerText = "Player hand: " + playerTotal;

        playerFirstDraw = false;
    }
    if(playerTotal > 21) {
        document.querySelector("#playerValue").innerText = "Player hand: " + playerTotal + " BUST";
        document.querySelector("#back").remove();
        document.querySelector(".field").querySelector("#card2").style = "display: show;";
        document.querySelector("#dealerValue").innerText = "Dealer hand: " + dealerTotal;

        var text = document.createElement("p");
        document.getElementById("winner").appendChild(text);
        document.querySelector("#winner").innerText = "Dealer wins";
        document.querySelector("#winner").style = "display: flex;";
    }
}

function stay() {
    //TODO
    //think of method to handle hands with ACE in them
    playerCanHit = false;
    var card;

    if (playerTotal > 21) {
        return;
    }
    
    if (dealerBlackjack) {
        return;
    }

    document.querySelector("#back").remove();
    document.querySelector(".field").querySelector("#card2").style = "display: show;";

    if (dealerTotal >= 17) {
        document.querySelector("#dealerValue").innerText = "Dealer hand: " + dealerTotal;
        return;
    }

    document.querySelector("#dealerValue").innerText = "Dealer hand: " + dealerTotal;


    while (dealerTotal < 17) {

        if (dealerTotal >= 17) {
            return;
        }

        fullDeck.shift();
        card = fullDeck[0];
        
        switch (card["value"]) {
            case "JACK":
                dealerTotal += 10;
                break;
            case "QUEEN":
                dealerTotal += 10;
                break;
            case "KING":
                dealerTotal += 10;
                break;
            case "ACE":
                if(dealerTotal <= 10) {
                    dealerTotal += 11;
                }
                else {
                    dealerTotal += 1;
                }
                break;
            default:
                    dealerTotal += parseInt(card["value"]);
        }

            var img = document.createElement("img");
            img.src = card["image"];
            document.getElementById("dealerHand").appendChild(img);

            document.querySelector("#dealerValue").innerText = "Dealer hand: " + dealerTotal;
        
            console.log(dealerTotal);

            if (dealerTotal > 21) {
                document.querySelector("#dealerValue").innerText = "Dealer hand: " + dealerTotal + " BUST";
                var text = document.createElement("p");
                document.getElementById("winner").appendChild(text);
                document.querySelector("#winner").innerText = "Player wins";
                document.querySelector("#winner").style = "display: flex;";
                return;
            }

            firstStay = false;
        }

        console.log("Dealer total: " + dealerTotal + " \n" + "Player total: " + playerTotal);
    if (playerTotal > dealerTotal){
        console.log("player wins");
        var text = document.createElement("p");
        document.getElementById("winner").appendChild(text);
        document.querySelector("#winner").innerText = "Player wins";
        document.querySelector("#winner").style = "display: flex;";
    }
    if (dealerTotal == playerTotal) {
        console.log("Push");
        var text = document.createElement("p");
        document.getElementById("winner").appendChild(text);
        document.querySelector("#winner").innerText = "Push";
        document.querySelector("#winner").style = "display: flex;";
    }
    if (dealerTotal > playerTotal){
        console.log("Dealer wins");
        var text = document.createElement("p");
        document.getElementById("winner").appendChild(text);
        document.querySelector("#winner").innerText = "Dealer wins";
        document.querySelector("#winner").style = "display: flex;";
    }

    document.querySelectorAll(".userChoices #newDeal").style = "display: flex;";
    

    return;
}

function checkStay() {

    if (!firstStay) {
        return;
    }

    if (playerTotal > dealerTotal){
        var text = document.createElement("p");
        document.getElementById("winner").appendChild(text);
        document.querySelector("#winner").innerText = "Player wins";
        document.querySelector("#winner").style = "display: flex;";
    }
    if (dealerTotal == playerTotal) {
        var text = document.createElement("p");
        document.getElementById("winner").appendChild(text);
        document.querySelector("#winner").innerText = "Push";
        document.querySelector("#winner").style = "display: flex;";
    }
    if (dealerTotal > playerTotal){
        var text = document.createElement("p");
        document.getElementById("winner").appendChild(text);
        document.querySelector("#winner").innerText = "Dealer wins";
        document.querySelector("#winner").style = "display: flex;";
    }

    return;
}

function newHand() {
    sessionStorage.setItem("reloading", "true");
    document.location.reload();
}

window.onload = function() {
    var reloading = sessionStorage.getItem("reloading");
    if (reloading) {
        const dealButton = document.querySelector(".container").querySelector(".deal");
        dealButton.style.display = "none";
        sessionStorage.removeItem("reloading");
        setTimeout(() => {
            console.log("Called from refresh");
            dealButton.click();
        }, 300);
    }
}
