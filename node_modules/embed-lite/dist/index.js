import { providers } from './services/index.js';
/**
 * Iterates through completely static, zero-dependency URL regex mappings.
 * It identifies the platform implicitly and generates either an `<iframe>`
 * or a specific secure embed script code snippet (e.g. `<blockquote class="twitter-tweet">...`).
 *
 * @param urlStr  The target URL to generate embed code for.
 * @param options Options defining additional classes or query parameters.
 * @returns EmbedResult containing the raw HTML string, or null if unsupported.
 */
export function embed(urlStr, options = {}) {
    try {
        const parsedUrl = new URL(urlStr);
        for (const provider of providers) {
            if (provider.match(parsedUrl)) {
                const html = provider.generate(parsedUrl, options);
                if (html) {
                    return { html };
                }
            }
        }
    }
    catch (error) {
        // If URL parsing fails (e.g. invalid string format), fail gracefully.
        return null;
    }
    // No recognized static provider
    return null;
}
export * from './types.js';
