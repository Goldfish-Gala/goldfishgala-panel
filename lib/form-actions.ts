'use server';
import { updateUserApi } from '@/api/api-user';
import { formUserCompletingDataSchema } from './form-schemas';
import { revalidatePath } from 'next/cache';
import { fishRegisterApi } from '@/api/api-fish';
import { eventRegisterApi } from '@/api/api-event';
import { cookies } from 'next/headers';

const cookieStore = cookies();
const authCookie = cookieStore?.get('token');

export async function updateUserSubmit(user: User | null, prevState: any, formData: FormData) {
    const validatedFields = {
        user_fname: formData.get('user_fname') as string,
        user_lname: formData.get('user_lname') as string,
        user_address: formData.get('user_address') as string,
        user_phone: formData.get('user_phone') as string,
    };

    try {
        const response = await updateUserApi(user?.user_id, validatedFields, authCookie?.value);
        if (response.success) {
            return { message: 'Data berhasil diperbarui' };
        }

        return { message: 'Gagal memperbarui data' };
    } catch (error: any) {
        return { message: 'Gagal memperbarui data' };
    }
}

export async function fishRegisterSubmit(
    params: { user: User | null; eventId: string },
    prevState: any,
    formData: FormData
) {
    const validatedFields = {
        user_id: params.user?.user_id,
        fish_type_id: formData.get('fish_type_id') as string,
        fish_size: formData.get('fish_size') as string,
        fish_name: formData.get('fish_name') as string,
        fish_gender: formData.get('fish_gender') as string,
        fish_desc: formData.get('fish_desc') as string,
        fish_image1: formData.get('fish_image1') as string,
        fish_image2: formData.get('fish_image2') as string,
        fish_image3: formData.get('fish_image3') as string,
        fish_video_url: formData.get('fish_video_url') as string,
    };

    try {
        const createFish = await fishRegisterApi(validatedFields, authCookie?.value);
        if (createFish.success) {
            const body = {
                event_id: params.eventId,
                user_id: params.user?.user_id,
                fish_id: createFish.data[0].fish_id,
            };
            const eventReg = await eventRegisterApi(body, authCookie?.value);
            if (eventReg.success) {
                return { message: 'Ikan berhasil didaftarkan' };
            }
        }

        return { message: 'Gagal mendaftarkan ikan' };
    } catch (error: any) {
        return { message: 'Gagal mendaftarkan ikan' };
    }
}
