type JsonLdValue = Record<string, unknown>;

export default function JsonLd({
  data,
}: {
  data: JsonLdValue | JsonLdValue[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
