import ProviderComponent from '@/components/layouts/provider-component';
import 'react-perfect-scrollbar/dist/css/styles.css';
import '../styles/tailwind.css';
import { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { CookiesProvider } from 'next-client-cookies/server';
import { Toaster } from '@/components/UI/Toast/toaster';
import QueryCacheProvider from '@/components/layouts/query-cache-provider';

export const metadata: Metadata = {
    title: {
        template: '%s | GOLDFISH GALA - The Premier Stage of Goldfish',
        default: 'GOLDFISH GALA - The Premier Stage of Goldfish',
    },
};
const nunito = Nunito({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-nunito',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={nunito.variable}>
                <Toaster />
                <ProviderComponent>
                    <QueryCacheProvider>{children}</QueryCacheProvider>
                </ProviderComponent>
            </body>
        </html>
    );
}
