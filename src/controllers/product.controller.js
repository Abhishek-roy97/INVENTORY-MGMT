import path from 'path';
import ProductModel from '../models/product.model.js';
import fs from 'fs';

 export default class ProductController{

    getProducts(req,res){
        let products = ProductModel.get();
        //console.log(products);
        res.render("products", {products:products, userEmail: req.session.userEmail });
        //return res.sendFile(path.join(path.resolve(),"src",'views',"products.html" ));
    }

    getAddForm(req, res){
        return res.render("new-product", {errorMessage:null, userEmail: req.session.userEmail });
    }

    postAddProduct(req, res){
        //access data from form
        const { name, desc, price } = req.body;
        const imageUrl = 'images/' + req.file.filename;
        ProductModel.add(name, desc, price, imageUrl)
        // let products = ProductModel.get();
        // res.render('products',{ products: products, userEmail: req.session.userEmail})
        res.redirect('/');
    }

    getUpdateProductView(req,res){
        //1. If product exists then return view 
        const id=req.params.id;
        const productFound = ProductModel.getById(id);
        if(productFound){
            res.render('update-product', {product: productFound, errorMessage: null, userEmail: req.session.userEmail});
        }
        //2. else return error
        else{
            res.status(401).send("Product not found");
        }
    }
    postUpdateProduct(req, res){
        const id=req.body.id;
        const productFound = ProductModel.getById(id);
        // console.log(productFound)
        const path = 'public/'+ productFound.imageUrl;
        // console.log(path);
        try{
            fs.unlinkSync(path)
        }catch(error){
            console.log('error in deleting the image file',error)
        }
        const imageUrl = 'images/' + req.file.filename;
        const { name, desc, price } = req.body;
        ProductModel.update(name, desc, price, imageUrl, id)
        let products = ProductModel.get();
        res.render('products',{ products: products})
    }
    deleteProduct(req, res){
        const id = req.params.id;
        const productFound = ProductModel.getById(id);
        if(!productFound){
           return res.status(401).send("Product not found");
        }
        ProductModel.delete(id);
        var products = ProductModel.get();
        res.render('products',{ products });
    }

}

