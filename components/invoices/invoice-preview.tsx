/* eslint-disable @next/next/no-img-element */
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
import SpinnerWithText from '../UI/Spinner';
import { formatToRupiah } from '@/utils/curency-format';
import { expiringTime, formatedDate } from '@/utils/date-format';

type Params = Promise<{ invoiceId: string }>;

const InvoicePreview = async (props: { params: Params }) => {
    const invoice_id = (await props.params).invoiceId;
    const router = useRouter();
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
    const [itemsDetail, setItemsDetail] = useState<ItemDetail[] | []>([]);
    const [isFetching, setFetching] = useState(false);
    const user = useSelector((state: IRootState) => state.auth.user);

    const fetchInvoice = useCallback(async () => {
        setFetching(true);
        try {
            const response = await getInvoiceByCode(authCookie, invoice_id, user?.user_id);
            if (response.success) {
                setInvoice(response.data[0]);
                setItemsDetail(response.data[0].fish_details);
                setFetching(false);
            }
        } catch (error) {
            setFetching(false);
        }
    }, [authCookie, invoice_id, user?.user_id]);

    useEffect(() => {
        if (!invoice) {
            fetchInvoice();
        }
    }, [fetchInvoice, invoice]);

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
            pdf.setFontSize(12);
            pdf.text('Nomor invoice', margin, margin + 30);
            pdf.text(':', margin + 50, margin + 30);
            pdf.setFontSize(12);
            pdf.text(invoice?.invoice_code || '', margin + 55, margin + 30);
            pdf.setFontSize(12);
            pdf.text('Nama tertagih', margin, margin + 38);
            pdf.text(':', margin + 50, margin + 38);
            pdf.setFontSize(12);
            pdf.text(user?.user_fname + ' ' + user?.user_lname || '', margin + 55, margin + 38);
            pdf.setFontSize(12);
            pdf.text('Tagihan untuk', margin, margin + 46);
            pdf.text(':', margin + 50, margin + 46);
            pdf.setFontSize(12);
            pdf.text('Pendaftaran event lomba ikan', margin + 55, margin + 46);
            pdf.setFontSize(12);
            pdf.text('Tanggal invoice', margin, margin + 54);
            pdf.text(':', margin + 50, margin + 54);
            pdf.setFontSize(12);
            pdf.text(formatedDate(invoice?.invoice_created_date) || '', margin + 55, margin + 54);
            pdf.setFontSize(12);
            pdf.text('Batas pembayaran', margin, margin + 62);
            pdf.text(':', margin + 50, margin + 62);
            pdf.setFontSize(12);
            pdf.text(expiringTime(invoice?.invoice_due_date) || '', margin + 55, margin + 62);
            pdf.setFontSize(12);
            pdf.text('Status invoice', margin, margin + 70);
            pdf.text(':', margin + 50, margin + 70);
            pdf.setFontSize(12);
            const status =
                invoice?.invoice_status === 'paid'
                    ? 'Lunas'
                    : invoice?.invoice_status === 'pending'
                    ? 'Belum Bayar'
                    : 'Kadaluarsa';
            pdf.text(status || '', margin + 56, margin + 70);

            const tableColumn = ['Nama Item', 'Jumlah', 'Harga', 'Total Harga'];
            const tableRows = itemsDetail.map((item) => [
                item.fish_size,
                item.fish_count,
                formatToRupiah(item.fish_price),
                formatToRupiah(item.fish_price * item.fish_count),
            ]);

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
                    cellPadding: 4,
                },
                headStyles: {
                    fillColor: [224, 230, 237],
                    textColor: [0, 0, 0],
                    lineWidth: 0,
                    fontSize: 12,
                },
                didParseCell: (hookData) => {
                    if (hookData.section === 'head') {
                        if (hookData.column.dataKey === 1) {
                            hookData.cell.styles.halign = 'center';
                        }
                        if (hookData.column.dataKey === 2 || hookData.column.dataKey === 3) {
                            hookData.cell.styles.halign = 'right';
                        }
                    }
                },
                columnStyles: {
                    0: { halign: 'left', fontSize: 12 },
                    1: { halign: 'center', fontSize: 12 },
                    2: { halign: 'right', fontSize: 12 },
                    3: { halign: 'right', fontSize: 12 },
                },
            });

            pdf.setFontSize(12);
            pdf.setLineWidth(0.5);
            pdf.line(100, 180, 190, 180);
            pdf.setLineWidth(1);
            const text = `Total akhir : ${formatToRupiah(
                itemsDetail.reduce((total, item) => total + item.fish_price * item.fish_count, 0)
            )}`;
            const textWidth = pdf.getTextWidth(text);
            const xPosition = a4Width - 24 - textWidth;
            pdf.text(text, xPosition, 190);

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

    return (
        <div>
            {isFetching ? (
                <div className="flex min-h-[600px] min-w-[320px] flex-col items-center justify-center ">
                    <SpinnerWithText text="Memuat..." />
                </div>
            ) : (
                <>
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
                    <div className="overflow-auto">
                        <div className="panel mx-auto w-[700px] !bg-white !p-16 !pb-48 !text-black">
                            <div className="flex flex-wrap justify-between gap-4 px-4">
                                <div className="text-2xl font-semibold uppercase">Invoice</div>
                                <div className="shrink-0">
                                    <img src="/assets/images/desktop-logo.png" alt="img" className="w-48" />
                                </div>
                            </div>
                            <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                            <div className="flex w-full flex-col justify-between gap-6 pt-10">
                                <div className="flex flex-col justify-between gap-6 sm:flex-row lg:w-2/3">
                                    <div className="grid gap-y-2">
                                        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                                            <div className="text-white-dark">No Invoice</div>
                                            <div className="text-center">:&nbsp;</div>
                                            <div>{invoice?.invoice_code}</div>
                                        </div>
                                        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                                            <div className="text-white-dark">Nama Tertagih</div>
                                            <div className="text-center">:&nbsp;</div>
                                            <div>
                                                {user?.user_fname}&nbsp;{user?.user_lname}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                                            <div className="text-white-dark">Tanggal Invoice</div>
                                            <div className="text-center">:&nbsp;</div>
                                            <div>{formatedDate(invoice?.invoice_created_date)}</div>
                                        </div>
                                        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                                            <div className="text-white-dark">Batas Pembayaran</div>
                                            <div className="text-center">:&nbsp;</div>
                                            <div>{expiringTime(invoice?.invoice_due_date)}</div>
                                        </div>
                                        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                                            <div className="text-white-dark">Status Invoice</div>
                                            <div className="text-center">:&nbsp;</div>
                                            <div>
                                                {invoice?.invoice_status === 'paid'
                                                    ? 'Lunas'
                                                    : invoice?.invoice_status === 'pending'
                                                    ? 'Belum Bayar'
                                                    : 'Kadaluarsa'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="table-responsive mt-14 h-[300px]">
                                <table className="table">
                                    <thead>
                                        <tr className="!bg-white-light font-extrabold">
                                            <th>Nama Item</th>
                                            <th className="text-center">Jumlah</th>
                                            <th className="text-right">Harga</th>
                                            <th className="text-right">Total Harga</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itemsDetail.map((item) => (
                                            <tr key={item.fish_size}>
                                                <td>{item.fish_size}</td>
                                                <td className="text-center">{item.fish_count}</td>
                                                <td className="text-right">{formatToRupiah(item.fish_price)}</td>
                                                <td className="text-right">
                                                    {formatToRupiah(item.fish_price * item.fish_count)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt grid grid-cols-1 px-4 sm:grid-cols-2">
                                <div></div>
                                <div className="space-y-2 ltr:text-right rtl:text-left">
                                    <hr className="my-6 border-white-light dark:border-[#1b2e4b]" />
                                    <div className="flex items-center">
                                        <div className="flex-1">Total Akhir</div>
                                        <div className="w-[37%]">
                                            {formatToRupiah(
                                                itemsDetail.reduce(
                                                    (total, item) => total + item.fish_price * item.fish_count,
                                                    0
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default InvoicePreview;
