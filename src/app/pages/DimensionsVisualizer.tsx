import { useEffect } from "react";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import React, {
  useState,
  useRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import * as THREE from "three";
import {
  FileText,
  Tags,
  GitBranch,
  RotateCcw,
  ChevronDown,
  X,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/components/ui/collapsible";
import { Drawer } from "vaul";

// ============================================
// MOCK DATA - Simula ChromaDB + Entidades
// ============================================

interface VectorPoint {
  id: string;
  position: [number, number, number];
  type: "entity" | "document" | "gene";
  category: string;
  metadata: Record<string, unknown>;
  connections?: string[];
}

// Función para generar embeddings simulados (en producción vendrían de ChromaDB)
const generateMockEmbeddings = (): VectorPoint[] => {
  const points: VectorPoint[] = [];

  // === ENTIDADES DEL SISTEMA ===
  const entities = [
    {
      id: "user-1",
      category: "User",
      metadata: { userId: "U001", name: "Dr. García", role: "resident" },
    },
    {
      id: "resident-1",
      category: "Resident",
      metadata: { userId: "U001", specialty: "cardiologia" },
    },
    {
      id: "assistant-1",
      category: "Assistant",
      metadata: { userId: "U002", name: "AI Assistant" },
    },
    {
      id: "appointment-1",
      category: "Appointment",
      metadata: {
        appointmentId: "APT001",
        date: "2025-11-08",
        status: "pending",
      },
      connections: ["resident-1", "patient-1"],
    },
    {
      id: "appointment-2",
      category: "Appointment",
      metadata: {
        appointmentId: "APT002",
        date: "2025-11-07",
        status: "resolved",
      },
      connections: ["resident-1", "patient-2", "diagnosis-1"],
    },
    {
      id: "patient-1",
      category: "Patient",
      metadata: {
        patientId: "P001",
        name: "Juan Pérez",
        contactInfo: "juan@example.com",
      },
    },
    {
      id: "patient-2",
      category: "Patient",
      metadata: {
        patientId: "P002",
        name: "María López",
        demographics: "F, 45 años",
      },
    },
    {
      id: "diagnosis-1",
      category: "Diagnosis",
      metadata: {
        diagnosisId: "D001",
        detail: "Infarto agudo de miocardio",
        isPrimary: true,
      },
      connections: ["appointment-2", "outcome-1"],
    },
    {
      id: "outcome-1",
      category: "Outcome",
      metadata: {
        outcomeId: "O001",
        summary: "Estabilización exitosa",
        recommendations: "Seguimiento cardiológico",
      },
    },
  ];

  entities.forEach((entity, i) => {
    const angle = (i / entities.length) * Math.PI * 2;
    points.push({
      id: entity.id,
      position: [Math.cos(angle) * 8, 0, Math.sin(angle) * 8],
      type: "entity",
      category: entity.category,
      metadata: entity.metadata,
      connections: entity.connections,
    });
  });

  // === DOCUMENTOS MÉDICOS (GPC, Protocolos) ===
  const documents = [
    {
      id: "gpc-1",
      category: "GPC",
      metadata: {
        title: "GPC Diabetes Tipo 2 - MSAL 2023",
        specialty: "endocrinologia",
        jurisdiction: "nacional",
      },
    },
    {
      id: "gpc-2",
      category: "GPC",
      metadata: {
        title: "GPC Hipertensión Arterial - OMS",
        specialty: "cardiologia",
        jurisdiction: "international",
      },
    },
    {
      id: "protocol-1",
      category: "Protocol",
      metadata: {
        title: "Protocolo Sedación Pediátrica - SEPAR",
        specialty: "pediatria",
      },
    },
    {
      id: "pharma-1",
      category: "Pharmacopeia",
      metadata: {
        title: "Farmacopea Argentina - Anticoagulantes",
        specialty: "farmacologia",
      },
    },
  ];

  documents.forEach((doc) => {
    points.push({
      id: doc.id,
      position: [
        (Math.random() - 0.5) * 12 + 15,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 12,
      ],
      type: "document",
      category: doc.category,
      metadata: doc.metadata,
    });
  });

  // === GENES (Metadata Genómica Enriquecida) ===
  const genes = [
    {
      id: "gene-NRAS",
      category: "Gene",
      metadata: {
        gene_name: "NRAS",
        disease: "oncogen",
        chrom: "1",
        variants: 5,
        interactions: ["BRAF", "RAF1"],
      },
    },
    {
      id: "gene-ABCA4",
      category: "Gene",
      metadata: {
        gene_name: "ABCA4",
        disease: "distrofias retinianas",
        chrom: "1",
        variants: 12,
      },
    },
    {
      id: "gene-BRCA1",
      category: "Gene",
      metadata: {
        gene_name: "BRCA1",
        disease: "cáncer hereditario",
        chrom: "17",
        variants: 23,
      },
    },
    {
      id: "gene-TP53",
      category: "Gene",
      metadata: {
        gene_name: "TP53",
        disease: "cáncer",
        chrom: "17",
        variants: 18,
      },
    },
  ];

  genes.forEach((gene) => {
    points.push({
      id: gene.id,
      position: [
        (Math.random() - 0.5) * 10 - 15,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 10,
      ],
      type: "gene",
      category: gene.category,
      metadata: gene.metadata,
    });
  });

  return points;
};

// ============================================
// COMPONENTES 3D
// ============================================

const VectorNode: React.FC<{
  point: VectorPoint;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (id: string | null) => void;
  showMetadata?: boolean;
}> = ({
  point,
  isSelected,
  isHovered,
  onClick,
  onHover,
  showMetadata = true,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Animación de rotación suave
  useFrame(() => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  // Colores por tipo
  const getColor = () => {
    switch (point.type) {
      case "entity":
        return "#4299e1"; // Azul
      case "document":
        return "#48bb78"; // Verde
      case "gene":
        return "#ed8936"; // Naranja
      default:
        return "#a0aec0";
    }
  };

  const getSize = () => (isSelected ? 0.5 : 0.3);

  return (
    <group position={point.position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => onHover(point.id)}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[getSize(), 16, 16]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={isSelected ? getColor() : "#000000"}
          emissiveIntensity={isSelected ? 0.5 : 0}
        />
      </mesh>

      {isHovered && (
        <Html distanceFactor={10}>
          <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-xl border border-border max-w-xs">
            <div className="font-bold text-sm mb-2 text-popover-foreground">
              {point.category}
            </div>
            {showMetadata && (
              <div className="text-xs space-y-1">
                {Object.entries(point.metadata)
                  .slice(0, 4)
                  .map(([key, value]) => (
                    <div key={key}>
                      <span className="text-muted-foreground">{key}:</span>{" "}
                      <span className="text-popover-foreground">
                        {JSON.stringify(value)}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

const ConnectionLine: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
}> = ({ start, end }) => {
  const points = useMemo(
    () => [new THREE.Vector3(...start), new THREE.Vector3(...end)],
    [start, end]
  );

  return (
    <Line
      points={points}
      color="#718096"
      lineWidth={1}
      opacity={0.3}
      transparent
    />
  );
};

const VectorSpace = forwardRef<
  any,
  {
    points: VectorPoint[];
    selectedId: string | null;
    hoveredId: string | null;
    onSelect: (id: string) => void;
    onHover: (id: string | null) => void;
    settings: {
      showDocuments: boolean;
      showMetadata: boolean;
      showLines: boolean;
      highlightedGroup: string | null;
    };
  }
>(({ points, selectedId, hoveredId, onSelect, onHover, settings }, ref) => {
  const controlsRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    reset: () => controlsRef.current?.reset(),
  }));

  // Generar conexiones
  const connections = useMemo(() => {
    const lines: Array<{
      start: [number, number, number];
      end: [number, number, number];
    }> = [];

    points.forEach((point) => {
      if (point.connections) {
        point.connections.forEach((connId) => {
          const target = points.find((p) => p.id === connId);
          if (target) {
            lines.push({ start: point.position, end: target.position });
          }
        });
      }
    });

    return lines;
  }, [points]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Grid de referencia */}
      <gridHelper args={[40, 40, "#2d3748", "#1a202c"]} />

      {/* Conexiones */}
      {settings.showLines &&
        connections.map((conn, i) => (
          <ConnectionLine key={i} start={conn.start} end={conn.end} />
        ))}

      {/* Nodos vectoriales */}
      {points.map((point) => {
        // Apply filtering based on settings
        const shouldShow =
          (point.type === "document" && settings.showDocuments) ||
          (point.type !== "document" && true); // Show non-documents always

        if (!shouldShow) return null;

        return (
          <VectorNode
            key={point.id}
            point={point}
            isSelected={selectedId === point.id}
            isHovered={hoveredId === point.id}
            onClick={() => onSelect(point.id)}
            onHover={onHover}
            showMetadata={settings.showMetadata}
          />
        );
      })}

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        minDistance={5}
        maxDistance={100}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
});

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const MedicalRAGVisualizer: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const controlsRef = useRef<any>(null);

  // Data fetching states (for future backend integration)
  const [data] = useState<VectorPoint[]>([]);
  // Uncomment these when implementing backend fetch:
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  // Settings state
  const [settings, setSettings] = useState({
    showDocuments: true,
    showMetadata: true,
    showLines: true,
    highlightedGroup: null as string | null,
  });

  const points = useMemo(() => {
    // Use fetched data if available, otherwise use mock data
    return data.length > 0 ? data : generateMockEmbeddings();
  }, [data]);

  // Data fetching effect (commented out - replace URL with your backend endpoint)
  useEffect(() => {
    // Uncomment to enable data fetching from backend
    /*
    setLoading(true);
    setError(null);
    fetch(`http://127.0.0.1:5000/data`)
      .then(res => res.json())
      .then(
        (result) => {
          setLoading(false);
          setData(result.points || result);
        },
        (error) => {
          setLoading(false);
          setError(error.message);
        }
      );
    */
  }, []);

  const selectedPoint = points.find((p) => p.id === selectedId);

  const handleNodeClick = (id: string) => {
    setSelectedId(id);
  };

  const handleHover = (id: string | null) => {
    setHoveredId(id);
    if (id) {
      const point = points.find((p) => p.id === id);
      if (point) {
        setSettings((prev) => ({ ...prev, highlightedGroup: point.type }));
      }
    } else {
      setSettings((prev) => ({ ...prev, highlightedGroup: null }));
    }
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const stats = useMemo(
    () => ({
      entities: points.filter((p) => p.type === "entity").length,
      documents: points.filter((p) => p.type === "document").length,
      genes: points.filter((p) => p.type === "gene").length,
      total: points.length,
    }),
    [points]
  );

  return (
    <div className="bg-background text-foreground flex flex-col w-full h-full overflow-hidden">
      {/* Header with controls */}
      <div className="bg-card border-b border-border shrink-0">
        {/* Title and description */}
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-2xl font-bold text-foreground">
            Visualizador de Espacio Vectorial
          </h1>
        </div>

        {/* Controls Bar */}
        <div className="px-4 py-3 flex items-center gap-4 border-t border-border">
          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
              <span className="text-xs text-muted-foreground">
                {stats.entities}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-chart-2"></div>
              <span className="text-xs text-muted-foreground">
                {stats.documents}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-chart-3"></div>
              <span className="text-xs text-muted-foreground">
                {stats.genes}
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-border"></div>

          {/* Visualization Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSetting("showDocuments")}
              className={`p-2 rounded-md transition ${
                settings.showDocuments
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              title="Toggle Documentos"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSetting("showMetadata")}
              className={`p-2 rounded-md transition ${
                settings.showMetadata
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              title="Toggle Metadata"
            >
              <Tags className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSetting("showLines")}
              className={`p-2 rounded-md transition ${
                settings.showLines
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              title="Toggle Conexiones"
            >
              <GitBranch className="w-4 h-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-border"></div>

          {/* Reset Button */}
          <button
            onClick={() => controlsRef.current?.reset()}
            className="p-2 rounded-md bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition"
            title="Resetear Vista"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="ml-auto text-xs text-muted-foreground">
            Total: <strong className="text-foreground">{stats.total}</strong>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas 3D */}
        <div className="flex-1 relative">
          <Canvas
            camera={{ position: [20, 15, 20], fov: 60 }}
            className="w-full h-full"
          >
            <VectorSpace
              ref={controlsRef}
              points={points}
              selectedId={selectedId}
              hoveredId={hoveredId}
              onSelect={handleNodeClick}
              onHover={handleHover}
              settings={settings}
            />
          </Canvas>
        </div>
      </div>

      {/* Details Panel - Right Side Drawer */}
      <Drawer.Root
        open={!!selectedPoint}
        onOpenChange={(open) => !open && setSelectedId(null)}
        direction="right"
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Drawer.Content
            className="right-2 top-20 bottom-2 fixed z-50 outline-none w-[400px] flex"
            style={
              {
                "--initial-transform": "calc(100% + 8px)",
              } as React.CSSProperties
            }
          >
            <div className="bg-card h-full w-full flex flex-col rounded-lg border border-border shadow-xl overflow-hidden">
              <div className="overflow-y-auto flex-1">
                <div className="p-6 space-y-6">
                  {selectedPoint && (
                    <>
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-foreground mb-1">
                            {selectedPoint.category}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {selectedPoint.type.charAt(0).toUpperCase() +
                              selectedPoint.type.slice(1)}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedId(null)}
                          className="p-2 hover:bg-accent rounded-md transition"
                          title="Cerrar"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* ID */}
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Identificador
                        </div>
                        <div className="text-sm font-mono bg-muted px-3 py-2 rounded text-foreground break-all">
                          {selectedPoint.id}
                        </div>
                      </div>

                      {/* Metadata - Collapsible */}
                      <Collapsible defaultOpen>
                        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:bg-accent/50 rounded-md px-2 transition group">
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Metadata
                          </div>
                          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 pt-2">
                          <div className="bg-muted rounded-lg p-4 space-y-3">
                            {Object.entries(selectedPoint.metadata).map(
                              ([key, value]) => (
                                <div key={key} className="space-y-1">
                                  <div className="text-xs text-muted-foreground">
                                    {key}
                                  </div>
                                  <div className="text-sm text-foreground font-mono break-all">
                                    {typeof value === "object"
                                      ? JSON.stringify(value, null, 2)
                                      : String(value)}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>

                      {/* Connections - Collapsible */}
                      {selectedPoint.connections &&
                        selectedPoint.connections.length > 0 && (
                          <Collapsible defaultOpen>
                            <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:bg-accent/50 rounded-md px-2 transition group">
                              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Conexiones ({selectedPoint.connections.length})
                              </div>
                              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-2 pt-2">
                              {selectedPoint.connections.map((connId) => {
                                const connectedPoint = points.find(
                                  (p) => p.id === connId
                                );
                                return (
                                  <button
                                    key={connId}
                                    onClick={() => setSelectedId(connId)}
                                    className="w-full text-left bg-muted hover:bg-accent rounded-lg px-3 py-2 transition group"
                                  >
                                    <div className="text-sm font-mono text-foreground group-hover:text-accent-foreground">
                                      {connId}
                                    </div>
                                    {connectedPoint && (
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {connectedPoint.category}
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </CollapsibleContent>
                          </Collapsible>
                        )}

                      {/* Controls Help */}
                      <div className="border-t border-border pt-4 space-y-2">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Controles 3D
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>
                            • <strong>Hover:</strong> Ver detalles rápidos
                          </div>
                          <div>
                            • <strong>Click:</strong> Ver detalles completos
                          </div>
                          <div>
                            • <strong>Arrastrar:</strong> Rotar vista
                          </div>
                          <div>
                            • <strong>Scroll:</strong> Zoom in/out
                          </div>
                          <div>
                            • <strong>Click derecho:</strong> Pan
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
};

const MedicalRAGPage = () => {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Medical RAG Visualizer" },
    ]);
  }, [setBreadcrumbs]);

  return <MedicalRAGVisualizer />;
};

export default MedicalRAGPage;
