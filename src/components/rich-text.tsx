import { Fragment } from 'react';

/**
 * Renders a string where `*words in asterisks*` are set in the serif italic.
 * That's the only markup content files use.
 */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
          <em key={index} className='serif'>
            {part.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        )
      )}
    </>
  );
}

/** The same string with the asterisks removed, for titles and meta tags. */
export function plainText(text: string) {
  return text.replace(/\*([^*]+)\*/g, '$1');
}
