import { body, validationResult } from 'express-validator'; //express-validator used to implement
//validation to the form input.

// export default expects 3 things => 
//  HoistedDeclaration => a function, Class, Assignment expression

const validateRequest = async (req, res, next)=>{
    console.log(req.body)
    // 1. Setup rules for validation.
    const rules = [
        body('name').notEmpty().withMessage('Name is required'),
        body('price').isFloat({ gt: 0 }).withMessage('Price should be a positive value'),
        body('imageUrl').custom((value, { req })=>{
            if(!req.file){
                throw new Error('Image not found');
            }
            return true;
        }),
    ];

    // 2. run those rules.
    await Promise.all(rules.map(rule=> rule.run(req)));
    
    // 3. check if there are any errors after running the rules.
    var validationErrors = validationResult(req);
    console.log(validationErrors)
    if(!validationErrors.isEmpty()){
        return res.render('new-product', {
            errorMessage: validationErrors.array()[0].msg,
        });
    }
    next();
}

export default validateRequest;