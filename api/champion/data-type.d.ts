interface ChampionCategoryType {
    champion_category_id: string;
    champion_category_name: string;
    champion_category_created_date: string;
    event_price_id: string;
    event_price_name: string;
}

interface ChampionType {
    champion_id: string;
    champion_category_id: string;
    fish_id: string;
    champion_rank: string;
    champion_desc: string;
    champion_created_date: string;
}
