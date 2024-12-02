'use client';

import { getFishDetailApi, updateFishUrlApi } from '@/api/api-fish';
import { IRootState } from '@/store';
import { formatToRupiah } from '@/utils/curency-format';
import { formatedDate } from '@/utils/date-format';
import { useCookies } from 'next-client-cookies';
import { useRouter } from 'next/navigation';
import { startTransition, useActionState, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InstagramEmbed } from 'react-social-media-embed';
import IconCopy from '../icon/icon-copy';
import IconEdit from '../icon/icon-edit';
import IconOpenBook from '../icon/icon-open-book';
import IconVisit from '../icon/icon-visit';
import Swal from 'sweetalert2';
import IconCancel from '../icon/icon-cancel';
import { useForm } from 'react-hook-form';
import { updateFishUrlSubmit } from '@/lib/form-actions';
import IconSubmit from '../icon/icon-submit';
import ConfirmationModal from '../components/confirmation-modal';
import { formLinkSubmitSchema } from '@/lib/form-schemas';
import { getOneEventDetail } from '@/api/api-event';
import SpinnerWithText from '../UI/Spinner';

const FishDetailComponent = ({ params }: { params: { fish_id: string } }) => {
    const [fishData, setFishData] = useState<FishDetailType | null>(null);
    const [submitPhase, setSubmitPhase] = useState('');
    const [loadTime, setLoadTime] = useState(8);
    const [isFetching, setFetching] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const user = useSelector((state: IRootState) => state.auth.user);
    const [open, setOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
    const form = useForm({
        defaultValues: {
            fish_submission_link: fishData?.fish_submission_link,
        },
    });
    const {
        formState: { isDirty },
        register,
        reset,
        setValue,
    } = form;
    const [state, formAction] = useActionState(updateFishUrlSubmit.bind(null, params.fish_id), null);

    const FetchFishDetail = useCallback(async () => {
        setFetching(true);
        try {
            const fishDetail = await getFishDetailApi(params.fish_id, authCookie);
            const eventPhase = await getOneEventDetail(authCookie, fishDetail.data[0].event_id);
            if (fishDetail) {
                setFishData(fishDetail.data[0]);
                if (eventPhase.data[0].event_reg_phase_code) {
                    setSubmitPhase(eventPhase.data[0].event_reg_phase_code);
                    setFetching(false);
                }
            }
        } catch (error) {
            setFetching(false);
        }
    }, [authCookie, params.fish_id]);

    useEffect(() => {
        reset({
            fish_submission_link: fishData?.fish_submission_link,
        });
        FetchFishDetail();
    }, [FetchFishDetail, fishData?.fish_submission_link, reset]);

    useEffect(() => {
        const timer = setInterval(() => {
            setLoadTime((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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

    const handleEdit = (state: boolean) => {
        setEditMode(state);
        if (state == false) {
            reset({
                fish_submission_link: fishData?.fish_submission_link,
            });
            setErrors((prevErrors: any) => ({
                ...prevErrors,
                ['fish_submission_link']: undefined,
            }));
        }
    };

    useEffect(() => {
        if (editMode) {
            const inputElement = document.getElementById('fish_submission_link') as HTMLInputElement;
            if (inputElement) {
                inputElement.focus();
            }
        }
    }, [editMode]);

    const handleCopy = async () => {
        if (navigator.clipboard && fishData?.fish_submission_link) {
            await navigator.clipboard.writeText(fishData?.fish_submission_link);
            showMessage('Berhasil disalin!');
        }
    };

    const handleSubmitPhaseFalse = async () => {
        const msg =
            submitPhase === 'open_phase'
                ? 'Fase pengumpulan Link post instagram belum dibuka'
                : 'Fase pengumpulan Link post instagram sudah ditutup';
        showMessage(msg, 'info');
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setValue(name as any, value);
        setErrors((prevErrors: any) => ({
            ...prevErrors,
            [name]: undefined,
        }));
    };

    const handleValidation = async (formData: FormData) => {
        const formValues = {
            fish_submission_link: formData.get('fish_submission_link'),
        };
        const validationResult = formLinkSubmitSchema.safeParse(formValues);

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

    const handleOpenModal = async () => {
        const formElement = formRef.current;
        if (formElement) {
            const formData = new FormData(formElement);
            const isValid = await handleValidation(formData);
            if (isValid && isDirty) {
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
        const formValues = new FormData();
        formData.forEach((value, key) => {
            formValues.append(key, value);
        });

        setErrors({});
        startTransition(() => {
            formAction(formValues);
        });
    };

    useEffect(() => {
        if (state?.message === 'Data berhasil diperbarui') {
            showMessage(state.message);
            setTimeout(() => {
                setLoading(false);
                setEditMode(false);
            }, 2000);
            FetchFishDetail();
        } else if (state?.message === 'Gagal memperbarui data') {
            reset({
                fish_submission_link: fishData?.fish_submission_link,
            });
            setLoading(false);
            showMessage(state?.message, 'error');
        }
    }, [FetchFishDetail, fishData?.fish_submission_link, reset, state?.message]);

    const errorLoadMessage = loadTime === 0 ? 'Cek kembali Link post instagram anda' : 'loading...';

    return (
        <div className="space-y-4 py-8">
            {isFetching ? (
                <div className="flex min-h-[600px] min-w-[320px] flex-col items-center justify-center ">
                    <SpinnerWithText text="Memuat..." />
                </div>
            ) : (
                <>
                    <div className="rounded-md">
                        <div className="flex flex-col gap-1">
                            {[
                                { label: 'Nama Ikan', value: fishData?.fish_name },
                                { label: 'Ukuran Ikan', value: `${fishData?.fish_size} cm` },
                                { label: 'Kategori Ikan', value: fishData?.event_price_name },
                                { label: 'Nama Event', value: fishData?.event_name },
                                { label: 'Biaya Pendaftaran', value: formatToRupiah(fishData?.event_price_amount) },
                                { label: 'Tanggal Terdaftar', value: formatedDate(fishData?.fish_created_date) },
                            ].map((item, index) => (
                                <div key={index} className="flex h-full w-full items-center justify-center pl-4">
                                    <div className="grid w-[320px] grid-cols-[3fr_auto_2fr] gap-6">
                                        <p className="capitalize">{item.label}</p>
                                        <p className="-ml-4 mr-2 text-center">:</p>
                                        <p className="capitalize">
                                            {item.value?.includes('cm') ? (
                                                <>
                                                    {item.value.replace(' cm', '')}{' '}
                                                    <span className="normal-case">cm</span>
                                                </>
                                            ) : (
                                                item.value
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mx-auto flex w-11/12 flex-col gap-1 rounded-md bg-white-light p-4 dark:bg-white-dark/20 sm:w-[70%]">
                        <label htmlFor="fish_submission_link" className="mx-auto">
                            Link post instagram :
                        </label>
                        <div className="flex flex-col">
                            <form action={handleSubmit} ref={formRef}>
                                <div className="flex w-full flex-col items-center justify-center gap-2">
                                    <div className="w-full">
                                        <div className="flex gap-1">
                                            <input
                                                className="w-full rounded-md border-none bg-white p-1 px-2 dark:bg-dark dark:text-white-light"
                                                type="text"
                                                id="fish_submission_link"
                                                {...register('fish_submission_link', {
                                                    onChange: (event) => {
                                                        handleInputChange(event);
                                                    },
                                                })}
                                                readOnly={!editMode}
                                                disabled={!editMode}
                                            />
                                            {fishData?.fish_submission_link && (
                                                <button type="button" onClick={handleCopy} disabled={editMode}>
                                                    <div
                                                        className={`border-1.5 flex gap-1 rounded-md border-white bg-dark-dark-light p-1 text-sm text-black hover:bg-dark-light active:scale-90 dark:text-white dark:hover:bg-white-dark ${
                                                            editMode ? 'cursor-not-allowed active:scale-100' : ''
                                                        }`}
                                                    >
                                                        <IconCopy />
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                        {errors.fish_submission_link && (
                                            <p className="ml-2 text-red-500">{errors.fish_submission_link}</p>
                                        )}
                                        <p className="ml-2 pt-0.5 text-xs">Pastikan Link bisa diakses publik</p>
                                    </div>
                                </div>
                                <ConfirmationModal
                                    open={open}
                                    setOpen={setOpen}
                                    title="Konfirmasi Data"
                                    mainText="Apakah sudah yakin Link sudah sudah benar ?"
                                    isLoading={isLoading}
                                    state={state?.message}
                                    cancelButton="Cek Lagi"
                                    confirmButton={isLoading ? 'Sedang diproses' : 'Ya'}
                                    handleConfirm={handleConfirm}
                                />
                            </form>
                            <div className="flex w-full items-center justify-center gap-2">
                                {!fishData?.fish_submission_link && !editMode && (
                                    <>
                                        {submitPhase !== 'content_upload_phase' ? (
                                            <button type="button" disabled={isLoading} onClick={handleSubmitPhaseFalse}>
                                                <div className=" border-1.5 flex w-fit gap-1 text-nowrap rounded-md border-white bg-success px-2 py-1 text-sm text-white hover:bg-green-400 active:scale-90">
                                                    <IconOpenBook /> Masukan Link
                                                </div>
                                            </button>
                                        ) : (
                                            <button type="button" disabled={isLoading} onClick={() => handleEdit(true)}>
                                                <div className=" border-1.5 flex w-fit gap-1 text-nowrap rounded-md border-white bg-success px-2 py-1 text-sm text-white hover:bg-green-400 active:scale-90">
                                                    <IconOpenBook /> Masukan Link
                                                </div>
                                            </button>
                                        )}
                                    </>
                                )}
                                {editMode && (
                                    <div className="flex w-full items-center justify-center gap-2">
                                        <button type="button" disabled={isLoading} onClick={() => handleEdit(false)}>
                                            <div className="btn2 flex items-center justify-center gap-1 text-nowrap rounded-md border-none bg-danger px-2 py-1 text-sm text-white hover:bg-red-400 active:scale-90">
                                                <IconCancel /> Batal
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleOpenModal}
                                            disabled={isLoading || !isDirty}
                                        >
                                            <div
                                                className={`btn-gradient2 flex items-center justify-center gap-1 text-nowrap rounded-md border-none px-2 py-1 text-sm text-white ${
                                                    isLoading || !isDirty
                                                        ? 'cursor-not-allowed bg-gray-500 hover:bg-gray-500 active:scale-100'
                                                        : ''
                                                }`}
                                            >
                                                <IconSubmit />
                                                {isLoading ? 'Memproses...' : 'Submit'}
                                            </div>
                                        </button>
                                    </div>
                                )}
                                {fishData?.fish_submission_link && !editMode && (
                                    <>
                                        <button onClick={handleCopy}>
                                            <div className="border-1.5 flex gap-1 rounded-md border-white bg-info p-1 pr-2 text-sm text-white hover:bg-cyan-400 active:scale-90">
                                                <IconVisit /> Kunjungi
                                            </div>
                                        </button>
                                        <button onClick={() => handleEdit(true)}>
                                            <div className="border-1.5 flex gap-1 rounded-md border-white bg-success p-1 pr-2 text-sm text-white hover:bg-green-400 active:scale-90">
                                                <IconEdit /> Ubah
                                            </div>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    {fishData?.fish_submission_link && (
                        <div className="-mr-0.5 rounded-md">
                            <div className="flex justify-center">
                                <InstagramEmbed
                                    url={fishData?.fish_submission_link || ''}
                                    width="100%"
                                    captioned
                                    linkText={errorLoadMessage}
                                    placeholderSpinnerDisabled={loadTime === 0}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FishDetailComponent;
