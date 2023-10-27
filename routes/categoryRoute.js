import express from 'express'
import { allCategoryController, createCategoryController, updateCategoryController, deleteCategoryController, singleCategoryController, deleteAllCategoryController } from '../controllers/categoryController.js'

const router = express();


router.get('/all-category', allCategoryController)

router.get('/single-category/:name', singleCategoryController)

router.post('/create-category', createCategoryController)

router.put('/update-category/:id', updateCategoryController)

router.delete('/delete-category/:id', deleteCategoryController)

router.delete('/delete-all-category', deleteAllCategoryController)




export default router;