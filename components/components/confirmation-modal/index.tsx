import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader } from '@/components/UI/Modal';

interface ConfirmationModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    mainText: string;
    subText?: string;
    isLoading: boolean;
    cancelButton: string;
    confirmButton: string;
    handleConfirm: () => void;
}

const ConfirmationModal = ({
    open,
    setOpen,
    title,
    mainText,
    subText,
    isLoading,
    cancelButton,
    confirmButton,
    handleConfirm,
}: ConfirmationModalProps) => {
    return (
        <div>
            <Dialog open={open}>
                <DialogContent className={'min-h-[250px] max-w-[370px] bg-white dark:bg-dark sm:max-w-[550px]'}>
                    <DialogHeader className="self-start text-xl font-extrabold uppercase text-black dark:text-white md:text-2xl">
                        {title}
                    </DialogHeader>
                    <div className="flex flex-col items-start justify-around">
                        <p className="dark:text-shadow-dark-mode text-base font-extrabold !leading-snug text-dark dark:text-secondary-light md:text-lg">
                            {mainText}
                        </p>
                        {subText && (
                            <p className="text-sm font-thin text-dark dark:text-secondary-light md:text-base">
                                {subText}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <div className="flex justify-center gap-6">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="btn2 btn-gradient2 shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                            >
                                {cancelButton}
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isLoading}
                                type="submit"
                                className="btn2 btn-gradient3 !px-6 shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                            >
                                {confirmButton}
                            </button>
                        </div>
                    </DialogFooter>
                </DialogContent>
                <DialogClose></DialogClose>
            </Dialog>
        </div>
    );
};

export default ConfirmationModal;
