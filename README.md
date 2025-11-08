## 1. Descripción General del Sistema

La plataforma **MEDICAL-RAG-PLATFORM** implementa un sistema de **Retrieval-Augmented Generation (RAG)** especializado en medicina, con **integración genómica avanzada** y soporte para procesamiento automatizado de documentación clínica. Su propósito es estructurar, indexar y contextualizar información médica —tanto documental como genómica— para **asistir a profesionales en la toma de decisiones clínicas** mediante evidencia verificable.

El sistema organiza **documentos médicos (PDF y TXT)** en una **estructura jerárquica de cuatro niveles**, lo que permite una búsqueda, navegación y recuperación de información precisas. Además, integra datos genómicos enriquecidos provenientes de fuentes científicas internacionales (Ensembl, ClinVar, OMIM, PubMed, STRING), habilitando consultas médicas basadas en evidencia y personalizadas según el perfil genético del paciente.

Las entidades principales reconocidas en el sistema hospitalario son: **Hospital**, **Residente**, **Asistente**, **Paciente**, **Turno (Appointment)**, **Diagnóstico (Diagnosis)** y **Resultado (Outcome)**.  
El **Hospital** centraliza la información y el acceso a los recursos digitales. El **Residente** utiliza las estaciones del hospital para acceder al sistema, donde el **Asistente** le provee datos, historiales y sugerencias diagnósticas.  
Cada **Paciente** cuenta con un historial clínico vinculado a sus **Turnos**, que registran síntomas, análisis y diagnósticos. Los **Resultados** de cada consulta alimentan el sistema de asistencia inteligente, que mejora progresivamente la precisión de los diagnósticos.

**Características principales:**

- Arquitectura RAG médica con soporte genómico y farmacológico.
- Organización jerárquica estandarizada por especialidad médica.
- Procesamiento automático de documentos y casos clínicos con IA (Gemini).
- Integración de metadata enriquecida para búsquedas contextuales.
- Soporte para interoperabilidad con APIs externas (openFDA).

---

## 2. Propósito y Fundación de la Aplicación

### 2.1 Propósito Principal

La plataforma **MEDICAL-RAG-PLATFORM** tiene como propósito central **asistir a profesionales médicos en la toma de decisiones clínicas** mediante la integración de evidencia médica verificable, datos genómicos y herramientas de inteligencia artificial. Su objetivo es reducir errores diagnósticos, acelerar procesos asistenciales y promover la medicina basada en evidencia, facilitando el acceso a información estructurada y contextualizada en tiempo real.

### 2.2 Fundación Técnica

La aplicación se fundamenta en una arquitectura **Retrieval-Augmented Generation (RAG)** especializada en medicina, que combina:

- **Procesamiento de documentos médicos** con IA (Gemini) para extracción y clasificación automática.
- **Integración genómica** con fuentes como Ensembl, ClinVar, OMIM y PubMed.
- **Estructura jerárquica de cuatro niveles** para organización taxonómica de conocimientos médicos.
- **Interoperabilidad** con APIs externas (openFDA) para farmacología y seguridad.
- **Modelo cliente-servidor centralizado** con roles diferenciados (Asistente Administrativo y Residente Médico).

Esta fundación técnica garantiza trazabilidad completa, auditoría inmutable y evolución progresiva del sistema mediante aprendizaje continuo.

---

## 3. Información Preliminar del Cliente

### 3.1 Contexto Institucional

El cliente es un **hospital universitario** de mediana complejidad, con especialidades médicas diversas y un enfoque en la formación de residentes. La institución maneja aproximadamente **500 pacientes activos mensuales**, con un promedio de **50 turnos diarios** y requiere gestión integrada de historiales clínicos, diagnósticos y prescripciones.

### 3.2 Necesidades Identificadas

- **Gestión administrativa**: Registro de pacientes, asignación de turnos y agenda médica.
- **Apoyo clínico**: Acceso rápido a guías, protocolos y evidencia científica durante consultas.
- **Formación médica**: Herramientas para residentes que faciliten el aprendizaje basado en casos reales.
- **Integración de datos**: Vinculación de información genómica y farmacológica con historiales pacientes.
- **Cumplimiento normativo**: Asegurar trazabilidad y auditoría de todas las operaciones médicas.

### 3.2 Roles de Usuario en Primera Versión

