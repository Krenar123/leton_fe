
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export const RichTextEditor = ({ value, onChange, placeholder, className, id }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const addFormatting = (format: 'bold' | 'italic') => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    
    if (format === 'bold') {
      document.execCommand('bold', false);
    } else if (format === 'italic') {
      document.execCommand('italic', false);
    }
    
    handleInput();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addFormatting('bold')}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addFormatting('italic')}
        >
          <Italic className="w-4 h-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className={`min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className} [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-muted-foreground`}
        style={{ whiteSpace: 'pre-wrap' }}
        data-placeholder={placeholder}
        id={id}
      />
    </div>
  );
};
