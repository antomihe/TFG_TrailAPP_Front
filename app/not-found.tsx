import React from "react"
import PageNotFound from "@/components/pages/not-found/PageNotFound"
import { Header, Footer } from "@/components/layout"

export default function NotFound() {



  return (
    <>
      <div className="container h-screen mx-auto flex flex-col px-4 md:px-6 lg:px-8">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <PageNotFound />
        </div>
        <Footer />
      </div>
    </>
  )
}
