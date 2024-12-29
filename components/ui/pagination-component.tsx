import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";

type Props = {
    currentPage: number;
    totalPages: number;
    className?: string;
    handlePageChange: (page: number) => void;
};

function PaginationComponent({ currentPage, totalPages, handlePageChange, className }: Props) {
    const handlePreviousPage = () => handlePageChange(Math.max(currentPage - 1, 1));
    const handleNextPage = () => handlePageChange(Math.min(currentPage + 1, totalPages));

    const getPaginationItems = () => {
        let items: (number | JSX.Element)[] = [];

        if (totalPages <= 1) return [];

        // Botón para página anterior
        items.push(
            <PaginationItem key="prev">
                <PaginationPrevious onClick={handlePreviousPage} href={""} />
            </PaginationItem>
        );

        // Lógica para mostrar solo 3 páginas en formato móvil
        if (window.innerWidth < 768) {
            if(currentPage == totalPages && totalPages > 2) {   
                items.push(
                    <PaginationItem key={currentPage - 2}>
                        <PaginationLink onClick={() => handlePageChange(currentPage - 2)} href={""}>
                            {currentPage - 2}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            // Mostrar la página anterior, actual, siguiente
            if (currentPage > 1) {
                items.push(
                    <PaginationItem key={currentPage - 1}>
                        <PaginationLink onClick={() => handlePageChange(currentPage - 1)} href={""}>
                            {currentPage - 1}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            // Página actual
            items.push(
                <PaginationItem key={currentPage}>
                    <PaginationLink onClick={() => handlePageChange(currentPage)} isActive={true} href={""}>
                        {currentPage}
                    </PaginationLink>
                </PaginationItem>
            );

            // Página siguiente
            if (currentPage < totalPages) {
                items.push(
                    <PaginationItem key={currentPage + 1}>
                        <PaginationLink onClick={() => handlePageChange(currentPage + 1)} href={""}>
                            {currentPage + 1}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

            if (currentPage < 2 && totalPages > 2) {
                items.push(
                    <PaginationItem key={currentPage + 1}>
                        <PaginationLink onClick={() => handlePageChange(currentPage + 2)} href={""}>
                            {currentPage + 2}
                        </PaginationLink>
                    </PaginationItem>
                );
            }

        } else {
            // Siempre mostrar la primera página
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink onClick={() => handlePageChange(1)} isActive={1 === currentPage} href={""}>
                        1
                    </PaginationLink>
                </PaginationItem>
            );

            // Lógica para pantallas grandes (pantalla de tamaño de tablet o escritorio)
            if (totalPages <= 7) {
                // Si hay pocas páginas, mostramos todas
                for (let page = 2; page < totalPages; page++) {
                    items.push(
                        <PaginationItem key={page}>
                            <PaginationLink onClick={() => handlePageChange(page)} isActive={page === currentPage} href={""}>
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    );
                }
            } else {
                // Mostrar las páginas cercanas al inicio (1, 2, 3, 4, 5, ...)
                if (currentPage <= 4) {
                    for (let page = 2; page <= Math.min(5, totalPages - 1); page++) {
                        items.push(
                            <PaginationItem key={page}>
                                <PaginationLink onClick={() => handlePageChange(page)} isActive={page === currentPage} href={""}>
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }
                    if (totalPages > 6) items.push(<PaginationEllipsis key="ellipsis-end" />);
                }

                // Mostrar las páginas cercanas al final (..., 6, 7, 8, 9, 10)
                else if (currentPage > totalPages - 4) {
                    items.push(<PaginationEllipsis key="ellipsis-start" />);
                    for (let page = totalPages - 4; page < totalPages; page++) {
                        items.push(
                            <PaginationItem key={page}>
                                <PaginationLink onClick={() => handlePageChange(page)} isActive={page === currentPage} href={""}>
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }
                }

                // Mostrar páginas intermedias con elipsis al inicio y al final
                else {
                    items.push(<PaginationEllipsis key="ellipsis-start" />);
                    for (let page = currentPage - 1; page <= currentPage + 1; page++) {
                        items.push(
                            <PaginationItem key={page}>
                                <PaginationLink onClick={() => handlePageChange(page)} isActive={page === currentPage} href={""}>
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }
                    items.push(<PaginationEllipsis key="ellipsis-end" />);
                }
            }
        }

        // Siempre mostrar la última página
        if (totalPages > 1 && window.innerWidth >= 768) {
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages} href={""}>
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Botón para página siguiente
        items.push(
            <PaginationItem key="next">
                <PaginationNext onClick={handleNextPage} href={""} />
            </PaginationItem>
        );
        return items;
    };

    const paginationItems = getPaginationItems();

    return (
        <div className={className}>
            <Pagination>
                <PaginationContent>
                    {paginationItems.map((page, index) => (
                        <PaginationItem key={index}>
                            {typeof page === "number" ? (
                                <PaginationLink
                                    onClick={() => handlePageChange(page)}
                                    isActive={page === currentPage}
                                    href={""}
                                >
                                    {page}
                                </PaginationLink>
                            ) : (
                                page
                            )}
                        </PaginationItem>
                    ))}
                </PaginationContent>
            </Pagination>
        </div>
    );
}

export { PaginationComponent };
