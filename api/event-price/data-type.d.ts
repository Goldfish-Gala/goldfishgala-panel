interface EventPriceRegisterType {
    event_price_code: string;
    event_price_name: string;
    event_price_amount: number;
}

interface EventPriceType extends EventPriceRegisterType {
    event_price_id: string;
}

interface EventUpdateType {
    event_id: string;
    event_price_id: string[]
}