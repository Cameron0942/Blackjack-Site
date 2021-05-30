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
var playerNonAceCardsTotal = 0;
var acePulled = false;
var dealerNonAceCardsTotal = 0;
var dealerAcePulled = false;

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
            playerNonAceCardsTotal += 10;
            break;
        case "QUEEN":
            playerHandValue = 10;
            playerNonAceCardsTotal += 10;
            break;
        case "KING":
            playerHandValue = 10;
            playerNonAceCardsTotal += 10;
            break;
        case "ACE":
            playerHandValue = 11;
            acePulled = true;
            break;
        default:
            playerHandValue = parseInt(card["value"]);
            playerNonAceCardsTotal += parseInt(card["value"]);
    }

    

    card = fullDeck[0];
    fullDeck.shift();
    document.querySelector("#playerHand").querySelector("#card2").src = card["image"];
    var total = playerHandValue;
    playerHandValue = card["value"];

    switch (playerHandValue) {
        case "JACK":
            total += 10;
            playerNonAceCardsTotal += 10;
            break;
        case "QUEEN":
            total += 10;
            playerNonAceCardsTotal += 10;
            break;
        case "KING":
            total += 10;
            playerNonAceCardsTotal += 10;
            break;
        case "ACE":
            acePulled = true;
            if(playerHandValue == 11) {
                total += 1;
            }
            else {
                total += 11;
            }
            break;
        default:
            total += parseInt(card["value"]);
            playerNonAceCardsTotal += parseInt(card["value"]);
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

        document.querySelector(".userChoices").querySelector("#newDeal").style.display = "flex";
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
            dealerNonAceCardsTotal += 10;
            break;
        case "QUEEN":
            dealerHandValue = 10;
            dealerNonAceCardsTotal += 10;
            break;
        case "KING":
            dealerHandValue = 10;
            dealerNonAceCardsTotal += 10;
            break;
        case "ACE":
            dealerAcePulled = true;
            dealerHandValue = 11;
            break;
        default:
            dealerHandValue = parseInt(card["value"]);
            dealerNonAceCardsTotal += parseInt(card["value"]);
    }

    document.querySelector("#dealerValue").innerText = "Dealer hand: " + dealerHandValue;

    var total = dealerHandValue;

    switch (card2["value"]) {
        case "JACK":
            total += 10;
            dealerNonAceCardsTotal += 10;
            break;
        case "QUEEN":
            total += 10;
            dealerNonAceCardsTotal += 10;
            break;
        case "KING":
            total += 10;
            dealerNonAceCardsTotal += 10;
            break;
        case "ACE":
            dealerAcePulled = true;
            if(dealerHandValue == 11) {
                total += 1;
            }
            else {
                total += 11;
            }
            break;
        default:
            total += parseInt(card2["value"]);
            dealerNonAceCardsTotal += parseInt(card2["value"]);
    }
    
    dealerTotal = total;
    console.log("dealer non card ace total from initial deal: " + dealerNonAceCardsTotal);

    if (dealerTotal == 21){
        console.log("Dealer BlackJack");

        setTimeout(()=> {
            document.querySelector("#back").remove();
            document.querySelector(".field").querySelector("#card2").style = "display: show;";
            document.querySelector("#dealerValue").innerText = "Dealer hand: Blackjack";
        }, 1000);

        document.querySelector(".userChoices").querySelector("#newDeal").style.display = "flex";
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

    document.querySelector(".doubleDown").style.display = "none";

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
                playerNonAceCardsTotal += 10;
                break;
            case "QUEEN":
                playerTotal += 10;
                playerNonAceCardsTotal += 10;
                break;
            case "KING":
                playerTotal += 10;
                playerNonAceCardsTotal += 10;
                break;
            case "ACE":
                acePulled = true;
                if(playerNonAceCardsTotal > 10) {
                    playerTotal += 1;
                }
                if (playerNonAceCardsTotal < 10 && playerTotal < 10) {
                    playerTotal += 11;
                }
                break;
            default:
                playerTotal += parseInt(cardPulled["value"]);
                playerNonAceCardsTotal += parseInt(cardPulled["value"]);

        }
        console.log("non ace card total: " + playerNonAceCardsTotal);

        playerFirstDraw = false;
    }

    if (playerNonAceCardsTotal > 10 && acePulled && playerTotal > 21) {
        playerTotal -= 10;
        console.log("successfully checked hit");
    }

    if(playerNonAceCardsTotal >= 21 && acePulled){
        playerTotal += 10;
        console.log("Player should have busted with playerTotal of: " + playerTotal);

        document.querySelector("#playerValue").innerText = "Player hand: " + playerTotal + " BUST";
        document.querySelector("#back").remove();
        document.querySelector(".field").querySelector("#card2").style = "display: show;";
        document.querySelector("#dealerValue").innerText = "Dealer hand: " + dealerTotal;

        var text = document.createElement("p");
        document.getElementById("winner").appendChild(text);
        document.querySelector("#winner").innerText = "Dealer wins";
        document.querySelector("#winner").style = "display: flex;";

        document.querySelector(".userChoices").querySelector("#newDeal").style.display = "flex";

        return;
    }

    console.log("Player total after checking: " + playerTotal);


    document.querySelector("#playerValue").innerText = "Player hand: " + playerTotal;

    if(playerTotal > 21) {
        document.querySelector("#playerValue").innerText = "Player hand: " + playerTotal + " BUST";
        document.querySelector("#back").remove();
        document.querySelector(".field").querySelector("#card2").style = "display: show;";
        document.querySelector("#dealerValue").innerText = "Dealer hand: " + dealerTotal;

        var text = document.createElement("p");
        document.getElementById("winner").appendChild(text);
        document.querySelector("#winner").innerText = "Dealer wins";
        document.querySelector("#winner").style = "display: flex;";

        document.querySelector(".userChoices").querySelector("#newDeal").style.display = "flex";
    }
}

