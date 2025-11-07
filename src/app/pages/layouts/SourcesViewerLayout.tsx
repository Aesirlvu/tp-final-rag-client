import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import { isPdfUrl } from "@/utils/url.utils";
import { File } from "lucide-react";

interface NavigationItem {
    title: string;
    description: string;
    id: string;
    url: string;
}

const NavigationPanel = ({
    items,
}: {
    items: NavigationItem[];
}) => {
    const navigate = useNavigate();

    return (
        <Card className="border rounded-lg h-full flex flex-col bg-card">
            <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-base text-card-foreground">Navegación</CardTitle>
                <p className="text-xs text-muted-foreground">
                    {items.length} elementos
                </p>
            </CardHeader>
            <CardContent className="px-2 pb-2 flex-1 overflow-hidden">
                <div className="h-full pr-2 overflow-y-auto">
                    <div className="space-y-1">
                        {items.map((item) => {
                            const isPdf = isPdfUrl(item.url);
                            return (
                                <Button
                                    key={item.id}
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left h-auto py-2 bg-background hover:bg-accent text-foreground",
                                        "transition-all duration-200"
                                    )}
                                    onClick={() => navigate(isPdf ? `/sources/viewer/file/${item.id}` : `/sources/viewer/web/${item.id}`)}
                                >
                                    <div className="flex items-start gap-2 w-full">
                                        {isPdf && <File className="size-3 text-blue-500 mt-0.5 shrink-0" />}
                                        <div className="flex-1 min-w-0">
                                            <p className={cn(
                                                "text-xs font-medium truncate text-foreground"
                                            )}>
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
                </div>
            </CardContent>
        </Card>
    );
};

const SourcesViewerLayout = () => {
    // Array de elementos de navegación
    const navigationItems: NavigationItem[] = [
        {
            "title": "NC_000007.13:g.(?_6010555)_(6045663_6048627)del",
            "description": "N/A",
            "id": "VCV004525971",
            "url": "https://www.ncbi.nlm.nih.gov/clinvar/variation/4525971/"
        },
        {
            "title": "NM_000535.7(PMS2):c.1983_1984insCAAA (p.Asp662fs)",
            "description": "N/A",
            "id": "VCV004294258",
            "url": "https://www.ncbi.nlm.nih.gov/clinvar/variation/4294258/"
        },
        {
            "title": "NM_000535.7(PMS2):c.1333_1355dup (p.Gly452_Met453insAlaLeuTer)",
            "description": "N/A",
            "id": "VCV004294222",
            "url": "https://www.ncbi.nlm.nih.gov/clinvar/variation/4294222/"
        },
        {
            "title": "NM_000535.7(PMS2):c.250+1G>T",
            "description": "N/A",
            "id": "VCV004294205",
            "url": "https://www.ncbi.nlm.nih.gov/clinvar/variation/4294205/"
        },
        {
            "title": "Guía Adaptación GPC",
            "description": "Documento PDF sobre adaptación GPC",
            "id": "pdf1",
            "url": "https://www.argentina.gob.ar/sites/default/files/guia-adaptacion-gpc.pdf"
        },
        {
            "title": "CADIME BTA 2021",
            "description": "Documento técnico CADIME",
            "id": "pdf2",
            "url": "https://www.cadime.es/images/documentos_archivos_web/BTA/2021/CADIME_BTA_2021_36_04.pdf"
        },
        {
            "title": "Manual GPC Completo",
            "description": "Manual completo de GPC",
            "id": "pdf3",
            "url": "https://portal.guiasalud.es/wp-content/uploads/2019/01/manual_gpc_completo.pdf"
        },
        {
            "title": "Buenas Prácticas Doc Américas",
            "description": "Documento técnico sobre buenas prácticas",
            "id": "pdf4",
            "url": "https://www.ms.gba.gov.ar/ssps/investigacion/DocTecnicos/BuenasPracticas-DocAmericas.pdf"
        },
    ];

    return (
        <div className="flex-1 h-full flex p-3 border-t gap-3">
            {/* Panel lateral */}
            <div className="w-80 bg-muted/10 h-full">
                <NavigationPanel
                    items={navigationItems}
                />
            </div>
            {/* Área principal - Contenido distribuido por Outlet */}
            <div className="flex-1 overflow-hidden">
                <Outlet />
            </div>
        </div>
    )
}

export default SourcesViewerLayout