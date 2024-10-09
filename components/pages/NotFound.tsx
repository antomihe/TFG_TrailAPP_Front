import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        <div className="max-w-lg mx-auto mt-4">
          <Image src="/404.png" alt="404" width={500} height={500} />
        </div>
        <p className="text-2xl md:text-3xl font-light leading-normal mt-5">
          Lo sentimos, no hemos encontrar la página que buscas.
        </p>

        <Link href="/" passHref>
          <Button className='mt-5 w-52'>IR AL INICIO</Button>
        </Link>
        
      </div>
    </div>
  );
}

export { NotFound };
