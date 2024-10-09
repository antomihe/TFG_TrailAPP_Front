import { H1, P } from '@/components/ui'

const Unauthorized = () => {
    return (
        <div className="flex flex-col items-center justify-center grow h-full">
            <H1>No autorizado</H1>
            <P>No tienes acceso a esta página</P>
        </div>
       
    )
}

export { Unauthorized }


