import { Sections } from '@/app/api/sections/getSections.type';

import { readLayout } from '@/utils/readData';

const getSections = (): Sections => {
  const sections = readLayout();
  const sectionsRoot = sections[Object.keys(sections)[0]];
  return Object.fromEntries(Object.entries(sectionsRoot)
    .map((section) => [
      section[0],
      {
        name: section[0].replace(/([A-Z])/g, ' $1').trim(),
        data: section[1] as string | string[] | object,
      }]));
};

export default getSections;
