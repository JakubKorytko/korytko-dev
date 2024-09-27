import fs from "fs";
import path from "path";
import YAML from "yaml";
import { XMLParser } from "fast-xml-parser";

const ReadXML = (XMLpath: string) => {
  const XMLdata = fs.readFileSync(path.resolve(process.cwd(), XMLpath));
  const parser = new XMLParser();

  return parser.parse(XMLdata);
};

const ReadLayout = () => ReadXML("src/data/layout.xml");

const ReadYML = (YMLpath: string) => {
  const YMLdata = fs.readFileSync(
    path.resolve(process.cwd(), YMLpath),
    "utf-8",
  );

  return YAML.parse(YMLdata);
};

const ReadSkills = () => ReadYML("src/data/skills/test_skill.yml");

export { ReadLayout, ReadSkills };
