import { getAllChampionByCategoryIdApi } from '@/api/champion/api-champions';
import SpinnerWithText from '@/components/UI/Spinner';
import { useQuery } from '@tanstack/react-query';

interface ChampionProps {
    categoryId: string;
    authCookie: string | undefined;
}

const ChampionsComp = ({ categoryId, authCookie }: ChampionProps) => {
    const fetchAllWinners = async (): Promise<ChampionType[]> => {
        const champions = await getAllChampionByCategoryIdApi(authCookie, categoryId);
        if (champions.success) return champions.data;
        throw new Error('Failed to fetch event prices');
    };

    const { data, isPending } = useQuery({
        queryKey: ['allChampionByCategory'],
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
        <div className="grid grid-cols-1">
            {data.map((item) => (
                <div key={item.champion_category_id}>
                    <p>{item.champion_rank}</p>
                </div>
            ))}
        </div>
    );
};

export default ChampionsComp;
