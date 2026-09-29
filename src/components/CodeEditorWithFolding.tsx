/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Minimize2,
  Maximize2,
  Copy,
  Check,
  Download,
  FileCode,
  Sparkles,
} from 'lucide-react';

interface FoldableBlock {
  id: string;
  startLine: number; // 0-indexed
  endLine: number;   // 0-indexed
  label: string;
  lineCount: number;
}

interface CodeEditorWithFoldingProps {
  code: string;
  isGenerating?: boolean;
  filename?: string;
  activePromptKey?: string;
}

export default function CodeEditorWithFolding({
  code,
  isGenerating = false,
  filename = 'main.tf',
  activePromptKey = 'infrastructure',
}: CodeEditorWithFoldingProps) {
  // Set of collapsed block startLine indices
  const [collapsedLines, setCollapsedLines] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  // Parse foldable blocks based on bracket pairs { and }
  const { blocks, blockMap } = useMemo(() => {
    const lines = code.split('\n');
    const stack: { lineIdx: number; label: string }[] = [];
    const detectedBlocks: FoldableBlock[] = [];
    const map = new Map<number, FoldableBlock>();

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      // Count open and close braces (simple parser)
      const openMatches = (line.match(/{/g) || []).length;
      const closeMatches = (line.match(/}/g) || []).length;

      if (openMatches > closeMatches) {
        let label = trimmed.split('{')[0].trim();
        if (label.endsWith('=')) {
          label = label.slice(0, -1).trim();
        }
        for (let i = 0; i < openMatches - closeMatches; i++) {
          stack.push({ lineIdx: idx, label });
        }
      } else if (closeMatches > openMatches) {
        for (let i = 0; i < closeMatches - openMatches; i++) {
          const top = stack.pop();
          if (top) {
            const block: FoldableBlock = {
              id: `block-${top.lineIdx}-${idx}`,
              startLine: top.lineIdx,
              endLine: idx,
              label: top.label || 'block',
              lineCount: idx - top.lineIdx,
            };
            detectedBlocks.push(block);
            map.set(top.lineIdx, block);
          }
        }
      }
    });

    return { blocks: detectedBlocks, blockMap: map };
  }, [code]);

  // When prompt changes, reset collapse states
  useEffect(() => {
    setCollapsedLines(new Set());
  }, [activePromptKey]);

  // Compute set of hidden line numbers
  const hiddenLines = useMemo(() => {
    const hidden = new Set<number>();
    collapsedLines.forEach((startLine) => {
      const block = blockMap.get(startLine);
      if (block) {
        for (let l = block.startLine + 1; l <= block.endLine; l++) {
          hidden.add(l);
        }
      }
    });
    return hidden;
  }, [collapsedLines, blockMap]);

  // Toggle fold for a specific start line
  const toggleFold = (startLine: number) => {
    setCollapsedLines((prev) => {
      const next = new Set(prev);
      if (next.has(startLine)) {
        next.delete(startLine);
      } else {
        next.add(startLine);
      }
      return next;
    });
  };

  // Fold all blocks
  const foldAll = () => {
    const allStarts = new Set<number>();
    blocks.forEach((b) => allStarts.add(b.startLine));
    setCollapsedLines(allStarts);
  };

  // Expand all blocks
  const expandAll = () => {
    setCollapsedLines(new Set());
  };

  // Copy code to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download code as .tf
  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nexusflow-${activePromptKey}.tf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Syntax highlighter for a line of Terraform / HCL
  const renderSyntaxHighlighted = (line: string, isFoldedLine: boolean, block?: FoldableBlock) => {
    // If it's a comment
    const trimmed = line.trimStart();
    if (trimmed.startsWith('#') || trimmed.startsWith('//')) {
      return <span className="text-slate-500 italic">{line}</span>;
    }

    // Split leading whitespace
    const leadingSpaces = line.match(/^(\s*)/)?.[1] || '';
    const content = line.slice(leadingSpaces.length);

    // If it's folded, render opening statement + folded badge
    if (isFoldedLine && block) {
      // Find where '{' is
      const braceIdx = content.indexOf('{');
      const prefix = braceIdx !== -1 ? content.slice(0, braceIdx + 1) : content;

      return (
        <span>
          <span className="whitespace-pre">{leadingSpaces}</span>
          {renderTokens(prefix)}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFold(block.startLine);
            }}
            className="inline-flex items-center gap-1.5 mx-2 px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/80 hover:border-cyan-400 transition-all cursor-pointer shadow-sm select-none"
            title="Click to expand block"
          >
            <span className="text-cyan-400 font-bold">⋯</span>
            <span className="text-[10px] text-slate-300">{block.lineCount} lines</span>
          </button>
          <span className="text-cyan-400 font-bold font-mono">{'}'}</span>
        </span>
      );
    }

    return (
      <span>
        <span className="whitespace-pre">{leadingSpaces}</span>
        {renderTokens(content)}
      </span>
    );
  };

  // Helper token renderer
  const renderTokens = (text: string) => {
    // Regular expression to match strings, keywords, properties, numbers
    const parts = text.split(/("[^"]*"|\b(?:module|resource|variable|output|provider|true|false)\b|\b\d+(?:\.\d+)?\b|[=:{},[\]])/g);

    return parts.map((part, i) => {
      if (!part) return null;

      // Strings
      if (part.startsWith('"') && part.endsWith('"')) {
        return (
          <span key={i} className="text-emerald-400 font-medium">
            {part}
          </span>
        );
      }

      // Keywords
      if (['module', 'resource', 'variable', 'output', 'provider'].includes(part)) {
        return (
          <span key={i} className="text-pink-400 font-semibold">
            {part}
          </span>
        );
      }

      // Booleans
      if (['true', 'false'].includes(part)) {
        return (
          <span key={i} className="text-amber-400 font-semibold">
            {part}
          </span>
        );
      }

      // Numbers
      if (/^\d+(\.\d+)?$/.test(part)) {
        return (
          <span key={i} className="text-orange-400">
            {part}
          </span>
        );
      }

      // Assignment / punctuation
      if (['=', ':', '{', '}', '[', ']'].includes(part)) {
        return (
          <span key={i} className="text-cyan-400 font-bold">
            {part}
          </span>
        );
      }

      // Properties / identifiers
      return (
        <span key={i} className="text-slate-200">
          {part}
        </span>
      );
    });
  };

  const lines = code.split('\n');

  return (
    <div className="flex flex-col h-full bg-[#04060B] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-2xl">
      {/* Top Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[rgba(15,23,42,0.85)] border-b border-[var(--border-color)]">
        {/* File & Validation Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[var(--accent-cyan)]" />
            <span className="font-mono text-xs text-slate-300 font-medium">{filename}</span>
          </div>
          <span className="hidden sm:inline-block text-[var(--border-color)] font-mono text-xs">|</span>
          <span className="text-emerald-400 font-mono text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Validated & Secure
          </span>
        </div>

        {/* Action Buttons: Fold/Unfold, Copy, Download */}
        <div className="flex items-center gap-2">
          {/* Fold All / Expand All buttons */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-slate-800">
            <button
              onClick={foldAll}
              disabled={blocks.length === 0}
              className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono text-slate-300 hover:text-cyan-300 hover:bg-white/5 transition-all disabled:opacity-40 cursor-pointer"
              title="Collapse all sections"
            >
              <Minimize2 className="w-3 h-3" />
              <span className="hidden md:inline">Fold All</span>
            </button>
            <div className="w-[1px] h-3 bg-slate-800"></div>
            <button
              onClick={expandAll}
              disabled={collapsedLines.size === 0}
              className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono text-slate-300 hover:text-cyan-300 hover:bg-white/5 transition-all disabled:opacity-40 cursor-pointer"
              title="Expand all sections"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden md:inline">Unfold All</span>
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[var(--accent-cyan)] border border-slate-800 font-mono text-xs transition-all cursor-pointer"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[var(--accent-cyan)] border border-slate-800 transition-all cursor-pointer"
            title="Download .tf Manifest"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Body with Gutter, Line Numbers, and Fold Chevrons */}
      <div className="relative font-mono text-xs sm:text-sm h-[400px] overflow-y-auto overflow-x-auto select-text scroll-smooth p-2">
        {lines.map((line, idx) => {
          // Check if this line is hidden inside a collapsed parent
          if (hiddenLines.has(idx)) {
            return null;
          }

          const block = blockMap.get(idx);
          const isFoldable = Boolean(block);
          const isCollapsed = collapsedLines.has(idx);

          return (
            <div
              key={idx}
              className={`flex items-start group hover:bg-white/[0.03] transition-colors rounded px-1 py-0.5 leading-6 ${
                isCollapsed ? 'bg-cyan-950/20' : ''
              }`}
            >
              {/* Line Gutter: Line Number + Folding Toggle */}
              <div className="flex items-center justify-end gap-1 w-12 sm:w-14 shrink-0 select-none pr-3 text-slate-600 group-hover:text-slate-400 font-mono text-[11px] sm:text-xs">
                {/* Folding chevron */}
                {isFoldable ? (
                  <button
                    onClick={() => toggleFold(idx)}
                    className="w-4 h-4 flex items-center justify-center rounded text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 transition-all cursor-pointer"
                    title={isCollapsed ? `Expand ${block?.label || 'block'} (${block?.lineCount} lines)` : `Collapse ${block?.label || 'block'}`}
                  >
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                  </button>
                ) : (
                  <span className="w-4 h-4"></span>
                )}

                {/* Line number */}
                <span className="tabular-nums text-right">{idx + 1}</span>
              </div>

              {/* Code Line Content */}
              <div className="flex-1 overflow-x-visible whitespace-pre font-mono">
                {renderSyntaxHighlighted(line, isCollapsed, block)}
              </div>
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs px-14 py-2 select-none animate-pulse">
            <span className="w-1.5 h-3 bg-cyan-400"></span>
            <span className="text-slate-400 font-mono">NexusAI compiling AST tokens...</span>
          </div>
        )}
      </div>

      {/* Footer Info Bar */}
      <div className="px-4 py-2 bg-[rgba(15,23,42,0.6)] border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span>HCL / Terraform 1.9+</span>
          <span>·</span>
          <span>{blocks.length} Foldable {blocks.length === 1 ? 'Block' : 'Blocks'}</span>
          {collapsedLines.size > 0 && (
            <>
              <span>·</span>
              <span className="text-cyan-400">{collapsedLines.size} Collapsed</span>
            </>
          )}
        </div>
        <div className="text-slate-500 hidden sm:block">UTF-8 · 2 Spaces</div>
      </div>
    </div>
  );
}