- **Asistente Administrativo**: Gestión de pacientes y turnos (sin acceso a datos clínicos sensibles).
- **Residente Médico**: Atención clínica con acceso a herramientas de asistencia inteligente.

### 3.3 Alcance de la Primera Versión

Esta versión inicial incluye:

- Dashboard diferenciado por roles con métricas básicas.
- Gestión de pacientes y turnos.
- Visualización de documentos médicos (PDFs).
- Integración básica con fuentes documentales.
- Modo desarrollo con simulación de roles para testing.

---

## 4. Estructura Jerárquica del Sistema Documental

El sistema mantiene un modelo jerárquico de cuatro niveles que garantiza la **coherencia semántica, trazabilidad y clasificación uniforme** de documentos médicos.

```text
organized/
├── specialty/           # Nivel 1: Especialidad médica
│   ├── doclevel/        # Nivel 2: Tipo de documento
│   │   ├── jurisdiction/# Nivel 3: Alcance jurisdiccional
│   │   │   └── source_org/  # Nivel 4: Organización fuente
│   │   │       └── documento.ext
```

### 4.1 Nivel 1: Especialidad Médica

16 especialidades predefinidas: cardiología, neumología, neurología, pediatría, oncología, endocrinología, gastroenterología, traumatología, psiquiatría, urgencias, farmacología, anestesiología, infectología, medicina interna, general y multidisciplinar.

### 4.2 Nivel 2: Tipo de Documento

Nueve categorías: guidelines, protocols, manuals, consensus, pharmacopeia, regulations, dictionaries, cases, other.

### 4.3 Nivel 3: Alcance Jurisdiccional

Cuatro niveles: internacional, nacional, provincial y hospitalario/institucional.

### 4.4 Nivel 4: Organización Fuente

Instituciones oficiales o académicas (MSAL, WHO, OPS, Hospital Clínic, AVS, etc.).

---

## 5. Nomenclatura y Estándares de Clasificación

### 5.1 Convención General de Archivos

```
tipo-topic-source-fecha-version.ext
```

**Ejemplo:** `gpc-diabetes_tipo2-msal-20220315-v1.pdf`

### 5.2 Casos Clínicos

**Formato recomendado:**  
`caso-especialidad-topic_descriptivo-source-fecha-version.ext`

**Formato legacy (compatible):**  
`caso-topic_descriptivo-source-fecha-version.ext`

La clasificación automática detecta ambos formatos y preserva compatibilidad retroactiva.

---

## 6. Integración Genómica

El módulo genómico integra y normaliza información biomédica mediante el archivo `genes_metadata_enriched.jsonl`, que consolida datos de **genes, variantes, fenotipos y asociaciones clínicas** desde fuentes verificadas.

### 6.1 Estructura de Datos

Cada entrada incluye:

- `gene_name`, `gene_id`, `chrom`, `start`, `end`, `strand`, `gene_biotype`, `description`
- Referencias cruzadas a **Ensembl, ClinVar, OMIM, PubMed y STRING**
- Campos derivados como `variants`, `interactions`, `pubmed`, `local_guidelines`

### 6.2 Fuentes Integradas

- **Ensembl GRCh38**: estructura genética y coordenadas.
- **ClinVar**: variantes y relevancia clínica.
- **OMIM**: enfermedades y fenotipos asociados.
- **PubMed**: evidencia científica indexada.
- **STRING**: interacciones proteicas.

### 6.3 Valor Clínico

- Contexto genético instantáneo durante la consulta.
- Validación basada en evidencia multipropósito.
- Soporte para correlación entre variantes y respuesta farmacológica.

---

## 7. Procesamiento de Datos

El sistema implementa una **cadena operativa secuencial** que abarca desde la adquisición de documentos hasta la indexación semántica y contextualización para RAG.

### 7.1 Etapa 1 — Scraping y Adquisición

- Recolección automatizada de documentos institucionales.
- Extracción de datos estructurados (metadatos, especialidad, fuente).
- Descarga y normalización de PDFs y TXTs clínicos.

### 7.2 Etapa 2 — Curación y Normalización

- Validación de rutas jerárquicas y consistencia taxonómica.
- Normalización de nombres de archivo según el estándar definido.
- Verificación de duplicados, integridad y formato.

### 7.3 Etapa 3 — Procesamiento de Contenido

#### a) **Procesador de PDFs**

- Extracción de texto con **Gemini AI**.
- Clasificación automatizada por especialidad y tipo de documento.
- Estandarización de nomenclatura y logging de resultados.
- Control de tasa (15 req/min) y fallback ante errores.

