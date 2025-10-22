import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { writeFileSync } from "node:fs";
import { type NextRequest, NextResponse } from "next/server";
import { join } from "node:path";

export async function PUT(request: NextRequest) {
  try {
    const { isAuthenticated } = getKindeServerSession();
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      slug,
      title,
      summary,
      tags,
      categories,
      images,
      canonicalUrl,
      layout,
      bibliography,
      draft,
      featured,
      content,
    } = await request.json();

    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: "Slug, title and content are required" },
        { status: 400 }
      );
    }

    // Create frontmatter
    const frontmatter: string[] = [];
    frontmatter.push("---");
    frontmatter.push(`title: "${title.replace(/"/g, '\\"')}"`);
    frontmatter.push(`date: "${new Date().toISOString()}"`);
    frontmatter.push(`lastmod: "${new Date().toISOString()}"`);

    if (tags && tags.length > 0) {
      frontmatter.push(
        `tags: [${tags.map((tag: string) => `"${tag.replace(/"/g, '\\"')}"`).join(", ")}]`
      );
    }

    if (categories && categories.length > 0) {
      frontmatter.push(
        `categories: [${categories.map((cat: string) => `"${cat.replace(/"/g, '\\"')}"`).join(", ")}]`
      );
    }

    if (images && images.length > 0) {
      frontmatter.push(
        `images: [${images.map((img: string) => `"${img.replace(/"/g, '\\"')}"`).join(", ")}]`
      );
    }

    frontmatter.push(`authors: ["Dana Davis"]`);
    frontmatter.push(`draft: ${draft || false}`);
    frontmatter.push(`featured: ${featured || false}`);

    if (canonicalUrl) {
      frontmatter.push(`canonicalUrl: "${canonicalUrl.replace(/"/g, '\\"')}"`);
    }

    if (layout) {
      frontmatter.push(`layout: "${layout.replace(/"/g, '\\"')}"`);
    }

    if (bibliography) {
      frontmatter.push(`bibliography: "${bibliography.replace(/"/g, '\\"')}"`);
    }

    if (summary) {
      frontmatter.push(`summary: "${summary.replace(/"/g, '\\"')}"`);
    }

    frontmatter.push("---");
    frontmatter.push("");

    const fullContent = frontmatter.join("\n") + content;

    // Write to file (overwrite existing)
    const filePath = join(process.cwd(), "data", "blog", `${slug}.mdx`);
    writeFileSync(filePath, fullContent);

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isAuthenticated } = getKindeServerSession();
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      summary,
      tags,
      categories,
      images,
      canonicalUrl,
      layout,
      bibliography,
      draft,
      featured,
      content,
    } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Create frontmatter
    const frontmatter: string[] = [];
    frontmatter.push("---");
    frontmatter.push(`title: "${title.replace(/"/g, '\\"')}"`);
    frontmatter.push(`date: "${new Date().toISOString()}"`);
    frontmatter.push(`lastmod: "${new Date().toISOString()}"`);

    if (tags && tags.length > 0) {
      frontmatter.push(
        `tags: [${tags.map((tag: string) => `"${tag.replace(/"/g, '\\"')}"`).join(", ")}]`
      );
    }

    if (categories && categories.length > 0) {
      frontmatter.push(
        `categories: [${categories.map((cat: string) => `"${cat.replace(/"/g, '\\"')}"`).join(", ")}]`
      );
    }

    if (images && images.length > 0) {
      frontmatter.push(
        `images: [${images.map((img: string) => `"${img.replace(/"/g, '\\"')}"`).join(", ")}]`
      );
    }

    frontmatter.push(`authors: ["Dana Davis"]`);
    frontmatter.push(`draft: ${draft || false}`);
    frontmatter.push(`featured: ${featured || false}`);

    if (canonicalUrl) {
      frontmatter.push(`canonicalUrl: "${canonicalUrl.replace(/"/g, '\\"')}"`);
    }

    if (layout) {
      frontmatter.push(`layout: "${layout.replace(/"/g, '\\"')}"`);
    }

    if (bibliography) {
      frontmatter.push(`bibliography: "${bibliography.replace(/"/g, '\\"')}"`);
    }

    if (summary) {
      frontmatter.push(`summary: "${summary.replace(/"/g, '\\"')}"`);
    }

    frontmatter.push("---");
    frontmatter.push("");

    const fullContent = frontmatter.join("\n") + content;

    // Write to file
    const filePath = join(process.cwd(), "data", "blog", `${slug}.mdx`);
    writeFileSync(filePath, fullContent);

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("Error saving post:", error);
    return NextResponse.json({ error: "Failed to save post" }, { status: 500 });
  }
}
