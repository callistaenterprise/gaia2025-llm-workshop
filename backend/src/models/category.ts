import mongoose from 'mongoose';

// Category Schema
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true  },
});

// Creating the model
const Category = mongoose.model('Category', categorySchema);

export default Category;
