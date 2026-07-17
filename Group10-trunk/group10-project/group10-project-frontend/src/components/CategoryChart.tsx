"use client";

import { Bar } from 'react-chartjs-2';
import { Annotation } from '@/types/Annotation';
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

interface AnnotationList {
    annotations: Annotation[];
}

const CategoryChart: React.FC<AnnotationList> = ({ annotations }) => {

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

    //create dictionary to count the # of annotations in each category
    const categories: { [key: string]: number } = {
        "First Party Collection/Use": 0,
        "Third Party Sharing/Collection": 0,
        "User Choice/Control": 0,
        "User Access, Edit and Deletion": 0,
        "Data Retention": 0,
        "Data Security": 0,
        "Policy Change": 0,
        "Do Not Track": 0,
        "International and Specific Audiences": 0,
        "Other": 0,
    };

    //count annotations in each category and store in dictionary
    annotations.forEach((annotation) => {
        categories[annotation.category]++;
    });

    console.log(categories);

    return (
        <div>
            <Bar
                data = {{
                    labels: [
                        "First Party Collection/Use",
                        "Third Party Sharing/Collection",
                        "User Choice/Control",
                        "User Access, Edit and Deletion",
                        "Data Retention",
                        "Data Security",
                        "Policy Change",
                        "Do Not Track",
                        "International and Specific Audiences",
                        "Other"
                    ],
                    datasets: [{
                        label: "# of annotations per category",
                        data: [
                            categories["First Party Collection/Use"],
                            categories["Third Party Sharing/Collection"],
                            categories["User Choice/Control"],
                            categories["User Access, Edit and Deletion"],
                            categories["Data Retention"],
                            categories["Data Security"],
                            categories["Policy Change"],
                            categories["Do Not Track"],
                            categories["International and Specific Audiences"],
                            categories["Other"]
                        ],
                        backgroundColor: categoryColors,
                    }]
                }} 
                height={300}
                width={500}
                options={{maintainAspectRatio: false}}
                className='rounded-t-md'
            />
        </div>
    )
}

export default CategoryChart;