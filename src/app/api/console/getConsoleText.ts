import fs from 'fs';
import path from 'path';

const getConsoleText = () => {
  const consoleText = fs.readFileSync(path.resolve(process.cwd(), 'src/data/console.txt'), 'utf8');
  return consoleText.toString();
};

export default getConsoleText;
