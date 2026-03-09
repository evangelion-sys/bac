import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { useAppStore } from '@/store/useAppStore';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { settings } = useAppStore();

  return (
    <div 
      className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-800 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-a:text-pink-500 hover:prose-a:text-pink-600"
      style={{ 
        fontSize: `${settings.fontSize}px`,
        lineHeight: settings.highLegibility ? '1.8' : '1.6',
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

