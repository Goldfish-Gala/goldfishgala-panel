'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { updateUserSubmit } from '@/lib/form-actions';
import { useActionState } from 'react';
import { formUserCompletingDataSchema } from '@/lib/form-schemas';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { fetchUserProfile } from '@/utils/store-user';
import { useCookies } from 'next-client-cookies';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '@/api/user/api-user';
import IconPencilPaper from '@/components/icon/icon-pencil-paper';

interface FormErrors {
    user_fname?: string;
    user_lname?: string;
    user_phone?: string;
    user_address?: string;
}

const ComponentsUpdateUserProfile = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const user = useSelector((state: IRootState) => state.auth.user);
    const [state, formAction] = useActionState(updateUserSubmit.bind(null, user), null);
    const [isLoading, setLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isButtonVisible, setButtonVisible] = useState(false);

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
            user_fname: formData.get('user_fname') || "",
            user_lname: formData.get('user_lname') || "",
            user_address: formData.get('user_address') || "",
            user_phone: formData.get('user_phone') || "",
            user_email: formData.get('user_email') || "",
            user_ig: formData.get('user_ig') || "",
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
                window.location.reload();
                router.push(user?.role_id === 1 ? '/users/user-account-settings' : '/dashboard');
            }, 3000);
        } else if (state?.message === 'Gagal memperbarui data') {
            setLoading(false);
            showMessage('Data failed to update', 'error');
        }
    }, [router, state, user?.role_id]);
    const getUserProfile = async (): Promise<User[]> => {
        const getOneUser = await getUser(authCookie);
        if (getOneUser.success) {
            return getOneUser.data;
        }
        throw new Error('No User Found');
    };
    const { isPending, error, data } = useQuery({
        queryKey: ['getUser'],
        queryFn: () => getUserProfile(),
        enabled: !!authCookie,
        refetchOnWindowFocus: false,
    });
    return (
        <form className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black"  action={handleSubmit}>
            <div className='flex items-center justify-between'>
                <h6 className="mb-5 text-lg font-bold">General Information</h6>
                <button type="button" 
                    className="btn btn-primary rounded-full p-2 ltr:ml-auto rtl:mr-auto"
                    onClick={() => {
                        setIsDisabled(!isDisabled); 
                        setButtonVisible(!isButtonVisible);
                      }}
                >
                    <IconPencilPaper />
                </button>
            </div>
                    {data && data.length > 0 && (
            <div className="flex flex-col sm:flex-row">
                <div className="mb-5 w-full sm:w-2/12 ltr:sm:mr-4 rtl:sm:ml-4">
                        <Image
                            width={800}
                            height={800}
                            src={data[0].user_avatar}
                            alt="img"
                            className="mx-auto h-20 w-20 rounded-full object-cover md:h-32 md:w-32"
                        />

                </div>
                <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="fname">First Name</label>
                        <input id="fname" 
                        type="text" name="user_fname"
                        placeholder={data[0].user_fname} 
                        defaultValue={data[0].user_fname} 
                        className="form-input disabled:opacity-50" 
                        disabled={isDisabled}
                        onChange={handleInputChange}/>
                    </div>
                    {errors.user_fname && <p className="text-red-500">{errors.user_fname}</p>}
                    <div>
                        <label htmlFor="lname">Last Name</label>
                        <input id="lname" 
                        type="text" name="user_lname"
                        placeholder={data[0].user_lname} 
                        defaultValue={data[0].user_lname} 
                        className="form-input disabled:opacity-50" 
                        disabled={isDisabled}
                        onChange={handleInputChange}/>
                    </div>
                    {errors.user_lname && <p className="text-red-500">{errors.user_lname}</p>}
                    <div>
                        <label htmlFor="address">Address</label>
                        <input id="address" 
                        type="text" name="user_address"
                        placeholder={data[0].user_address} 
                        defaultValue={data[0].user_address} 
                        className="form-input disabled:opacity-50" 
                        disabled={isDisabled}
                        onChange={handleInputChange}/>
                    </div>
                    {errors.user_address && <p className="text-red-500">{errors.user_address}</p>}
                    <div>
                        <label htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            type="text" name="user_phone"
                            placeholder={data[0].user_phone}
                            defaultValue={data[0].user_phone} 
                            className="form-input disabled:opacity-50"
                            disabled={isDisabled}
                            onChange={handleInputChange}/>
                    </div>
                    {errors.user_phone && <p className="text-red-500">{errors.user_phone}</p>}
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email" name="user_email"
                            placeholder={data[0].user_email}
                            defaultValue={data[0].user_email} 
                            className="form-input disabled:opacity-50"
                            disabled={isDisabled}
                            onChange={handleInputChange}/>
                    </div>
                    {errors.email && <p className="text-red-500">{errors.email}</p>}
                    <div>
                        <label htmlFor="ig">Instagram</label>
                        <input id="ig" 
                        type="text" name="user_ig"
                        placeholder={data[0].user_ig} 
                        defaultValue={data[0].user_ig} 
                        className="form-input disabled:opacity-50" 
                        disabled={isDisabled}
                        onChange={handleInputChange}/>
                    </div>
                    {errors.user_ig && <p className="text-red-500">{errors.user_ig}</p>}
                    <li className="flex items-center gap-2">
                        Joined on{" "}
                        {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }).format(new Date(data[0].user_created_date))}
                    </li>
                    <div className="mt-3 sm:col-span-2 flex gap-5"
                    >
                        {/* <button type="button" className="btn bg-red-600 shadow-red-300 border-red-500 btn-primary">
                            <Link href="/users/profile">
                                Back
                            </Link>
                        </button>  */}
                        {isButtonVisible && (
                        <button type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                        > {isLoading ? 'Proccessing...' : 'Save'}
                        </button>  
                        )}
                    </div>
                </div>
            </div>
            )}
        </form>
    );
};

export default ComponentsUpdateUserProfile;
