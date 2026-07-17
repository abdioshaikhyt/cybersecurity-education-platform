"use client";

import { fetchCategories } from "@/lib/api";
import { useEffect, useState } from "react";
import { Category } from "@/types/Category";

export default function Glossary() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch all the categories once when the component first mounts
    useEffect(() => {
        setLoading(true);
        fetchCategories()
            .then((data) => {
                setCategories(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                setLoading(false);
            });
    }, [])
    
    // Display a loading screen when categories are being fetched
    if (loading) {
        return (
            <div className="flex flex-grow items-center justify-center w-full h-full">
                <p className="text-2xl">Loading policies...</p>
            </div>
        );
    }

    return (
        <div className='flex flex-grow items-center justify-center w-full h-full'>
            <div className='flex flex-col w-1/2 p-4 bg-background rounded-lg space-y-4'>
                <h1 className='text-4xl font-bold text-foreground'>Category Descriptions</h1>
                <div className='p-4 border border-t-dull'>
                    {categories.map((category, index) => (
                        <div
                            key={category.category}
                            className="flex flex-col p-4 rounded-lg shadow-md mb-4"
                            style={{ border: `2px solid var(--category${index})` }}
                        >
                            <h3>{category.category}</h3>
                            <p>{category.category_description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}