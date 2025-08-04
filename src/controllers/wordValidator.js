import { getWordOfTheDay } from '../controllers/wordFetcher.js'
let wordOfTheDay = '';
fetchWordOfTheDay();

export const validateWord = async(req, res) => {
  const userGuess = req.body.guess;
  console.log(userGuess);
  res.status(200).json({word: wordOfTheDay});
}

async function fetchWordOfTheDay() {
  if (wordOfTheDay !== '')
    return;

  wordOfTheDay = await getWordOfTheDay();
}