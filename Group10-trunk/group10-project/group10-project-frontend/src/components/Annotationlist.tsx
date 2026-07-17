import { Annotation } from '@/types/Annotation';
import React, { useState } from 'react'

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
    category: AnnotationCategory;
}

const Annotationlist: React.FC<PolicyProps> = ({ htmlContent, annotations, selectedCategory }) => {
    const categories: AnnotationCategory[] = [];
    const annotatedSections: AnnotatedSections[] = [];
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

    // Sort annotations by segment
    annotations.sort((a, b) => {
        const segmentA = Number(a.segment);
        const segmentB = Number(b.segment);
    
        return segmentA - segmentB; // Sort in ascending order
    });

    for (const annotation of annotations) {
        if (!selectedCategory.includes(annotation.category)) continue;

        let foundCategory = categories.find((category) => category.category === annotation.category);

        // If the current Annotation's category does not exist in the array, add it
        if (!foundCategory) {
            foundCategory = { category: annotation.category, annotation: annotation };
            categories.push(foundCategory);
        }

        // Apply highlighting logic
        const categoryIndex = categoryColours[annotation.category];
        const highlightedText = `<span style="background-color: color-mix(in srgb, var(--category${categoryIndex}) 50%, transparent); padding: 2px; border-radius: 4px;">"${annotation.text}"</span>`;

        annotatedSections.push(
            {
                start: annotation.startId,
                end: annotation.endId,
                text: highlightedText,
                category: { category: annotation.category, annotation: annotation }, // Use the current annotation
            }
        );
    }

    console.log("Annotated sections:", annotatedSections);

    // Replace with custom classes for styling
    htmlContent = htmlContent.replace(/<strong>/g, "<strong class='text-2xl font-bold text-foreground'>");
    htmlContent = htmlContent.replace(/<ul>/g, "<ul class='list-disc list-inside text-foreground'>");
    htmlContent = htmlContent.replace(/<li>/g, "<li class='text-foreground'>");

    const splithtml = htmlContent.split(/\|\|\|/g);

    // Highlight any text that has been annotated
    for (const section of annotatedSections) {
        if (!section.category) continue;

        const text = section.text;
        if (section.category === undefined) continue;
        const categoryIndex = categoryColours[section.category.category];
        const replacement = `<span style="background-color: color-mix(in srgb, var(--category${categoryIndex}) 50%, transparent); padding: 2px; border-radius: 4px;">${text}</span>`;
        
        const segment = section.category.annotation.segment;

        splithtml[segment] = splithtml[segment].replace(text, replacement);
    }

    // Remove triple pipes added in the HTML dataset
    htmlContent = splithtml.join("");

    const handleMouseEnter = (index: number) => {
        setHoveredIndex(index); // Set the index of the hovered annotation
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null); // Clear the hovered index
    };


    if (selectedCategory.length === 0) {
        // Return entire policy without highlights
        return (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }}/>
        )
    }

    // Return only the highlighted annotations
    return (
        <div className="flex flex-col w-full h-fulls overflow-y-auto px-4 space-y-4 custom-scrollbar">
            {annotatedSections.map((section, index) => (
                <div
                    key={index}
                    className="text-foreground text-lg relative"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                >
                    <span dangerouslySetInnerHTML={{ __html: section.text }} />
                    {hoveredIndex === index && section.category?.annotation.pretty_print && (
                        <div
                            className="absolute mt-2 p-2 z-10 bg-white border border-gray-300 rounded shadow-lg"
                        >
                            {section.category.annotation.pretty_print}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default Annotationlist;