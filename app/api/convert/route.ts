import { NextResponse } from "next/server"
import jsYaml from "js-yaml"

const keyConversionMap = new Map([
  ["DOMAIN-SUFFIX", "domain_suffix"],
  ["HOST-SUFFIX", "domain_suffix"],
  ["host-suffix", "domain_suffix"],
  ["DOMAIN", "domain"],
  ["HOST", "domain"],
  ["host", "domain"],
  ["DOMAIN-KEYWORD", "domain_keyword"],
  ["HOST-KEYWORD", "domain_keyword"],
  ["host-keyword", "domain_keyword"],
  ["IP-CIDR", "ip_cidr"],
  ["ip-cidr", "ip_cidr"],
  ["IP-CIDR6", "ip_cidr"],
  ["IP6-CIDR", "ip_cidr"],
  ["SRC-IP-CIDR", "source_ip_cidr"],
  ["GEOIP", "geoip"],
  ["DST-PORT", "port"],
  ["SRC-PORT", "source_port"],
  ["URL-REGEX", "domain_regex"],
  ["DOMAIN-REGEX", "domain_regex"],
  ["PROCESS-NAME", "process_name"],
])

async function fetchYaml(url: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch YAML from ${url}`)
    }
    const yamlText = await response.text()
    return jsYaml.load(yamlText)
  } catch (error) {
    console.error(`Error fetching YAML from ${url}:`, error)
    throw error
  }
}

function extractFilename(url: string): string {
  const urlObj = new URL(url)
  const pathname = urlObj.pathname
  const filename = pathname.split("/").pop() || "unknown"
  return filename.replace(".yaml", "").replace(".yml", "")
}

function parseYAMLContent(yamlData: any) {
  const rulesMap = new Map()

  yamlData.payload.forEach((item: string) => {
    const [key, ...valueParts] = item.split(",")
    const value = valueParts.join(",").trim()
    if (key) {
      const trimmedKey = key.trim()
      const convertedKey = keyConversionMap.get(trimmedKey)
      if (convertedKey) {
        if (!rulesMap.has(convertedKey)) {
          rulesMap.set(convertedKey, [])
        }
        rulesMap.get(convertedKey).push(value)
      }
    }
  })

  const rules = Array.from(rulesMap).map(([key, values]) => ({
    [key]: values,
  }))

  return {
    rules,
    version: 1,
  }
}

export async function POST(request: Request) {
  try {
    const { links } = await request.json()

    const convertedJsons = await Promise.all(
      links.map(async (link: string) => {
        try {
          const yamlContent = await fetchYaml(link)
          const filename = extractFilename(link)

          // 使用原有的转换逻辑
          const convertedJson = parseYAMLContent(yamlContent)

          return {
            filename,
            content: JSON.stringify(convertedJson, null, 2),
          }
        } catch (error) {
          console.error(`Error processing ${link}:`, error)
          return null
        }
      }),
    )

    // 过滤掉失败的请求
    const validResults = convertedJsons.filter((result) => result !== null)

    return NextResponse.json(validResults)
  } catch (error) {
    console.error("Conversion error:", error)
    return NextResponse.json({ error: "Failed to convert YAML to JSON" }, { status: 500 })
  }
}

