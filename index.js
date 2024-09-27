import yaml from 'js-yaml';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

const linkPrefixes = new Set(['LINK_']);

const links = Object.entries(process.env)
  .filter(([key]) => [...linkPrefixes].some(prefix => key.startsWith(prefix)))
  .map(([key, value]) => ({
    url: value,
    name: key.slice(5).toLowerCase()
  }));

const keyConversionMap = new Map([
  ['DOMAIN-SUFFIX', 'domain_suffix'],
  ['HOST-SUFFIX', 'domain_suffix'],
  ['host-suffix', 'domain_suffix'],
  ['DOMAIN', 'domain'],
  ['HOST', 'domain'],
  ['host', 'domain'],
  ['DOMAIN-KEYWORD', 'domain_keyword'],
  ['HOST-KEYWORD', 'domain_keyword'],
  ['host-keyword', 'domain_keyword'],
  ['IP-CIDR', 'ip_cidr'],
  ['ip-cidr', 'ip_cidr'],
  ['IP-CIDR6', 'ip_cidr'],
  ['IP6-CIDR', 'ip_cidr'],
  ['SRC-IP-CIDR', 'source_ip_cidr'],
  ['GEOIP', 'geoip'],
  ['DST-PORT', 'port'],
  ['SRC-PORT', 'source_port'],
  ['URL-REGEX', 'domain_regex'],
  ['DOMAIN-REGEX', 'domain_regex'],
  ['PROCESS-NAME', 'process_name']
]);

const downloadAndParseYAML = async (link) => {
  try {
    const response = await fetch(link.url);
    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态: ${response.status}`);
    }
    const yamlContent = await response.text();
    return yaml.load(yamlContent);
  } catch (error) {
    console.error(`下载或解析YAML文件时出错 (${link.name}): ${error.message}`);
    return null;
  }
};

const parseYAMLContent = (yamlData) => {
  const rulesMap = new Map();

  yamlData.payload.forEach(item => {
    const [key, ...valueParts] = item.split(',');
    const value = valueParts.join(',').trim();
    if (key) {
      const trimmedKey = key.trim();
      const convertedKey = keyConversionMap.get(trimmedKey);
      if (convertedKey) {
        if (!rulesMap.has(convertedKey)) {
          rulesMap.set(convertedKey, []);
        }
        rulesMap.get(convertedKey).push(value);
      }
    }
  });

  return {
    version: 1,
    rules: Object.fromEntries(rulesMap)
  };
};

const processAllLinks = async () => {
  const outputDir = './output';
  await fs.mkdir(outputDir, { recursive: true });

  const fileWritePromises = links.map(async (link) => {
    const yamlData = await downloadAndParseYAML(link);
    if (yamlData) {
      const parsedData = parseYAMLContent(yamlData);
      const fileName = `${outputDir}/${link.name}.json`;
      await fs.writeFile(fileName, JSON.stringify(parsedData, null, 2));
      console.log(`已生成新的JSON文件：${fileName}`);
      return fileName;
    }
    return null;
  });

  const results = await Promise.all(fileWritePromises);
  return results.filter(fileName => fileName !== null);
};

processAllLinks()
  .then(generatedFiles => {
    console.log('所有文件处理完成。生成的文件：', generatedFiles);
  })
  .catch(error => {
    console.error('处理过程中发生错误：', error);
  });