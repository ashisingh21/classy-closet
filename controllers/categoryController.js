import categoryModel from "../models/categoryModel.js"

export const allCategoryController = async (req, res) => {
    try {
        const categories = await categoryModel.find({})
        if (!categories) {
            return res.send({ error: 'No Categories found!' })
        }
        return res.status(201).send({ success: true, message: 'Category fetched successfully!', categories });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}

export const singleCategoryController = async (req, res) => {
    try {
        const { name } = req.params;
        const category = await categoryModel.findOne({ name });
        if (!category) {
            return res.send({ error: 'category doesnt exist!' })
        }
        return res.status(201).send({ success: true, message: 'Category fetched successfully!', category });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}


export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.send({ error: 'Please fill the category' });
        }

        // Check for existing category
        const existingCat = await categoryModel.findOne({ name });
        if (existingCat) {
            return res.send({ error: 'Category already exists!' });
        }

        // Generate a slug by replacing all spaces with hyphens
        const slug = name.replace(' ', '-');

        // Create a new category document and save it
        const category = await new categoryModel({ name, slug }).save();

        if (category) {
            return res.status(201).send({ success: true, message: 'Category created successfully!', category });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}


export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        if (!name) {
            return res.status(400).send({ error: 'Please fill the category' });
        }

        // Check for existing category
        const slugtrimmed = name.trim();
        const slug = slugtrimmed.replace(' ', '-');

        // Find and update the category by ID
        const category = await categoryModel.findByIdAndUpdate(id, { name, slug }, { new: true });

        if (!category) {
            return res.status(404).send({ error: 'Category not found' });
        }

        return res.status(200).send({ success: true, message: 'Category updated successfully!', category });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}



export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await categoryModel.findByIdAndDelete(id);

        if (category) {
            return res.status(201).send({ success: true, message: 'Category deleted successfully!' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}


export const deleteAllCategoryController = async (req, res) => {
    try {


        const category = await categoryModel.deleteMany();

        if (category) {
            return res.status(201).send({ success: true, message: 'Categories deleted successfully!' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}

