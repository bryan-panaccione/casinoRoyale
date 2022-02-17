var wager = 0;
var cashReserves = 100;
var deckOfCards = undefined;
var houseScore = 0
var playerScore = 0
var dealCount = 0
$('.scoreRightBox').text(houseScore)
$('.scoreLeftBox').text(playerScore)
$('#cashDisplay').text(cashReserves)
const $cardBack = $('<img id="faceDown" src="http://deckofcardsapi.com/static/img/back.png">')

const deckInit = () => {
    document.querySelector('#newHand').disabled = false;
    const otherButts = document.querySelectorAll('.lockDis')
    for (let i = 0; i < otherButts.length; i++) {
        otherButts[i].disabled = true;
    }

    const otherButts3 = document.querySelectorAll('.preBetDisabled')
    for (let i = 0; i < otherButts3.length; i++) {
        otherButts3[i].disabled = true;
    }
    $.get(`http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6`, (data) => {
        deckOfCards = data
    }
    )
}

//gamble feature
function wagerSet() {


    if (document.querySelector('#wagerInput').value % 5 === 0 && Number.isInteger(parseInt(document.querySelector('#wagerInput').value))) {
        wager = parseInt(document.querySelector('#wagerInput').value)
        //button triggers
        document.querySelector('#lock').disabled = true;
        const otherButts2 = document.querySelectorAll('.duringGame')
        for (let i = 0; i < otherButts2.length; i++) {
            otherButts2[i].disabled = false;
        }
        document.querySelector('#deckMake').disabled = true;

    } else {
        return


    }
}

function lose() {
    cashReserves -= wager
    $('#cashDisplay').text(cashReserves.toLocaleString())
}

function win() {
    cashReserves += wager
    $('#cashDisplay').text(cashReserves.toLocaleString())
}

function reservesCheck() {
    if (cashReserves < 0) {
        $('.hiddenDiv2').toggleClass('showDiv2')
    }
}

$resultsMessage = $('<div class="hiddenDiv"></div>')
$('.playContainer').append($resultsMessage)
function dealerBust() {
    $resultsMessage.text('DEALER BUST!')
    $resultsMessage.toggleClass('showDiv')
    win()


}

function playerBust() {
    $resultsMessage.text('PLAYER BUST!')
    $resultsMessage.toggleClass('showDiv')
    document.querySelector('#newHand').disabled = false;
    lose()
    reservesCheck()
}

function dealerWin() {
    $resultsMessage.text('DEALER WON!')
    $resultsMessage.toggleClass('showDiv')
    lose()
    reservesCheck()
}

function playerWin() {
    $resultsMessage.text('YOU WIN!')
    $resultsMessage.toggleClass('showDiv')
    win()
}

//lw5uw2w3xcme
function hitCard() {
    $.get(`http://deckofcardsapi.com/api/deck/${deckOfCards['deck_id']}/draw/?count=1`, (data) => {
        console.log(data)
        let $cardImage = $(`<img class="faceUp" src=${data['cards'][0]['image']}>`)
        let cardValue = parseInt(data['cards'][0]['value'])
        if (data['cards'][0]['value'] === 'ACE' && dealCount === 0) {
            houseScore += 11
            $('.scoreRightBox').text(houseScore)
            $('.rightSide').append($cardImage)
            $('.rightSide').append($cardBack)
        } else if (data['cards'][0]['value'] === 'ACE' && dealCount > 0) {
            playerScore += 11
            $('.scoreLeftBox').text(playerScore)
            $('.leftSide').append($cardImage)


        } else if (dealCount === 0) {
            houseScore += (cardValue || 10)
            $('.scoreRightBox').text(houseScore)
            $('.rightSide').append($cardImage)
            $('.rightSide').append($cardBack)
        } else {
            playerScore += (cardValue || 10)
            $('.leftSide').append($cardImage)
            $('.scoreLeftBox').text(playerScore)
        }
        if (playerScore > 21) {
            playerBust()
            $('.leftSide').append($cardImage)
            $('.scoreLeftBox').text(playerScore)
            playerScore = 0
            console.log('loser')
            const otherButts = document.querySelectorAll('.duringGame')
            for (let i = 0; i < otherButts.length; i++) {
                otherButts[i].disabled = true;

            }
        } dealCount++


    })
}

function newHand() {
    document.querySelector('#newHand').disabled = true;
    $resultsMessage.toggleClass('showDiv')
    const otherButts = document.querySelectorAll('.preBetEnabled')
    for (let i = 0; i < otherButts.length; i++) {
        otherButts[i].disabled = false;
    }
    const otherButts5 = document.querySelectorAll('.preBetDisabled')
    for (let i = 0; i < otherButts5.length; i++) {
        otherButts5[i].disabled = true;
    }

    playerScore = 0
    houseScore = 0
    dealCount = 0
    $('.scoreLeftBox').text(playerScore)
    $('.scoreRightBox').text(houseScore)
    console.log('new hand')
    $('.leftSide').html('')
    $('.rightSide').html('')
}

function dealHand() {
    document.querySelector('#deal').disabled = true;
    let i = 0;
    while (i < 3) {
        hitCard()
        i++
    }
}

function playDealer() {
    $("#faceDown").remove()
    document.querySelector('#newHand').disabled = false;
    const otherButts3 = document.querySelectorAll('.duringGame')
    for (let i = 0; i < otherButts3.length; i++) {
        otherButts3[i].disabled = true;
    }
    $.get(`http://deckofcardsapi.com/api/deck/${deckOfCards['deck_id']}/draw/?count=1`, (data) => {
        let $cardImage = $(`<img class="faceUp" src=${data['cards'][0]['image']}>`)
        let cardValue = parseInt(data['cards'][0]['value'])
        if (data['cards'][0]['value'] === 'ACE') {
            houseScore += 11
            $('.rightSide').append($cardImage)
            $('.scoreRightBox').text(houseScore)
        } else {
            houseScore += (cardValue || 10)
            console.log(houseScore)
            $('.rightSide').append($cardImage)
            $('.scoreRightBox').text(houseScore)
        }

        if (houseScore <= 16) {
            playDealer()
        }
        else if (houseScore > 21) {
            dealerBust()
            console.log('dealer bust')
            houseScore = 0
            playerScore = 0
        }
        else if (houseScore <= 21 && houseScore >= playerScore) {
            dealerWin()
            console.log('dealer wins')
            houseScore = 0
            playerScore = 0
        } else {
            playerWin()
            console.log('player won this hand')
            houseScore = 0
            playerScore = 0
        }

    })
}



$('#lock').click(wagerSet)

$('#deckMake').click(deckInit)
$('#deal').click(dealHand)
$('#hitter').click(hitCard)
$('#newHand').click(newHand)
$('#stay').click(playDealer)

deckInit()
