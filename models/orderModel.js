import mongoose from 'mongoose'

const orderSchema = mongoose.Schema({

    products: [{
        type: mongoose.ObjectId,
        ref: 'products'
    }],
    payment: {

    },
    buyer: {
        type: mongoose.ObjectId,
        ref: 'new_users'
    },
    status: {
        type: String,
        default: 'Not Process',
        enum: ["Not Process", "Processing", "Shipped", "Delivered", "Canceled"]
    }
}, { timestamps: true })

export default mongoose.model('order', orderSchema)