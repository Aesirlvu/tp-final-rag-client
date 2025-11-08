import { Card } from "@/app/components/ui/card";
import { isPdfUrl } from "@/utils/url.utils";
import {
  ScrollMode,
  SpecialZoomLevel,
  Viewer,
  Worker,
} from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useTheme } from "next-themes";
import { useOutletContext } from "react-router";
import { useParams } from "react-router-dom";
import type { NavigationItem } from "./types";

interface FileContentViewerProps {
  content: NavigationItem[];
}
const useSourceContentContext = () => {
  return useOutletContext<{ content: NavigationItem[] }>();
};

const FileContentViewer: React.FC<FileContentViewerProps> = () => {
  const { content: sourceContent } = useSourceContentContext();

  console.log(sourceContent);

  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();

  const selectedItem = sourceContent.find((v) => v.id === id);

  console.log(selectedItem);

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
              <Viewer
                fileUrl={fileUrl}
                plugins={[defaultLayoutPluginInstance]}
                theme={theme}
                defaultScale={SpecialZoomLevel["ActualSize"]}
                scrollMode={ScrollMode.Page}
              />
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
