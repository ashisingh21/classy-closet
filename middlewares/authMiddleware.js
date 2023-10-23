import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'
import userModel from '../models/userModel.js';

dotenv.config();

export const isSignin = async (req, res, next) => {

    try {
        const { token } = req.body;
        const decode = JWT.verify(req.headers.token, process.env.JWT_SECRET)
        if (!decode) {
            return res.status(401).send({ success: false, message: 'Unauthorised Access!' })
        }
        req.user = decode;
        return next();
    } catch (error) {
        console.log(error)
    }

}

// Is Admin
export const isAdmin = async (req, res, next) => {

    try {
        const existingUser = await userModel.findById(req.user._id);
        if (existingUser.role !== 1) {
            return res.status(201).send({ success: false, message: 'Unauthorised Access!' })
        } else {
            return next();
        }


    } catch (error) {
        console.log(error)
    }

}


// export const isAdmin = async (req, res, next) => {
//     try {
//         const user = await users.findById(req.user._id)
//         if (user.role !== 1) {
//             res.status(401).send({ success: false, message: 'Unauthorised access', error });
//         } else {
//             next()
//         }

//     } catch (error) {
//         console.log(error);
//         res.status(500).send({ success: false, message: 'Admin Authorisation Failed', error });
//     }
// }