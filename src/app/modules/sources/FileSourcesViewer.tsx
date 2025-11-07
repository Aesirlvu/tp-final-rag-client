import { Card } from "@/app/components/ui/card";
import { ScrollMode, SpecialZoomLevel, Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useTheme } from "next-themes";
import { useParams } from "react-router-dom";
import { isPdfUrl } from "@/utils/url.utils";

interface NavigationItem {
    title: string;
    description: string;
    id: string;
    url: string;
}

interface FileContentViewerProps {
    content?: any;
}

const FileContentViewer: React.FC<FileContentViewerProps> = () => {
    const { id } = useParams<{ id: string }>();
    const { theme } = useTheme();

    // Array de elementos de navegación - se poblará desde API
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
            "title": "guia-adaptacion-gpc",
            "description": "N/A",
            "id": "VCV004280720",
            "url": "https://www.argentina.gob.ar/sites/default/files/guia-adaptacion-gpc.pdf"
        },
        {
            "title": "NM_000535.7(PMS2):c.*110del",
            "description": "N/A",
            "id": "VCV004280720",
            "url": "https://www.argentina.gob.ar/sites/default/files/guia-adaptacion-gpc.pdf"
        },
    ];

    const selectedItem = navigationItems.find(v => v.id === id);

    if (!selectedItem) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <p className="text-sm">Elemento no encontrado.</p>
            </div>
        );
    }

    if (!isPdfUrl(selectedItem.url)) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <p className="text-sm">Este elemento no es un archivo PDF válido.</p>
            </div>
        );
    }

    const mimetype = "application/pdf"; // Forzamos PDF ya que validamos
    const fileUrl = selectedItem.url;
    // const cloudinaryId = metadata?.cloudinaryId;

    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <Card className="w-full">
            {/* <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <File className="size-5" />
          {formatTextWithUmlauts(filename)}
        </CardTitle>
        <CardDescription className="space-y-1">
          {mimetype && <div>Tipo: {mimetype}</div>}
          {fileSize && <div>Tamaño: {(fileSize / 1024).toFixed(1)} KB</div>}
          {uploadDate && (
            <div>Subido: {new Date(uploadDate).toLocaleDateString()}</div>
          )}
          {processingStatus && <div>Estado: {processingStatus}</div>}
          {processingError && (
            <div className="text-red-500">Error: {processingError}</div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Acciones del archivo */}
            {/* {fileUrl && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <Download className="size-4 mr-2" />
              Descargar
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4 mr-2" />
              Abrir
            </a>
          </Button>
        </div>
      )}  */}
            {mimetype === "application/pdf" && fileUrl && (
                <div>
                    <div className="w-full h-[calc(100vh-164px)] rounded-xl overflow-auto">
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} theme={theme} defaultScale={SpecialZoomLevel['ActualSize']} scrollMode={ScrollMode.Page} />
                        </Worker>
                    </div>
                </div>
            )}
            {/* {fileFullTextContent && (
                <div>
                    <h4 className="font-semibold text-sm mb-2">
                        Contenido del archivo
                    </h4>
                    <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                        <pre className="text-xs whitespace-pre-wrap break-words">
                            {fileFullTextContent}
                        </pre>
                    </div>
                </div>
            )} */}
        </Card>
    );
};

export default FileContentViewer;
