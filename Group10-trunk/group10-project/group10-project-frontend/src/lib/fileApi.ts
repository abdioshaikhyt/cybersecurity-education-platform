export async function fetchSanitisedPolicy(name: string) {
    const response = await fetch(`/api/policies/${name}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.content;
}
