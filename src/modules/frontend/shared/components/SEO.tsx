import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  type?: string;
  robots?: string;
  author?: string;
  siteName?: string;
  favicon?: string;
  themeColor?: string;
}

export function SEO({
  title,
  description,
  keywords,
  canonical,
  image,
  type = 'website',
  robots = 'index, follow',
  author,
  siteName = 'The Wedding',
  favicon,
  themeColor,
}: SEOProps) {
  const currentUrl = canonical || window.location.href;
  const metaEnv = import.meta.env as Record<string, string | undefined>;
  const domain = metaEnv.VITE_APP_URL || window.location.origin;
  const absoluteImage = image?.startsWith('http') ? image : `${domain}${image || '/assets/betawi-themes/images/og-image.jpg'}`;
  
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      {themeColor && <meta name="theme-color" content={themeColor} />}
      {favicon && <link rel="icon" type="image/svg+xml" href={favicon} />}
      
      <link rel="canonical" href={currentUrl} />
      <meta name="robots" content={robots} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:secure_url" content={absoluteImage} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={absoluteImage} />

      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'article' ? 'Article' : 'WebSite',
          "name": title,
          "url": currentUrl,
          "description": description,
          "image": absoluteImage,
          "publisher": {
            "@type": "Organization",
            "name": siteName
          }
        })}
      </script>
    </Helmet>
  );
}
