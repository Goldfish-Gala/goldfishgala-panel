'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import IconUser from '@/components/icon/icon-user';
import IconPhone from '../icon/icon-phone';
import IconHome from '../icon/icon-home';
import IconInstagram from '../icon/icon-instagram';
import IconX from '../icon/icon-x';
import { fishRegisterSubmit, updateUserSubmit } from '@/lib/form-actions';
import { useFormState } from 'react-dom';
import { formFishRegistrationSchema, formUserCompletingDataSchemaRegFish } from '@/lib/form-schemas';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { fetchUserProfile } from '@/utils/store-user';
import Image from 'next/image';
import { useCookies } from 'next-client-cookies';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { fishImageApi, getFishTypeApi } from '@/api/api-fish';
import SpinnerWithText from '../UI/Spinner';
import { ArrowLeft } from 'lucide-react';
import ConfirmationModal from '../components/confirmation-modal';
import { getEventPricesApi } from '@/api/api-event';
import { formatToRupiah } from '@/utils/curency-format';
import './style.css';

interface Price {
    value: string;
    label: string;
}

const FishRegistrationForm = ({ params }: { params: { eventId: string } }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const user = useSelector((state: IRootState) => state.auth.user);
    const [eventPrices, setEventPrices] = useState<EventPrice[] | null>(null);
    const [totalFish, setTotalFish] = useState(1);
    const [fishForms, setFishForms] = useState([{}]);
    const [isFetching, setFetching] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
    const [step, setStep] = useState(1);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const formRef1 = useRef<HTMLFormElement>(null);
    const formRef2 = useRef<HTMLFormElement>(null);
    const { control } = useForm();
    const form1 = useForm({
        defaultValues: {
            user_fname: user?.user_fname,
            user_lname: user?.user_lname,
            user_phone: user?.user_phone,
            user_ig: user?.user_ig,
            user_address: user?.user_address,
        },
    });
    const {
        formState: { isDirty },
        register,
        reset,
        setValue,
    } = form1;
    const [state1, formAction1] = useFormState(updateUserSubmit.bind(null, user), null);
    const [state2, formAction2] = useFormState(
        fishRegisterSubmit.bind(null, { user: user, eventId: params.eventId }),
        null
    );

    useEffect(() => {
        reset({
            user_fname: user?.user_fname,
            user_lname: user?.user_lname,
            user_phone: user?.user_phone,
            user_ig: user?.user_ig,
            user_address: user?.user_address,
        });
        if (!user) {
            fetchUserProfile(authCookie, dispatch, router);
        }
    }, [authCookie, dispatch, reset, router, user]);

    const fetchAllEventPrices = useCallback(async () => {
        setFetching(true);
        try {
            const response = await getEventPricesApi(params.eventId, authCookie);
            if (response.success) {
                setEventPrices(response.data);
                setFetching(false);
            }
        } catch (error) {
            setFetching(false);
        }
    }, [authCookie, params.eventId]);

    useEffect(() => {
        fetchAllEventPrices();
    }, [fetchAllEventPrices]);

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

    const handleNext = async (id: string) => {
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };
    const handleInputChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setValue(name as any, value);
        setErrors((prevErrors: any) => ({
            ...prevErrors,
            [name]: undefined,
        }));
    };

    const handleInputChange2 = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, value } = event.target;
        const updatedFishForms = [...fishForms];

        if (type === 'number') {
            const numericValue = Number(value);
            if (numericValue > 99) {
                event.target.value = '99';
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [`fish_size_${index}`]: 'Ukuran tidak boleh lebih dari 99 cm',
                }));
                return;
            }
        }

        updatedFishForms[index] = {
            ...updatedFishForms[index],
            [name]: value,
        };

        setErrors((prevErrors) => ({
            ...prevErrors,
            [`${name}_${index}`]: undefined,
        }));

        setFishForms(updatedFishForms);
    };

    const handleAddFish = () => {
        setFishForms((prevFishForms) => [...prevFishForms, {}]);
        setTotalFish((prevTotal) => prevTotal + 1);
    };

    const handleRemoveFish = (index: number) => {
        const updatedFishForms = fishForms.filter((_, i) => i !== index);
        setFishForms(updatedFishForms);
        setTotalFish(updatedFishForms.length);
    };

    const handleValidation1 = async (formData: FormData) => {
        const formValues = {
            user_fname: formData.get('user_fname'),
            user_lname: formData.get('user_lname'),
            user_phone: formData.get('user_phone'),
            user_ig: formData.get('user_ig'),
            user_address: formData.get('user_address'),
        };
        const validationResult = formUserCompletingDataSchemaRegFish.safeParse(formValues);

        if (!validationResult.success) {
            const newErrors: { [key: string]: string } = {};
            validationResult.error.errors.forEach((error) => {
                newErrors[error.path[0]] = error.message;
            });
            setErrors(newErrors);
            return false;
        }
        return true;
    };

    const handleOpenModal1 = async () => {
        const formElement = formRef1.current;
        if (formElement) {
            const formData = new FormData(formElement);
            const isValid = await handleValidation1(formData);
            if (isValid && isDirty) {
                setOpen1(true);
            } else if (isValid && !isDirty) {
                setStep(2);
            }
        }
    };

    const handleConfirm1 = () => {
        setLoading(true);
        formRef1.current?.dispatchEvent(new Event('submit', { bubbles: true }));
    };

    const handleSubmit1 = async (formData: FormData) => {
        const formValues = new FormData();
        formData.forEach((value, key) => {
            formValues.append(key, value);
        });

        setErrors({});
        setLoading(true);
        form1.handleSubmit(() => formAction1(formValues))();
    };

    const handleValidation2 = (formData: FormData): boolean => {
        const newErrors: { [key: string]: string } = {};
        const formValuesArray = fishForms.map((_, index) => ({
            event_price_id: formData.get(`fish[${index}][event_price_id]`),
            fish_size: formData.get(`fish[${index}][fish_size]`),
            fish_name: formData.get(`fish[${index}][fish_name]`),
        }));

        const isValid = formValuesArray.every((formValues, idx) => {
            const validationResult = formFishRegistrationSchema.safeParse(formValues);

            if (!validationResult.success) {
                validationResult.error.errors.forEach((error) => {
                    newErrors[`${error.path[0]}_${idx}`] = error.message;
                });
                return false;
            }

            return true;
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleOpenModal2 = () => {
        const formElement = formRef2.current;
        if (formElement) {
            const formData = new FormData(formElement);
            const isValid = handleValidation2(formData);
            if (isValid) {
                setOpen2(true);
            }
        }
    };

    const handleConfirm2 = () => {
        setLoading(true);
        formRef2.current?.dispatchEvent(new Event('submit', { bubbles: true }));
    };

    const handleSubmit2 = async (formData: FormData) => {
        setLoading(true);

        const validFormData = new FormData();
        for (let i = 0; i < totalFish; i++) {
            validFormData.append(`fish[${i}][event_price_id]`, formData.get(`fish[${i}][event_price_id]`) as string);
            validFormData.append(`fish[${i}][fish_size]`, formData.get(`fish[${i}][fish_size]`) as string);
            validFormData.append(`fish[${i}][fish_name]`, formData.get(`fish[${i}][fish_name]`) as string);
        }

        formAction2(validFormData);
    };

    useEffect(() => {
        if (state1?.message === 'Data berhasil diperbarui') {
            showMessage(state1.message);
            fetchUserProfile(authCookie, dispatch, router);
            setTimeout(() => {
                setStep(2);
                setLoading(false);
            }, 2000);
        } else if (state1?.message === 'Gagal memperbarui data') {
            setLoading(false);
            showMessage(state1?.message, 'error');
        }
    }, [authCookie, dispatch, router, state1?.message]);

    useEffect(() => {
        if (state2?.message === 'Ikan berhasil didaftarkan') {
            setLoading(false);
            showMessage(state2.message + '. Silahkan menyelesaikan pembayaran');
            setTimeout(() => {
                window.location.href = state2.data;
            }, 3000);
        } else if (state2?.message === 'Gagal mendaftarkan ikan') {
            setLoading(false);
            showMessage(state2.message, 'error');
        }
    }, [state2?.data, state2?.message]);

    return (
        <div>
            {isFetching ? (
                <div className="flex h-full w-full flex-col items-center justify-center ">
                    <SpinnerWithText text="Memuat..." />
                </div>
            ) : (
                <div>
                    {step === 1 && (
                        <div className="flex min-h-[300px] w-full flex-col justify-center gap-4">
                            <p className="text-base font-bold leading-normal text-dark dark:text-white ">
                                Lengkapi Data diri
                            </p>
                            <form className="dark:text-white" action={handleSubmit1} ref={formRef1}>
                                <div>
                                    <label htmlFor="firstName">Nama Depan</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="firstName"
                                            type="text"
                                            {...register('user_fname', {
                                                onChange: (event) => {
                                                    handleInputChange1(event);
                                                },
                                            })}
                                            className="form-input bg-white ps-10 placeholder:text-white-dark"
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
                                            type="text"
                                            {...form1.register('user_lname', {
                                                onChange: (event) => {
                                                    handleInputChange1(event);
                                                },
                                            })}
                                            placeholder="Masukan nama belakang"
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
                                            type="text"
                                            {...form1.register('user_phone', {
                                                onChange: (event) => {
                                                    handleInputChange1(event);
                                                },
                                            })}
                                            placeholder="Contoh : 628523456789"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconPhone />
                                        </span>
                                        {errors.user_phone && <p className="text-red-500">{errors.user_phone}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="user_ig">Username Instagram</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="user_ig"
                                            type="text"
                                            {...form1.register('user_ig', {
                                                onChange: (event) => {
                                                    handleInputChange1(event);
                                                },
                                            })}
                                            placeholder="contoh : @goldfishgala"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconInstagram />
                                        </span>
                                    </div>
                                    {errors.user_ig && <p className="text-red-500">{errors.user_ig}</p>}
                                </div>
                                <div>
                                    <label htmlFor="address">Alamat</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="address"
                                            type="text"
                                            {...form1.register('user_address', {
                                                onChange: (event) => {
                                                    handleInputChange1(event);
                                                },
                                            })}
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconHome />
                                        </span>
                                    </div>
                                    {errors.user_address && <p className="text-red-500">{errors.user_address}</p>}
                                </div>
                                <div className="flex w-full items-end">
                                    <button
                                        disabled={isLoading}
                                        type="button"
                                        className="btn btn-gradient !mt-16 w-fit self-end border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] md:w-[50%]"
                                        onClick={handleOpenModal1}
                                    >
                                        {isLoading ? 'Sedang diproses...' : 'Selanjutnya'}
                                    </button>
                                </div>
                                <ConfirmationModal
                                    open={open1}
                                    setOpen={setOpen1}
                                    title="Konfirmasi Data"
                                    mainText="Apakah sudah yakin semua data diri sudah benar ?"
                                    subText="(Akan dilanjutkan ke proses selanjutnya setelah tombol 'YA' dipilih)"
                                    isLoading={isLoading}
                                    state={state1?.message}
                                    cancelButton="Cek Lagi"
                                    confirmButton={isLoading ? 'Sedang diproses' : 'Ya'}
                                    handleConfirm={handleConfirm1}
                                />
                            </form>
                        </div>
                    )}
                    {step === 2 && (
                        <form className="dark:text-white" action={handleSubmit2} ref={formRef2}>
                            {fishForms.map((form, index) => (
                                <div key={index} className="mb-2 space-y-5 border-b-[1.2px] border-dark-light pb-6">
                                    {totalFish > 1 && (
                                        <div className="flex w-full justify-between">
                                            <h3>IKAN {index + 1}</h3>
                                            <div className="cursor-pointer" onClick={() => handleRemoveFish(index)}>
                                                <IconX />
                                            </div>
                                        </div>
                                    )}
                                    {/* Kategori Ikan */}
                                    <div>
                                        <label htmlFor={`event_price_id_${index}`}>Kategori ikan</label>
                                        <div className="relative text-white-dark">
                                            <Controller
                                                name={`fish[${index}][event_price_id]`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        id={`event_price_id_${index}`}
                                                        isSearchable={false}
                                                        {...field}
                                                        placeholder="Pilih kategori ikan"
                                                        options={
                                                            eventPrices?.map((price) => ({
                                                                value: price.event_price_id,
                                                                label: `${
                                                                    price.event_price_name
                                                                } (Biaya: ${formatToRupiah(price.event_price_amount)})`,
                                                            })) || []
                                                        }
                                                        styles={{
                                                            control: (provided) => ({ ...provided, paddingLeft: 6 }),
                                                        }}
                                                        onChange={(selectedOption) => {
                                                            handleInputChange2(index, {
                                                                target: {
                                                                    name: `fish[${index}][event_price_id]`,
                                                                    value: selectedOption.value,
                                                                },
                                                            } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>
                                        {errors[`event_price_id_${index}`] && (
                                            <p className="text-red-400">{errors[`event_price_id_${index}`]}</p>
                                        )}
                                    </div>
                                    {/* Nama Ikan */}
                                    <div>
                                        <label htmlFor={`fish_name_${index}`}>Nama ikan</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id={`fish_name_${index}`}
                                                name={`fish[${index}][fish_name]`}
                                                type="text"
                                                onChange={(e) => handleInputChange2(index, e)}
                                                className="form-input2 placeholder:text-white-dark"
                                            />
                                            {errors[`fish_name_${index}`] && (
                                                <p className="text-red-400">{errors[`fish_name_${index}`]}</p>
                                            )}
                                        </div>
                                    </div>
                                    {/* Ukuran Panjang Ikan */}
                                    <div>
                                        <label htmlFor={`fish_size_${index}`}>Ukuran panjang ikan</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id={`fish_size_${index}`}
                                                name={`fish[${index}][fish_size]`}
                                                type="number"
                                                maxLength={100}
                                                min={1}
                                                placeholder="Satuan centimeter"
                                                onChange={(e) => handleInputChange2(index, e)}
                                                className="form-input2 relative pr-10 placeholder:text-white-dark"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 transform text-black">
                                                centimeter
                                            </span>
                                            {errors[`fish_size_${index}`] && (
                                                <p className="absolute left-0 top-full mt-1 text-red-400">
                                                    {errors[`fish_size_${index}`]}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex w-full flex-col">
                                <button
                                    disabled={isLoading}
                                    type="button"
                                    className="btn2 btn-gradient3 !mt-2 w-fit self-center border-0 py-1.5 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] md:w-[40%]"
                                    onClick={handleAddFish}
                                >
                                    Tambahkan ikan lain
                                </button>
                                <div className="flex w-full items-center justify-between">
                                    <button
                                        disabled={isLoading}
                                        type="button"
                                        onClick={handleBack}
                                        className="btn2 btn-gradient2 !mt-16 w-fit border-0 py-1.5 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                                    >
                                        <ArrowLeft />
                                        &nbsp; Kembali
                                    </button>
                                    <button
                                        disabled={isLoading}
                                        type="button"
                                        className="btn btn-gradient !mt-16 w-fit border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] md:w-[50%]"
                                        onClick={handleOpenModal2}
                                    >
                                        {isLoading ? 'Sedang diproses...' : 'Daftarkan ikan'}
                                    </button>
                                </div>
                            </div>
                            <ConfirmationModal
                                open={open2}
                                setOpen={setOpen2}
                                title="Konfirmasi Data"
                                mainText="Apakah sudah yakin semua data ikan sudah benar ?"
                                subText="(Akan dilanjutkan ke proses pembayaran setelah tombol 'YA' dipilih)"
                                isLoading={isLoading}
                                state={state2?.message}
                                cancelButton="Cek Lagi"
                                confirmButton={isLoading ? 'Sedang diproses' : 'Ya'}
                                handleConfirm={handleConfirm2}
                            />
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default FishRegistrationForm;
