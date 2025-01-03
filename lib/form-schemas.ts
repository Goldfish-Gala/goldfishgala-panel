import { z } from 'zod';

export const formUserCompletingDataSchema = z.object({
    user_fname: z.string().min(3, { message: 'First name min. 3 characters' }),
    user_lname: z.string().optional(),
    user_phone: z.string().min(1, { message: 'Phone number required' }),
    user_ig: z.string().min(1, { message: 'Instagram username required' }),
});

export const formUserCompletingDataSchemaRegFish = z.object({
    user_fname: z.string().min(3, { message: 'Nama depan wajib di isi minimal 3 character' }),
    user_lname: z.string().optional(),
    user_phone: z.string().min(1, { message: 'Nomor telepon wajib di isi' }),
    user_ig: z.string().min(1, { message: 'Username instagram wajib di isi' }),
    user_address: z.string().min(1, { message: 'Alamat wajib di isi' }),
});

export const formFishRegistrationSchema = z.object({
    event_price_id: z.string().min(1, { message: 'Kategori ikan wajib di isi' }),
    fish_name: z.string().min(1, { message: 'Nama ikan wajib di isi' }),
    fish_size: z.string().min(1, { message: 'Ukuran ikan wajib di isi' }),
});

export const formLinkSubmitSchema = z.object({
    fish_submission_link: z
        .string()
        .min(1, { message: 'Kategori ikan wajib di isi' })
        .url({ message: 'Link tidak valid' }),
});

export const formFishScoreSchema = z.object({
    fishscores: z.number().min(1, { message: 'Kategori ikan wajib di isi' }),
});

export const formEventPriceSchema = z.object({
    event_price_code: z.string().min(1, { message: 'Code event price wajib diisi' }),
    event_price_name: z.string().min(1, { message: 'Nama event price wajib diisi' }),
    event_price_amount: z.number().min(1, { message: 'Harga event price wajib diisi' }),
});