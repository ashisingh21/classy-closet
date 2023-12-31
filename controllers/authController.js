import userModel from '../models/userModel.js'
import dotenv from 'dotenv'
import { hashPassword, comparePassword } from '../helpers/authHelper.js'
import JWT from 'jsonwebtoken'
import orderModel from '../models/orderModel.js';

dotenv.config();

export const registerController = async (req, res) => {
    try {
        const { name, email, password, address, phone, answer, role } = req.body;

        if (!name || !email || !password || !address || !phone || !answer) {
            return res.send({ error: 'Input field cannot be blank, Please fill required information' })
        }
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.send({ error: 'user already exists!!!' })
        }

        const hashedPassword = await hashPassword(password);
        const user = await new userModel({ name, email, password: hashedPassword, answer, address, phone, role }).save();
        return res.status(201).send({ success: true, message: 'Your Account is created successfully!', user })

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Oops! Registration failed!', error })
    }
}


export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.send({ error: 'Please fill both the fields.' })
        }
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.send({ error: 'No user exists, please create one.' })
        }

        const checkComparePassword = await comparePassword(password, user.password);

        if (!checkComparePassword) {
            return res.send({ error: 'Wrong Credentials!' })
        }
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.status(201).send({ success: true, message: 'Logged in Successfully', user, token })


    } catch (error) {
        return res.status(500).send({ success: false, message: 'Login failed!', error })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email, answer, password } = req.body;

        if (!email || !password || !answer) {
            return res.send({ error: 'Please fill all fields.' })
        }
        const existingUser = await userModel.findOne({ email });

        if (!existingUser) {
            return res.send({ error: 'No such user exists, please create one.' })
        }
        const matchAnswer = answer == existingUser.answer;

        if (!matchAnswer) {
            return res.send({ error: 'Sorry, answer does not match!' })

        }
        const hashedPassword = await hashPassword(password);
        const user = await userModel.findByIdAndUpdate(existingUser._id, { password: hashedPassword })
        if (user) {

            return res.status(201).send({ success: true, message: 'password updated successfully', user })
        }

    } catch (error) {

        return res.status(500).send({ success: false, message: 'password change failed!', error })
    }
}




export const allUsersController = async (req, res) => {
    try {
        const users = await userModel.find({});
        if (!users) return res.send({ message: 'No users exists' })
        return res.status(200).send({ success: true, message: 'users fetched successfully', users })
    } catch (error) {
        return res.status(500).send({ success: false, message: 'internal error!', error })
    }
}

export const deleteUserController = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await userModel.findByIdAndDelete(id);

        if (category) {
            return res.status(201).send({ success: true, message: 'user deleted successfully!' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}

export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;

        const currentUser = await userModel.findOne({ email });

        const hashedPassword = password ? await hashPassword(password) : undefined;

        const user = await userModel.findByIdAndUpdate(currentUser._id, {
            name: name || currentUser.name, email: email || currentUser.email, password: hashedPassword || currentUser.password, address: address || currentUser.address, phone: phone || currentUser.phone
        }, { new: true });

        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found.' });
        }
        return res.status(201).send({ success: true, message: 'Profile updated successfully!', user });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: 'Oops! Profile update failed!', error: error.message });
    }
}

export const orderDataController = async (req, res) => {
    try {
        const { id } = req.query;
        const orders = await orderModel.find({ buyer: id }).populate("products", "-photo").populate("buyer", "name");
        // res.json(orders);
        return res.status(201).send({ success: true, message: 'order fetched successfully!', orders });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: 'Error in fetching orders', error: error.message });
    }
}

export const orderAdminDataController = async (req, res) => {
    try {
        const orders = await orderModel.find().populate("products", "-photo").populate("buyer", "name").sort({ createdAt: "-1" });
        // res.json(orders);
        return res.status(201).send({ success: true, message: 'order fetched successfully!', orders });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: 'Error in fetching orders', error: error.message });
    }
}


export const orderStatusUpdateController = async (req, res) => {
    try {
        // const { id, newStatus } = req.body;
        // const order = await orderModel.findByIdAndUpdate(id, { status: newStatus })
        // if (!order) {
        //     return res.status(404).send({ success: false, message: 'Order not found' });
        // }

        // approach 2

        const { newStatus } = req.body;
        const { id } = req.params;
        const order = await orderModel.findByIdAndUpdate(id, { status: newStatus })
        if (!order) {
            return res.status(404).send({ success: false, message: 'Order not found' });
        }

        return res.status(201).send({ success: true, message: 'order status updated successfully!', order });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: 'Error in Updating status', error: error.message });
    }
}
