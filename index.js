import express from "express";
import ejsLayout from "express-ejs-layouts";
import ProductController from "./src/controllers/product.controller.js";
import UserController from "./src/controllers/user.controller.js";
import path from 'path';
import validationMiddleware from "./src/middlewares/validation.middleware.js";
import { uploadFile } from "./src/middlewares/file-upload.middleware.js";
import userValidator from "./src/middlewares/userValidation.middleware.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import { auth } from "./src/middlewares/auth.middleware.js";
import { setLastVisit } from "./src/middlewares/lastVist.middleware.js";

const server = express();

server.use(express.static('public'));
server.use(express.static('src/views'));

server.use(cookieParser());
server.use(setLastVisit);
server.use(session({
    secret: 'SecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },    
}));

//create an instance of ProductController
const productController = new ProductController();
const userController = new UserController();

server.use(ejsLayout);
// parse form data
server.use(express.urlencoded({ extended: true}));

//setup view engine settings
server.set("view engine", "ejs");
server.set("views", path.join(path.resolve(),'src','views'));

//User request
server.get('/register', userController.getRegister);
server.get('/login', userController.getLogin);
server.post('/register',userValidator, userController.postRegister);
server.post('/login',userController.postLogin);
server.get('/logout', userController.logout);

//Products request
server.get("/", auth, productController.getProducts);
server.get('/new',auth, productController.getAddForm);
server.get('/update/:id',auth, productController.getUpdateProductView);
server.post('/delete/:id',auth, productController.deleteProduct)
server.post('/', auth, uploadFile.single('imageUrl'),validationMiddleware, productController.postAddProduct);
server.post('/update', auth, uploadFile.single('imageUrl'), productController.postUpdateProduct);



server.listen(3800, () => {
    console.log("Server is running in 3800")
})
