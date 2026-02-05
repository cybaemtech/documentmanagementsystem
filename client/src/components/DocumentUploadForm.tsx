import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Upload, FileText, X, Building } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const documentSchema = z.object({
  docName: z.string().min(1, "Document name is required"),
  docNumber: z.string().min(1, "Document number is required"),
  dateOfIssue: z.string().min(1, "Date of issue is required"),
  revisionNumber: z.string().min(1, "Revision number is required"),
  duePeriodYears: z.string().optional(),
  preparerName: z.string().min(1, "Preparer name is required"),
  reasonForRevision: z.string().optional(),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

interface DocumentUploadFormProps {
  onSubmit?: (data: DocumentFormValues & { file?: File }) => void;
  onCancel?: () => void;
}

export default function DocumentUploadForm({ onSubmit, onCancel }: DocumentUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      docName: "",
      docNumber: "",
      dateOfIssue: "",
      revisionNumber: "0",
      duePeriodYears: "",
      preparerName: "",
      reasonForRevision: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFileError("");
    }
  };

  const handleSubmit = (data: DocumentFormValues) => {
    if (!selectedFile) {
      setFileError("Word document is required for document content.");
      return;
    }
    onSubmit?.({ ...data, file: selectedFile });
    console.log("Form submitted:", { ...data, file: selectedFile?.name });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Document Information</h3>

          {/* All fields in a compact 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="docName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Quality Control SOP" {...field} data-testid="input-doc-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="docNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., QC-SOP-001" {...field} data-testid="input-doc-number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preparerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preparer Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} data-testid="input-preparer-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfIssue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Issue *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="revisionNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Revision No. *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duePeriodYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Period (Years)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reasonForRevision"
              render={({ field }) => (
                <FormItem className="md:col-span-3">
                  <FormLabel>Reason for Revision</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the reason for document revision..."
                      className="resize-none"
                      rows={2}
                      {...field}
                      data-testid="input-revision-reason"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* File Upload Section - Integrated */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Upload className="w-5 h-5 text-blue-600" />
              <h4 className="text-base font-semibold">Upload Word Document *</h4>
            </div>
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors bg-muted/30">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".doc,.docx"
                onChange={handleFileChange}
                data-testid="input-file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-primary" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedFile(null);
                        setFileError("");
                      }}
                      data-testid="button-remove-file"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">Click to upload Word document</p>
                    <p className="text-xs text-muted-foreground">
                      Word documents only (.doc, .docx) - Required
                    </p>
                  </div>
                )}
              </label>
            </div>
            {fileError && (
              <p className="text-sm text-red-500 mt-2" data-testid="text-file-error">{fileError}</p>
            )}
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel">
            Cancel
          </Button>
          <Button type="submit" data-testid="button-submit">
            Submit for Approval
          </Button>
        </div>
      </form>
    </Form>
  );
}
