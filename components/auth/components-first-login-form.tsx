'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import IconUser from '@/components/icon/icon-user';
import IconPhone from '../icon/icon-phone';
import IconHome from '../icon/icon-home';
import IconInstagram from '../icon/icon-instagram';
import { updateUserSubmit } from '@/lib/form-actions';
import { useActionState } from 'react';
import { formUserCompletingDataSchema } from '@/lib/form-schemas';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { fetchUserProfile } from '@/utils/store-user';
import { useCookies } from 'next-client-cookies';
import Swal from 'sweetalert2';

interface FormErrors {
    user_fname?: string;
    user_lname?: string;
    user_phone?: string;
    user_address?: string;
}

const FirstLoginForm = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const user = useSelector((state: IRootState) => state.auth.user);
    const [state, formAction] = useActionState(updateUserSubmit.bind(null, user), null);
    const [isLoading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (!user) {
            fetchUserProfile(authCookie, dispatch, router);
        }
    }, [authCookie, dispatch, router, user]);

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

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
            user_ig: formData.get('user_ig'),
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
            showMessage('Data updated successfully');
            setTimeout(() => {
                router.push(user?.role_id === 4 ? '/fish-candidates' : '/dashboard');
            }, 3000);
        } else if (state?.message === 'Gagal memperbarui data') {
            setLoading(false);
            showMessage('Data failed to update', 'error');
        }
    }, [router, state?.message, user?.role_id]);

    return (
        <form className="space-y-5 dark:text-white" action={handleSubmit}>
            <div>
                <label htmlFor="firstName">First Name</label>
                <div className="relative text-white-dark">
                    <input
                        id="firstName"
                        name="user_fname"
                        type="text"
                        placeholder="input first name"
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
                    Last Name <span className="font-extralight italic">(optional)</span>
                </label>
                <div className="relative text-white-dark">
                    <input
                        id="lastName"
                        name="user_lname"
                        type="text"
                        placeholder="input last name"
                        onChange={handleInputChange}
                        className="form-input ps-10 placeholder:text-white-dark"
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconUser fill={true} />
                    </span>
                </div>
            </div>
            <div>
                <label htmlFor="phone">Phone Number</label>
                <div className="relative text-white-dark">
                    <input
                        id="phone"
                        name="user_phone"
                        type="text"
                        placeholder="example : 628523456789"
                        onChange={handleInputChange}
                        className="form-input ps-10 placeholder:text-white-dark"
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconPhone />
                    </span>
                </div>
                {errors.user_phone && <p className="text-red-500">{errors.user_phone}</p>}
            </div>
            <div>
                <label htmlFor="user_ig">Instagram Username</label>
                <div className="relative text-white-dark">
                    <input
                        id="user_ig"
                        name="user_ig"
                        type="text"
                        placeholder="example : goldfishgala"
                        onChange={handleInputChange}
                        className="form-input ps-10 placeholder:text-white-dark"
                    />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconInstagram />
                    </span>
                </div>
                {errors.user_ig && <p className="text-red-500">{errors.user_ig}</p>}
            </div>
            <button
                disabled={isLoading}
                type="submit"
                className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
            >
                {isLoading ? 'Proccessing...' : 'Submit Data'}
            </button>
        </form>
    );
};

export default FirstLoginForm;
