import React from 'react';
import { Annotation } from '@/types/Annotation';

interface PolicyProps {
    htmlContent: string;
    annotations: Annotation[];
    selectedCategory: string[];
}

interface AnnotationCategory {
    category: string;
    annotation: Annotation;
}

interface AnnotatedSections {
    start: number;
    end: number;
    text: string;
    category: AnnotationCategory | undefined;
}

const PolicyBlock: React.FC<PolicyProps> = ({ htmlContent, annotations, selectedCategory }) => {
    const categories: AnnotationCategory[] = [];
    const annotatedSections: AnnotatedSections[] = [];

    for (const annotation of annotations) {
        if (!selectedCategory.includes(annotation.category)) continue;

        // If the current Annotation's category does not exist in the array, add it
        if (categories.find((category) => category.category === annotation.category) === undefined) {
            categories.push({ category: annotation.category, annotation: annotation });
        }
        annotatedSections.push(
            {
                start: annotation.startId,
                end: annotation.endId,
                text: annotation.text,
                category: categories.find((category) => category.category === annotation.category)
            }
        );
    }

    // Replace with custom classes for styling
    htmlContent = htmlContent.replace(/<strong>/g, "<strong class='text-2xl font-bold text-foreground'>");
    htmlContent = htmlContent.replace(/<ul>/g, "<ul class='list-disc list-inside text-foreground'>");
    htmlContent = htmlContent.replace(/<li>/g, "<li class='text-foreground'>");

    const categoryColours: { [key: string]: number } = {
        "First Party Collection/Use": 0,
        "Third Party Sharing/Collection": 1,
        "User Choice/Control": 2,
        "User Access, Edit and Deletion": 3,
        "Data Retention": 4,
        "Data Security": 5,
        "Policy Change": 6,
        "Do Not Track": 7,
        "International and Specific Audiences": 8,
        "Other": 9,
    };

    const splithtml = htmlContent.split(/\|\|\|/g);

    // Highlight any text that has been annotated
    for (const section of annotatedSections) {
        if (!section.category) continue;

        const text = section.text;
        //const categoryIndex = categories.findIndex((category) => category.category === section.category?.category);
        if (section.category === undefined) continue;
        const categoryIndex = categoryColours[section.category.category];
        const replacement = `<span style="background-color: color-mix(in srgb, var(--category${categoryIndex}) 50%, transparent); padding: 2px; border-radius: 4px;">${text}</span>`;
        
        const segment = section.category.annotation.segment;

        splithtml[segment] = splithtml[segment].replace(text, replacement);
        //htmlContent = htmlContent.replace(text, replacement);
    }

    // Remove triple pipes added in the HTML dataset
    //htmlContent = htmlContent.replace(/\|\|\|/g, "");
    htmlContent = splithtml.join("");


    return (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }}/>
    )
}

export default PolicyBlock;