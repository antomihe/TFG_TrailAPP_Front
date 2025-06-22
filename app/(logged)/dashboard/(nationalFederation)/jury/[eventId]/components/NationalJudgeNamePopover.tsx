import { Button, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Command } from "cmdk";
import { ChevronsUpDown } from "lucide-react";
import { NationalJudgeRowProps } from "./NationalJuryForm";

interface NationalJudgeNamePopoverProps extends Omit<NationalJudgeRowProps, 'values' | 'errors' | 'touched'> {
    isMobile?: boolean;
}

export const NationalJudgeNamePopover: React.FC<NationalJudgeNamePopoverProps> = ({
    judge, index, setFieldValue, openPopovers, setOpenPopovers, selectedOfficialUserIds, officials, isMobile
}) => {
    const handleSelectOfficial = (official: { id: string; fullName: string }) => {
        setFieldValue(`judges.${index}.name`, official.fullName);
        setFieldValue(`judges.${index}.userId`, official.id);
        const newOpenPopovers = [...openPopovers];
        newOpenPopovers[index] = false;
        setOpenPopovers(newOpenPopovers);
    };

    return (
        <Popover open={openPopovers[index]} onOpenChange={(isOpen) => {
            const newOpenPopovers = [...openPopovers];
            newOpenPopovers[index] = isOpen;
            setOpenPopovers(newOpenPopovers);
        }}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={judge.erase || !judge.isNational}
                    role="combobox"
                    aria-expanded={openPopovers[index]}
                    className={cn(
                        "w-full justify-between font-normal text-foreground border-input",
                        !judge.name && judge.isNational && "text-muted-foreground",
                        !judge.isNational && "text-muted-foreground italic",
                        judge.erase && "line-through text-destructive placeholder:text-destructive/70",
                        !judge.isNational && "cursor-not-allowed opacity-70"
                    )}
                >
                    <span className="truncate">
                        {judge.name || (judge.isNational ? "Seleccionar Juez Nacional..." : "Juez Autonómico (gestionado por FAA)")}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            {judge.isNational && !judge.erase && judge.canEdit && (
                <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                    onOpenAutoFocus={(e) => {
                        e.preventDefault();
                    }}
                >
                    <Command>
                        <CommandInput placeholder="Buscar oficial RFEA..." />
                        <CommandList>
                            <CommandEmpty>No se encontraron oficiales.</CommandEmpty>
                            <CommandGroup>
                                {officials
                                    .filter(official => !selectedOfficialUserIds.includes(official.id) || official.id === judge.userId)
                                    .map(official => (
                                        <CommandItem
                                            key={official.id}
                                            value={official.fullName}
                                            onSelect={() => handleSelectOfficial(official)}
                                        >
                                            {official.fullName}
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            )}
        </Popover>
    );
};
