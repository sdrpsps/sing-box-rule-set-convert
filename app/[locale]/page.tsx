"use client";

import { useState } from "react";
import { Plus, Download, FileJson, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConvertedJson {
  filename: string;
  content: string;
}

export default function ConvertPage() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  const [links, setLinks] = useState<string[]>([""]);
  const [outputJsons, setOutputJsons] = useState<ConvertedJson[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const addLink = () => {
    setLinks([...links, ""]);
  };

  const removeLink = (index: number) => {
    if (links.length > 1) {
      const newLinks = links.filter((_, i) => i !== index);
      setLinks(newLinks);
    }
  };

  const updateLink = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleConvert = async () => {
    const validLinks = links.filter((link) => link.trim() !== "");

    if (validLinks.length === 0) {
      toast.error(t("errorNoValidLinks"));
      return;
    }

    setIsConverting(true);
    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ links: validLinks }),
      });

      if (!response.ok) {
        throw new Error("Conversion failed");
      }

      const data = await response.json();
      setOutputJsons(data);
      toast.success(t("successConversion"));
    } catch (error) {
      toast.error(t("errorConversionFailed"));
      console.error(error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = (json: ConvertedJson) => {
    const blob = new Blob([json.content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${json.filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const changeLanguage = (locale: string) => {
    router.push(`/${locale}`);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>
            <div className="flex items-center justify-between">
              <div>{t("description")}</div>
              <Select
                onValueChange={changeLanguage}
                defaultValue={pathname.split("/")[1]}
              >
                <SelectTrigger className="h-8 w-24">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">{t("yamlLinks")}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={addLink}
                >
                  <Plus className="size-4" />
                  {t("addLink")}
                </Button>
              </div>
              <div className="space-y-2">
                {links.map((link, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={t("enterYamlUrl")}
                      value={link}
                      onChange={(e) => updateLink(index, e.target.value)}
                    />
                    {links.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLink(index)}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <Button
              className="w-full gap-2"
              onClick={handleConvert}
              disabled={isConverting}
            >
              <FileJson className="size-4" />
              {isConverting ? t("converting") : t("convert")}
            </Button>
            {outputJsons.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">{t("outputJson")}</h3>
                <Tabs defaultValue={outputJsons[0].filename}>
                  <TabsList>
                    {outputJsons.map((json) => (
                      <TabsTrigger key={json.filename} value={json.filename}>
                        {json.filename}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {outputJsons.map((json) => (
                    <TabsContent key={json.filename} value={json.filename}>
                      <div className="flex justify-end mb-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleDownload(json)}
                        >
                          <Download className="size-4" />
                          {t("download")} {json.filename}.json
                        </Button>
                      </div>
                      <Textarea
                        className="font-mono min-h-[400px]"
                        value={json.content}
                        readOnly
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
