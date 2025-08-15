import React from 'react';

const TestCategoryListSelectBox = ({ categories, onChange }) => {
    return (
        <select name="cate" id="cate"  onChange={onChange}>
                <option>select category</option>
            {categories.map((category) => (
                <option key={category.id}
                        value={category.id}
                >
                    {category.name}
                </option>
            ))}
        </select>
    );
};

export default TestCategoryListSelectBox;