#### b) **Procesador de Casos Clínicos (TXT)**

- Análisis de contenido completo y detección de especialidad.
- Asignación de jurisdicción por fuente y contexto.
- Compatibilidad con formatos legacy.

### 7.4 Etapa 4 — Enriquecimiento Semántico

- Asignación de keywords por especialidad (>700 términos).
- Vinculación con entidades genómicas y farmacológicas.
- Generación de metadatos extendidos para búsqueda avanzada.

### 7.5 Etapa 5 — Indexación para RAG

- Chunking contextual inteligente.
- Generación de embeddings biomédicos especializados.
- Creación de índices jerárquicos filtrables por specialty/doclevel/jurisdiction.

---

## 8. Integración con el Sistema Clínico

El **sistema asistencial** basado en esta infraestructura documental implementa una **arquitectura cliente-servidor centralizada** con módulos de gestión administrativa y clínica, diseñados para garantizar la trazabilidad completa del proceso asistencial.

### 8.1 Roles Operativos

#### Asistente Administrativo

- Registro y gestión de pacientes.
- Creación y asignación de turnos.
- Administración de agenda médica.

**Restricciones:** sin acceso a datos clínicos.

#### Residente Médico

- Atención y registro de consultas.
- Formulación de diagnósticos y prescripciones.
- Acceso a evidencia estructurada desde MEDICAL-RAG-PLATFORM.

**Restricciones:** sin permisos administrativos.

### 8.2 Flujo de Información

```
Patient → Appointment → Outcome → Diagnosis → Sources → Documents
                                              ↓
                                          Recipe
                                              ├── Indications
                                              └── Drugs
```

1. Creación de paciente y turno.
2. Registro de hallazgos clínicos (outcome).
3. Formulación de diagnóstico.
4. Asociación de fuentes de evidencia.
5. Acceso a documentos RAG relevantes.
6. Generación de prescripción terapéutica.

---

## 9. Integración Farmacológica

### 9.1 API openFDA

**Endpoint principal:**

```
https://api.fda.gov/drug/label.json
```

**Usos:**

- Verificación de interacciones medicamentosas.
- Consulta de efectos adversos y contraindicaciones.
- Validación de seguridad farmacológica antes de la prescripción.

### 9.2 Autenticación y Límites

- Sin API Key: 240 req/min, 1.000 req/día.
- Con API Key: 240 req/min, 120.000 req/día.

---

## 10. Estrategia RAG Médico

El sistema combina **texto completo, metadata estructurada y jerarquía documental** para generar respuestas contextuales precisas.

**Principios de diseño:**

- Enriquecimiento semántico con metadata jerárquica.
- Recuperación filtrada por especialidad, tipo y jurisdicción.
- Validación cruzada de fuentes.
- Prompts de LLM con contexto documental extendido.

---

## 11. Trazabilidad, Auditoría y Continuidad Asistencial

- Registro inmutable de operaciones críticas.
- Asociación automática de usuario responsable.
- Timestamps y logs centralizados.
- Historial longitudinal del paciente y diagnósticos previos.
- Acceso rápido a la evidencia utilizada en consultas anteriores.

---

## 12. Objetivos Generales

### 12.1 Operativos

- Centralizar la gestión clínica y administrativa.
- Reducir errores de registro.
- Mejorar la eficiencia del flujo asistencial.
- Garantizar acceso institucional controlado y sin persistencia local.

### 12.2 Clínicos

- Estandarizar la documentación médica estructurada.
- Aumentar la precisión diagnóstica mediante evidencia verificada.
- Potenciar la educación médica basada en casos reales y genómicos.

---

## 13. Estado Actual y Alcance

### Completado

- Arquitectura RAG médica integrada con datos genómicos.
- Procesadores automáticos para PDFs y casos clínicos.
- Base genómica enriquecida (54 genes).
- Taxonomía médica jerárquica completa.
- Sistema interoperable con openFDA.

### En desarrollo

- Módulo de analítica retrospectiva.
- Integración directa con motores LLM clínicos.
- Visualizador de embeddings biomédicos para trazabilidad cognitiva.

---

**MEDICAL-RAG-PLATFORM** consolida una infraestructura técnica, semántica y asistencial unificada, destinada a transformar la práctica médica mediante la automatización, la trazabilidad y la evidencia contextualizada.
