'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { fishRegisterSubmit } from '@/lib/form-actions';
import { useFormState } from 'react-dom';
import { formFishRegistrationSchema } from '@/lib/form-schemas';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '@/store';
import { storeUser } from '@/utils/store-user';
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
import IconX from '../icon/icon-x';
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
    const [open, setOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

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

    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, value } = event.target;
        const updatedFishForms = [...fishForms];

        if (type === 'number') {
            const numericValue = Number(value);
            if (numericValue > 99) {
                // If the numeric value exceeds 99, update it to 99 and set an error
                event.target.value = '99';
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [`fish_size_${index}`]: 'Ukuran tidak boleh lebih dari 99 cm',
                }));
                return;
            }
        }

        // Update the specific fish form in the array based on the index
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

    const handleValidation = (formData: FormData): boolean => {
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

    const handleOpenModal = () => {
        const formElement = formRef.current;
        if (formElement) {
            const formData = new FormData(formElement);
            const isValid = handleValidation(formData);
            if (isValid) {
                setOpen(true);
            }
        }
    };

    const { control } = useForm();
    const [state, formAction] = useFormState(
        fishRegisterSubmit.bind(null, { user: user, eventId: params.eventId }),
        null
    );

    const handleConfirm = () => {
        setLoading(true);
        formRef.current?.dispatchEvent(new Event('submit', { bubbles: true }));
    };

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);

        const validFormData = new FormData();
        for (let i = 0; i < totalFish; i++) {
            validFormData.append(`fish[${i}][event_price_id]`, formData.get(`fish[${i}][event_price_id]`) as string);
            validFormData.append(`fish[${i}][fish_size]`, formData.get(`fish[${i}][fish_size]`) as string);
            validFormData.append(`fish[${i}][fish_name]`, formData.get(`fish[${i}][fish_name]`) as string);
        }

        formAction(validFormData);
    };

    useEffect(() => {
        if (state?.message === 'Ikan berhasil didaftarkan') {
            setLoading(false);
            showMessage(state.message + '. Silahkan menyelesaikan pembayaran');
            setTimeout(() => {
                window.location.href = state.data;
            }, 3000);
        } else if (state?.message === 'Gagal mendaftarkan ikan') {
            setLoading(false);
            showMessage(state.message, 'error');
        }
    }, [state?.data, state?.message]);

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
                            <p className="text-base font-bold leading-normal text-dark dark:text-white ">Isi Alamat</p>
                            <form action="">
                                <div>
                                    <label htmlFor="fish_name">Alamat</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="user_address"
                                            name="user_address"
                                            type="text"
                                            defaultValue={user?.user_address}
                                            onChange={handleInputChange}
                                            className="form-input2 placeholder:text-white-dark"
                                        />
                                        {errors.user_address && <p className="text-red-400">{errors.user_address}</p>}
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                    {/* {step === 2 && ()} */}
                    <form className="dark:text-white" action={handleSubmit} ref={formRef}>
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
                                                            label: `${price.event_price_name} (Biaya: ${formatToRupiah(
                                                                price.event_price_amount
                                                            )})`,
                                                        })) || []
                                                    }
                                                    styles={{
                                                        control: (provided) => ({ ...provided, paddingLeft: 6 }),
                                                    }}
                                                    onChange={(selectedOption) => {
                                                        handleInputChange(index, {
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
                                            onChange={(e) => handleInputChange(index, e)}
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
                                            onChange={(e) => handleInputChange(index, e)}
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
                                    onClick={handleOpenModal}
                                >
                                    {isLoading ? 'Sedang diproses...' : 'Daftarkan ikan'}
                                </button>
                            </div>
                        </div>
                        <ConfirmationModal
                            open={open}
                            setOpen={setOpen}
                            title="Konfirmasi Data"
                            mainText="Apakah sudah yakin semua data ikan sudah benar ?"
                            subText="(Akan dilanjutkan ke proses pembayaran setelah tombol 'YA' dipilih)"
                            isLoading={isLoading}
                            state={state?.message}
                            cancelButton="Cek Lagi"
                            confirmButton={isLoading ? 'Sedang diproses' : 'Ya'}
                            handleConfirm={handleConfirm}
                        />
                    </form>
                </div>
            )}
        </div>
    );
};

export default FishRegistrationForm;
