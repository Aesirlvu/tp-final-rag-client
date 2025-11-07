/**
 * Extrae el dominio de una URL
 * @param url - URL completa
 * @returns El dominio sin www y con la extensión
 * @example
 * getDomainFromUrl("https://www.example.com/path") // "example.com"
 * getDomainFromUrl("https://blog.github.com") // "blog.github.com"
 */
export function getDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Remover 'www.' si existe
    return urlObj.hostname.replace(/^www\./, "");
  } catch (error) {
    // Si la URL no es válida, intentar extraer manualmente
    const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/);
    return match ? match[1] : url;
  }
}

/**
 * Obtiene la URL del favicon de un sitio web
 * Usa el servicio de Google para obtener favicons
 * @param url - URL del sitio web
 * @returns URL del favicon
 * @example
 * getFaviconUrl("https://github.com") // "https://www.google.com/s2/favicons?domain=github.com&sz=32"
 */
export function getFaviconUrl(url: string): string {
  try {
    const domain = getDomainFromUrl(url);
    // Usar el servicio de Google para obtener favicons (más confiable)
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch (error) {
    // Fallback: icono genérico
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><text y="20" font-size="20">🌐</text></svg>';
  }
}

/**
 * Valida si una cadena es una URL válida
 * @param url - Cadena a validar
 * @returns true si es una URL válida
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Formatea una URL para mostrarla de forma más legible
 * @param urlOrContent - URL completa o ResourceContentDTO
 * @param maxLength - Longitud máxima del texto (default: 50)
 * @returns URL formateada y truncada
 */
export function formatUrlForDisplay(
  urlOrContent: string,
  maxLength = 50
): string {
  try {
    // Si es un ResourceContentDTO, extraer la URL del body
    let urlString: string;

    if (typeof urlOrContent === "string") {
      urlString = urlOrContent;
    } else {
      // Es un ResourceContentDTO
      const body = urlOrContent as { url?: string };
      if (body?.url) {
        urlString = body.url;
      } else {
        return "URL no disponible";
      }
    }

    const urlObj = new URL(urlString);
    let display = urlObj.hostname.replace(/^www\./, "");

    if (urlObj.pathname !== "/" && urlObj.pathname !== "") {
      display += urlObj.pathname;
    }

    if (display.length > maxLength) {
      return display.substring(0, maxLength - 3) + "...";
    }

    return display;
  } catch {
    const fallbackString =
      typeof urlOrContent === "string" ? urlOrContent : "URL inválida";

    return fallbackString.length > maxLength
      ? fallbackString.substring(0, maxLength - 3) + "..."
      : fallbackString;
  }
}

/**
 * Obtiene el protocolo de una URL
 * @param url - URL completa
 * @returns El protocolo (http, https, etc.)
 */
export function getProtocol(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol.replace(":", "");
  } catch {
    return "http";
  }
}

/**
 * Verifica si una URL apunta a un archivo PDF
 * @param url - URL a verificar
 * @returns true si la URL termina en .pdf (case insensitive)
 */
export function isPdfUrl(url: string): boolean {
  return url.toLowerCase().endsWith(".pdf");
}
