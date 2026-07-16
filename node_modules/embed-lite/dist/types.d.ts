export interface EmbedOptions {
    /** Map of additional query parameters added to the iframe or fetch request. */
    params?: Record<string, string | number>;
    /** Optional class name to attach to the wrapper div or blockquote */
    className?: string;
    [key: string]: any;
}
export interface EmbedResult {
    /** The fully constructed HTML string ready to dynamically inject or string parse. */
    html: string;
}
export interface EmbedProvider {
    name: string;
    /**
     * Determine whether a URL belongs to this provider.
     */
    match: (url: URL) => boolean;
    /**
     * Generate the static HTML for this provider based on the matched URL.
     */
    generate: (url: URL, options?: EmbedOptions) => string | null;
}
