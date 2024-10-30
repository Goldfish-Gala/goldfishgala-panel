export function formatToRupiah(amount: number): string {
    return `Rp ${amount.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
}
