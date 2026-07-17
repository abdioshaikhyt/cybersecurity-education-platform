import React from 'react'
import ClientPolicyPage from './ClientPolicyPage';

//type PageProps = Promise<{id: number}>

async function PolicyPage({
    params
}: {
    params: Promise<{id: number}>
}) {
    const { id } = await params;

    return <ClientPolicyPage id={id} />;
}

export default PolicyPage;