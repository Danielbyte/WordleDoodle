import { getWordOfTheDay } from '../controllers/wordFetcher.js'
import { isValidWord } from '../controllers/wordFetcher.js'

let wordOfTheDay = '';
fetchWordOfTheDay();

export const validateWord = async(req, res) => {
  const userGuess = req.body.guess;
  const tries = req.body.numbeOfTries;
  let index = 0;
  let tileStates = [];
  for (const letter of userGuess) { //Iterate through each letter of user guess
    if (letter.toUpperCase() === wordOfTheDay[index])
      tileStates[index] = 'correct'; //Define tile state for each tile
    
    //Define state of misplaced word
    else if (wordOfTheDay.includes(letter.toUpperCase()))
      tileStates[index] = 'wrong-location';

    else
      tileStates[index] = 'wrong';

    ++index;
  }

  let isWin = false;
  let dailyWord = '';
  if (userGuess.toUpperCase() === wordOfTheDay)
    isWin = true;

  if (tries === 6 && !isWin)
    dailyWord = wordOfTheDay; //Only return the word once the player looses at the end

  res.status(200).json({states: tileStates, winState: isWin, word: dailyWord});
}

async function fetchWordOfTheDay() {
  if (wordOfTheDay !== '')
    return;

  wordOfTheDay = await getWordOfTheDay();
}

//An overkill that may result in an overhead (This verification can be done on client side to make make the application faster)

export const verifyWord = async (req, res) => {
  let userGuess = req.body.guess;
  let isValid = isValidWord(userGuess);
  res.json({isValidWord: isValid})
}