import type { StatsType } from "@prisma/client";
import { prisma } from "./index";

export type SelectStats = {
  type: StatsType;
  slug: string;
  views: number;
  loves: number;
  applauses: number;
  ideas: number;
  bullseyes: number;
};

export type { StatsType };

export async function getBlogStats(type: StatsType, slug: string) {
  try {
    let stats = await prisma.stats.findUnique({
      where: {
        type_slug: {
          type,
          slug,
        },
      },
    });
    if (stats) {
      return stats;
    }
    let newStats = await prisma.stats.create({
      data: {
        type,
        slug,
      },
    });
    return newStats;
  } catch (error) {
    // Return default stats if database is unavailable
    return {
      type,
      slug,
      views: 0,
      loves: 0,
      applauses: 0,
      ideas: 0,
      bullseyes: 0,
    };
  }
}

export async function updateBlogStats(
  type: StatsType,
  slug: string,
  updates: Omit<SelectStats, "type" | "slug">
) {
  try {
    let currentStats = await getBlogStats(type, slug);
    // Safeguard against negative updates
    for (let key in updates) {
      if (
        typeof updates[key] === "number" &&
        updates[key] < currentStats[key]
      ) {
        updates[key] = currentStats[key];
      }
    }
    let updatedStats = await prisma.stats.update({
      where: {
        type_slug: {
          type,
          slug,
        },
      },
      data: updates,
    });
    return updatedStats;
  } catch (error) {
    // Return updated stats if database is unavailable
    let currentStats = await getBlogStats(type, slug);
    return {
      ...currentStats,
      ...updates,
    };
  }
}

export async function getCurrentlyReading(): Promise<any> {
  let books = await prisma.goodreadsBook.findMany({
    where: { userShelves: "currently-reading" },
    orderBy: { pubDate: "desc" },
    take: 1,
  });
  return books[0] || null;
}

export async function getLastWatchedMovie(): Promise<any> {
  let movies = await prisma.goodreadsMovie.findMany({
    orderBy: { dateRated: "desc" },
    take: 1,
  });
  return movies[0] || null;
}

export async function upsertBooks(booksData: any[]): Promise<any[]> {
  let result = await Promise.all(
    booksData.map((bookData) =>
      prisma.goodreadsBook.upsert({
        where: { id: bookData.id },
        update: { ...bookData, updatedAt: new Date() },
        create: { ...bookData, updatedAt: new Date() },
      })
    )
  );
  return result;
}

export async function upsertManyMovies(moviesData: any[]): Promise<any[]> {
  let result = await Promise.all(
    moviesData.map((movieData) =>
      prisma.goodreadsMovie.upsert({
        where: { id: movieData.id },
        update: { ...movieData, updatedAt: new Date() },
        create: { ...movieData, updatedAt: new Date() },
      })
    )
  );
  return result;
}
