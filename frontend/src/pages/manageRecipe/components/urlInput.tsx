import React from 'react';
import { InputHeader } from './inputHeader.tsx';
import { Button } from './button.tsx';
import { ErrorMessage } from './errorMessage.tsx';

interface UrlInputProps {
    url: string;
    setUrl: (url: string) => void;
    handleFetchParsedRecipe: (event: React.MouseEvent<HTMLButtonElement>) => void;
    loadingUrl: boolean;
    error: { title: string; message: string } | null;
}

export const UrlInput: React.FC<UrlInputProps> = ({ url, setUrl, handleFetchParsedRecipe, loadingUrl, error }) => {
    return (
        <div>
            <InputHeader title="Url:" />
            <div className="flex gap-2 mt-2">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="p-2 border rounded flex-1"
                    placeholder={"https://..."}
                />
                <Button disabled={!url} onClick={handleFetchParsedRecipe}>Fetch from web</Button>
            </div>
            <br />
            {loadingUrl && (
                <div className="flex justify-center items-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    <span className="ml-2 text-blue-500">Fetching recipe from {url}</span>
                </div>
            )}
            {error && (
                <ErrorMessage title={error.title} message={error.message} />
            )}
        </div>
    );
};
