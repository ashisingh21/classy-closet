import express from "express";
import { registerController, loginController, forgotPassword, allUsersController, deleteUserController, updateProfileController, orderDataController, orderAdminDataController, orderStatusUpdateController } from '../controllers/authController.js'
import { isAdmin, isSignin } from '../middlewares/authMiddleware.js'

const router = express.Router()




router.post('/register', registerController)
router.post('/login', loginController)
router.post('/forgot-password', forgotPassword)


router.get('/user-auth', isSignin, (req, res) => {
    res.status(201).send({ ok: true });
})


router.get('/admin-auth', isSignin, isAdmin, (req, res) => {
    res.status(201).send({ ok: true });
})

router.get('/all-user', allUsersController)

router.delete('/delete-user/:id', deleteUserController)

router.put('/update', updateProfileController)

router.get('/order-data', orderDataController)

router.get('/all-order-data', orderAdminDataController)

router.put('/order-status-update/:id', orderStatusUpdateController)


export default router;
