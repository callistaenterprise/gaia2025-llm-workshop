import axios from 'axios';
import Category from "../../../backend/src/models/category.ts";

const url = import.meta.env.VITE_BASE_URL + "/categories";

export const getCategoryOptions  = async () => {
    const response = await axios.get(url);
    return response.data.map((cat: typeof Category) => ({
        label: cat.name,
        value: cat.name
    }));
};
export const addCategory = async (category: {name: string}) => {
    return await axios.post(url, category);
};
