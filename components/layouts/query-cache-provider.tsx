'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface IProps {
    children?: ReactNode;
}

const QueryCacheProvider = ({ children }: IProps) => {
    const [queryClient] = useState(new QueryClient());

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryCacheProvider;
