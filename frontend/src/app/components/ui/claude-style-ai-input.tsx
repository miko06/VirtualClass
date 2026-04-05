"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus,
  ArrowUp,
  X,
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  ChevronDown,
  Check,
  Loader2,
  AlertCircle,
  Copy,
  Mic,
} from "lucide-react";
import { Button } from "./button";
import { cn } from "./utils";

// Types
export interface FileWithPreview {
  id: string;
  file: File;
  preview?: string;
  type: string;
  uploadStatus: "pending" | "uploading" | "complete" | "error";
  uploadProgress?: number;
  abortController?: AbortController;
  textContent?: string;
}

export interface PastedContent {
  id: string;
  content: string;
  timestamp: Date;
  wordCount: number;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  badge?: string;
}

interface ChatInputProps {
  onSendMessage?: (
    message: string,
    files: FileWithPreview[],
    pastedContent: PastedContent[]
  ) => void;
  disabled?: boolean;
  placeholder?: string;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
  models?: ModelOption[];
  defaultModel?: string;
  onModelChange?: (modelId: string) => void;
}

// Constants
const MAX_FILES = 10;
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const PASTE_THRESHOLD = 200;

// File type helpers
const getFileIcon = (type: string) => {
  if (type.startsWith("image/"))
    return <ImageIcon className="h-5 w-5 text-zinc-400" />;
  if (type.startsWith("video/"))
    return <Video className="h-5 w-5 text-zinc-400" />;
  if (type.startsWith("audio/"))
    return <Music className="h-5 w-5 text-zinc-400" />;
  if (type.includes("zip") || type.includes("rar") || type.includes("tar"))
    return <Archive className="h-5 w-5 text-zinc-400" />;
  return <FileText className="h-5 w-5 text-zinc-400" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const isTextualFile = (file: File): boolean => {
  const textualTypes = [
    "text/",
    "application/json",
    "application/xml",
    "application/javascript",
    "application/typescript",
  ];

  const textualExtensions = [
    "txt", "md", "py", "js", "ts", "jsx", "tsx", "html", "htm", "css",
    "scss", "sass", "json", "xml", "yaml", "yml", "csv", "sql", "sh",
    "bash", "php", "rb", "go", "java", "c", "cpp", "h", "hpp", "cs",
    "rs", "swift", "kt", "scala", "r", "vue", "svelte", "astro", "config",
    "conf", "ini", "toml", "log", "gitignore", "dockerfile", "makefile", "readme",
  ];

  const isTextualMimeType = textualTypes.some((type) =>
    file.type.toLowerCase().startsWith(type)
  );

  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  const isTextualExtension =
    textualExtensions.includes(extension) ||
    file.name.toLowerCase().includes("readme") ||
    file.name.toLowerCase().includes("dockerfile") ||
    file.name.toLowerCase().includes("makefile");

  return isTextualMimeType || isTextualExtension;
};

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || "");
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

const getFileExtension = (filename: string): string => {
  const extension = filename.split(".").pop()?.toUpperCase() || "FILE";
  return extension.length > 8 ? extension.substring(0, 8) + "..." : extension;
};

