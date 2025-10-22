import { genPageMetadata } from "app/seo";
import { ProjectCard } from "~/components/cards/project";
import { Container } from "~/components/ui/container";
import { PageHeader } from "~/components/ui/page-header";
import { PROJECTS } from "~/data/projects";

export const metadata = genPageMetadata({
  title: "Projects",
  description:
    "Collections of my open-source side projects, along with some cool things I've built with colleagues at work. It's a mix of passion projects and practical tools—some just for fun, others to solve real-world problems.",
});

export default async function Projects() {
  const workProjects = PROJECTS.filter(({ type }) => type === "work");
  const sideProjects = PROJECTS.filter(({ type }) => type === "self");

  return (
    <Container className='pt-4 lg:pt-12'>
      <PageHeader
        title='Projects'
        description='Collections of my open-source side projects, along with some cool things I’ve built with colleagues at work. It’s a mix of passion projects and practical tools—some just for fun, others to solve real-world problems.'
        className='border-b border-gray-200 dark:border-gray-700'
      />
      <div className='py-5 md:py-10'>
        <h3 className='mb-6 text-2xl leading-9 font-bold tracking-tight text-gray-900 md:text-3xl dark:text-gray-100'>
          Work
        </h3>
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
          {workProjects.map((pro) => (
            <ProjectCard key={pro.title} project={pro} />
          ))}
        </div>
      </div>
      <div className='mt-6 border-t border-gray-200 py-5 md:mt-10 md:py-10 dark:border-gray-700'>
        <h3 className='mb-6 text-2xl leading-9 font-bold tracking-tight text-gray-900 md:mb-8 md:text-3xl dark:text-gray-100'>
          Side projects
        </h3>
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
          {sideProjects.map((pro) => (
            <ProjectCard key={pro.title} project={pro} />
          ))}
        </div>
      </div>
    </Container>
  );
}
