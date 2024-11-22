export function formatName(firstName: string, lastName: string, maxLength: number) {
    const fullName = `${firstName} ${lastName}`;
    if (fullName.length <= maxLength) {
        return fullName;
    }

    const nameParts = lastName.split(' ');
    const abbreviatedLastName = nameParts.slice(0, -1).join(' ') + ' ' + nameParts.slice(-1)[0].charAt(0) + '.';

    const fullWithAbbreviatedLast = `${firstName} ${abbreviatedLastName}`;
    if (fullWithAbbreviatedLast.length <= maxLength) {
        return fullWithAbbreviatedLast;
    }

    // As a fallback, abbreviate all parts of the last name
    const abbreviatedFullName = `${firstName} ${nameParts.map((part) => part.charAt(0) + '.').join(' ')}`;
    return abbreviatedFullName;
}
