import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon, RotateCcwIcon, XIcon } from "lucide-react";
import { JudgeRowProps } from "./JuryForm";

interface JudgeActionsProps extends Omit<JudgeRowProps, 'errors' | 'touched' | 'openPopovers' | 'setOpenPopovers' | 'selectedOfficialUserIds' | 'officials'> {
    isMobile?: boolean;
}

export const JudgeActions: React.FC<JudgeActionsProps> = ({ judge, index, values, setFieldValue, isMobile }) => {
    return (
        <div className="flex items-center justify-end space-x-2">
            {(judge.canEdit || !judge.isNational) && !judge.erase && (
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title={judge.isNational ? "Solicitar designación local" : "Solicitar designación nacional"}
                    onClick={() => {
                        const newIsNational = !values.judges[index].isNational;
                        setFieldValue(`judges.${index}.isNational`, newIsNational);
                        if (!newIsNational && judge.originalData?.userId && judge.originalData?.officialName) {
                            setFieldValue(`judges.${index}.userId`, judge.originalData.userId);
                            setFieldValue(`judges.${index}.name`, judge.originalData.officialName);
                        } else if (newIsNational) {
                            setFieldValue(`judges.${index}.userId`, null);
                            setFieldValue(`judges.${index}.name`, '');
                        }
                    }}
                    className={cn(
                        "border-input hover:bg-accent",
                        judge.isNational
                            ? "text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300"
                            : "text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300",
                        isMobile && "h-9 w-9"
                    )}
                >
                    {values.judges[index].isNational ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
            )}

            {!judge.isReferee && (judge.canEdit || !judge.isNational) && (
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title={judge.erase ? "Restaurar juez" : "Marcar para eliminar"}
                    onClick={() => {
                        setFieldValue(`judges.${index}.erase`, !judge.erase);
                    }}
                    className={cn(
                        "border-input hover:bg-accent",
                        judge.erase
                            ? "text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
                            : "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300",
                        isMobile && "h-9 w-9"
                    )}
                >
                    {judge.erase ? <RotateCcwIcon className="h-4 w-4" /> : <XIcon className="h-4 w-4" />}
                </Button>
            )}
        </div>
    );
};
