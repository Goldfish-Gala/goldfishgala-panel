'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/UI/Accordion"

const Faq = () => {
    
    return (
        <> 
            <div className="flex flex-col gap-5 pb-5">
                <div className="panel border-white-light px-5 py-4 ">
                    <div className="flex items-center justify-between mb-4">
                        <h6 className="text-lg font-bold">FAQ</h6>
                    </div>
                    <div className="faq px-5">
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Apa itu Goldfish Gala?</AccordionTrigger>
                                <AccordionContent>
                                Goldfish Gala adalah sebuah event yang didedikasikan untuk menampilkan keindahan, elegansi, dan kelucuan ikan koki dalam berbagai kategori, serta memberikan platform bagi para penghobi ikan koki untuk menunjukkan dan memamerkan hobby mereka.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>Siapa yang dapat berpartisipasi dalam Goldfish Gala?</AccordionTrigger>
                                <AccordionContent>
                                Goldfish Gala terbuka untuk semua penghobi ikan koki, baik pemula maupun yang berpengalaman, yang ingin menampilkan ikan koki mereka dan terlibat dalam komunitas ikan koki.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>Bagaimana cara mendaftar untuk berpartisipasi?</AccordionTrigger>
                                <AccordionContent>
                                Peserta dapat mendaftar melalui situs resmi Goldfishgala.com atau menghubungi panitia untuk mendapatkan informasi lebih lanjut mengenai prosedur pendaftaran dan persyaratan.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger>Apakah ada biaya pendaftaran untuk mengikuti Goldfish Gala?</AccordionTrigger>
                                <AccordionContent>
                                Biaya pendaftaran akan diberitahukan saat pendaftaran dibuka. Pastikan untuk memeriksa informasi pendaftaran yang terbaru di situs resmi goldfishgala.com atau media sosial Instagram @Goldfishgala
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-5">
                                <AccordionTrigger>Apa saja kriteria penilaian dalam kompetisi?</AccordionTrigger>
                                <AccordionContent>
                                Penilaian dilakukan berdasarkan beberapa faktor, seperti ukuran, bentuk, warna, dan kualitas keseluruhan ikan koki. Penilaian juga mempertimbangkan faktor estetika dan kesehatan ikan.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-6">
                                <AccordionTrigger>Apakah ada hadiah untuk pemenang?</AccordionTrigger>
                                <AccordionContent>
                                Ya, pemenang dari setiap kategori akan mendapatkan  Piala Apresiasi , produk pilihan dari brand terpercaya, dan sertifikat partisipan.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-7">
                                <AccordionTrigger>Apa yang dimaksud dengan sertifikasi partisipan?</AccordionTrigger>
                                <AccordionContent>
                                Sertifikasi partisipan adalah penghargaan resmi yang diberikan kepada semua peserta yang terlibat dalam acara, sebagai bentuk pengakuan atas partisipasi mereka dalam membangun komunitas ikan koki.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-8">
                                <AccordionTrigger>Apakah ada batasan ukuran atau jenis ikan koki yang bisa diikutkan?</AccordionTrigger>
                                <AccordionContent>
                                Tergantung pada kategori kompetisi, kami menerima berbagai ukuran dan jenis ikan koki. Detail kategori dan persyaratan dapat ditemukan di halaman pendaftaran.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-9">
                                <AccordionTrigger>Kapan dan di mana Goldfish Gala akan diselenggarakan?</AccordionTrigger>
                                <AccordionContent>
                                Goldfish Gala akan diadakan secara online pada tanggal 28 Januari. Acara ini akan diselenggarakan melalui platform website dan Instagram Goldfish Gala, memberikan kemudahan bagi peserta dan pengunjung untuk bergabung dari mana saja.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Faq;
