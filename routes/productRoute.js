import express from 'express'
import formidable from 'express-formidable'
import { allProductController, categoryProductController, createProductController, deleteAllProductController, deleteProductController, filterProductController, productCountController, productListController, productPhotoController, searchProductController, similarProductController, singleProductController, updateProductController } from '../controllers/productController.js'

const router = express();




router.get('/get-product', allProductController)

router.get('/product-photo/:id', productPhotoController)

router.get('/get-product/:slug', singleProductController)

router.post('/create-product', formidable(), createProductController)


router.put('/update-product/:id', formidable(), updateProductController)

router.delete('/delete-product/:id', deleteProductController)

router.delete('/delete-all-products', deleteAllProductController)

router.post('/filter-products', filterProductController)

router.get('/product-count', productCountController);

router.get('/product-list/:page', productListController);

router.get('/product-search/:keyword', searchProductController);

router.get('/product-similar/:slug', similarProductController);

router.get('/category/:slug', categoryProductController);











export default router;