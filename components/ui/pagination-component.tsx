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

    const itemsPerPage = 5;

    const getPaginationItems = () => {
        let items: (number | JSX.Element)[] = [];

        if (totalPages <= 1) return [];

        // Siempre mostrar botones de navegación
        items.push(
            <PaginationItem key="prev">
                <PaginationPrevious onClick={handlePreviousPage} href={""} />
            </PaginationItem>
        );


        // Calcular el rango de páginas a mostrar
        const startPage = Math.max(2, currentPage - Math.floor(itemsPerPage / 2));
        const endPage = Math.min(totalPages - 1, startPage + itemsPerPage - 2); // -2 porque ya hay la primera página

        // Ajustar el rango si está cerca de los límites
        const adjustedStartPage = Math.max(2, endPage - itemsPerPage + 2);


        // Siempre mostrar la primera página
        items.push(1);

        // Mostrar elipsis al inicio si es necesario
        if (adjustedStartPage > 2) {
            items.push(<PaginationEllipsis key="ellipsis-start" />);
        }

        // Mostrar páginas desde el rango ajustado
        for (let page = adjustedStartPage; page <= endPage; page++) {
            items.push(page);
        }

        // Siempre mostrar la última página
        if (totalPages > 1) {
            if (endPage < totalPages - 1) {
                items.push(<PaginationEllipsis key="ellipsis-end" />);
            }
            items.push(totalPages);
        }

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
                                    isActive={page === currentPage} href={""}                                >
                                    {page}
                                </PaginationLink>
                            ) : (
                                page // Muestra el componente de elipsis
                            )}
                        </PaginationItem>
                    ))}
                </PaginationContent>
            </Pagination>
        </div>
    );
}

export { PaginationComponent };
