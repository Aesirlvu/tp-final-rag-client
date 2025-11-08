import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import type { NavigationItem } from "@/app/pages/layouts/SourcesViewerLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isPdfUrl } from "@/utils/url.utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ChevronDown, File, Newspaper, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const NavigationPanel = ({ items }: { items: NavigationItem[] }) => {
  const navigate = useNavigate();
  const [accordionValue, setAccordionValue] = useState("item-1");

  const toggleAccordion = () => {
    setAccordionValue(accordionValue === "item-1" ? "" : "item-1");
  };

  return (
    <Card className="border rounded-lg h-full flex flex-col bg-card hover:shadow-lg hover:border-primary transition-all duration-200">
      <CardHeader className="pb-2 pt-3 px-3">
        <div className="flex flex-1 border-b p-2">
          <CardTitle className="mr-auto text-lg text-card-foreground">
            Navegación
          </CardTitle>
          <Button
            size="sm"
            className="flex border items-center px-2 py-1 h-auto ml-auto"
            onClick={toggleAccordion}
          >
            <Plus className="h-2 w-2" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground py-2 mx-0.5 border-b max-w-1/4">
          {items.length} elementos
        </p>
      </CardHeader>
      <CardContent className="px-2 pb-2 flex-1 overflow-hidden">
        <div className="h-full pr-2 overflow-y-auto">
          <div className="space-y-1">
            <Accordion
              type="single"
              collapsible
              className="w-full"
              value={accordionValue}
              onValueChange={setAccordionValue}
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="w-full">
                  <div className="flex flex-1 p-2 border-b">
                    <p className="mr-auto text-sm text-card-foreground">
                      Documentos
                    </p>
                    <ChevronDown
                      className={cn(
                        "ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180",
                        accordionValue === "item-1" ? "rotate-180" : ""
                      )}
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                  )}
                >
                  <div className="flex flex-col gap-4 text-balance">
                    <ScrollArea className="h-full border-b p-2">
                      <div className="space-y-1 mx-5 pb-2">
                        {items.map((item) => {
                          const isPdf = isPdfUrl(item.url);
                          return (
                            <Button
                              key={item.id}
                              variant="outline"
                              className={cn(
                                "w-[calc(16vw)] justify-center text-left h-auto py-2 hover:bg-accent text-foreground",
                                "transition-all duration-200"
                              )}
                              onClick={() =>
                                navigate(
                                  isPdf
                                    ? `/sources/viewer/file/${item.id}`
                                    : `/sources/viewer/web/${item.id}`
                                )
                              }
                            >
                              <div className="flex items-start gap-2 w-full">
                                {isPdf ? (
                                  <File className="size-3 text-red-500 mt-2 shrink-0" />
                                ) : (
                                  <Newspaper className="size-3 text-blue-500 mt-2 shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={cn(
                                      "text-xs font-medium truncate text-foreground"
                                    )}
                                  >
                                    {item.title}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                                    {item.description} - {item.id}
                                  </p>
                                </div>
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
