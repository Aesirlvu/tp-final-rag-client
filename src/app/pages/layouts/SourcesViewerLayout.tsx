import { NavigationPanel } from "@/app/modules/sources/NavigationPanel";
import { Outlet } from "react-router-dom";
import pdfUrl2 from "../../../../public/CADIME_BTA_2021_36_04.pdf";
import pdfUrl3 from "../../../../public/guia-adaptacion-gpc.pdf";
import pdfUrl1 from "../../../../public/Perceptrón Simple y Perceptrón Multicapa.pdf";

export interface NavigationItem {
  title: string;
  description: string;
  id: string;
  url: string;
}

export const navigationItems: NavigationItem[] = [
  {
    title: "NC_000007.13:g.(?_6010555)_(6045663_6048627)del",
    description: "N/A",
    id: "VCV004525971",
    url: "https://www.ncbi.nlm.nih.gov/clinvar/variation/4525971/",
  },
  {
    title: "NM_000535.7(PMS2):c.1983_1984insCAAA (p.Asp662fs)",
    description: "N/A",
    id: "VCV004294258",
    url: "https://www.ncbi.nlm.nih.gov/clinvar/variation/4294258/",
  },
  {
    title: "NM_000535.7(PMS2):c.1333_1355dup (p.Gly452_Met453insAlaLeuTer)",
    description: "N/A",
    id: "VCV004294222",
    url: "https://www.ncbi.nlm.nih.gov/clinvar/variation/4294222/",
  },
  {
    title: "Perceptrón Simple y Perceptrón Multicapa",
    description: "N/A",
    id: "VCV004280720",
    url: pdfUrl1,
  },
  {
    title: "CADIME_BTA_2021_36_04",
    description: "N/A",
    id: "VCV004280722",
    url: pdfUrl2,
  },
  {
    title: "no se que poner",
    description: "N/A",
    id: "VCV004280723",
    url: pdfUrl3,
  },
];

const SourcesViewerLayout = () => {
  return (
    <div className="flex-1 h-full flex p-3 border-t gap-3">
      <div className="w-80 bg-muted/10 h-full">
        <NavigationPanel items={navigationItems} />
      </div>
      <div className="flex-1 overflow-hidden">
        <Outlet
          context={{
            content: navigationItems,
          }}
        />
      </div>
    </div>
  );
};

export default SourcesViewerLayout;
