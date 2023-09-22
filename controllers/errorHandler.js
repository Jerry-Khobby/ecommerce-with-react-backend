const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    if(err instanceof ValidationError) {
return res.status(400).json({error:err.message});
    }
    res.status(500).send('Something went wrong!');
};

module.exports =errorHandler;