import { Button, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import { JudgeRowProps } from "./JuryForm";

interface JudgeNamePopoverProps extends Omit<JudgeRowProps, 'values' | 'errors' | 'touched'> {
    isMobile?: boolean;
}

export const JudgeNamePopover: React.FC<JudgeNamePopoverProps> = ({
    judge, index, setFieldValue, openPopovers, setOpenPopovers, selectedOfficialUserIds, officials, isMobile
}) => {

    const handleSelectOfficial = (official: { id: string; fullName: string }) => {
        setFieldValue(`judges.${index}.userId`, official.id);
        setFieldValue(`judges.${index}.name`, official.fullName);
        setOpenPopovers(prev => {
            const newOpenPopovers = [...prev];
            newOpenPopovers[index] = false;
            return newOpenPopovers;
        });
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
                    disabled={judge.isNational || judge.erase || !judge.canEdit}
                    role="combobox"
                    aria-expanded={openPopovers[index]}
                    className={cn(
                        "w-full justify-between font-normal text-foreground border-input",
                        !judge.name && !judge.isNational && "text-muted-foreground",
                        judge.isNational && "text-muted-foreground italic",
                        judge.erase && "line-through text-destructive placeholder:text-destructive/70",
                        (judge.isNational || !judge.canEdit) && "cursor-not-allowed opacity-70"
                    )}
                >
                    <span className="truncate">
                        {judge.name || (judge.isNational ? judge.originalData?.officialName || "Designación Nacional (RFEA)" : "Seleccionar Juez Local...")}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            {judge.canEdit && !judge.isNational && !judge.erase && (
                <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                    onOpenAutoFocus={(e) => {
                        e.preventDefault();
                    }}
                >
                    <Command>
                        <CommandInput placeholder="Buscar juez por nombre..." />
                        <CommandList>
                            <CommandEmpty>No se encontraron jueces locales.</CommandEmpty>
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