'use client';

import { InstagramEmbed } from 'react-social-media-embed';

interface CardProps {
    item: ChampionBestAwardType;
}

const BestAwardCard = ({ item }: CardProps) => {
    return (
        <>
            <p className="mb-4 font-semibold capitalize">{item.event_price_name}</p>
            <InstagramEmbed url={item?.fish_submission_link} width={328} />
            <div className="flex w-full items-center justify-center gap-4">
                <label htmlFor="fishscore">Total Score</label>
                <input id="fishscore" readOnly value={item.total_score} className="form-input h-8 w-16 text-center" />
            </div>
        </>
    );
};

export default BestAwardCard;
