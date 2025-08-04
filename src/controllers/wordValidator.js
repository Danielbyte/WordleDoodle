import { getWordOfTheDay } from '../controllers/wordFetcher.js'
let wordOfTheDay = '';
fetchWordOfTheDay();

export const validateWord = async(req, res) => {
  const userGuess = req.body.guess;
  let index = 0;
  let tileState = [];
  for (const letter of userGuess) { //Iterate through each letter of user guess
    if (letter.toUpperCase() === wordOfTheDay[index])
      tileState[index] = 'correct'; //Define tile state for each tile
    
    //Define state of misplaced word
    else if (wordOfTheDay.includes(letter.toUpperCase()))
      tileState[index] = 'wrong-location';

    else
      tileState[index] = 'wrong';

    ++index;
  }

  res.status(200).json(tileState);
}

async function fetchWordOfTheDay() {
  if (wordOfTheDay !== '')
    return;

  wordOfTheDay = await getWordOfTheDay();
}