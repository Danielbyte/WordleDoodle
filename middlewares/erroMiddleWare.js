const errorMiddleWare = (err, req, res, next) => {
  try {
    //Decipher any error that may happen so that we know where the issue is
    //Destructure error
    let error = {...err};
    error.message = err.message;
    console.log(err);

    //Try to figure out the type of error
    //mongoose bad objectId
    if(err.name === 'CastError') {
      const message = 'Resource not found';

      error = new Error(message);
      error.statusCode = 404;
    }

    //mongoose duplicate key
    if (err.code === 11000) {
      const message = 'Duplicate field value enetered';
      error = new Error(message);
      error.statusCode = 400;
    }

   //Mongoose validation error
   if (err.name === 'ValidationError') {
    //Form the error message by mapping over the values of the object and show the message for each one
    const message = Object.values(err.errors).map(val => val.message);
    error = new Error(message.join(', '));
    error.statusCode = 400;
   }
 
   //Return response from this middleware
   res.status(error.statusCode || 500).json({success: false, error: error.message || 'Server Error'});
  } catch (error) {
    //send the error to the next step/process of the application to let us know that an erroe happened
    next(error);
  }
};

export default errorMiddleWare;