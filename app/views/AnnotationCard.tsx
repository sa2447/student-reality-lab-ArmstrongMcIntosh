"use client";

import { STYLES } from '../ui/theme';

type Annotation = {
  title: string;
  body: string;
};

export function AnnotationCard({ annotation }: { annotation: Annotation }) {
  return (
    <section aria-label="Annotation" style={STYLES.annotation}>
      <h3 style={{ margin: '0 0 8px' }}>{annotation.title}</h3>
      <p style={{ margin: 0 }}>{annotation.body}</p>
    </section>
  );
}
