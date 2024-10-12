import { Head } from '@/components/layout'

import OfficialValidationList from './components/OfficialValidationList'


export default function ValidateOfficialPage() {
  return (
    <>
      <Head title="Jueces" subtitle="Validación de nuevos jueces" />

      <OfficialValidationList />

    </>
  )
}

