import EventStatusList from '@/components/admin/events/event-properties/event-status';
import EventPhaseList from '@/components/admin/events/event-properties/event-phase';
import EventPeriodList from '@/components/admin/events/event-properties/event-period';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Event Phase, Status and Period',
};

const EventPhaseStatusPeriod = () => {
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <span className="text-primary ">Admin</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Events</span>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>All Event Properties</span>
                </li>
            </ul>
            <div className="pt-5">
                <EventStatusList />
                <EventPhaseList />
                <EventPeriodList />
            </div>
        </div>
    );
};

export default EventPhaseStatusPeriod;
