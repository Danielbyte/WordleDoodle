import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  gamesPlayed: {
    type: Number,
    default: 0,
    min: [0, 'Number of games played must be 0 or greater']
  },
  percentageWin: {
    type: Number,
    default: 0
  },
  guessDistribution: {
    firstTry: {type: Number, default: 0},
    secondTry: {type: Number, default: 0},
    thirdTry: {type: Number, default: 0},
    fourthTry: {type: Number, default: 0},
    fifthTry: {type: Number, default: 0},
    sixthTry: {type: Number, default: 0}
  },
  user: {
    typeof: mongoose.Schema.Types.ObjectId,
    ref: 'User', //Reference to the User model we created earlier
    required: true,
    index: true //Optimise the queries by indexing the User field
  }
}, {timestamps: true});

