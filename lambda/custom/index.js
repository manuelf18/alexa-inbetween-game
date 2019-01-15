/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const DECK = [
  {name: '2', value: 1, suit: 'clubs'},
  {name: '3', value: 2, suit: 'clubs'},
  {name: '4', value: 3, suit: 'clubs'},
  {name: '5', value: 4, suit: 'clubs'},
  {name: '6', value: 5, suit: 'clubs'},
  {name: '7', value: 6, suit: 'clubs'},
  {name: '8', value: 7, suit: 'clubs'},
  {name: '9', value: 8, suit: 'clubs'},
  {name: '10', value: 9, suit: 'clubs'},
  {name: 'J', value: 10, suit: 'clubs'},
  {name: 'Q', value: 11, suit: 'clubs'},
  {name: 'K', value: 12, suit: 'clubs'},
  {name: 'A', value: 13, suit: 'clubs'},
  {name: '2', value: 1, suit: 'diamonds'},
  {name: '3', value: 2, suit: 'diamonds'},
  {name: '4', value: 3, suit: 'diamonds'},
  {name: '5', value: 4, suit: 'diamonds'},
  {name: '6', value: 5, suit: 'diamonds'},
  {name: '7', value: 6, suit: 'diamonds'},
  {name: '8', value: 7, suit: 'diamonds'},
  {name: '9', value: 8, suit: 'diamonds'},
  {name: '10', value: 9, suit: 'diamonds'},
  {name: 'J', value: 10, suit: 'diamonds'},
  {name: 'Q', value: 11, suit: 'diamonds'},
  {name: 'K', value: 12, suit: 'diamonds'},
  {name: 'A', value: 13, suit: 'diamonds'},
  {name: '2', value: 1, suit: 'hearts'},
  {name: '3', value: 2, suit: 'hearts'},
  {name: '4', value: 3, suit: 'hearts'},
  {name: '5', value: 4, suit: 'hearts'},
  {name: '6', value: 5, suit: 'hearts'},
  {name: '7', value: 6, suit: 'hearts'},
  {name: '8', value: 7, suit: 'hearts'},
  {name: '9', value: 8, suit: 'hearts'},
  {name: '10', value: 9, suit: 'hearts'},
  {name: 'J', value: 10, suit: 'hearts'},
  {name: 'Q', value: 11, suit: 'hearts'},
  {name: 'K', value: 12, suit: 'hearts'},
  {name: 'A', value: 13, suit: 'hearts'},
  {name: '2', value: 1, suit: 'spades'},
  {name: '3', value: 2, suit: 'spades'},
  {name: '4', value: 3, suit: 'spades'},
  {name: '5', value: 4, suit: 'spades'},
  {name: '6', value: 5, suit: 'spades'},
  {name: '7', value: 6, suit: 'spades'},
  {name: '8', value: 7, suit: 'spades'},
  {name: '9', value: 8, suit: 'spades'},
  {name: '10', value: 9, suit: 'spades'},
  {name: 'J', value: 10, suit: 'spades'},
  {name: 'Q', value: 11, suit: 'spades'},
  {name: 'K', value: 12, suit: 'spades'},
  {name: 'A', value: 13, suit: 'spades'},
]
var card1;
var card2;
var points = 0;

function dealCards(){
  /* returns two cards which are not the same */
  let card1Index;
  let card2Index;
  do {
    card1Index = Math.floor(Math.random()*DECK.length);
    card2Index = Math.floor(Math.random()*DECK.length);
    if (DECK[card1Index].value > DECK[card2Index].value) {
      let aux = card2Index;
      card2Index = card1Index;
      card1Index = aux;
    }
  } while((card1Index === card2Index) || (DECK[card1Index].value === DECK[card2Index].value) || (DECK[card1Index].name === 'K' && DECK[card2Index].name === 'A') || (DECK[card2Index].value - DECK[card1Index].value === 1));
  return [DECK[card1Index], DECK[card2Index]];
}

function dealCard(){
  /* returns one card */
  return DECK[Math.floor(Math.random()*DECK.length)];
}

