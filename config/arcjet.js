//Configure an active instance of arcjet
import arcjet, { shield, detectBot, tokenBucket } from '@arcjet/node';
import { ARCJET_KEY } from './env.js';

const aj = arcjet({
  key: ARCJET_KEY,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE"], // Google, Bing, etc
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE",
      refillRate: 10, // Refill 10 tokens per interval
      interval: 15, // Refill every 15 seconds
      capacity: 15, // Bucket capacity of 15 tokens
    }),
  ],
});

export default aj;