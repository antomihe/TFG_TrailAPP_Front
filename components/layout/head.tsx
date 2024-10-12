import React from 'react'

import { H1, H2 } from '@/components/ui/typography'

type Props = {
    title: string
    subtitle: string
}

const Head: React.FC<Props> = ({title, subtitle}: Props) => {
  return (
    <div className="flex flex-col items-center justify-center p-2 mb-4">
        <H1 className='text-center'>{title}</H1>
        <H2 className="mt-5">{subtitle}</H2>
    </div>
  )
}

export {Head}
