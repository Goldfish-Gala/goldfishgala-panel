'use client';
import IconUser from '@/components/icon/icon-user';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import IconPhone from '../icon/icon-phone';
import IconHome from '../icon/icon-home';
import { updateUserSubmit } from '@/lib/form-actions';
import { useFormState } from 'react-dom';
import { formUserCompletingDataSchema } from '@/lib/form-schemas';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { storeUser } from '@/utils/storeUser';
import { useCookies } from 'next-client-cookies';
import { useToast } from '../UI/Toast/use-toast';

interface FormErrors {
    user_fname?: string;
    user_lname?: string;
    user_phone?: string;
    user_address?: string;
}

const FirstLoginForm = () => {
    const router = useRouter();
    const { toast } = useToast();
    const dispatch = useDispatch();
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const user = useSelector((state: IRootState) => state.auth.user);
    const [state, formAction] = useFormState(updateUserSubmit.bind(null, user), null);
    const [isLoading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (authCookie) {
                await storeUser(authCookie, dispatch);
            } else {
                router.replace('/auth');
            }
        };

        if (!user) {
            fetchUserProfile();
        }
    }, [authCookie, dispatch, router, user]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = event.target;
        setErrors((prevErrors: any) => ({
            ...prevErrors,
            [name]: undefined,
        }));
    };

    const handleSubmit = async (formData: FormData) => {
        const formValues = {
            user_fname: formData.get('user_fname'),
            user_lname: formData.get('user_lname'),
            user_phone: formData.get('user_phone'),
            user_address: formData.get('user_address'),
        };

        const validationResult = formUserCompletingDataSchema.safeParse(formValues);

        if (!validationResult.success) {
            const newErrors: { [key: string]: string } = {};
            validationResult.error.errors.forEach((error) => {
                newErrors[error.path[0]] = error.message;
            });

            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoading(true);
        formAction(formData);
    };

    useEffect(() => {
        if (state?.message === 'Data berhasil diperbarui') {
            toast({
                description: state?.message,
                className: 'bg-success text-white border-none',
                duration: 2000,
            });
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } else if (state?.message === 'Gagal memperbarui data') {
            setLoading(false);
            toast({
                description: state?.message,
                className: 'bg-danger text-white border-none',
                duration: 2000,
            });
        }
    }, [state, router, toast]);

    return (
        <form className="space-y-5 dark:text-white" action={handleSubmit}>
            <div>
                <label htmlFor="firstName">Nama Depan</label>
                <div className="relative text-white-dark">
                    <input
                        id="firstName"
                        name="user_fname"
                        type="text"
                        placeholder="Masukan nama depan"
                        onChange={handleInputChange}
                        className="form-input ps-10 placeholder:text-white-dark"
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconUser fill={true} />
                    </span>
                </div>
                {errors.user_fname && <p className="text-red-500">{errors.user_fname}</p>}
            </div>
            <div>
                <label htmlFor="lastName">
                    Nama Belakang <span className="font-extralight italic">(opsional)</span>
                </label>
                <div className="relative text-white-dark">
                    <input
                        id="lastName"
                        name="user_lname"
                        type="text"
                        placeholder="Masukan nama belakang"
                        onChange={handleInputChange}
                        className="form-input ps-10 placeholder:text-white-dark"
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconUser fill={true} />
                    </span>
                </div>
            </div>
            <div>
                <label htmlFor="phone">Nomor Telepon</label>
                <div className="relative text-white-dark">
                    <input
                        id="phone"
                        name="user_phone"
                        type="text"
                        placeholder="Contoh : 628523456789"
                        onChange={handleInputChange}
                        className="form-input ps-10 placeholder:text-white-dark"
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconPhone />
                    </span>
                    {errors.user_phone && <p className="text-red-500">{errors.user_phone}</p>}
                </div>
            </div>
            <div>
                <label htmlFor="address">Alamat</label>
                <div className="relative text-white-dark">
                    <input
                        id="address"
                        name="user_address"
                        type="text"
                        placeholder="Masukan alamat"
                        onChange={handleInputChange}
                        className="form-input ps-10 placeholder:text-white-dark"
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconHome />
                    </span>
                </div>
                {errors.user_address && <p className="text-red-500">{errors.user_address}</p>}
            </div>
            <button
                disabled={isLoading}
                type="submit"
                className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
            >
                {isLoading ? 'Sedang diproses...' : 'Perbarui Data'}
            </button>
        </form>
    );
};

export default FirstLoginForm;
