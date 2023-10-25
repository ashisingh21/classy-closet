import express from 'express'
import formidable from 'express-formidable'
import { createProductController, deleteAllProductController, deleteProductController, filterProductController, productPhotoController, productsListController, singleProductController, updateProductController } from '../controllers/productController.js'

const router = express();




router.get('/get-product', productsListController)

router.get('/product-photo/:id', productPhotoController)

router.get('/get-product/:slug', singleProductController)

router.post('/create-product', formidable(), createProductController)


router.put('/update-product/:id', formidable(), updateProductController)

router.delete('/delete-product/:id', deleteProductController)

router.delete('/delete-all-products', deleteAllProductController)

router.post('/filter-products', filterProductController)











export default router;