import { z } from 'zod';

export const formUserCompletingDataSchema = z.object({
    user_fname: z.string().min(3, { message: 'Nama depan wajib di isi minimal 3 character' }),
    user_lname: z.string().optional(),
    user_phone: z.string().min(1, { message: 'Nomor telepon wajib di isi' }),
    user_address: z.string().min(1, { message: 'Alamat wajib di isi' }),
});

export const formFishRegistrationSchema = z.object({
    fish_size: z.string().min(1, { message: 'Ukuran ikan wajib di isi' }),
    fish_name: z.string().min(1, { message: 'Nama ikan wajib di isi' }),
    fish_gender: z.string().min(1, { message: 'Jenis kelamin ikan wajib di isi' }),
    fish_desc: z.string().min(1, { message: 'Deskripsi ikan wajib di isi' }),
    fish_image1: z.string().min(1, { message: 'Foto ikan 1 wajib di isi' }),
    fish_image2: z.string().min(1, { message: 'Foto ikan 2 wajib di isi' }),
    fish_image3: z.string().min(1, { message: 'Foto ikan 3 wajib di isi' }),
    fish_video_url: z.string().min(1, { message: 'Link video ikan wajib di isi' }),
});
