declare module 'marked' {
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

  interface MarkedOptions {
    /**
     * Include an id attribute when emitting headings.
     */
    headerIds?: boolean;
  }

  declare namespace marked {
    const defaults: MarkedOptions;

    /**
     * Sets the default options.
     *
     * @param options Hash of options
     */
    function setOptions(options: MarkedOptions): typeof marked;
  }

  export default marked;
}
