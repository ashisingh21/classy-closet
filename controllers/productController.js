import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";
import fs from "fs";

export const allProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate("category").select("-photo");
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
        const { slug } = req.params;
        const product = await productModel.findOne({ slug })
        if (!product) {
            return res.send({ error: 'No products found!' })
        }
        if (product.photo.data) {
            res.set('name', product.slug)
        }
        return res.status(200).send({ success: true, message: 'Product fetched successfully', product })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}



export const productPhotoController = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id).select('photo');
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
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


        if (!name || !description || !category || !price || !slug || !quantity || !shipping) return res.send({ error: 'Please fill all fields.' })

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

// filter controller

export const filterProductController = async (req, res) => {
    try {

        const { checked, radio } = req.body

        let args = {}
        if (checked.length > 0) args.category = checked;

        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const product = await productModel.find(args).populate("category")

        return res.status(200).send({ success: true, message: 'Products deleted successfully', product })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error, message: 'Server error' });
    }
}

export const productCountController = async (req, res) => {
    try {
        const count = await productModel.find({}).estimatedDocumentCount();
        return res.status(200).send({ success: true, message: 'Products count fetched successfully', count })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error, message: 'Server error' });
    }
}

export const productListController = async (req, res) => {
    try {
        const pageCount = 3;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel.find({}).populate("category").select("-photo").skip((page - 1) * pageCount).limit(pageCount).sort({ createdAt: -1 })
        return res.status(200).send({ success: true, message: 'Products fetched successfully', products })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error, message: 'Server error' });
    }
}

export const searchProductController = async (req, res) => {

    try {

        const { keyword } = req.params;
        const result = await productModel.find({
            $or: [
                { "name": { $regex: keyword, $options: 'i' } },
                { "description": { $regex: keyword, $options: 'i' } },
            ]

        }).select("-photo");
        return res.status(200).send({ success: true, message: 'Products fetched successfully', result })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error, message: 'Server error' });
    }
}

export const similarProductController = async (req, res) => {

    try {
        const { slug } = req.params;
        const currentProduct = await productModel.findOne({ slug }).select("-photo");
        const products = await productModel.find({ category: currentProduct.category, _id: { $ne: currentProduct._id } }).populate("category");
        return res.status(200).send({ success: true, message: 'Products fetched successfully', products })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error, message: 'Server error' });
    }
}



export const categoryProductController = async (req, res) => {
    try {
        const { slug } = req.params;

        const category = await categoryModel.findOne({ slug })
        const products = await productModel.find({ category }).populate("category");
        return res.status(200).send({ success: true, message: 'Products fetched successfully', products })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error, message: 'Server error' });
    }
}
