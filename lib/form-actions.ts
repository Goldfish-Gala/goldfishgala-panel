'use server';

import { updateUserApi } from '@/api/user/api-user';
import { fishRegisterApi, updateFishUrlApi } from '@/api/fish/api-fish';
import { cookies } from 'next/headers';
import { eventRegisterApi } from '@/api/event-reg/api-event';
import { createInvoceApi } from '@/api/invoice/api-invoice';
import { updateScoreApi } from '@/api/nomination/api-nomination';

const getCookies = async () => {
    const cookieStore = await cookies();
    const authCookie = cookieStore?.get('token');
    return authCookie?.value;
};

export async function updateUserSubmit(user: User | null, prevState: any, formData: FormData) {
    const validatedFields = {
        user_fname: formData.get('user_fname') as string,
        user_lname: formData.get('user_lname') as string,
        user_phone: formData.get('user_phone') as string,
        user_ig: formData.get('user_ig') as string,
        user_address: formData.get('user_address') as string,
    };

    const authToken = await getCookies();
    const response = await updateUserApi(user?.user_id, validatedFields, authToken);
    if (response.success) {
        return { message: 'Data berhasil diperbarui' };
    }

    return { message: 'Gagal memperbarui data' };
}

export async function fishRegisterSubmit(
    params: { user: User | null; eventId: string },
    prevState: any,
    formData: FormData
) {
    if (!params.user || !params.eventId) {
        return { message: 'User or event ID is missing.' };
    }

    const fishArray = [];
    const fishIds = [];
    let index = 0;

    while (formData.get(`fish[${index}][event_price_id]`)) {
        fishArray.push({
            user_id: params.user.user_id,
            event_price_id: formData.get(`fish[${index}][event_price_id]`) as string,
            fish_size: formData.get(`fish[${index}][fish_size]`) as string,
            fish_name: formData.get(`fish[${index}][fish_name]`) as string,
        });
        index++;
    }

    const authToken = await getCookies();
    for (const fishData of fishArray) {
        const createFish = await fishRegisterApi(fishData, authToken);
        if (!createFish.success) {
            return { message: 'Gagal mendaftarkan ikan' };
        }
        fishIds.push(createFish.data[0].fish_id);
    }

    const body = {
        event_id: params.eventId,
        user_id: params.user.user_id,
        fish_id: fishIds,
    };

    const eventReg = await eventRegisterApi(body, authToken);
    if (!eventReg.success) {
        return { message: 'Gagal mendaftarkan ikan' };
    }

    const createInvoice = await createInvoceApi(eventReg.data[0].user_reg_id, authToken);
    if (!createInvoice.success) {
        return { message: 'Gagal mendaftarkan ikan' };
    }

    return { message: 'Ikan berhasil didaftarkan', data: createInvoice.data.invoiceUrl };
}

export async function updateFishUrlSubmit(fishId: string, prevState: any, formData: FormData) {
    const validatedFields = {
        fish_submission_link: formData.get('fish_submission_link') as string,
    };

    const authToken = await getCookies();
    const response = await updateFishUrlApi(fishId, validatedFields, authToken);
    if (response.success) {
        return { message: 'Data berhasil diperbarui' };
    }

    return { message: 'Gagal memperbarui data' };
}

export async function updateFishScoreSubmit(
    state: { message: string } | null,
    payload: { fish_score_id: string; fish_score: number }[]
): Promise<{ message: string }> {
    const authToken = await getCookies();
    const response = await updateScoreApi(payload, authToken);
    if (response.success) {
        return { message: 'Fish score submitted succesfully' };
    }

    return { message: 'Fish score failed to submit' };
}
