import { useState, useEffect } from 'react';
// import axios from 'axios';
// import Category from "../../../../backend/src/models/category.ts";


// export const getCategoryOptions  = async () => {
//   const response = await axios.get(url);
//   return response.data.map((cat: typeof Category) => ({
//       label: cat.name,
//       value: cat.name
//   }));
// };
// export const addCategory = async (category: {name: string}) => {
//   return await axios.post(url, category);
// };

const useCategory = (url: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useCategory;