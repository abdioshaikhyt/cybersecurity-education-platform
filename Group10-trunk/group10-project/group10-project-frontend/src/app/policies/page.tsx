"use client";

import { useEffect, useState } from "react";
import { Policy } from "@/types/Policy";
import { fetchPolicies } from "@/lib/api";
import './page.css';
import Link from "next/link";

function Policies() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [policies, setPolicies] = useState<Policy[]>([]);

  // Fetch all the policies once when the component first mounts. This will make sorting and filtering more efficient.
  useEffect(() => {
    setLoading(true);
    fetchPolicies()
      .then((data) => {
        setPolicies(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching policies:", error);
        setLoading(false);
      });
  }, [])

  // Display a loading screen when policies are being fetched
  if (loading) {
    return (
      <div className="flex flex-grow items-center justify-center w-full h-full">
        <p className="text-2xl">Loading policies...</p>
      </div>
    );
  }

  // Handle the user submitting a search query
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent HTML's default form submission from interfereing
    const policySearch = policies.find((policy) => policy.policy_name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (policySearch) {
      window.location.href = `/policies/${policySearch.policy_id}`;
    }
  }

  // Filter the policies based on what the current serach term is, and sort alphabetically
  const filteredPolicies = policies
    .filter((policy) =>
      policy.policy_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.policy_name.localeCompare(b.policy_name));

  // Highlight the search term in the policy name
  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return text;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="text-foreground italic underline">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col flex-grow items-center justify-center w-full h-full">
      {/* SEARCH BAR */}
      <div className="flex flex-col w-full h-full space-y-4 items-center mb-16">
        <form
          className="flex flex-row items-center justify-between border-2 border-foreground rounded-2xl p-2 w-1/2 h-15"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            className="outline-none text-2xl bg-inherit placeholder-dull p-4 w-full h-full"
            placeholder="search for a policy..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button type="submit" className="hover:text-dull transition-all duration-300 text-2xl p-4">Go!</button>
        </form>
      </div>

      {/* POLICIES */}
      {filteredPolicies.length === 0 && <p className="text-dull text-lg">No policies found</p>}
      <div className="grid grid-cols-3 gap-4 w-1/2">
        {filteredPolicies.map((policy) => (
          <Link
            key={policy.policy_id}
            className="flex flex-col shadow-md rounded-lg p-4 border-dull hover:border-blue-300 hover:border-4 border-2 transition-all duration-300"
            href={`/policies/${policy.policy_id}`}
          >
            <p className="text-dull font-bold text-gray-800 text-lg transition-all duration-300">
              {highlightMatch(policy.policy_name, searchTerm)}
            </p>
            <p className="text-dull text-sm mt-2">
              View analysis for {highlightMatch(policy.policy_name, searchTerm)}'s privacy policy...
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Policies;