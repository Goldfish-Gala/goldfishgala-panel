import { getAllCategoryByEventPriceApi } from '@/api/champion/api-champions';
import SpinnerWithText from '@/components/UI/Spinner';
import { useQuery } from '@tanstack/react-query';
import ChampionsComp from './champion-category';

interface WinnerCardProps {
    eventPriceId: string;
    eventPriceName: string;
    authCookie: string | undefined;
}

const WinnerCard = ({ eventPriceId, eventPriceName, authCookie }: WinnerCardProps) => {
    const fetchAllWinners = async (): Promise<ChampionCategoryType[]> => {
        const fishes = await getAllCategoryByEventPriceApi(authCookie, eventPriceId);
        if (fishes.success) return fishes.data;
        throw new Error('Failed to fetch event prices');
    };

    const { data, isPending } = useQuery({
        queryKey: ['allChampionCategory'],
        queryFn: fetchAllWinners,
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
        staleTime: 5 * 50 * 1000,
    });
    if (!data) {
        return (
            <div className="flex min-h-[650px] min-w-[320px] items-center justify-center">
                <SpinnerWithText text="Loading..." />
            </div>
        );
    }
    return (
        <>
            <p>{`Category size : ${eventPriceName}`}</p>
            {data.map((item) => (
                <div key={item.champion_category_id}>
                    <ChampionsComp categoryId={item.champion_category_id} authCookie={authCookie} />
                </div>
            ))}
        </>
    );
};

export default WinnerCard;
