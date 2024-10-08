import { Spinner } from '@/components/ui'

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Spinner className="h-12 w-12 text-primary animate-spin" />
            <p className="mt-4 text-lg text-accent dark:text-inherit">Loading...</p>
        </div>
    );
};

export {Loading};
