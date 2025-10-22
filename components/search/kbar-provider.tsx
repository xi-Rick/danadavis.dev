"use client";

import type { Action } from "kbar";
import { KBarProvider } from "kbar";
import { useRouter } from "next/navigation.js";
import { type ReactNode, useEffect, useState } from "react";
import type { CoreContent, MDXDocument } from "~/types/data";
import { formatDate } from "~/utils/misc";
import { KBarModal } from "./kbar-modal";

export interface KBarSearchProps {
  searchDocumentsPath: string | false;
  defaultActions?: Action[];
  onSearchDocumentsLoad?: (json: unknown) => Action[];
}

export interface KBarConfig {
  provider: "kbar";
  kbarConfig: KBarSearchProps;
}

export function KBarSearchProvider({
  configs,
  children,
}: {
  configs: KBarSearchProps;
  children: ReactNode;
}) {
  const { searchDocumentsPath, defaultActions, onSearchDocumentsLoad } =
    configs;
  const router = useRouter();
  const [searchActions, setSearchActions] = useState<Action[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    function mapPosts(posts: CoreContent<MDXDocument>[]) {
      const actions: Action[] = [];
      for (const post of posts) {
        actions.push({
          id: post.path,
          name: post.title,
          keywords: post?.summary || "",
          section: "Content",
          subtitle: formatDate(post.date),
          perform: () => router.push(`/${post.path}`),
        });
      }
      return actions;
    }
    async function fetchData() {
      if (searchDocumentsPath) {
        try {
          const url =
            searchDocumentsPath.indexOf("://") > 0 ||
            searchDocumentsPath.indexOf("//") === 0
              ? searchDocumentsPath
              : new URL(searchDocumentsPath, window.location.origin);
          const res = await fetch(url);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const json = await res.json();
          const actions = onSearchDocumentsLoad
            ? onSearchDocumentsLoad(json)
            : mapPosts(json);
          setSearchActions(actions);
          setDataLoaded(true);
        } catch (error) {
          console.error("Failed to fetch search documents:", error);
          setDataLoaded(true); // Still set loaded to true to avoid infinite loading
        }
      }
    }
    if (!dataLoaded && searchDocumentsPath) {
      fetchData();
    } else {
      setDataLoaded(true);
    }
  }, [
    defaultActions,
    dataLoaded,
    router,
    searchDocumentsPath,
    onSearchDocumentsLoad,
  ]);

  return (
    <KBarProvider actions={defaultActions}>
      <KBarModal actions={searchActions} isLoading={!dataLoaded} />
      {children}
    </KBarProvider>
  );
}
