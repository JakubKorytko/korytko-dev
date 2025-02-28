import getConsoleText from '@/app/api/console/getConsoleText';

// eslint-disable-next-line import/prefer-default-export
export async function GET() {
  return new Response(getConsoleText(), {
    status: 200,
  });
}
