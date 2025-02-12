'use client';

import { getFishDetailApi, updateFishNameApi } from '@/api/fish/api-fish';
import { formatToRupiah } from '@/utils/curency-format';
import { formatedDate } from '@/utils/date-format';
import { useCookies } from 'next-client-cookies';
import { startTransition, useActionState, useCallback, useEffect, useRef, useState } from 'react';
import { InstagramEmbed } from 'react-social-media-embed';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { updateFishUrlSubmit } from '@/lib/form-actions';
import { formLinkSubmitSchema } from '@/lib/form-schemas';
import { getOneEventDetail } from '@/api/event-reg/api-event';
import SpinnerWithText from '@/components/UI/Spinner';
import IconCopy from '@/components/icon/icon-copy';
import IconOpenBook from '@/components/icon/icon-open-book';
import IconCancel from '@/components/icon/icon-cancel';
import IconSubmit from '@/components/icon/icon-submit';
import IconEdit from '@/components/icon/icon-edit';
import IconVisit from '@/components/icon/icon-visit';
import IconX from '@/components/icon/icon-x';
import { Spinner } from '@/components/UI/Spinner/spinner';
import IconChecks from '@/components/icon/icon-checks';

const FishDetailAdminComponent = ({ params }: { params: { fish_id: string } }) => {
    const [fishData, setFishData] = useState<FishDetailType | null>(null);
    const [submitPhase, setSubmitPhase] = useState('');
    const [isFetching, setFetching] = useState(false);
    const cookies = useCookies();
    const authCookie = cookies.get('token');
    const [open, setOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [editMode, setEditMode] = useState(false);
    const [editNameMode, setEditNameMode] = useState(false);
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

    const fishNameForm = useForm({
        defaultValues: {
            fish_name: fishData?.fish_name || '',
        },
    });

    const {
        register: registerFishName,
        handleSubmit: handleSubmitFishName,
        reset: resetFishName,
        formState: { isDirty: isDirtyFishName },
    } = fishNameForm;

    const onSubmitFishName = async (data: { fish_name: string }) => {
        setLoading(true);
        try {
            const response = await updateFishNameApi(params.fish_id, data.fish_name, authCookie);
            if (response.success) {
                showMessage('Berhasil memperbarui nama ikan', 'success');
                resetFishName();
                setEditNameMode(false);
                resetFishName({
                    fish_name: response.data[0].fish_name,
                });
            }
        } catch (error: any) {
            showMessage(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

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
        resetFishName({
            fish_name: fishData?.fish_name || '',
        });
        FetchFishDetail();
    }, [FetchFishDetail, fishData?.fish_submission_link, reset]);

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

    const isValidInstagramUrl = (url: string | null | undefined) => {
        const regex = /^https:\/\/www\.instagram\.com\/p\/[\w-]+(\/.*)?(\?[\w&%=+-]*)?$/;
        return url && regex.test(url);
    };

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
    }, [FetchFishDetail, fishData?.fish_submission_link, reset, state]);

    return (
        <>
            {isFetching ? (
                <div className="flex min-h-[600px] min-w-[320px] flex-col items-center justify-center ">
                    <SpinnerWithText text="Memuat..." />
                </div>
            ) : (
                <div className="space-y-4 py-8 pb-0">
                    {fishData && (
                        <>
                            <div className="rounded-md">
                                <div className="flex flex-col gap-1">
                                    <form
                                        onSubmit={handleSubmitFishName(onSubmitFishName)}
                                        className="flex h-full w-full items-center justify-center pl-4"
                                    >
                                        <div className="mx-auto grid w-[320px] grid-cols-[2fr_auto_2fr] gap-6 sm:w-[400px]">
                                            <label className="text-nowrap text-sm font-medium" htmlFor="fish_name">
                                                Nama Ikan
                                            </label>
                                            <div className="flex w-full gap-2">
                                                <input
                                                    id="fish_name"
                                                    className="form-input -mt-0.5 h-6 rounded-md bg-white-light ps-2 capitalize text-dark dark:bg-white"
                                                    {...registerFishName('fish_name', {
                                                        onChange: (event) => {
                                                            handleInputChange(event);
                                                        },
                                                    })}
                                                    readOnly={!editNameMode}
                                                    disabled={!editNameMode}
                                                />
                                                {!editNameMode ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditNameMode(true)}
                                                        className="group relative"
                                                    >
                                                        <div
                                                            className="-mt-1 flex rounded-md border-white bg-white p-1 text-sm
                                                            text-black hover:bg-dark-light active:scale-90 dark:bg-white dark:text-black dark:hover:bg-white-dark"
                                                        >
                                                            <IconEdit />
                                                        </div>
                                                        <span className="absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 transform rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                            Ubah
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditNameMode(false)}
                                                            className="group relative"
                                                        >
                                                            <div className="btn2 -mt-1 flex items-center justify-center gap-1 text-nowrap rounded-md border-none bg-danger p-0.5 text-sm text-white hover:bg-red-400 active:scale-90">
                                                                <IconX />
                                                            </div>
                                                            <span className="absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 transform rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                                Batal
                                                            </span>
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={!isDirtyFishName || isLoading}
                                                            className="group relative"
                                                        >
                                                            <div
                                                                className={`btn-gradient2 -mt-1 flex items-center justify-center gap-1 text-nowrap rounded-md border-none p-0.5 text-sm text-white ${
                                                                    !isDirtyFishName || isLoading
                                                                        ? 'cursor-not-allowed bg-gray-500 hover:bg-gray-500 active:scale-100'
                                                                        : ''
                                                                }`}
                                                            >
                                                                {isLoading ? (
                                                                    <div className="flex h-6 w-6 justify-center">
                                                                        <Spinner className="w-4" />
                                                                    </div>
                                                                ) : (
                                                                    <IconChecks />
                                                                )}
                                                            </div>
                                                            <span className="absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 transform rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                                Simpan
                                                            </span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </form>
                                    {[
                                        { label: 'Ukuran Ikan', value: `${fishData?.fish_size} cm` },
                                        { label: 'Kategori Ikan', value: fishData?.event_price_name },
                                        { label: 'Nama Event', value: fishData?.event_name },
                                        {
                                            label: 'Biaya Pendaftaran',
                                            value: formatToRupiah(fishData?.event_price_amount),
                                        },
                                        {
                                            label: 'Tanggal Terdaftar',
                                            value: formatedDate(fishData?.fish_created_date),
                                        },
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex h-full w-full items-center justify-center pl-4"
                                        >
                                            <div className="grid w-[320px] grid-cols-[3fr_auto_2fr] gap-6 sm:w-[400px]">
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
                                                                className={`border-1.5 flex gap-1 rounded-md border-white bg-white p-1 text-sm text-black hover:bg-dark-light active:scale-90 dark:bg-dark-dark-light dark:text-white dark:hover:bg-white-dark ${
                                                                    editMode
                                                                        ? 'cursor-not-allowed active:scale-100'
                                                                        : ''
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
                                            </div>
                                        </div>
                                    </form>
                                    <div className="mt-2 flex w-full items-center justify-center gap-2">
                                        {!fishData?.fish_submission_link && !editMode && (
                                            <>
                                                {submitPhase !== 'content_upload_phase' ? (
                                                    <button
                                                        type="button"
                                                        disabled={isLoading}
                                                        onClick={handleSubmitPhaseFalse}
                                                    >
                                                        <div className=" border-1.5 flex w-fit gap-1 text-nowrap rounded-md border-white bg-secondary px-2 py-1 text-sm text-white hover:bg-secondary/60 active:scale-90">
                                                            <IconOpenBook /> Masukan Link
                                                        </div>
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        disabled={isLoading}
                                                        onClick={() => handleEdit(true)}
                                                    >
                                                        <div className=" border-1.5 flex w-fit gap-1 text-nowrap rounded-md border-white bg-secondary px-2 py-1 text-sm text-white hover:bg-secondary/60 active:scale-90">
                                                            <IconOpenBook /> Masukan Link
                                                        </div>
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        {editMode && (
                                            <div className="flex w-full items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    disabled={isLoading}
                                                    onClick={() => handleEdit(false)}
                                                >
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
                                            <div className="mt-2 flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        window.open(fishData.fish_submission_link!, '_blank');
                                                    }}
                                                >
                                                    <div className="border-1.5 flex gap-1 rounded-md border-white bg-info p-1 pr-2 text-sm text-white hover:bg-cyan-400 active:scale-90">
                                                        <IconVisit /> Kunjungi
                                                    </div>
                                                </button>
                                                {submitPhase !== 'content_upload_phase' ? (
                                                    <button
                                                        type="button"
                                                        disabled={isLoading}
                                                        onClick={handleSubmitPhaseFalse}
                                                    >
                                                        <div className="border-1.5 flex gap-1 rounded-md border-white bg-success p-1 pr-2 text-sm text-white hover:bg-green-400 active:scale-90">
                                                            <IconEdit /> Ubah
                                                        </div>
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleEdit(true)}>
                                                        <div className="border-1.5 flex gap-1 rounded-md border-white bg-success p-1 pr-2 text-sm text-white hover:bg-green-400 active:scale-90">
                                                            <IconEdit /> Ubah
                                                        </div>
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {!isValidInstagramUrl(fishData?.fish_submission_link) || !fishData?.fish_submission_link ? (
                                <div className="mb-2 flex h-full min-h-[400px] w-full items-center justify-center rounded border border-white-light dark:border-white-dark">
                                    <p>Link Instagram invalid / privacy not public</p>
                                </div>
                            ) : (
                                <div className="-mr-0.5 rounded-md">
                                    <div className="flex justify-center">
                                        <InstagramEmbed url={fishData?.fish_submission_link || ''} width="100%" />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default FishDetailAdminComponent;
