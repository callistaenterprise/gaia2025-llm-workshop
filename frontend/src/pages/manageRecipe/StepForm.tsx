import React from 'react';
import { Step } from "../../types/Recipe.ts";
import { InputHeader } from './components/inputHeader.tsx';
import { Button } from './components/button.tsx';

interface StepFormProps {
    order: number;
    setOrder: (order: number) => void;
    instruction: string;
    setInstruction: (instruction: string) => void;
    minutes: number;
    setMinutes: (minutes: number) => void;
    handleSaveStep: (event: React.MouseEvent<HTMLButtonElement>) => void;
    cancelEditStep: () => void;
    editStep: boolean | undefined;
}

export const StepForm: React.FC<StepFormProps> = ({
    order,
    setOrder,
    instruction,
    setInstruction,
    minutes,
    setMinutes,
    handleSaveStep,
    cancelEditStep,
    editStep
}) => {
    return (
        <div className="flex gap-2 mt-2">
            <div className="h-14">
                <InputHeader title="No:" />
                <input
                    type="number"
                    placeholder="Number"
                    value={order}
                    onChange={e => setOrder(parseInt(e.target.value))}
                    className="p-2 border rounded w-auto h-10 md:w-14"
                />
            </div>
            <div className="h-14">
                <InputHeader title="Instruction:" />
                <textarea
                    value={instruction}
                    placeholder="Instruction"
                    onChange={(e) => setInstruction(e.target.value)}
                    className="p-2 border rounded flex-1 h-10"
                />
            </div>
            <div className="h-14">
                <InputHeader title="Minutes:" />
                <input
                    type="number"
                    placeholder="min"
                    value={minutes}
                    onChange={e => setMinutes(parseInt(e.target.value))}
                    className="p-2 border rounded h-10 w-auto md:w-16"
                />
            </div>
            {editStep && (
                <div className="h-14 space-y-5 space-x-2">
                    <Button onClick={cancelEditStep}>Cancel</Button>
                    <Button onClick={handleSaveStep}>Save</Button>
                </div>
            )}
            {!editStep && (
                <div className="h-14 pt-5">
                    <button type="button" onClick={handleSaveStep}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 whitespace-nowrap w-auto">
                        Add step
                    </button>
                </div>
            )}
        </div>
    );
};
