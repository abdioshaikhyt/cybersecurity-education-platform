"use client";

import React from 'react'
import { postUserTrustScore } from '@/lib/api';
import { TrustScore } from '@/types/TrustScore';

interface PolicyInformation {
    policy_id: number;
    privacySpyTrustScore: TrustScore;
    averageTrustScore: TrustScore;
}

const TrustScoreBlock: React.FC<PolicyInformation> = ({ policy_id, privacySpyTrustScore, averageTrustScore }) => {
    let userTrustScore = 0;
    const [userHasSubmitted, setUserHasSubmitted] = React.useState(false);

    const buttons = [
        { id: 1, label: '1' },
        { id: 2, label: '2' },
        { id: 3, label: '3' },
        { id: 4, label: '4' },
        { id: 5, label: '5' },
        { id: 6, label: '6' },
        { id: 7, label: '7' },
        { id: 8, label: '8' },
        { id: 9, label: '9' },
        { id: 10, label: '10' }
    ]

    const postUserTrustScoreToAverage = (formData: FormData) => {
        if (userHasSubmitted) {
            userTrustScore = Number(formData.get('rating'));
        }
        postUserTrustScore(policy_id, userTrustScore);
    }

    const renderUserTrustScoreForm = () => {
        return (
            <div className='w-full'>
                <form action={postUserTrustScoreToAverage} hidden={userHasSubmitted} >
                    <ul className="grid w-full md:grid-cols-10 gap-1 mb-4">
                        {buttons.map((button) => (
                            <li key={button.id}>
                                <input type="radio" id={String(button.id)} name="rating" value={button.label} className="hidden peer" required />
                                <label
                                    htmlFor={String(button.id)}
                                    className={
                                        `inline-flex items-center w-10 h-10 justify-center bg-background rounded-lg hover:bg-dull
                                            ${button.id <= 3
                                                ? 'peer-checked:bg-red-500'
                                                : button.id <= 6
                                                ? 'peer-checked:bg-yellow-500'
                                                : 'peer-checked:bg-green-500'
                                        }`
                                    }
                                >
                                    <div className="block">
                                        <div className="w-full text-lg">{button.label}</div>
                                    </div>
                                </label>
                            </li>
                        ))}
                    </ul>

                    <button
                        type="submit"
                        className="inline-flex items-center justify-center h-10 w-full text-default bg-background cursor-pointer text-black hover:text-dull"
                        onClick={() => {
                            setUserHasSubmitted(true);
                        }}
                    >
                        Submit score
                    </button>
                </form>

                {userHasSubmitted && (
                    <div className='flex flex-col w-full'>
                        <div className='flex flex-row'>
                            <p className='pr-2'>PrivacySpy trust score:</p>
                            { isNaN(Number(privacySpyTrustScore.score))
                                ? <p className='text-dull italic'>PrivacySpy has not indexed this company.</p> 
                                : <p className={
                                    `${Number(privacySpyTrustScore.score) <= 3
                                        ? 'text-red-500'
                                        : Number(privacySpyTrustScore.score) <= 6
                                        ? 'text-yellow-500'
                                        : 'text-green-500'}`}
                                >
                                    {privacySpyTrustScore.score}
                                </p>
                            }
                        </div>

                        <div className='flex flex-row'>
                            <p className='pr-2'>Average user trust score (this average does not include your score):</p>
                            { isNaN(Number(averageTrustScore.score))
                                ? <p className='text-dull italic'> you are the first user to submit a trust score for this company!</p> 
                                : <p className={
                                    `${Number(averageTrustScore.score) <= 3
                                        ? 'text-red-500'
                                        : Number(averageTrustScore.score) <= 6
                                        ? 'text-yellow-500'
                                        : 'text-green-500'}`}
                                >
                                    {averageTrustScore.score}
                                </p>
                            }
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div //This div is for the entire trust score block
            className='w-full'
        >
            {renderUserTrustScoreForm()}
        </div>
    )

}

export default TrustScoreBlock;