"use client";

import Annotationlist from "@/components/Annotationlist";
import CategoryChart from "@/components/CategoryChart";
import TrustScoreBlock from "@/components/TrustScoreBlock";
import { fetchAnnotations, fetchAverageTrustScore, fetchPolicy, fetchPrivacySpyTrustScore } from "@/lib/api";
import { Annotation } from "@/types/Annotation";
import { Policy } from "@/types/Policy";
import { TrustScore } from "@/types/TrustScore";
import { useEffect, useState } from "react";

interface ClientPolicyPageProps {
    id: number;
}

export default function ClientPolicyPage({ id }: ClientPolicyPageProps) {
    const [policy, setPolicy] = useState<Policy | undefined>(undefined);
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const [privacySpyTrustScoreData, setPrivacySpyTrustScoreData] = useState<TrustScore>({ score: "0" });
    const [averageTrustScoreData, setAverageTrustScoreData] = useState<TrustScore>({ score: "0" });

    const cagetoryButtons = [
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
    ]

    useEffect(() => {
        if (isNaN(id)) {
            setError("Invalid policy ID");
            setLoading(false);
            return;
        }
        
        const loadData = async () => {
            try {
                const policyData = await fetchPolicy(id);
                setPolicy(policyData);

                const annotationsData = await fetchAnnotations(id);
                const privacySpyTrustScoreData = await fetchPrivacySpyTrustScore(policyData.policy_name);
                const averageTrustScoreData = await fetchAverageTrustScore(policyData.policy_id);

                console.log(annotationsData);

                setAnnotations(annotationsData);
                setPrivacySpyTrustScoreData(privacySpyTrustScoreData);
                setAverageTrustScoreData(averageTrustScoreData);
            } catch (err) {
                console.log(err);
                setError("Failed to load policy data");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (policy === undefined) {
        return <div>Policy not found.</div>;
    }

    if (annotations.length === 0) {
        return <div>Annotations not found.</div>;
    }

    return (
        <div className='flex flex-grow flex-row items-center justify-center w-full h-full'>
            <div className='flex flex-col w-1/2 p-4 bg-background rounded-lg space-y-4'>
                <h1 className='text-4xl font-bold text-foreground'>{policy.policy_name}</h1>
                {!isNaN(Number(privacySpyTrustScoreData.score)) && (
                    <div className='flex flex-row'>
                        <p>PrivacySpy trust score: </p>
                        <p
                            className={`${(Number(privacySpyTrustScoreData.score) > 5) ? 'text-green-500' : 'text-red-500'} font-bold ml-2`}
                        >
                            {privacySpyTrustScoreData.score}
                        </p>
                    </div>
                )}
                
                <div className='flex flex-col space-y-4 p-4 rounded-lg shadow-md border-dull border w-full'>
                    <h2 className='text-xl font-bold text-foreground'>Submit your trust score</h2>
                    <p className='text-foreground'>After learning more about the categories of clause and what they mean, how well do you trust this policy?</p>
                    <TrustScoreBlock 
                        policy_id={id}
                        privacySpyTrustScore={privacySpyTrustScoreData}
                        averageTrustScore={averageTrustScoreData}
                    />
                    <p className="text-dull italic">These averages are an indication of how users perceive this company's trustworthiness, and should not be used to inform your decisions. The average user trust score is not validated in any way, and is simply an aggregated calculation of all other submissions from this form.</p>
                </div>

                <div className='flex flex-col space-y-4 p-4 rounded-lg shadow-md border-dull border'>
                    <h2 className='text-xl font-bold text-foreground'>Distribution of categories in this policy</h2>
                    <CategoryChart
                        annotations={annotations}
                    />
                    <div className="flex flex-row justify-between items-center">
                        <h2 className='text-xl font-bold text-foreground'>Filter policy clauses by category</h2>
                        <button
                            className={`text-foreground hover:text-dull`}
                            onClick={() => setSelectedCategories([])}
                        >
                            Clear selection
                        </button>
                    </div>
                    <div className="flex flex-row flex-wrap justify-center items-center">
                        {cagetoryButtons.map((category, index) => (
                            <button
                                key={category}
                                className={`px-2 py-1 m-1 rounded-lg text-foreground`}
                                style={{ backgroundColor: selectedCategories?.includes(category) ? `var(--category${index})` : 'var(--background)' }}
                                onClick={() => setSelectedCategories([category])}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='flex flex-col space-y-4 p-4 rounded-lg shadow-md border-dull border'>
                    { selectedCategories.length > 0 && (
                        <h2 className='text-xl font-bold text-foreground'>Filtered policy clauses</h2>
                    )}
                    { selectedCategories.length === 0 && (
                        <h2 className='text-xl font-bold text-foreground'>Full privacy policy</h2>
                    )}
                    <Annotationlist
                        htmlContent={policy.sanitized_policy_html}
                        annotations={annotations}
                        selectedCategory={selectedCategories}
                    />
                </div>
            </div>
        </div>
    )
}