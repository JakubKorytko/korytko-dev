import getSections from '@/app/api/sections/getSections';

export async function GET() {
  return Response.json(getSections());
}
