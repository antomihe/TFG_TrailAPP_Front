import { YearComponent } from '@/components/ui/yearComponent';

export const Footer = () => {
    return (
        <footer className="flex h-20 w-full shrink-0 items-center justify-center px-4 md:px-6">
            <p className="text-sm font-semibold">© <YearComponent /> - TRAILAPP</p>
        </footer>
    )
}
