import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

const readXML = (XMLpath: string) => {
  const XMLdata = fs.readFileSync(path.resolve(process.cwd(), XMLpath));
  const parser = new XMLParser();
  return parser.parse(XMLdata);
};

const readLayout = () => readXML('src/data/layout.xml');

const readYML = (YMLpath: string) => {
  const YMLdata = fs.readFileSync(
    path.resolve(process.cwd(), YMLpath),
    'utf-8',
  );

  return YAML.parse(YMLdata);
};

const readSkills = () => readYML('src/data/skills/test_skill.yml');

export { readLayout, readSkills };
