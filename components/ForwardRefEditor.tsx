"use client";

import type { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { forwardRef } from "react";

const Editor = dynamic(() => import("./InitializedMDXEditor"), {
  ssr: false,
});

// Wrap the dynamically loaded editor in a stable container so the
// page doesn't shift when the editor JS bundles load. The container
// preserves any `className` (for example min-h-[600px]) passed from
// the page and provides a subtle loading state while the editor mounts.
export const ForwardRefEditor = forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => {
    const { className, ...rest } = props as MDXEditorProps & {
      className?: string;
    };

    return (
      <div
        className={className ?? "min-h-[600px]"}
        aria-busy={true}
        aria-live='polite'>
        <Editor {...(rest as MDXEditorProps)} editorRef={ref} />
      </div>
    );
  }
);

ForwardRefEditor.displayName = "ForwardRefEditor";
