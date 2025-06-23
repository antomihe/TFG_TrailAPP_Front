import { cn } from "@/lib/utils";
import { Field } from "formik";
import { FileTextIcon, SettingsIcon, UserIcon } from "lucide-react";
import { JudgeRowProps } from "./JuryForm";
import { Input } from "@/components/ui";
import { JudgeNamePopover } from "./JudgeNamePopover";
import { JudgeActions } from "./JudgeActions";

export const JudgeRowMobile: React.FC<JudgeRowProps> = ({
    judge, index, values, errors, touched, setFieldValue, openPopovers, setOpenPopovers, selectedOfficialUserIds, officials
}) => {
    return (
        <div
            className={cn(
                "border border-border rounded-lg p-4 space-y-3 transition-colors",
                judge.erase && "opacity-50 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/40",
            )}
        >
            <div>
                <label htmlFor={`judges.${index}.role`} className="flex items-center text-xs font-medium text-muted-foreground mb-1">
                    <FileTextIcon className="h-3.5 w-3.5 mr-1.5" /> Rol
                </label>
                <Field
                    as={Input}
                    id={`judges.${index}.role`}
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
                    <div className="text-red-600 dark:text-red-500 text-xs mt-1">
                        {(errors.judges as any)[index].role}
                    </div>
                )}
            </div>

            <div>
                <label htmlFor={`judges.${index}.name`} className="flex items-center text-xs font-medium text-muted-foreground mb-1">
                    <UserIcon className="h-3.5 w-3.5 mr-1.5" /> Nombre del Juez
                </label>
                <JudgeNamePopover
                    judge={judge} index={index} setFieldValue={setFieldValue}
                    openPopovers={openPopovers} setOpenPopovers={setOpenPopovers}
                    selectedOfficialUserIds={selectedOfficialUserIds} officials={officials}
                    isMobile
                />
                {errors.judges && (errors.judges as any)[index] && (errors.judges as any)[index].name && touched.judges && touched.judges[index]?.name && (
                    <div className="text-red-600 dark:text-red-500 text-xs mt-1">
                        {(errors.judges as any)[index].name}
                    </div>
                )}
            </div>

            <div>
                <label className="flex items-center text-xs font-medium text-muted-foreground mb-1">
                    <SettingsIcon className="h-3.5 w-3.5 mr-1.5" /> Acciones
                </label>
                <div className="flex justify-end space-x-2"> 
                    <JudgeActions judge={judge} index={index} values={values} setFieldValue={setFieldValue} isMobile />
                </div>
            </div>
        </div>
    );
};