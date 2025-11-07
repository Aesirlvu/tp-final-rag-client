import {
    WebPreview,
    WebPreviewBody,
    WebPreviewNavigation,
    WebPreviewUrl,
} from "@/components/ai-elements/web-preview";
import { Button } from "@/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { getDomainFromUrl, getFaviconUrl, isPdfUrl } from "@/utils/url.utils";
import { CheckCircle, ExternalLink, Globe, XCircle } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams } from "react-router-dom";

interface WebSourcesViewerProps {
    content?: {
        id: string;
        body: Record<string, unknown>;
        metadata?: {
            webpageUrl?: string;
            webpageTitle?: string;
            webpageDescription?: string;
            webpageKeywords?: string[];
            isAccessible?: boolean;
        };
    }
    showInlineHeader?: boolean;
}

interface NavigationItem {
    title: string;
    description: string;
    id: string;
    url: string;
}

const WebSourcesViewer: React.FC<WebSourcesViewerProps> = ({
    content,
    showInlineHeader
}) => {
    const { id } = useParams<{ id: string }>();

    // Array de elementos de navegación
    const navigationItems: NavigationItem[] = [
        {
            "title": "NC_000007.13:g.(?_6010555)_(6045663_6048627)del",
            "description": "N/A",
            "id": "VCV004525971",
            "url": "https://www.ncbi.nlm.nih.gov/clinvar/variation/4525971/"
        }, {
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

    const webItems = navigationItems.filter(item => !isPdfUrl(item.url));
    const effectiveId = id || webItems[0]?.id;
    const selectedItem = webItems.find(v => v.id === effectiveId);

    if (content) {
        // Código para cuando hay content
        const webpageBody = content.body as any;
        const metadata = content.metadata;

        const [showPreview] = useState(true);
        const [previewError, setPreviewError] = useState(false);

        // Usar metadata si está disponible, sino el body
        const url = webpageBody.url || metadata?.webpageUrl;
        const title = webpageBody.title || metadata?.webpageTitle || "Sin título";
        const formattedContent = webpageBody.formattedContent;
        const isAccessible = metadata?.isAccessible;

        // Obtener dominio y favicon
        const domain = getDomainFromUrl(url);
        const faviconUrl = getFaviconUrl(url);

        // Header compacto inline (aparece arriba del panel)
        const inlineHeader = showInlineHeader && (
            <>
                <div className="flex items-center justify-between gap-3 px-4 py-2 bg-muted/30 border-b ">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <img
                            src={faviconUrl}
                            alt={`${domain} favicon`}
                            className="w-4 h-4 rounded-sm "
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                            }}
                        />
                        <Globe className="size-3 text-muted-foreground " />
                        <span className="text-xs text-muted-foreground truncate">
                            {domain}
                        </span>
                        <Separator orientation="vertical" className="h-3" />
                        <span className="text-xs font-medium truncate">{title}</span>
                        {isAccessible !== undefined && (
                            <span className="flex items-center gap-1 text-xs ">
                                {isAccessible ? (
                                    <CheckCircle className="size-3 text-green-500" />
                                ) : (
                                    <XCircle className="size-3 text-red-500" />
                                )}
                            </span>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs "
                        asChild
                    >
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="size-3 mr-1" />
                            Abrir
                        </a>
                    </Button>
                </div>
                {previewError && (
                    <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-center ">
                        <p className="text-[10px] text-amber-600 dark:text-amber-400">
                            ⚠️ Esta página bloquea la visualización embebida
                        </p>
                    </div>
                )}
            </>
        );

        return (
            <>
                {inlineHeader}
                {/* Web Preview o contenido formateado - Ocupa TODO el espacio */}
                <div className="flex-1 overflow-hidden">
                    {showPreview && !previewError ? (
                        <div key={url} className="w-full h-full bg-background">
                            <WebPreview key={`preview-${content.id}-${url}`} defaultUrl={url}>
                                <WebPreviewNavigation>
                                    <WebPreviewUrl readOnly />
                                </WebPreviewNavigation>
                                <WebPreviewBody onError={() => setPreviewError(true)} />
                            </WebPreview>
                        </div>
                    ) : formattedContent ? (
                        <div className="h-full overflow-y-auto p-4">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {formattedContent}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <Globe className="size-12 mb-4 opacity-50" />
                            <p className="text-sm mb-4">
                                No se puede mostrar la vista previa de esta página.
                            </p>
                            <Button variant="default" asChild>
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                    Abrir en nueva pestaña →
                                </a>
                            </Button>
                        </div>
                    )}
                </div>
            </>
        );
    } else {
        return (
            <div className="w-full h-full bg-background">
                <WebPreview key={`preview-${selectedItem!.id}`} defaultUrl={selectedItem!.url}>
                    <WebPreviewNavigation>
                        <WebPreviewUrl readOnly />
                    </WebPreviewNavigation>
                    <WebPreviewBody />
                </WebPreview>
            </div>
        );
    }
};

export default WebSourcesViewer;