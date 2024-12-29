import React from 'react'

import { H1, H2 } from '@/components/ui/typography'

type Props = {
    title: string
    subtitle: string
}

const Head: React.FC<Props> = ({title, subtitle}: Props) => {
  return (
    <div className="flex flex-col items-center justify-center pt-2 md:p-2 mb-4 text-center">
    <H1 className="w-full break-words text-primary">{title}</H1>
    <H2 className="mt-3 md:mt-5 w-full break-words">{subtitle}</H2>
</div>

  )
}

export {Head}
