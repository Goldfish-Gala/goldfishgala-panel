'use client';
import IconDownload from '@/components/icon/icon-download';
import IconEdit from '@/components/icon/icon-edit';
import IconPlus from '@/components/icon/icon-plus';
import IconPrinter from '@/components/icon/icon-printer';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'next-client-cookies';
import { IRootState } from '@/store';
import { storeUser } from '@/utils/store-user';
import { getInvoiceByCode } from '@/api/api-invoice';

const InvoicePreview = ({ params }: { params: { invoiceId: string } }) => {
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
    const [isFetching, setFetching] = useState(false);

    const fetchInvoice = useCallback(async () => {
        setFetching(true);
        try {
            const response = await getInvoiceByCode(authCookie, params.invoiceId);
            if (response.success) {
                setInvoice(response.data[0]);
                setFetching(false);
            }
        } catch (error) {
            setFetching(false);
        }
    }, [authCookie, params.invoiceId]);

    useEffect(() => {
        fetchInvoice();
    }, [fetchInvoice]);

    const generatePDF = (isDownload = false) => {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const margin = 20;
        const a4Width = 210;
        const a4Height = 297;
        const titleYPosition = margin;

        // Add Logo
        const logoUrl = '/assets/images/desktop-logo.png';
        const img = new Image();
        img.src = logoUrl;
        img.onload = () => {
            pdf.setFontSize(20);
            pdf.text('Invoice', margin, titleYPosition);
            pdf.addImage(img, 'SVG', 130, titleYPosition - 10, 60, 15);
            pdf.setDrawColor(0, 0, 0);
            pdf.setLineWidth(0.5);
            pdf.line(margin, 30, a4Width - margin, 30);
            pdf.setLineWidth(1);
            pdf.setFontSize(14);
            pdf.text('Nomor invoice', margin, margin + 30);
            pdf.text(':', margin + 50, margin + 30);
            pdf.setFontSize(12);
            pdf.text('2134123424', margin + 55, margin + 30);
            pdf.setFontSize(14);
            pdf.text('Nama tertagih', margin, margin + 38);
            pdf.text(':', margin + 50, margin + 38);
            pdf.setFontSize(12);
            pdf.text('rpb', margin + 55, margin + 38);
            pdf.setFontSize(14);
            pdf.text('Tagihan untuk', margin, margin + 46);
            pdf.text(':', margin + 50, margin + 46);
            pdf.setFontSize(12);
            pdf.text('Pendaftaran event lomba ikan', margin + 55, margin + 46);
            pdf.setFontSize(14);
            pdf.text('Tanggal invoice', margin, margin + 54);
            pdf.text(':', margin + 50, margin + 54);
            pdf.setFontSize(12);
            pdf.text('26 okt 2024', margin + 55, margin + 54);
            pdf.setFontSize(14);
            pdf.text('Batas pembayaran', margin, margin + 62);
            pdf.text(':', margin + 50, margin + 62);
            pdf.setFontSize(12);
            pdf.text('26 okt, 17:30', margin + 55, margin + 62);
            pdf.setFontSize(14);
            pdf.text('Status invoice', margin, margin + 70);
            pdf.text(':', margin + 50, margin + 70);
            pdf.setFontSize(18);
            pdf.setTextColor(150, 150, 150);
            pdf.text('BELUM BAYAR', margin + 55, margin + 71);

            const tableColumn = ['S.NO', 'ITEMS', 'QTY', 'PRICE', 'AMOUNT'];
            const tableRows = items.map((item) => [item.item, item.quantity, `$${item.price}`]);

            autoTable(pdf, {
                head: [tableColumn],
                body: tableRows,
                startY: margin + 80,
                theme: 'grid',
                margin: { top: margin, left: margin, right: margin },
                styles: {
                    fillColor: [255, 255, 255],
                    textColor: [0, 0, 0],
                    lineWidth: 0,
                    lineColor: [255, 255, 255],
                    cellPadding: 5,
                },
                headStyles: {
                    fillColor: [230, 230, 230],
                    textColor: [0, 0, 0],
                    lineWidth: 0,
                },
            });

            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);

            const totalStartY = pdf.lastAutoTable.finalY + 10;
            pdf.text('Subtotal: $3255', margin, totalStartY);
            pdf.text('Tax: $700', margin, totalStartY + 10);
            pdf.text('Shipping Rate: $0', margin, totalStartY + 20);
            pdf.text('Discount: $10', margin, totalStartY + 30);
            pdf.text('Total: $3945', margin, totalStartY + 40);

            if (isDownload) {
                pdf.save('invoice.pdf');
            } else {
                const pdfBlob = pdf.output('blob');
                const pdfUrl = URL.createObjectURL(pdfBlob);
                const pdfWindow = window.open(pdfUrl, '_blank');
                pdfWindow?.print();
            }
        };
    };

    const items = [
        {
            id: 1,
            item: 'nama event : lomba ikan | nama ikan : lala',
            quantity: 1,
            price: '120',
        },
    ];

    const columns = [
        { key: 'item', label: 'Nama Item' },
        { key: 'quantity', label: 'Jumlah Item', class: 'text-left' },
        { key: 'price', label: 'harga', class: 'ltr:text-right rtl:text-left' },
    ];

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-center justify-center gap-4 lg:justify-end">
                <button type="button" className="btn btn-primary gap-2" onClick={() => generatePDF(false)}>
                    <IconPrinter />
                    Print
                </button>

                <button type="button" className="btn btn-success gap-2" onClick={() => generatePDF(true)}>
                    <IconDownload />
                    Download
                </button>
            </div>
            <div className="panel mx-auto max-w-[1000px] !bg-white !p-16 !text-black">
                <div className="flex flex-wrap justify-between gap-4 px-4">
                    <div className="text-2xl font-semibold uppercase">Invoice</div>
                    <div className="shrink-0">
                        <img src="/assets/images/desktop-logo.png" alt="img" className="w-44 ltr:ml-auto rtl:mr-auto" />
                    </div>
                </div>
                <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                <div className="flex flex-col flex-wrap justify-between gap-6 lg:flex-row">
                    <div className="flex flex-col justify-between gap-6 sm:flex-row lg:w-2/3">
                        <div className="xl:1/3 sm:w-1/2 lg:w-2/5">
                            <div className="mb-2 flex w-full items-center justify-between">
                                <div className="text-white-dark">No Invoice :</div>
                                <div>#8701</div>
                            </div>
                            <div className="mb-2 flex w-full items-center justify-between">
                                <div className="text-white-dark">Nama Tertagih :</div>
                                <div>Rpb</div>
                            </div>
                            <div className="mb-2 flex w-full items-center justify-between">
                                <div className="text-white-dark">Tanggal Invoice :</div>
                                <div>13 Sep 2022</div>
                            </div>
                            <div className="mb-2 flex w-full items-center justify-between">
                                <div className="text-white-dark">Batas Pembayaran :</div>
                                <div>13 Sep 20.20</div>
                            </div>
                            <div className="mb-2 flex w-full items-center justify-between">
                                <div className="text-white-dark">Status :</div>
                                <div>Belum Bayar</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="table-responsive mt-6">
                    <table className="table-striped">
                        <thead>
                            <tr className="!bg-white !bg-none dark:!bg-white">
                                {columns.map((column) => (
                                    <th key={column.key} className={column?.class + '!bg-white'}>
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.item}</td>
                                    <td>{item.quantity}</td>
                                    <td className="ltr:text-right rtl:text-left">${item.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 grid grid-cols-1 px-4 sm:grid-cols-2">
                    <div></div>
                    <div className="space-y-2 ltr:text-right rtl:text-left">
                        <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                        <div className="flex items-center">
                            <div className="flex-1">Total</div>
                            <div className="w-[37%]">$3945</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePreview;
