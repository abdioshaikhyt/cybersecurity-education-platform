//"use client";
import { Category } from '@/types/Category';
import { babelIncludeRegexes } from 'next/dist/build/webpack-config';
import React from 'react';
import { useEffect, useState } from 'react';
import { postUserUnderstandingScore } from '@/lib/api';
import CategoryUnderstandingChart from './CategoryUnderstandingChart';

interface CategoryExplanationRatings {
    category: Category | null;
}

const CategoryExplanation: React.FC<CategoryExplanationRatings> = ({ category }) => {
    var userUnderstandingScore = 0;

    // const [categoryUnderstandingScoreSubmission, setCategoryUnderstandingScoreSubmission] = useState(category_submission_record);
    const [categoryUnderstandingScoreSubmission, setCategoryUnderstandingScoreSubmission] = useState({
        "First Party Collection/Use": false,
        "Third Party Sharing/Collection": false,
        "User Choice/Control": false,
        "User Access, Edit and Deletion": false,
        "Data Retention": false,
        "Data Security": false,
        "Policy Change": false,
        "Do Not Track": false,
        "International and Specific Audiences": false,
        "Other": false,
    });
    // const [categoryUnderstandingScoreSubmission, setCategoryUnderstandingScoreSubmission] = useState<{ [key: string]: boolean }>({});
    
    
    
    

    const postCategoryUnderstandingScoreToCategoryAverage = (formData: any) => {
        // if (userHasSubmitted) {
        //     userUnderstandingScore = formData.get('score');
        // }
        // if (category){
        //     postUserUnderstandingScore(category.category, userUnderstandingScore);
        // }
        if (category){
            if (category.category in categoryUnderstandingScoreSubmission && categoryUnderstandingScoreSubmission[category.category as keyof typeof categoryUnderstandingScoreSubmission]) {
                userUnderstandingScore = formData.get('score');
            }
            postUserUnderstandingScore(category.category, userUnderstandingScore);
        }
    }






    const renderCategoryExplanationBlock = () => {
        if (category) {
            return (
                <div>
                    <div className="w-full text-lg font-semibold"><h1>Category Explanation - {category.category}</h1></div>
                    <form action={postCategoryUnderstandingScoreToCategoryAverage} hidden={category.category in categoryUnderstandingScoreSubmission && categoryUnderstandingScoreSubmission[category.category as keyof typeof categoryUnderstandingScoreSubmission]} >
                        <p>{category.category_description}</p>
                        <div className="w-full text-lg mt-4 font-semibold"><h1>How well do you understand the explanation of this category?</h1></div>
                        <ul className="flex w-full mt-4">
                            <li className="m-0 p-0 flex-1">
                                <input type="radio" id="1" name="score" value="1" className="hidden peer" required />
                                <label htmlFor="1" className="flex items-center justify-center w-full h-10 text-default bg-white border-default border-2 rounded-md cursor-pointer peer-checked:border-blue-600 peer-checked:border-2 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100">
                                    <div className="block">
                                        <div className="w-full text-lg font-semibold">1</div>
                                    </div>
                                </label>
                            </li>
                            <li className="m-0 p-0 flex-1">
                                <input type="radio" id="2" name="score" value="2" className="hidden peer" required />
                                <label htmlFor="2" className="flex items-center justify-center w-full h-10 text-default bg-white border-default border-2 rounded-md cursor-pointer peer-checked:border-blue-600 peer-checked:border-2 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100">
                                    <div className="block">
                                        <div className="w-full text-lg font-semibold">2</div>
                                    </div>
                                </label>
                            </li>
                            <li className="m-0 p-0 flex-1">
                                <input type="radio" id="3" name="score" value="3" className="hidden peer" required />
                                <label htmlFor="3" className="flex items-center justify-center w-full h-10 text-default bg-white border-default border-2 rounded-md cursor-pointer peer-checked:border-blue-600 peer-checked:border-2 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100">
                                    <div className="block">
                                        <div className="w-full text-lg font-semibold">3</div>
                                    </div>
                                </label>
                            </li>
    
                            <li className="m-0 p-0 flex-1">
                                <input type="radio" id="4" name="score" value="4" className="hidden peer" required />
                                <label htmlFor="4" className="flex items-center justify-center w-full h-10 text-default bg-white border-default border-2 rounded-md cursor-pointer peer-checked:border-blue-600 peer-checked:border-2 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100">
                                    <div className="block">
                                        <div className="w-full text-lg font-semibold">4</div>
                                    </div>
                                </label>
                            </li>
                            <li className="m-0 p-0 flex-1">
                                <input type="radio" id="5" name="score" value="5" className="hidden peer" required />
                                <label htmlFor="5" className="flex items-center justify-center w-full h-10 text-default bg-white border-default border-2 rounded-md cursor-pointer peer-checked:border-blue-600 peer-checked:border-2 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100">
                                    <div className="block">
                                        <div className="w-full text-lg font-semibold">5</div>
                                    </div>
                                </label>
                            </li>
                            <li className="m-0 p-0 flex-1">
                                <input type="radio" id="6" name="score" value="6" className="hidden peer" required />
                                <label htmlFor="6" className="flex items-center justify-center w-full h-10 text-default bg-white border-default border-2 rounded-md cursor-pointer peer-checked:border-blue-600 peer-checked:border-2 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100">
                                    <div className="block">
                                        <div className="w-full text-lg font-semibold">6</div>
                                    </div>
                                </label>
                            </li>
                            <li className="m-0 p-0 flex-1">
                                <input type="radio" id="7" name="score" value="7" className="hidden peer" required />
                                <label htmlFor="7" className="flex items-center justify-center w-full h-10 text-default bg-white border-default border-2 rounded-md cursor-pointer peer-checked:border-blue-600 peer-checked:border-2 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100">
                                    <div className="block">
                                        <div className="w-full text-lg font-semibold">7</div>
                                    </div>
                                </label>
                            </li>
                            <li className="m-0 p-0 flex-1">
                                <input type="radio" id="8" name="score" value="8" className="hidden peer" required />
                                <label htmlFor="8" className="flex items-center justify-center w-full h-10 text-default bg-white border-default border-2 rounded-md cursor-pointer peer-checked:border-blue-600 peer-checked:border-2 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100">
                                    <div className="block">
                                        <div className="w-full text-lg font-semibold">8</div>
                                    </div>
                                </label>
                            </li>
                            <li className="m-0 p-0 flex-1">
                                <input type="radio" id="9" name="score" value="9" className="hidden peer" required />
                                <label htmlFor="9" className="flex items-center justify-center w-full h-10 text-default bg-white border-default border-2 rounded-md cursor-pointer peer-checked:border-blue-600 peer-checked:border-2 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100">
                                    <div className="block">
                                        <div className="w-full text-lg font-semibold">9</div>
                                    </div>
                                </label>
                            </li>
                            <li className="m-0 p-0 flex-1">
                                <input type="radio" id="10" name="score" value="10" className="hidden peer" required />
                                <label htmlFor="10" className="flex items-center justify-center w-full h-10 text-default bg-white border-default border-2 rounded-md cursor-pointer peer-checked:border-blue-600 peer-checked:border-2 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100">
                                    <div className="block">
                                        <div className="w-full text-lg font-semibold">10</div>
                                    </div>
                                </label>
                            </li>
                        </ul>
                        <div className="mt-4">
                            <button type="submit" className="inline-flex items-center justify-center w-full h-10 text-default bg-white border-default border-2 rounded-md cursor-pointer peer-checked:border-blue-600 peer-checked:border-2 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100"
                                onClick={(e) => {
                                    //setUserHasSubmitted(true); OLD
                                    
                                    var copy: typeof categoryUnderstandingScoreSubmission = { 
                                        ...categoryUnderstandingScoreSubmission 
                                    };
                                    Object.assign(copy, categoryUnderstandingScoreSubmission);
                                    copy[category.category as keyof typeof categoryUnderstandingScoreSubmission] = true;
                                    // console.log(category.category);
                                    // console.log("copy", copy);
                                    setCategoryUnderstandingScoreSubmission(copy);
                                    // console.log("monkey", categoryUnderstandingScoreSubmission);
                                }}
                            >
                                <div className="block">
                                    <div className="w-full text-lg font-semibold">Submit score</div>
                                </div>
                            </button>
                        </div>
                    </form>
                    <div hidden={!(category.category in categoryUnderstandingScoreSubmission && categoryUnderstandingScoreSubmission[category.category as keyof typeof categoryUnderstandingScoreSubmission])}>
                            <div>
                                <CategoryUnderstandingChart
                                    category={category}
                                />
                            </div>
                        </div>
                </div>
            )
        } else { //if no category is selected

            return (
            <div>
                <div className="w-full text-lg font-semibold"><h1>Category Explanation</h1></div>
                <div>Select a category...</div>
            </div>
        )
        }
    }
    return (
        <div //This div is for the entire category explanation block
            className='w-500 h-350'
        >
            {renderCategoryExplanationBlock()}
        </div>
    )
}
//get the category explanation from the backend
//make a 1-10 form (smaller in size ideally)
//get the ratings information (10 integers / array of 10 integers)

export default CategoryExplanation;