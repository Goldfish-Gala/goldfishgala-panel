export function formatToRupiah(amount: number | undefined): string {
    if (!amount) {
        return '';
    }
    return `Rp ${amount.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
}
