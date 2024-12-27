import EventRegistrationList from '@/components/admin/events/event-registration';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Event Registration',
};

const EventRegistration = () => {
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
                    <span>All Event Registration</span>
                </li>
            </ul>
            <div className="pt-5">
                <EventRegistrationList />
            </div>
        </div>
    );
};

export default EventRegistration;
