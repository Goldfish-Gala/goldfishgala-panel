'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactSelect from 'react-select';
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

const FishRegistrationForm = ({ params }: { params: { eventId: string } }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const user = useSelector((state: IRootState) => state.auth.user);
    const [eventPrices, setEventPrices] = useState<EventPrice[] | null>(null);
    const [fishTypeId, setFishTypeId] = useState('');
    const [fishImageUrls, setFishImageUrls] = useState<{ [key: string]: string }>({});
    const [imgObjectURLs, setImgObjectURLs] = useState<{ [key: string]: string | null }>({});
    const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});
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

    const fetchFishType = useCallback(
        async (code: string) => {
            setFetching(true);
            try {
                const response = await getFishTypeApi(code, authCookie);
                if (response.success) {
                    setFishTypeId(response.data[0].fish_type_id);
                    setFetching(false);
                }
            } catch (error) {
                setFetching(false);
            }
        },
        [authCookie]
    );

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

    const { control } = useForm();
    const [state, formAction] = useFormState(
        fishRegisterSubmit.bind(null, { user: user, eventId: params.eventId }),
        null
    );

    const handleNext = async (id: string) => {
        await fetchFishType(id);
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name } = event.target;
        setErrors((prevErrors: any) => ({
            ...prevErrors,
            [name]: undefined,
        }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const file = event.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setImgObjectURLs((prev) => ({
                ...prev,
                [key]: objectUrl,
            }));
        }
    };

    const handleUpload = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, key: string) => {
        event.preventDefault();
        setIsUploading((prev) => ({
            ...prev,
            [key]: true,
        }));

        const fileInput = document.getElementById(key) as HTMLInputElement;
        const file = fileInput?.files?.[0];

        if (!file) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [key]: 'Pilih ulang image',
            }));
            setIsUploading((prev) => ({
                ...prev,
                [key]: false,
            }));
            return;
        }

        const maxFileSize = 2 * 1024 * 1024;
        if (file.size > maxFileSize) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [key]: 'File size exceeds 2MB',
            }));
            setIsUploading((prev) => ({
                ...prev,
                [key]: false,
            }));
            return;
        }

        try {
            const response = await fishImageApi(file, authCookie);
            console.log('fish image', response.data);
            if (response.success) {
                setFishImageUrls((prev) => ({
                    ...prev,
                    [key]: response.data,
                }));
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [key]: undefined,
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [key]: 'Gagal mengunggah',
                }));
            }
        } catch (error) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [key]: 'An error occurred during upload',
            }));
        } finally {
            setIsUploading((prev) => ({
                ...prev,
                [key]: false,
            }));
        }
    };

    const handleValidation = (formData: FormData): boolean => {
        const formValues = {
            fish_type_id: fishTypeId,
            fish_size: formData.get('fish_size'),
            fish_name: formData.get('fish_name'),
            fish_gender: formData.get('fish_gender'),
            fish_desc: formData.get('fish_desc'),
            fish_image1: fishImageUrls['fish_image1'] || '',
            fish_image2: fishImageUrls['fish_image2'] || '',
            fish_image3: fishImageUrls['fish_image3'] || '',
            fish_video_url: formData.get('fish_video_url'),
        };

        const validationResult = formFishRegistrationSchema.safeParse(formValues);

        if (!validationResult.success) {
            const newErrors: { [key: string]: string } = {};
            validationResult.error.errors.forEach((error) => {
                newErrors[error.path[0]] = error.message;
            });

            setErrors(newErrors);
            return false;
        }

        setErrors({});
        return true;
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

    const handleConfirm = () => {
        setLoading(true);
        formRef.current?.dispatchEvent(new Event('submit', { bubbles: true }));
    };

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        const formValues = {
            fish_type_id: fishTypeId,
            fish_size: formData.get('fish_size'),
            fish_name: formData.get('fish_name'),
            fish_gender: formData.get('fish_gender'),
            fish_desc: formData.get('fish_desc'),
            fish_image1: fishImageUrls['fish_image1'] || '',
            fish_image2: fishImageUrls['fish_image2'] || '',
            fish_image3: fishImageUrls['fish_image3'] || '',
            fish_video_url: formData.get('fish_video_url'),
        };

        const validFormData = new FormData();
        Object.entries(formValues).forEach(([key, value]) => {
            validFormData.append(key, value as string);
        });

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
                <form className="dark:text-white" action={handleSubmit} ref={formRef}>
                    {step === 1 && (
                        <div className="flex min-h-[300px] w-full flex-col justify-center gap-4">
                            <p className="text-base font-bold leading-normal text-dark dark:text-white ">
                                Pilih kategori ukuran ikan, biaya pendaftaran tertera
                            </p>
                            {eventPrices?.map((event) => (
                                <button
                                    className="btn-gradient2 rounded-md py-4"
                                    type="button"
                                    key={event.event_price_id}
                                    onClick={() => handleNext(event.event_price_code)}
                                >
                                    {event.event_price_name}&nbsp;(Biaya : {formatToRupiah(event.event_price_amount)})
                                </button>
                            ))}
                        </div>
                    )}
                    {step === 2 && (
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="fish_size">Ukuran panjang ikan</label>
                                <div className="relative text-white-dark">
                                    <input
                                        id="fish_size"
                                        name="fish_size"
                                        type="text"
                                        placeholder="Satuan centimeter"
                                        onChange={handleInputChange}
                                        className="form-input2 placeholder:text-white-dark"
                                    />
                                    {errors.fish_size && <p className="text-red-400">{errors.fish_size}</p>}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="fish_name">Nama ikan</label>
                                <div className="relative text-white-dark">
                                    <input
                                        id="fish_name"
                                        name="fish_name"
                                        type="text"
                                        onChange={handleInputChange}
                                        className="form-input2 placeholder:text-white-dark"
                                    />
                                    {errors.fish_name && <p className="text-red-400">{errors.fish_name}</p>}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="fish_gender">Jenis kelamin</label>
                                <div className="relative text-white-dark">
                                    <Controller
                                        name="fish_gender"
                                        control={control}
                                        render={({ field }) => (
                                            <ReactSelect
                                                isClearable
                                                isSearchable={false}
                                                {...field}
                                                placeholder={'Pilih jenis kelamin ikan'}
                                                options={[
                                                    { value: 'male', label: 'Jantan' },
                                                    { value: 'female', label: 'Betina' },
                                                ]}
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        paddingLeft: 6,
                                                    }),
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                {errors.fish_gender && <p className="text-red-400">{errors.fish_gender}</p>}
                            </div>
                            <div>
                                <label htmlFor="fish_desc">Deskripsi ikan</label>
                                <div className="relative text-white-dark">
                                    <input
                                        id="fish_desc"
                                        name="fish_desc"
                                        type="text"
                                        placeholder="Deskripsikan ikan anda"
                                        onChange={handleInputChange}
                                        className="form-input2 placeholder:text-white-dark"
                                    />
                                    {errors.fish_desc && <p className="text-red-400">{errors.fish_desc}</p>}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="fish_video_url">Link video ikan</label>
                                <div className="relative text-white-dark">
                                    <input
                                        id="fish_video_url"
                                        name="fish_video_url"
                                        type="text"
                                        placeholder="Masukkan URL video dari sosmed dan lainnya"
                                        onChange={handleInputChange}
                                        className="form-input2 placeholder:text-white-dark"
                                    />
                                    {errors.fish_video_url && <p className="text-red-500">{errors.fish_video_url}</p>}
                                </div>
                            </div>
                            <div className="flex justify-start gap-2 md:gap-6">
                                <div>
                                    <label>Foto foto ikan</label>
                                    <Image
                                        src={
                                            imgObjectURLs['fish_image1']
                                                ? imgObjectURLs['fish_image1']
                                                : '/assets/images/no-image.png'
                                        }
                                        className="aspect-square h-32 w-32 rounded-lg bg-gray-300 object-cover"
                                        alt="fish image preview"
                                        width={400}
                                        height={400}
                                    />
                                </div>
                                <label htmlFor="fish_image1"></label>
                                <div className="relative flex items-center text-white-dark">
                                    <input
                                        id="fish_image1"
                                        name="fish_image1"
                                        type="file"
                                        accept="image/png, image/gif, image/jpeg, image/wepb"
                                        onChange={(e) => handleFileChange(e, 'fish_image1')}
                                        className="hidden"
                                    />
                                    <div>
                                        {imgObjectURLs['fish_image1'] && !fishImageUrls['fish_image1'] && (
                                            <div className=" mb-2 text-dark dark:text-white-light">
                                                <p className="font-bold">Anda yakin memilih foto ini?</p>
                                                <p className="text-sm">( Foto akan diunggah )</p>
                                            </div>
                                        )}
                                        {imgObjectURLs['fish_image1'] && fishImageUrls['fish_image1'] && (
                                            <div className="rounded-full bg-success px-3 py-0.5">
                                                <p className="text-white">Berhasil diunggah !</p>
                                            </div>
                                        )}
                                        {!fishImageUrls['fish_image1'] && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    disabled={isUploading['fish_image1']}
                                                    type="button"
                                                    onClick={() => document.getElementById('fish_image1')?.click()}
                                                    className="btn2 btn-gradient2"
                                                >
                                                    {imgObjectURLs['fish_image1'] ? 'Ubah Foto' : 'Pilih Foto'}
                                                </button>
                                                {imgObjectURLs['fish_image1'] && (
                                                    <button
                                                        disabled={isUploading['fish_image1']}
                                                        type="button"
                                                        onClick={(e) => handleUpload(e, 'fish_image1')}
                                                        className="btn2 btn-gradient3 shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                                                    >
                                                        {isUploading['fish_image1'] ? 'Mengunggah...' : 'Yakin'}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        {errors.fish_image1 && (
                                            <p className="mt-1 text-red-500">{errors.fish_image1}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-start gap-2 md:gap-6">
                                <Image
                                    src={
                                        imgObjectURLs['fish_image2']
                                            ? imgObjectURLs['fish_image2']
                                            : '/assets/images/no-image.png'
                                    }
                                    className="aspect-square h-32 w-32 rounded-lg bg-gray-300 object-cover"
                                    alt="fish image preview"
                                    width={400}
                                    height={400}
                                />
                                <label htmlFor="fish_image2"></label>
                                <div className="relative flex items-center text-white-dark">
                                    <input
                                        id="fish_image2"
                                        name="fish_image2"
                                        type="file"
                                        accept="image/png, image/gif, image/jpeg, image/wepb"
                                        onChange={(e) => handleFileChange(e, 'fish_image2')}
                                        className="hidden"
                                    />
                                    <div>
                                        {imgObjectURLs['fish_image2'] && !fishImageUrls['fish_image2'] && (
                                            <div className=" mb-2 text-dark dark:text-white-light">
                                                <p className="font-bold">Anda yakin memilih foto ini?</p>
                                                <p className="text-sm">( Foto akan diunggah )</p>
                                            </div>
                                        )}
                                        {imgObjectURLs['fish_image2'] && fishImageUrls['fish_image2'] && (
                                            <div className="rounded-full bg-success px-3 py-0.5">
                                                <p className="text-white">Berhasil diunggah !</p>
                                            </div>
                                        )}
                                        {!fishImageUrls['fish_image2'] && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    disabled={isUploading['fish_image2']}
                                                    type="button"
                                                    onClick={() => document.getElementById('fish_image2')?.click()}
                                                    className="btn2 btn-gradient2"
                                                >
                                                    {imgObjectURLs['fish_image2'] ? 'Ubah Foto' : 'Pilih Foto'}
                                                </button>
                                                {imgObjectURLs['fish_image2'] && (
                                                    <button
                                                        disabled={isUploading['fish_image2']}
                                                        type="button"
                                                        onClick={(e) => handleUpload(e, 'fish_image2')}
                                                        className="btn2 btn-gradient3 shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                                                    >
                                                        {isUploading['fish_image2'] ? 'Mengunggah...' : 'Yakin'}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        {errors.fish_image2 && (
                                            <p className="mt-1 text-red-500">{errors.fish_image2}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-start gap-2 md:gap-6">
                                <Image
                                    src={
                                        imgObjectURLs['fish_image3']
                                            ? imgObjectURLs['fish_image3']
                                            : '/assets/images/no-image.png'
                                    }
                                    className="aspect-square h-32 w-32 rounded-lg bg-gray-300 object-cover"
                                    alt="fish image preview"
                                    width={400}
                                    height={400}
                                />
                                <label htmlFor="fish_image3"></label>
                                <div className="relative flex items-center text-white-dark">
                                    <input
                                        id="fish_image3"
                                        name="fish_image3"
                                        type="file"
                                        accept="image/png, image/gif, image/jpeg, image/wepb"
                                        onChange={(e) => handleFileChange(e, 'fish_image3')}
                                        className="hidden"
                                    />
                                    <div>
                                        {imgObjectURLs['fish_image3'] && !fishImageUrls['fish_image3'] && (
                                            <div className=" mb-2 text-dark dark:text-white-light">
                                                <p className="font-bold">Anda yakin memilih foto ini?</p>
                                                <p className="text-sm">( Foto akan diunggah )</p>
                                            </div>
                                        )}
                                        {imgObjectURLs['fish_image3'] && fishImageUrls['fish_image3'] && (
                                            <div className="rounded-full bg-success px-3 py-0.5">
                                                <p className="text-white">Berhasil diunggah !</p>
                                            </div>
                                        )}
                                        {!fishImageUrls['fish_image3'] && (
                                            <div className="flex w-full items-center gap-2">
                                                <button
                                                    disabled={isUploading['fish_image3']}
                                                    type="button"
                                                    onClick={() => document.getElementById('fish_image3')?.click()}
                                                    className="btn2 btn-gradient2"
                                                >
                                                    {imgObjectURLs['fish_image3'] ? 'Ubah Foto' : 'Pilih Foto'}
                                                </button>
                                                {imgObjectURLs['fish_image3'] && (
                                                    <button
                                                        disabled={isUploading['fish_image3']}
                                                        type="button"
                                                        onClick={(e) => handleUpload(e, 'fish_image3')}
                                                        className="btn2 btn-gradient3 shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                                                    >
                                                        {isUploading['fish_image3'] ? 'Mengunggah...' : 'Yakin'}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        {errors.fish_image3 && (
                                            <p className="mt-1 text-red-500">{errors.fish_image3}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
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
                                    // onClick={() => setOpen(true)}
                                >
                                    {isLoading ? 'Sedang diproses...' : 'Daftarkan ikan'}
                                </button>
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
                        </div>
                    )}
                </form>
            )}
        </div>
    );
};

export default FishRegistrationForm;
