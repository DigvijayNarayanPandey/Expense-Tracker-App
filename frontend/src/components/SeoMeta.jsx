import { useEffect } from "react";

const SITE_URL = "https://expense-tracker-app-digvijay.vercel.app";
const DEFAULT_OG_IMAGE = `${SITE_URL}/expense logo.png`;

const upsertMetaTag = ({ attr, key, content }) => {
  if (!content) return;

  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const setCanonical = (href) => {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", href);
};

const SeoMeta = ({
  title,
  description,
  path = "/",
  robots = "index, follow",
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  structuredData,
}) => {
  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${path}`;

    if (title) {
      document.title = title;
      upsertMetaTag({ attr: "property", key: "og:title", content: title });
      upsertMetaTag({ attr: "name", key: "twitter:title", content: title });
    }

    if (description) {
      upsertMetaTag({
        attr: "name",
        key: "description",
        content: description,
      });
      upsertMetaTag({
        attr: "property",
        key: "og:description",
        content: description,
      });
      upsertMetaTag({
        attr: "name",
        key: "twitter:description",
        content: description,
      });
    }

    upsertMetaTag({ attr: "name", key: "robots", content: robots });
    upsertMetaTag({ attr: "property", key: "og:type", content: ogType });
    upsertMetaTag({ attr: "property", key: "og:url", content: canonicalUrl });
    upsertMetaTag({ attr: "property", key: "og:image", content: ogImage });
    upsertMetaTag({
      attr: "name",
      key: "twitter:card",
      content: "summary_large_image",
    });
    upsertMetaTag({ attr: "name", key: "twitter:image", content: ogImage });

    setCanonical(canonicalUrl);

    const existingScript = document.getElementById("seo-structured-data");
    if (existingScript) {
      existingScript.remove();
    }

    if (structuredData) {
      const script = document.createElement("script");
      script.id = "seo-structured-data";
      script.type = "application/ld+json";
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      const schemaScript = document.getElementById("seo-structured-data");
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [title, description, path, robots, ogImage, ogType, structuredData]);

  return null;
};

export default SeoMeta;
