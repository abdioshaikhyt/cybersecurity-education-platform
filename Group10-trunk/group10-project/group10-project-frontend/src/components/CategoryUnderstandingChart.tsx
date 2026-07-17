"use client";

import { Bar } from 'react-chartjs-2';
import { Category } from '@/types/Category';
import React from 'react';
import { useEffect, useState } from 'react'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

//Zeeshan said we don't need this rubbish horrible trash useless pathetic waste of my eyesight code
// interface AnnotationList {
//     annotations: Annotation[];
// }

interface CategoryChartUnderstanding { //This used for generally representing any trust score.
    category: Category | null;
}

const CategoryUnderstandingChart: React.FC<CategoryChartUnderstanding> = ({ category }) => {

    //state for category colors
    const [categoryColors, setCategoryColors] = useState<string[]>([]);

    useEffect(() => {


    //fetch CSS variables
    const getComputedStyles = () => {
      const root = getComputedStyle(document.documentElement);
      return [
        root.getPropertyValue("--category0"),
        root.getPropertyValue("--category1"),
        root.getPropertyValue("--category2"),
        root.getPropertyValue("--category3"),
        root.getPropertyValue("--category4"),
        root.getPropertyValue("--category5"),
        root.getPropertyValue("--category6"),
        root.getPropertyValue("--category7"),
        root.getPropertyValue("--category8"),
        root.getPropertyValue("--category9"),
      ].map(color => color.trim()); // Remove whitespace
    };

    setCategoryColors(getComputedStyles());
    }, []);
    

    if (category) {
        return (
            <div>
                <Bar
                    data = {{
                        labels: [
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                            "10"
                        ],
                        datasets: [{
                            label: "# of annotations per category",
                            data: [
                                category.category_understanding_counts[0],
                                category.category_understanding_counts[1],
                                category.category_understanding_counts[2],
                                category.category_understanding_counts[3],
                                category.category_understanding_counts[4],
                                category.category_understanding_counts[5],
                                category.category_understanding_counts[6],
                                category.category_understanding_counts[7],
                                category.category_understanding_counts[8],
                                category.category_understanding_counts[9]
                            ],
                            backgroundColor: categoryColors,
                        }]
                    }}
                    height={300}
                    width={500}
                    options={{maintainAspectRatio: false}}
                />
            </div>
        )
    }
    
}

export default CategoryUnderstandingChart;