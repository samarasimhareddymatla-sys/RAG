import { useCallback, useState } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { extractTextFromPdf } from "@/lib/pdf";
import { toast } from "sonner";

interface PdfUploadProps {
  onTextExtracted: (text: string, fileName: string) => void;
  documents: { name: string }[];
  onRemoveDocument: (index: number) => void;
}

const PdfUpload = ({ onTextExtracted, documents, onRemoveDocument }: PdfUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File must be under 20MB");
      return;
    }
    setProcessing(true);
    try {
      const text = await extractTextFromPdf(file);
      if (!text.trim()) {
        toast.error("Could not extract text from this PDF");
        return;
      }
      onTextExtracted(text, file.name);
      toast.success(`"${file.name}" uploaded successfully`);
    } catch {
      toast.error("Failed to process PDF");
    } finally {
      setProcessing(false);
    }
  }, [onTextExtracted]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          dragOver ? "border-primary bg-accent" : "border-border hover:border-primary/50"
        }`}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={onFileSelect}
          className="hidden"
          id="pdf-upload"
          disabled={processing}
        />
        <label htmlFor="pdf-upload" className="cursor-pointer">
          {processing ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Processing PDF...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Drop PDF here or click to upload</p>
              <p className="text-xs text-muted-foreground">PDF files only, max 20MB</p>
            </div>
          )}
        </label>
      </div>

      {documents.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Uploaded Documents</p>
          {documents.map((doc, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <FileText className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-foreground truncate flex-1">{doc.name}</span>
              <button onClick={() => onRemoveDocument(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PdfUpload;
