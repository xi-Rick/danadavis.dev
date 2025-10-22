import { Twemoji } from "~/components/ui/twemoji";

export function Intro() {
  return (
    <h1 className='text-neutral-900 dark:text-neutral-200'>
      I&apos;m <span className='font-medium'>Dana Davis</span> - a passionate
      Web Developer in
      <span className='hidden font-medium'>United States</span>
      <span className='absolute ml-1.5 inline-flex pt-[3px]'>
        <Twemoji emoji='flag-us' />
      </span>
    </h1>
  );
}
