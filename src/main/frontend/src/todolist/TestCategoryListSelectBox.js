import React from 'react';

const TestCategoryListSelectBox = ({ categories, onChange }) => {
    return (
        <select name="cate"
                id="cate"
                onChange={onChange}
                style={{ height: '30px', textAlign:"center"}}
        >
                <option>--- select category ---</option>
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
