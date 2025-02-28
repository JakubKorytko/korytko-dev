import getSections from '@/app/api/sections/getSections';

// eslint-disable-next-line import/prefer-default-export
export async function GET() {
  return Response.json(getSections());
}
