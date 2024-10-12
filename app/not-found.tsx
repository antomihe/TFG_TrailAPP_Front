import React from "react"
import { NotFound } from "@/components/pages"
import { Header, Footer } from "@/components/layout"

export default function NotFoundPage() {



  return (
    <>
      <div className="container h-screen mx-auto flex flex-col px-4 md:px-6 lg:px-8">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <NotFound />
        </div>
        <Footer />
      </div>
    </>
  )
}