function stay() {
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
    document.querySelector(".doubleDown").style.display = "none";

    if (dealerTotal >= 17) {
        document.querySelector("#dealerValue").innerText = "Dealer hand: " + dealerTotal;
        return;
    }

    document.querySelector("#dealerValue").innerText = "Dealer hand: " + dealerTotal;


    while (dealerTotal < 17) {

        if (dealerTotal >= 17) {
            break;
        }

        fullDeck.shift();
        card = fullDeck[0];
        
        console.log("dealer non ace cards total before switch statement: " + dealerNonAceCardsTotal);

        switch (card["value"]) {
            case "JACK":
                dealerTotal += 10;
                dealerNonAceCardsTotal += 10;
                break;
            case "QUEEN":
                dealerTotal += 10;
                dealerNonAceCardsTotal += 10;
                break;
            case "KING":
                dealerTotal += 10;
                dealerNonAceCardsTotal += 10;
                break;
            case "ACE":
                dealerAcePulled = true;
                if (dealerNonAceCardsTotal > 10 && dealerTotal > 10) {
                    dealerTotal += 1;
                    console.log("Value being added from ACE: 1");
                }
                if (dealerNonAceCardsTotal <= 10 && dealerTotal <= 10) {
                    dealerTotal += 11;
                    console.log("Value being added from ACE: 11");
                }
                break;
            default:
                    dealerTotal += parseInt(card["value"]);
                    console.log("This is the value being added into dealerNonAceCardsTotal -> " + parseInt(card["value"]));
                    dealerNonAceCardsTotal += parseInt(card["value"]);
        }
            console.log("dealer non ace cards total after switch statement: " + dealerNonAceCardsTotal);

            if (dealerNonAceCardsTotal > 10 && dealerAcePulled && dealerTotal > 21) {
                dealerTotal -= 10;
                console.log("successfully checked dealer hit");
            }

            console.log("dealer total after adjusting: " + dealerTotal);

            if (dealerNonAceCardsTotal >= 21 && dealerAcePulled && dealerTotal > 21) {
                dealerTotal += 10;
                console.log("Dealer should have busted with dealerTotal of: " + dealerTotal);

                document.querySelector("#dealerValue").innerText = "Dealer hand: " + dealerTotal + " BUST";
                var text = document.createElement("p");
                document.getElementById("winner").appendChild(text);
                document.querySelector("#winner").innerText = "Player wins";
                document.querySelector("#winner").style = "display: flex;";

                document.querySelector(".userChoices").querySelector("#newDeal").style.display = "flex";
                return;                
            }

            var img = document.createElement("img");
            img.src = card["image"];
            document.getElementById("dealerHand").appendChild(img);

            document.querySelector("#dealerValue").innerText = "Dealer hand: " + dealerTotal;
        

            if (dealerTotal > 21) {
                document.querySelector("#dealerValue").innerText = "Dealer hand: " + dealerTotal + " BUST";
                var text = document.createElement("p");
                document.getElementById("winner").appendChild(text);
                document.querySelector("#winner").innerText = "Player wins";
                document.querySelector("#winner").style = "display: flex;";

                document.querySelector(".userChoices").querySelector("#newDeal").style.display = "flex";
                return;
            }

            firstStay = false;
            dealerAcePulled = false;
            console.log("____ITERATE____");
        }
        

    if (playerTotal > dealerTotal){
        console.log("player wins");
        var text = document.createElement("p");
        document.getElementById("winner").appendChild(text);
        document.querySelector("#winner").innerText = "Player wins";
        document.querySelector("#winner").style = "display: flex;";
        document.querySelector(".userChoices").querySelector("#newDeal").style.display = "flex";
    }
    if (dealerTotal == playerTotal) {
        console.log("Push");
        var text = document.createElement("p");
        document.getElementById("winner").appendChild(text);
        document.querySelector("#winner").innerText = "Push";
        document.querySelector("#winner").style = "display: flex;";
        document.querySelector(".userChoices").querySelector("#newDeal").style.display = "flex";
    }
    if (dealerTotal > playerTotal){
        console.log("Dealer wins");
        var text = document.createElement("p");
        document.getElementById("winner").appendChild(text);
        document.querySelector("#winner").innerText = "Dealer wins";
        document.querySelector("#winner").style = "display: flex;";
        document.querySelector(".userChoices").querySelector("#newDeal").style.display = "flex";
        document.querySelector(".userChoices").querySelector("#newDeal").style.display = "flex";
    }

    document.querySelector(".userChoices").querySelector("#newDeal").style.display = "flex";
    

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
        document.querySelector(".userChoices").querySelector("#newDeal").style.display = "flex";
    }
    if (dealerTotal == playerTotal) {
        var text = document.createElement("p");
        document.getElementById("winner").appendChild(text);
        document.querySelector("#winner").innerText = "Push";
        document.querySelector("#winner").style = "display: flex;";
        document.querySelector(".userChoices").querySelector("#newDeal").style.display = "flex";
    }
    if (dealerTotal > playerTotal){
        var text = document.createElement("p");
        document.getElementById("winner").appendChild(text);
        document.querySelector("#winner").innerText = "Dealer wins";
        document.querySelector("#winner").style = "display: flex;";
        document.querySelector(".userChoices").querySelector("#newDeal").style.display = "flex";
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
            dealButton.click();
        }, 1000);
    }
}
