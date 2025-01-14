export const expiringTime = (isoDate: string | undefined): string => {
    if (!isoDate) {
        return '';
    }
    const date = new Date(isoDate);

    const dateFormatter = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
    });

    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    const formattedDate = dateFormatter.format(date);
    const formattedTime = `${hours} : ${minutes} : ${seconds}`;

    return `${formattedDate}, ${formattedTime}`;
};

export const formatedDate = (isoDate: string | undefined): string => {
    if (!isoDate) {
        return '';
    }
    const date = new Date(isoDate);

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
};

export const formatDateToString = (date: Date | null): string => {
    if (!date) {
        return '';
    }
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
};

export function isoDateToString(isoDate: string | undefined) {
    if (!isoDate) {
        return '';
    }
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
