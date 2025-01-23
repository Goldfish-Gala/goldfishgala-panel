interface CommunityType {
    group_community_id: string;
    event_id: string;
    group_platform: string;
    group_link_invitation: string;
    event_name: string;
    event_desc: string;
    event_is_active: boolean;
    event_start_date: string;
    event_end_date: string;
    event_created_date: string;
}

interface CreateCommunityType {
    event_id: string;
    group_platform: string;
    group_link_invitation: string;
}
