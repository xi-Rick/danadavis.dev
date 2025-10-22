"use client";

import { allBlogs, allSnippets } from "contentlayer/generated";
import { useEffect, useRef } from "react";
import { Home } from "~/components/home-page";
import { allCoreContent } from "~/utils/contentlayer";
import { sortPosts } from "~/utils/misc";

const MAX_POSTS_DISPLAY = 3;
const MAX_SNIPPETS_DISPLAY = 4;

export default function HomePage() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const hasPlayed = localStorage.getItem("openingPlayed");
    if (!hasPlayed && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Audio play failed:", error);
      });
      localStorage.setItem("openingPlayed", "true");
    }
  }, []);

  return (
    <>
      <audio ref={audioRef} src='/audio/opening.mp3' />
      <Home
        posts={allCoreContent(sortPosts(allBlogs)).slice(0, MAX_POSTS_DISPLAY)}
        snippets={allCoreContent(sortPosts(allSnippets)).slice(
          0,
          MAX_SNIPPETS_DISPLAY
        )}
      />
    </>
  );
}
