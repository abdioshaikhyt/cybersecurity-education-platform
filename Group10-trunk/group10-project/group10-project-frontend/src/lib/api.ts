import { Annotation } from "@/types/Annotation";
import { Policy } from "@/types/Policy";
import { TrustScore } from "@/types/TrustScore";
import { Category } from "@/types/Category";

const getApiUrl = () => {
    // For client-side requests, use relative path or the public URL
    if (typeof window !== 'undefined') {
        return 'http://localhost:8000/api/';  // This will be handled by Nginx proxy
    }
    
    // For server-side requests inside Docker
    return 'http://backend:8000/api/';
};

// Fetch all policies from the API
export const fetchPolicies = async (): Promise<Policy[]> => {
    const apiUrl = getApiUrl();
    try {
        const response = await fetch(`${apiUrl}policies/sanitizedpolicies/`, {
            method: 'GET', // HTTP method
            headers: {
            'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch policies: ${response.statusText}`);
        }
    
        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error('Data is not an array');
        }

        return data as Policy[];
    } catch (error) {
        console.error('Error fetching policies:', error);
        throw error;
    }
};

// Fetch a single policy from the API based on the ID
export const fetchPolicy = async (id: number): Promise<Policy> => {
    const apiUrl = getApiUrl();
    try {
        const response = await fetch(`${apiUrl}policies/sanitizedpolicies/${id}/`, {
            method: 'GET', // HTTP method
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch policy: ${response.statusText}`);
        }
    
        const data = await response.json();

        if (!data) {
            throw new Error('Data is not an object');
        }

        return data as Policy;
    } catch (error) {
        console.error('Error fetching policy:', error);
        throw error;
    }
}

// Fetch annotations for a single policy from the API based on the ID
export const fetchAnnotations = async (id: number): Promise<Annotation[]> => {
    const apiUrl = getApiUrl();
    try {
        const response = await fetch(`${apiUrl}policies/annotations/policy/${id}/`, {
            method: 'GET', // HTTP method
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch annotations: ${response.statusText}`);
        }
    
        const data = await response.json();

        if (!data) {
            throw new Error('Data is not an object');
        }

        return data as Annotation[];
    } catch (error) {
        console.error('Error fetching annotations:', error);
        throw error;
    }
}

// Fetches total breached accounts
export const fetchTotalPwnCount = async(): Promise<String> => {
    try {
        const response = await fetch(`https://haveibeenpwned.com/api/v3/breaches`, {
            method: 'GET', // HTTP method
            headers: {
                'User-Agent': 'Visualise Your Data Security'
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch breaches`);
        }
    
        const breaches = await response.json();
        let totalPwnCount = 0;

        for (const breach of breaches) { // counts total breaches from all breches.
            totalPwnCount += breach.PwnCount || 0
        }

        let totalPwnCountAsString = totalPwnCount.toLocaleString()

        return totalPwnCountAsString;

    } catch (error) {
        console.error('Error fetching breaches:', error);
        throw error;
    }
}

// Fetch trust score from PrivacySpy using slug
export const fetchPrivacySpyTrustScore = async ( slug: string ): Promise<TrustScore> => {
    // PrivacySpy API won't recognise names with ".com" in, so need to trim
    if (slug.endsWith('.com')) {
        slug = slug.replace('.com', '');
    }
    
    try {
        const response = await fetch(`https://privacyspy.org/api/v2/products/${slug}.json`, {
            method: 'GET', //HTTP Method
            headers: {
                'Content-type': 'application/json'
            }
        });

        if (!response.ok) {
            console.log(`Failed to fetch Trust Score from API: ${response.statusText}`);
        }

        const trust_score = await response.json();

        if (!trust_score) {
            console.log('Data is not an object')
        }

        //return trust_score.score as TrustScore;
        return { "score": trust_score.score } as TrustScore;
    } catch (error) {
        console.log('Error fetching Trust Score', error);
        return {"score": "No score available." }  as TrustScore;
    }
}

// TODO Fetch Average Trust Score
export const fetchAverageTrustScore = async ( id: number ): Promise<TrustScore> => {
    try {
        const response = await fetch(`http://localhost:8000/api/policies/trust_score/${id}/`, {
            method: 'GET', //HTTP Method
            headers: {
                'Content-type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch Trust Score from API: ${response.statusText}`);
        }

        const average_trust_score = await response.json();

        if (!average_trust_score) {
            throw new Error('Data is not an object')
        }

        //return average_trust_score.average_trust_score as TrustScore;
        return { "score": average_trust_score.average_trust_score } as TrustScore;
    } catch (error) {
        console.log('Error fetching Trust Score', error);
        return {"score": "You're the first person to give a score!" }  as TrustScore;
    }
}

// POST the user trust score to our Server
export const postUserTrustScore = async ( id: number, userTrustScore: number ) => {
    try {
        const response = await fetch(`http://localhost:8000/api/policies/trust_score/`, {
            method: 'POST', //HTTP Method
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                policy_id: id,
                average_trust_score: userTrustScore,
            }),
        });

        if (!response.ok) {
            throw new Error('HTTP error! Status: ' + response.status);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating trust score', error);
        throw error;
    }
}
// Fetch all categories from the API
export const fetchCategories = async (): Promise<Category[]> => {
    const apiUrl = getApiUrl();
    try {
        const response = await fetch(`${apiUrl}policies/categories/`, {
            method: 'GET', // HTTP method
            headers: {
            'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }
    
        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error('Data is not an array');
        }

        return data as Category[];
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const postUserUnderstandingScore = async ( category: string, userUnderstandingScore: number ) => {//category: string can be replaced with anything that can be used to specify which category is being rated
    const apiUrl = getApiUrl();
    try {
        const response = await fetch(`${apiUrl}policies/categories/`, {
            method: 'POST', //HTTP Method
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                category_name: category,//need to change category_identifier
                understanding_rating: userUnderstandingScore,
            }),
        });

        if (!response.ok) {
            throw new Error('HTTP error! Status: ' + response.status);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating understanding score', error);
        throw error;
    }
}