// File Preview Component
const FilePreviewCard: React.FC<{
  file: FileWithPreview;
  onRemove: (id: string) => void;
}> = ({ file, onRemove }) => {
  const isImage = file.type.startsWith("image/");
  const isTextual = isTextualFile(file.file);

  if (isTextual) {
    return <TextualFilePreviewCard file={file} onRemove={onRemove} />;
  }

  return (
    <div
      className={cn(
        "relative group bg-zinc-800 border border-zinc-700 w-fit rounded-lg p-3 h-[125px] w-[125px] shadow-md flex-shrink-0 overflow-hidden",
        isImage ? "p-0" : "p-3"
      )}
    >
      <div className="flex items-start gap-3 h-full w-full overflow-hidden">
        {isImage && file.preview ? (
          <div className="relative w-full h-full rounded-md overflow-hidden bg-zinc-700">
            <img
              src={file.preview || "/placeholder.svg"}
              alt={file.file.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5 mb-1">
              {file.uploadStatus === "uploading" && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
              )}
              {file.uploadStatus === "error" && (
                <AlertCircle className="h-3.5 w-3.5 text-red-400" />
              )}
            </div>
            <p
              className="max-w-[90%] text-xs font-medium text-zinc-100 truncate"
              title={file.file.name}
            >
              {file.file.name}
            </p>
            <p className="text-[10px] text-zinc-500 mt-1">
              {formatFileSize(file.file.size)}
            </p>
          </div>
        )}
      </div>
      <Button
        size="icon"
        variant="outline"
        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 bg-zinc-900 border-zinc-600"
        onClick={() => onRemove(file.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

const PastedContentCard: React.FC<{
  content: PastedContent;
  onRemove: (id: string) => void;
}> = ({ content, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const previewText = content.content.slice(0, 150);
  const needsTruncation = content.content.length > 150;

  return (
    <div className="bg-zinc-800 border border-zinc-700 relative rounded-lg p-3 h-[125px] w-[125px] shadow-md flex-shrink-0 overflow-hidden">
      <div className="text-[8px] text-zinc-300 whitespace-pre-wrap break-words max-h-24 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {isExpanded || !needsTruncation ? content.content : previewText}
        {!isExpanded && needsTruncation && "..."}
      </div>
      <div className="group absolute flex justify-start items-end p-2 inset-0 bg-gradient-to-b to-zinc-900 from-transparent overflow-hidden">
        <p className="capitalize text-zinc-400 text-xs px-2 py-1 rounded-md">
          PASTED
        </p>
        <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 flex items-center gap-0.5 absolute top-2 right-2">
          <Button
            size="icon"
            variant="outline"
            className="h-6 w-6 bg-zinc-900 border-zinc-600"
            onClick={() => navigator.clipboard.writeText(content.content)}
            title="Copy content"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-6 w-6 bg-zinc-900 border-zinc-600"
            onClick={() => onRemove(content.id)}
            title="Remove content"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const ModelSelectorDropdown: React.FC<{
  models: ModelOption[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}> = ({ models, selectedModel, onModelChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedModelData = models.find((m) => m.id === selectedModel) || models[0];
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate max-w-[150px]">{selectedModelData.name}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-72 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 p-2">
          {models.map((model) => (
            <button
              key={model.id}
              className={cn(
                "w-full text-left p-2.5 rounded-md hover:bg-zinc-700 transition-colors flex items-center justify-between",
                model.id === selectedModel && "bg-zinc-700"
              )}
              onClick={() => {
                onModelChange(model.id);
                setIsOpen(false);
              }}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-100">{model.name}</span>
                  {model.badge && (
                    <span className="px-1.5 py-0.5 text-xs bg-amber-500/20 text-amber-300 rounded">
                      {model.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{model.description}</p>
              </div>
              {model.id === selectedModel && (
                <Check className="h-4 w-4 text-amber-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const TextualFilePreviewCard: React.FC<{
  file: FileWithPreview;
  onRemove: (id: string) => void;
}> = ({ file, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const previewText = file.textContent?.slice(0, 150) || "";
  const needsTruncation = (file.textContent?.length || 0) > 150;
  const fileExtension = getFileExtension(file.file.name);

  return (
    <div className="bg-zinc-800 border border-zinc-700 relative rounded-lg p-3 h-[125px] w-[125px] shadow-md flex-shrink-0 overflow-hidden">
      <div className="text-[8px] text-zinc-300 whitespace-pre-wrap break-words max-h-24 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {file.textContent ? (
          <>{isExpanded || !needsTruncation ? file.textContent : previewText}{!isExpanded && needsTruncation && "..."}</>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
      <div className="group absolute flex justify-start items-end p-2 inset-0 bg-gradient-to-b to-zinc-900 from-transparent overflow-hidden">
        <p className="text-zinc-400 text-xs px-2 py-1 rounded-md">{fileExtension}</p>
        {file.uploadStatus === "uploading" && (
          <div className="absolute top-2 left-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
          </div>
        )}
        {file.uploadStatus === "error" && (
          <div className="absolute top-2 left-2">
            <AlertCircle className="h-3.5 w-3.5 text-red-400" />
          </div>
        )}
        <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 flex items-center gap-0.5 absolute top-2 right-2">
          {file.textContent && (
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 bg-zinc-900 border-zinc-600"
              onClick={() => navigator.clipboard.writeText(file.textContent || "")}
              title="Copy content"
            >
              <Copy className="h-3 w-3" />
            </Button>
          )}
          <Button
            size="icon"
            variant="outline"
            className="h-6 w-6 bg-zinc-900 border-zinc-600"
            onClick={() => onRemove(file.id)}
            title="Remove file"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const ClaudeChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "How can I help you today?",
  maxFiles = MAX_FILES,
  maxFileSize = MAX_FILE_SIZE,
  acceptedFileTypes,
  models,
  defaultModel,
  onModelChange,
}) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [pastedContent, setPastedContent] = useState<PastedContent[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedModel, setSelectedModel] = useState(defaultModel || models?.[0]?.id || "");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const maxHeight = parseInt(getComputedStyle(textareaRef.current).maxHeight, 10) || 200;
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
    }
  }, [message]);

  const handleFileSelect = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return;

      const currentFileCount = files.length;
      if (currentFileCount >= maxFiles) {
        alert(`Maximum ${maxFiles} files allowed.`);
        return;
      }

      const availableSlots = maxFiles - currentFileCount;
      const filesToAdd = Array.from(selectedFiles).slice(0, availableSlots);

      const newFiles = filesToAdd
        .filter((file) => {
          if (file.size > maxFileSize) {
            alert(`File ${file.name} exceeds size limit.`);
            return false;
          }
          if (acceptedFileTypes && !acceptedFileTypes.some(
            (type) => file.type.includes(type) || type === file.name.split(".").pop()
          )) {
            alert(`File type for ${file.name} not supported.`);
            return false;
          }
          return true;
        })
        .map((file) => ({
          id: String(Math.random()),
          file,
          preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
          type: file.type || "application/octet-stream",
          uploadStatus: "pending" as const,
          uploadProgress: 0,
        }));

      setFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((fileToUpload) => {
        if (isTextualFile(fileToUpload.file)) {
          readFileAsText(fileToUpload.file)
            .then((textContent) => {
              setFiles((prev) =>
                prev.map((f) => (f.id === fileToUpload.id ? { ...f, textContent } : f))
              );
            })
            .catch(console.error);
        }

        setFiles((prev) =>
          prev.map((f) => (f.id === fileToUpload.id ? { ...f, uploadStatus: "uploading" } : f))
        );

        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20 + 5;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileToUpload.id ? { ...f, uploadStatus: "complete", uploadProgress: 100 } : f
              )
            );
          } else {
            setFiles((prev) =>
              prev.map((f) => (f.id === fileToUpload.id ? { ...f, uploadProgress: progress } : f))
            );
          }
        }, 150);
      });
    },
    [files.length, maxFiles, maxFileSize, acceptedFileTypes]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const clipboardData = e.clipboardData;
      const items = clipboardData.items;

      const fileItems = Array.from(items).filter((item) => item.kind === "file");
      if (fileItems.length > 0 && files.length < maxFiles) {
        e.preventDefault();
        const pastedFiles = fileItems.map((item) => item.getAsFile()).filter(Boolean) as File[];
        const dataTransfer = new DataTransfer();
        pastedFiles.forEach((file) => dataTransfer.items.add(file));
        handleFileSelect(dataTransfer.files);
        return;
      }

      const textData = clipboardData.getData("text");
      if (textData && textData.length > PASTE_THRESHOLD && pastedContent.length < 5) {
        e.preventDefault();
        setMessage(message + textData.slice(0, PASTE_THRESHOLD) + "...");

        const pastedItem: PastedContent = {
          id: String(Math.random()),
          content: textData,
          timestamp: new Date(),
          wordCount: textData.split(/\s+/).filter(Boolean).length,
        };

        setPastedContent((prev) => [...prev, pastedItem]);
      }
    },
    [handleFileSelect, files.length, maxFiles, pastedContent.length, message]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files) {
        handleFileSelect(e.dataTransfer.files);
      }
    },
    [handleFileSelect]
  );

  const handleSend = useCallback(() => {
    if (disabled || (!message.trim() && files.length === 0 && pastedContent.length === 0)) return;
    if (files.some((f) => f.uploadStatus === "uploading")) {
      alert("Please wait for all files to finish uploading.");
      return;
    }

    onSendMessage?.(message, files, pastedContent);

    setMessage("");
    files.forEach((file) => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    setFiles([]);
    setPastedContent([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [message, files, pastedContent, disabled, onSendMessage]);

  const handleModelChangeInternal = useCallback(
    (modelId: string) => {
      setSelectedModel(modelId);
      onModelChange?.(modelId);
    },
    [onModelChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const hasContent = message.trim() || files.length > 0 || pastedContent.length > 0;
  const canSend = hasContent && !disabled && !files.some((f) => f.uploadStatus === "uploading");

  return (
    <div className="relative w-full max-w-3xl mx-auto" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-amber-500/10 border-2 border-dashed border-amber-500 rounded-3xl flex flex-col items-center justify-center pointer-events-none">
          <p className="text-sm text-amber-500 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 opacity-50" />
            Drop files here
          </p>
        </div>
      )}

      {/* File previews */}
      {(files.length > 0 || pastedContent.length > 0) && (
        <div className="mb-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-3">
            {pastedContent.map((content) => (
              <PastedContentCard
                key={content.id}
                content={content}
                onRemove={(id) => setPastedContent((prev) => prev.filter((c) => c.id !== id))}
              />
            ))}
            {files.map((file) => (
              <FilePreviewCard key={file.id} file={file} onRemove={removeFile} />
            ))}
          </div>
        </div>
      )}

      {/* Main input box - Claude.ai style */}
      <div className="relative bg-[#2a2a2a] border border-zinc-700 rounded-3xl shadow-xl focus-within:border-zinc-600 focus-within:shadow-2xl transition-all">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="w-full px-5 py-5 bg-transparent text-base text-zinc-100 outline-none placeholder:text-zinc-500 resize-none max-h-[200px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] disabled:opacity-50 font-light"
        />

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || files.length >= maxFiles}
              className="p-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors disabled:opacity-40"
              title="Attach files"
            >
              <Plus className="h-5 w-5" />
            </button>
            <button
              className="p-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              title="Voice input (coming soon)"
            >
              <Mic className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {models && models.length > 0 && (
              <ModelSelectorDropdown
                models={models}
                selectedModel={selectedModel}
                onModelChange={handleModelChangeInternal}
              />
            )}

            <button
              onClick={handleSend}
              disabled={!canSend}
              className={cn(
                "p-2.5 rounded-xl transition-all",
                canSend
                  ? "bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20"
                  : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
              )}
              title="Send message"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept={acceptedFileTypes?.join(",")}
        onChange={(e) => {
          handleFileSelect(e.target.files);
          if (e.target) e.target.value = "";
        }}
      />
    </div>
  );
};

export { ClaudeChatInput };
