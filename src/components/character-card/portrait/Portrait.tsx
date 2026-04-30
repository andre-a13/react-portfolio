import React from "react";
import { ImageUp } from "lucide-react";

interface PortraitProps {
    src?: string;
    alt?: string;
    editable?: boolean;
    uploading?: boolean;
    error?: string | null;
    onUpload?: (file: File) => void;
}

const hasDraggedFiles = (event: React.DragEvent<HTMLElement>) => {
    return Array.from(event.dataTransfer.types).includes("Files");
};

export const Portrait: React.FC<PortraitProps> = ({
    src,
    alt = "Portrait du personnage",
    editable = false,
    uploading = false,
    error,
    onUpload,
}) => {
    const [isDraggingFile, setIsDraggingFile] = React.useState(false);
    const dragDepthRef = React.useRef(0);
    const canDropPortrait = editable && Boolean(onUpload) && !uploading;

    React.useEffect(() => {
        if (canDropPortrait) return;
        dragDepthRef.current = 0;
        setIsDraggingFile(false);
    }, [canDropPortrait]);

    const startDragVisual = (event: React.DragEvent<HTMLElement>) => {
        if (!canDropPortrait || !hasDraggedFiles(event)) return;
        event.preventDefault();
        dragDepthRef.current += 1;
        setIsDraggingFile(true);
    };

    const keepDragVisual = (event: React.DragEvent<HTMLElement>) => {
        if (!canDropPortrait || !hasDraggedFiles(event)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        setIsDraggingFile(true);
    };

    const stopDragVisual = (event: React.DragEvent<HTMLElement>) => {
        if (!canDropPortrait) return;
        event.preventDefault();
        dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
        if (dragDepthRef.current === 0) setIsDraggingFile(false);
    };

    const dropPortrait = (event: React.DragEvent<HTMLElement>) => {
        if (!canDropPortrait || !hasDraggedFiles(event)) return;
        event.preventDefault();
        dragDepthRef.current = 0;
        setIsDraggingFile(false);

        const file = event.dataTransfer.files?.[0];
        if (file) onUpload?.(file);
    };

    return (
        <figure
            className={`ccard-portrait ${editable ? "is-editable" : ""} ${isDraggingFile ? "is-dragging-file" : ""}`}
            aria-label="Illustration"
            aria-busy={uploading}
            onDragEnter={startDragVisual}
            onDragOver={keepDragVisual}
            onDragLeave={stopDragVisual}
            onDrop={dropPortrait}
        >
            {isDraggingFile ? (
                <div className="ccard-portraitDrop" aria-live="polite">
                    <ImageUp size={24} aria-hidden="true" />
                    <strong>Deposez le portrait</strong>
                    <ul>
                        <li>JPG, PNG ou WebP</li>
                        <li>5 Mo maximum</li>
                        <li>Format 4:5 recommande</li>
                    </ul>
                </div>
            ) : src ? (
                <img src={src} alt={alt} />
            ) : (
                <div className="ccard-hint">Zone illustration (4:5).<br />Inserez une image ou laissez vide pour un symbole.</div>
            )}

            {uploading && !isDraggingFile ? (
                <figcaption className="ccard-portraitStatus" aria-live="polite">
                    Envoi du portrait...
                </figcaption>
            ) : null}

            {error && !isDraggingFile ? (
                <figcaption className="ccard-portraitError" role="alert">
                    {error}
                </figcaption>
            ) : null}
        </figure>
    );
};
