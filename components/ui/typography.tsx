import React, { HTMLAttributes } from 'react';

type HeadingProps = HTMLAttributes<HTMLHeadingElement>;
type ParagraphProps = HTMLAttributes<HTMLParagraphElement>;
type BlockquoteProps = HTMLAttributes<HTMLElement>;
type CodeProps = HTMLAttributes<HTMLElement>;

// Encabezados
export const H1: React.FC<HeadingProps> = ({ className = '', children, ...props }) => (
  <h1
    className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}
    {...props}
  >
    {children}
  </h1>
);

export const H2: React.FC<HeadingProps> = ({ className = '', children, ...props }) => (
  <h2
    className={`scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${className}`}
    {...props}
  >
    {children}
  </h2>
);

export const H3: React.FC<HeadingProps> = ({ className = '', children, ...props }) => (
  <h3
    className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const H4: React.FC<HeadingProps> = ({ className = '', children, ...props }) => (
  <h4
    className={`scroll-m-20 text-xl font-semibold tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h4>
);

// Párrafos
export const P: React.FC<ParagraphProps> = ({ className = '', children, ...props }) => (
  <p className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`} {...props}>
    {children}
  </p>
);

export const Lead: React.FC<ParagraphProps> = ({ className = '', children, ...props }) => (
  <p className={`text-xl text-muted-foreground ${className}`} {...props}>
    {children}
  </p>
);

export const Large: React.FC<ParagraphProps> = ({ className = '', children, ...props }) => (
  <p className={`text-lg font-semibold ${className}`} {...props}>
    {children}
  </p>
);

export const Small: React.FC<ParagraphProps> = ({ className = '', children, ...props }) => (
  <p className={`text-sm font-medium leading-none ${className}`} {...props}>
    {children}
  </p>
);

export const Muted: React.FC<ParagraphProps> = ({ className = '', children, ...props }) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props}>
    {children}
  </p>
);

// Otros
export const Blockquote: React.FC<BlockquoteProps> = ({ className = '', children, ...props }) => (
  <blockquote className={`mt-6 border-l-2 pl-6 italic ${className}`} {...props}>
    {children}
  </blockquote>
);

export const InlineCode: React.FC<CodeProps> = ({ className = '', children, ...props }) => (
  <code
    className={`relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold ${className}`}
    {...props}
  >
    {children}
  </code>
);
