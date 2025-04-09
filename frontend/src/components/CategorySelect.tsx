import React from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import {OnChangeValue, MultiValue} from 'react-select';

interface OptionType {
    label: string;
    value: string;
}

// Props for the component
interface CategorySelectProps {
    loadOptions: (inputValue: string) => Promise<OptionType[]>;
    createOption: (inputValue: string) => Promise<OptionType>;
    selectedOptions: OptionType[];
    setSelectedOptions: React.Dispatch<React.SetStateAction<OptionType[]>>;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
                                                           loadOptions,
                                                           createOption,
                                                           selectedOptions,
                                                           setSelectedOptions,
                                                       }) => {

    const handleChange = (newValue: OnChangeValue<OptionType, true>) => {
        setSelectedOptions([...newValue as MultiValue<OptionType>]);
    };
    const handleCreate = async (inputValue: string) => {
        const newOption = await createOption(inputValue);
        setSelectedOptions([...selectedOptions, newOption]);
    };

    return (
        <AsyncCreatableSelect
            isMulti
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            onChange={handleChange}
            onCreateOption={handleCreate}
            value={selectedOptions}
        />
    );
};

export default CategorySelect;
