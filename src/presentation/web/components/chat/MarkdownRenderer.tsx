import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>;
          },
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !String(children).includes('\n');
            
            if (isInline) {
              return (
                <code 
                  className={cn(
                    "px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-sm",
                    className
                  )} 
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="my-2 overflow-hidden rounded-lg border border-border">
                <div className="bg-muted px-3 py-1.5 text-xs text-muted-foreground border-b border-border font-mono">
                  {match ? match[1] : 'code'}
                </div>
                <pre className="p-3 overflow-x-auto bg-card text-sm">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          table({ children }) {
            return (
              <div className="my-4 w-full overflow-y-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-muted text-xs uppercase text-muted-foreground">
                {children}
              </thead>
            );
          },
          th({ children }) {
            return (
              <th className="px-4 py-2 font-medium text-left">{children}</th>
            );
          },
          td({ children }) {
            return (
              <td className="px-4 py-2 border-t border-border">{children}</td>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary pl-4 py-1 my-2 italic text-muted-foreground">
                {children}
              </blockquote>
            );
          },
          h1({ children }) {
            return <h1 className="text-2xl font-bold my-4">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-xl font-bold my-3">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-lg font-bold my-2">{children}</h3>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}