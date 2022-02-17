
var deckOfCards = undefined;
var houseScore = 0
var playerScore = 0
var dealCount = 0
$('.scoreRightBox').text(houseScore)
$('.scoreLeftBox').text(playerScore)
const $cardBack = $('<img id="faceDown" src="http://deckofcardsapi.com/static/img/back.png">')

const deckInit = () => {

    console.log('hellow')
    $.get(`http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6`, (data) => {
        deckOfCards = data
    }
    )
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
            $('.leftSide').append($cardImage)
            $('.scoreLeftBox').text(playerScore)
            playerScore = 0
            console.log('loser')
            const otherButts = document.querySelectorAll('.dis1')
            for (let i = 0; i < otherButts.length; i++) {
                otherButts[i].disabled = true;

            }
        } dealCount++


    })
}

function newHand() {
    const otherButts = document.querySelectorAll('.dis1')
    for (let i = 0; i < otherButts.length; i++) {
        otherButts[i].disabled = false;
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
    let i = 0;
    while (i < 3) {
        hitCard()
        i++
    }
}

function playDealer() {
    $("#faceDown").remove()
    $.get(`http://deckofcardsapi.com/api/deck/${deckOfCards['deck_id']}/draw/?count=1`, (data) => {
        let $cardImage = $(`<img class="faceUp" src=${data['cards'][0]['image']}>`)
        let cardValue = parseInt(data['cards'][0]['value'])
        if (data['cards'][0]['value'] === 'ACE') {
            houseScore += 11
            $('.rightSide').append($cardImage)
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
            console.log('dealer bust')
            houseScore = 0
            playerScore = 0
        }
        else if (houseScore <= 21 && houseScore >= playerScore) {
            console.log('dealer wins')
            houseScore = 0
            playerScore = 0
        } else {
            console.log('player won this hand')
            houseScore = 0
            playerScore = 0
        }

    })
}
$('#deckMake').click(deckInit)
$('#deal').click(dealHand)
$('#hitter').click(hitCard)
$('#newHand').click(newHand)
$('#stay').click(playDealer)

deckInit()
