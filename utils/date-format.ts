export const expiringTime = (isoDate: string): string => {
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
