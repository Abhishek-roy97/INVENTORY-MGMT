import { body, validationResult } from 'express-validator';

const validateRequest = async (req, res, next)=>{
    const rules = [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Enter a valid email'),
        body('password').isLength({min: 6}).withMessage('Password should be minimum 6 digit')
    ];

    await Promise.all(rules.map(rule=> rule.run(req)));

    var errors = validationResult(req);
    if(!errors.isEmpty()){
        res.render('register', { errorMessage: errors.array()[0].msg})
    }
    next();
}

export default validateRequest;