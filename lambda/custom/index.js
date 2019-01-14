/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const DECK = [
  {id: 1, name: 'A', value: 1, suit: 'clubs'},
  {name: '2', value: 2, suit: 'clubs'},
  {name: '3', value: 3, suit: 'clubs'},
  {name: '4', value: 4, suit: 'clubs'},
  {name: '5', value: 5, suit: 'clubs'},
  {name: '6', value: 6, suit: 'clubs'},
  {name: '7', value: 7, suit: 'clubs'},
  {name: '8', value: 8, suit: 'clubs'},
  {name: '9', value: 9, suit: 'clubs'},
  {name: '10', value: 10, suit: 'clubs'},
  {name: 'J', value: 11, suit: 'clubs'},
  {name: 'Q', value: 12, suit: 'clubs'},
  {name: 'K', value: 13, suit: 'clubs'},
  {name: 'A', value: 1, suit: 'diamonds'},
  {name: '2', value: 2, suit: 'diamonds'},
  {name: '3', value: 3, suit: 'diamonds'},
  {name: '4', value: 4, suit: 'diamonds'},
  {name: '5', value: 5, suit: 'diamonds'},
  {name: '6', value: 6, suit: 'diamonds'},
  {name: '7', value: 7, suit: 'diamonds'},
  {name: '8', value: 8, suit: 'diamonds'},
  {name: '9', value: 9, suit: 'diamonds'},
  {name: '10', value: 10, suit: 'diamonds'},
  {name: 'J', value: 11, suit: 'diamonds'},
  {name: 'Q', value: 12, suit: 'diamonds'},
  {name: 'K', value: 13, suit: 'diamonds'},
  {name: 'A', value: 1, suit: 'hearts'},
  {name: '2', value: 2, suit: 'hearts'},
  {name: '3', value: 3, suit: 'hearts'},
  {name: '4', value: 4, suit: 'hearts'},
  {name: '5', value: 5, suit: 'hearts'},
  {name: '6', value: 6, suit: 'hearts'},
  {name: '7', value: 7, suit: 'hearts'},
  {name: '8', value: 8, suit: 'hearts'},
  {name: '9', value: 9, suit: 'hearts'},
  {name: '10', value: 10, suit: 'hearts'},
  {name: 'J', value: 11, suit: 'hearts'},
  {name: 'Q', value: 12, suit: 'hearts'},
  {name: 'K', value: 13, suit: 'hearts'},
  {name: 'A', value: 1, suit: 'spades'},
  {name: '2', value: 2, suit: 'spades'},
  {name: '3', value: 3, suit: 'spades'},
  {name: '4', value: 4, suit: 'spades'},
  {name: '5', value: 5, suit: 'spades'},
  {name: '6', value: 6, suit: 'spades'},
  {name: '7', value: 7, suit: 'spades'},
  {name: '8', value: 8, suit: 'spades'},
  {name: '9', value: 9, suit: 'spades'},
  {name: '10', value: 10, suit: 'spades'},
  {name: 'J', value: 11, suit: 'spades'},
  {name: 'Q', value: 12, suit: 'spades'},
  {name: 'K', value: 13, suit: 'spades'}
]

function dealCards(){
  let card1Index;
  let card2Index;
  do {
    card1Index = Math.floor(Math.random()*DECK.length);
    card2Index = Math.floor(Math.random()*DECK.length);
  } while (card1Index === card2Index);
  return [DECK[card1Index], DECK[card2Index]];
}

function getIndex(name, suit){
  return DECK.findIndex(e => e.name === name && e.suit === suit);
}

function removeCard(name, suit){
  index = getIndex(name, suit);
  if (index != -1){
    DECK.splice(index, 1);
  }
}

function isInBetween(value1, value2, response){
  if (response < value1 && response > value2)
    return true;
  return false;
}

function canPlay(){
  if (DECK.length > 0)
    return true;
  return false;
}

const repront = 'Say Yes for me to deal a card, say No for me to deal you two more cards'

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    cards = dealCards();
    index1 = removeCard(cards[0].name, cards[0].suit);
    index2 = removeCard(cards[1].name, cards[1].suit);

    const speechText = `We are going to play a session of in between. I will deal two cards, say yes if
                        you believe that the next card I'll deal will be between card.
                        Your first cards are: ${cards[0].name} of ${cards[0].suit}
                        and ${cards[1].name} of ${cards[1].suit}`;
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repront)
      .withSimpleCard('Game Begins', speechText)
      .getResponse();
  },
};

const YesIntentHandler = {

}

const NoIntentHandler = {

}

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'I will deal';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
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
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
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
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
