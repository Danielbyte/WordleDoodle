import aj from '../config/arcjet.js'

const arcjetMiddleware = (req, res, next) => {
  try {
    const decision = await aj.protect(req); //Protect this request and tell me your decision (should the request be denied or allowed)

    if (decision.isDenied()) {
      //try todec figure out the reason for the denial
      if (decision.reason.isRateLimit()) return res.status(429).json({error: 'Rate limit exceeded'});
      
      //Bot protection
      if (decision.reason.isBot()) return res.status(403).json({error: 'Bot detected'});

      //else return access denied (for whatever reason)
      return res.status(403).json({error: 'Access denied'});
    }

    //Just go to the next step (creatin a user, getting user stats.....)
    next();

  } catch (error) {
    console.log(`Arcjet Middleware Error: ${error}`);
    next(error);
  }
}

export default arcjetMiddleware;