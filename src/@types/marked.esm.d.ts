declare module 'marked/lib/marked.esm.js' {
  /**
   * Compiles markdown to HTML.
   *
   * @param src String of markdown source to be compiled
   * @param callback Function called when the markdownString has been fully parsed when using async highlighting
   * @return String of compiled HTML
   */
  declare function marked(
    src: string,
    callback?: (error: any | undefined, parseResult: string) => void
  ): string;

  export default marked;
}
