import { NationalJudgeRowProps } from "@/app/(logged)/dashboard/(nationalFederation)/jury/[eventId]/components/NationalJuryForm";
import { Input, TableCell, TableRow } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Field } from "formik";
import { JudgeNamePopover } from "./JudgeNamePopover";
import { JudgeActions } from "./JudgeActions";

export const JudgeRowDesktop: React.FC<NationalJudgeRowProps> = ({
    judge, index, values, errors, touched, setFieldValue, openPopovers, setOpenPopovers, selectedOfficialUserIds, officials
}) => {
    return (
        <TableRow
            className={cn(
                "border-b border-border transition-colors hover:bg-muted/50 dark:hover:bg-muted/30",
                judge.erase && "opacity-50 bg-red-50 dark:bg-red-900/30 hover:bg-red-100/50 dark:hover:bg-red-800/40",
            )}
        >
            <TableCell className="px-4 py-3 align-top">
                <Field
                    as={Input}
                    name={`judges.${index}.role`}
                    readOnly={judge.isReferee || (!judge.canEdit && judge.isNational)}
                    disabled={judge.erase || (!judge.canEdit && judge.isNational)}
                    value={judge.isReferee ? 'Juez Árbitro' : judge.role}
                    className={cn(
                        "w-full bg-background border-input text-foreground",
                        judge.isReferee && "font-semibold",
                        judge.erase && "line-through text-destructive placeholder:text-destructive/70",
                        (!judge.canEdit && judge.isNational) && "cursor-not-allowed opacity-70"
                    )}
                />
                {errors.judges && (errors.judges as any)[index] && (errors.judges as any)[index].role && touched.judges && touched.judges[index]?.role && (
                    <div className="text-red-600 dark:text-red-500 text-xs mt-1.5">
                        {(errors.judges as any)[index].role}
                    </div>
                )}
            </TableCell>
            <TableCell className="px-4 py-3 align-top">
                <JudgeNamePopover
                    judge={judge} index={index} setFieldValue={setFieldValue}
                    openPopovers={openPopovers} setOpenPopovers={setOpenPopovers}
                    selectedOfficialUserIds={selectedOfficialUserIds} officials={officials}
                />
                {errors.judges && (errors.judges as any)[index] && (errors.judges as any)[index].name && touched.judges && touched.judges[index]?.name && (
                    <div className="text-red-600 dark:text-red-500 text-xs mt-1.5">
                        {(errors.judges as any)[index].name}
                    </div>
                )}
            </TableCell>
            <TableCell className="px-4 py-3 text-right align-top">
                <JudgeActions judge={judge} index={index} values={values} setFieldValue={setFieldValue} />
            </TableCell>
        </TableRow>
    );
};