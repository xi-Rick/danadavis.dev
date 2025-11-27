import type { Course } from '~/types/data'

// Import from single-source JSON at build-time
import coursesJson from '~/json/courses.json'

export const COURSES: Course[] = coursesJson as unknown as Course[]

export default COURSES
