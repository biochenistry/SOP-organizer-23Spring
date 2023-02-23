export enum HeadingSize {
    /**
     * 20px; Similar to an h3
     */
    Small = 20,
    /**
     * 24px; Similar to an h2
     */
    Medium = 24,
    /**
     * 32px; Similar to an h1
     */
    Large = 32
}

interface HeaderProps {
    text: string;
    classes?: string[];
    size: HeadingSize
}

function Heading({ text, classes, size }: HeaderProps) {
    /**
     * Builds a class name string using the given array of strings
     * @param classes custom class names to apply to header
     * @returns empty if none given, otherwise a class string (e.g. 'test-class test-class-two')
     */
    function buildClassString(classes?: string[]): string {
        if (!classes) return '';
        return classes
            .reduce(((currentStr, currentClass) => currentStr + currentClass + ' '), '')
            .trimEnd();
    }

    return (
      <h1 className={buildClassString(classes)} style={{ fontSize: size }}>{text}</h1>
    );
  }
  
export default Heading;