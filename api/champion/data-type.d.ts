interface ChampionCategoryRegisterType {
    champion_category_name: string;
    event_price_id: string;
}

interface ChampionCategoryType extends ChampionCategoryRegisterType {
    champion_category_id: string;
    event_price_name: string;
    champion_category_created_date: string;
}

interface ChampionAwardType {
    champion_award_id: string;
    champion_award_rank: string;
    champion_award_desc: string;
}

interface ChampionType {
    champion_id: string;
    champion_category_id: string;
    fish_id: string;
    champion_award_id: string;
    champion_award_rank: string;
    is_best_award: boolean;
    is_grand_champion: boolean;
    champion_created_date: string;
    champion_category_name: string;
    event_price_id: string;
    fish_name: string;
    fish_size: string;
    user_id: string;
    fish_submission_link: string;
    fish_is_nominated: boolean;
    event_price_code: string;
    event_price_name: string;
    event_price_amount: number;
    user_name: string;
    user_email: string;
    user_phone: string;
    user_address: string;
    user_avatar: string;
    user_ig: string;
}

interface FishScoreType {
    user_id: string;
    fish_score: number;
    user_fname: string;
    user_lname: string;
    fish_score_id: string;
    fish_score_updated_at: string;
}

interface FinalChampionCategory {
    fishScores: FishScoreType[];
    event_price_id: string;
    event_price_name: string;
    event_price_amount: number;
    champion_category_id: string;
    champion_category_name: string;
}
interface FinalFishType {
    fish_final_score_id: string;
    fish_id: string;
    champion_category_id: string;
    fish_final_score: number;
    fish_final_score_created_date: string;
    fish_name: string;
    fish_size: string;
    fish_submission_link: string;
    user_name: string;
    championcategories: FinalChampionCategory[];
}

interface CreateChampionType {
    champion_category_id: string;
    fish_id: string | undefined;
    champion_award_id: string | undefined;
    is_best_award?: boolean;
    is_grand_champion?: boolean;
}

interface ChampionBestAwardType {
    champion_id: string;
    champion_category_id: string;
    fish_id: string;
    champion_award_id: string;
    is_best_award: boolean;
    is_grand_champion: boolean;
    champion_created_date: string;
    champion_category_name: string;
    event_price_id: string;
    fish_name: string;
    fish_size: string;
    user_id: string;
    fish_submission_link: string;
    event_price_code: string;
    event_price_name: string;
    event_price_amount: number;
    champion_award_rank: string;
    champion_award_desc: string;
    user_name: string;
    user_email: string;
    user_phone: string;
    user_address: string;
    user_avatar: string;
    user_ig: string;
    total_score: string;
}

interface FishScoreType {
    user_id: string;
    fish_score: number;
    user_fname: string;
    user_lname: string;
    fish_score_id: string;
    fish_score_updated_at: string;
}

interface FinalChampionCategory {
    fishScores: FishScoreType[];
    event_price_id: string;
    event_price_name: string;
    event_price_amount: number;
    champion_category_id: string;
    champion_category_name: string;
}
interface FinalFishType {
    fish_final_score_id: string;
    fish_id: string;
    champion_category_id: string;
    fish_final_score: number;
    fish_final_score_created_date: string;
    fish_name: string;
    fish_size: string;
    fish_submission_link: string;
    championcategories: FinalChampionCategory[];
}

interface FishScoreType {
    user_id: string;
    fish_score: number;
    user_fname: string;
    user_lname: string;
    fish_score_id: string;
    fish_score_updated_at: string;
}

interface FinalChampionCategory {
    fishScores: FishScoreType[];
    event_price_id: string;
    event_price_name: string;
    event_price_amount: number;
    champion_category_id: string;
    champion_category_name: string;
}
interface FinalFishType {
    fish_final_score_id: string;
    fish_id: string;
    champion_category_id: string;
    fish_final_score: number;
    fish_final_score_created_date: string;
    fish_name: string;
    fish_size: string;
    fish_submission_link: string;
    championcategories: FinalChampionCategory[];
}
