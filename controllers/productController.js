import productModel from "../models/productModel.js";
import fs from "fs";

export const productsListController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate("category")
        if (!products) {
            return res.send({ error: 'No products found!' })
        }
        return res.status(200).send({ success: true, message: 'Product created successfully', products })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}

export const singleProductController = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id)
        if (!product) {
            return res.send({ error: 'No products found!' })
        }
        return res.status(200).send({ success: true, message: 'Product fetched successfully', product })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}

export const createProductController = async (req, res) => {
    try {
        const { name, description, category, price, slug, quantity, shipping } = req.fields;
        const { photo } = req.files;

        if (!name || !description || !category || !price || !slug || !quantity || !photo || !shipping) return res.send({ error: 'Please fill all fields.' })
        // check for existing product
        const existingProduct = await productModel.findOne({ name })

        if (existingProduct) return res.send({ error: 'Product with this name already exists!' })

        const product = await new productModel({ name, description, category, price, slug, quantity, shipping })
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type
        }
        await product.save()

        if (product) return res.status(200).send({ success: true, message: 'Product created successfully', product })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}


export const updateProductController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, price, slug, quantity, shipping } = req.fields;
        const { photo } = req.files;

        if (!name || !description || !category || !price || !slug || !quantity || !photo || !shipping) return res.send({ error: 'Please fill all fields.' })

        // check for existing product

        const product = await productModel.findByIdAndUpdate(id, { name, description, category, price, slug, quantity, shipping })

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type
        }
        await product.save()

        if (product) return res.status(200).send({ success: true, message: 'Product updated successfully', product })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error, message: 'Server error' });
    }
}


export const deleteProductController = async (req, res) => {
    try {
        const { id } = req.params;


        const product = await productModel.findByIdAndDelete(id)



        if (product) return res.status(200).send({ success: true, message: 'Product deleted successfully' })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error, message: 'Server error' });
    }
}

export const deleteAllProductController = async (req, res) => {
    try {



        const product = await productModel.deleteMany()



        if (product) return res.status(200).send({ success: true, message: 'Products deleted successfully' })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error, message: 'Server error' });
    }
}