function getIndex(name, suit){
  return DECK.findIndex(e => e.name === name && e.suit === suit);
}

function removeCard(name, suit){
  let index = getIndex(name, suit);
  if (index != -1){
    DECK.splice(index, 1);
  }
}

function isInBetween(value1, value2, valuePlayer){
  if (valuePlayer > value1 && valuePlayer < value2)
    return true;
  return false;
}

function canPlay(){
  if (DECK.length >= 3)
    return true;
  return false;
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest' || 
          (handlerInput.requestEnvelope.request.type === 'IntentRequest' && handlerInput.requestEnvelope.request.intent.name === 'BeginGameIntent');
  },
  handle(handlerInput) {
    [card1, card2] = dealCards();
    removeCard(card1.name, card1.suit);
    removeCard(card2.name, card2.suit);

    const speechText = `We are going to play a session of acey deucey. I will deal two cards, say yes if
                        you believe that the next card I'll deal will be of a value between the two previous cards, or
                        say no if you dont believe it.
                        Your first cards are: ${card1.name} of ${card1.suit}
                        and ${card2.name} of ${card2.suit}`;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.gameStarted = true;
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Game Begins', speechText)
      .getResponse();
  },
};

const YesIntentHandler = {
  canHandle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    let gameStarted = false; 
    if (sessionAttributes.gameStarted && sessionAttributes.gameStarted === true)
      gameStarted = true;
    return gameStarted && handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent';
  },
  handle(handlerInput){
    let card = dealCard();
    removeCard(card.name, card.suit);
    let speechText = `The card that was deal was ${card.name} of ${card.suit}, and `;
    if(isInBetween(card1.value, card2.value, card.value)){
      points += 1;
      speechText += `you guess correctly.`;  
    }
    else{
      speechText += `you didnt guess correctly. `;  
    }
    if(canPlay()){
      [card1, card2] = dealCards();
      removeCard(card1.name, card1.suit);
      removeCard(card2.name, card2.suit);      
      speechText += `Your points are: ${points}. Your next cards are: ${card1.name} of ${card1.suit}
      and ${card2.name} of ${card2.suit}`
    }
    else{
      speechText += `There are not enough cards left to play. Thanks for playing. You got ${points} points.`    
    }
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Your guess', speechText)
      .getResponse();
  }
}

const NoIntentHandler = {
  canHandle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    let gameStarted = false; 
    if (sessionAttributes.gameStarted && sessionAttributes.gameStarted === true)
      gameStarted = true;
    return gameStarted && handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent';
  },
  handle(handlerInput){
    let card = dealCard();
    removeCard(card.name, card.suit);
    let speechText = `The card that was deal was ${card.name} of ${card.suit}, and `;
    if(!isInBetween(card1.value, card2.value, card.value)){
      points += 1;
      speechText += 'you guess correctly. ';  
    }
    else{
      speechText += `you didnt guess correctly. `;  
    }
    if(canPlay()){
      [card1, card2] = dealCards();
      removeCard(card1.name, card1.suit);
      removeCard(card2.name, card2.suit);      
      speechText += `Your points are: ${points}. Your next cards are: ${card1.name} of ${card1.suit}
      and ${card2.name} of ${card2.suit}`
    }
    else{
      speechText += `There are not enough cards left to play. Thanks for playing. You got ${points} points.`    
    }
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Your guess', speechText)
      .getResponse();
  }
}

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = `I will deal two cards, you have to guess if the next card I\'ll deal is gonna be of a value between the first and second card I just dealt.
                        for example if I deal an 4 of hearts and a 9 of spades, a 6 of hearts would make you win, if you say Yes and I deal a 10 of clubs you'll lose, but
                        you'll win if you had said No.
                        Some aditional rules are: The A card counts as 1, cards with the same value dont count as in between, for example if I deal a 5 and a 8, if the next card 
                        is a 8 and you say Yes, you'll lose, but if you say No you'll win. 
                        So, are you willing to take the risk?`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Help & Rules', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = `You got a total of ${points} points, thanks for playing`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Goodbye!', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    YesIntentHandler,
    NoIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
