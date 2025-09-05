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
      error.statusCode = '404';
    }
  } catch (error) {
    //send the error to the next step/process of the application to let us know that an erroe happened
    next(error);
  }
};