import { defineConfig } from 'tinacms';

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,
  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  // Uncomment to allow cross-origin requests from non-localhost origins
  // during local development (e.g. GitHub Codespaces, Gitpod, Docker).
  // Use 'private' to allow all private-network IPs (WSL2, Docker, etc.)
  // server: {
  //   allowedOrigins: ['https://your-codespace.github.dev'],
  // },
  media: {
    tina: {
      mediaRoot: '',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      // Singleton: site-wide copy, hero, SEO, stats, socials — one file, no "new document" action.
      {
        name: 'settings',
        label: 'Site Settings',
        path: 'content/settings',
        format: 'json',
        ui: {
          global: true,
          allowedActions: { create: false, delete: false },
        },
        fields: [
          { type: 'string', name: 'seoTitle', label: 'SEO Title', required: true },
          { type: 'string', name: 'seoDescription', label: 'SEO Description', ui: { component: 'textarea' } },
          { type: 'string', name: 'canonicalUrl', label: 'Canonical URL' },
          { type: 'image', name: 'ogImage', label: 'Open Graph Image' },
          { type: 'string', name: 'gaId', label: 'Google Analytics ID' },
          {
            type: 'string',
            name: 'heroHeadline',
            label: 'Hero Headline',
            description: 'Wrap the emphasized word(s) in *asterisks*, e.g. "...break *after* handoff."',
          },
          { type: 'string', name: 'heroSub', label: 'Hero Subheading', ui: { component: 'textarea' } },
          {
            type: 'string',
            name: 'availabilityText',
            label: 'Availability Strip Text',
            description: 'Wrap the bold lead-in in **double asterisks**.',
          },
          {
            type: 'object',
            name: 'stats',
            label: 'Hero Stats',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label }) },
            fields: [
              { type: 'number', name: 'value', label: 'Value' },
              { type: 'string', name: 'label', label: 'Label' },
            ],
          },
          { type: 'string', name: 'contactFormAction', label: 'Contact Form Action URL (Formspree, etc.)' },
          { type: 'string', name: 'ctaHeadline', label: 'Final CTA Headline' },
          { type: 'string', name: 'ctaSub', label: 'Final CTA Subheading' },
          {
            type: 'object',
            name: 'socialLinks',
            label: 'Social Links',
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label }) },
            fields: [
              { type: 'string', name: 'label', label: 'Label' },
              { type: 'string', name: 'url', label: 'URL' },
              { type: 'string', name: 'icon', label: 'Icon (Phosphor class name)' },
            ],
          },
        ],
      },

      // Services grid ("What I do")
      {
        name: 'service',
        label: 'Services',
        path: 'content/services',
        format: 'json',
        ui: { itemProps: (item) => ({ label: item?.title }) },
        fields: [
          { type: 'string', name: 'title', label: 'Title', isTitle: true, required: true },
          { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
          {
            type: 'string',
            name: 'icon',
            label: 'Icon',
            description: 'Phosphor icon class (e.g. ph-code) or simpleicons:wordpress for the brand-colored WordPress mark',
          },
          { type: 'boolean', name: 'featured', label: 'Featured (larger card)' },
          { type: 'string', name: 'tags', label: 'Tags', list: true },
          { type: 'number', name: 'order', label: 'Order' },
        ],
      },

      // Process steps ("How a project runs")
      {
        name: 'processStep',
        label: 'Process Steps',
        path: 'content/process',
        format: 'json',
        ui: { itemProps: (item) => ({ label: item?.title }) },
        fields: [
          { type: 'string', name: 'title', label: 'Title', isTitle: true, required: true },
          { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
          { type: 'string', name: 'icon', label: 'Icon (Phosphor class name)' },
          { type: 'number', name: 'order', label: 'Order' },
        ],
      },

      // Selected work / portfolio items
      {
        name: 'work',
        label: 'Work',
        path: 'content/work',
        format: 'json',
        ui: { itemProps: (item) => ({ label: item?.title }) },
        fields: [
          { type: 'string', name: 'title', label: 'Project Title', isTitle: true, required: true },
          { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
          { type: 'string', name: 'url', label: 'Live URL' },
          { type: 'image', name: 'image', label: 'Screenshot' },
          { type: 'string', name: 'alt', label: 'Screenshot Alt Text' },
          {
            type: 'string',
            name: 'platform',
            label: 'Platform',
            options: ['wordpress', 'shopify'],
          },
          { type: 'string', name: 'category', label: 'Category (e.g. "Enterprise tech")' },
          {
            type: 'boolean',
            name: 'featured',
            label: 'Show by default',
            description: 'Checked = one of the first 6 shown before "Load more"',
          },
          { type: 'number', name: 'order', label: 'Order' },
        ],
      },

      // Experience timeline
      {
        name: 'experience',
        label: 'Experience',
        path: 'content/experience',
        format: 'json',
        ui: { itemProps: (item) => ({ label: item?.company }) },
        fields: [
          { type: 'string', name: 'company', label: 'Company', isTitle: true, required: true },
          { type: 'string', name: 'role', label: 'Role' },
          { type: 'string', name: 'dateRange', label: 'Date Range (free text, e.g. "Nov 2010 - Present")' },
          { type: 'boolean', name: 'current', label: 'Current / ongoing' },
          { type: 'number', name: 'order', label: 'Order' },
        ],
      },

      // Testimonials carousel
      {
        name: 'testimonial',
        label: 'Testimonials',
        path: 'content/testimonials',
        format: 'json',
        ui: { itemProps: (item) => ({ label: item?.attribution }) },
        fields: [
          { type: 'string', name: 'quote', label: 'Quote', isTitle: true, required: true, ui: { component: 'textarea' } },
          { type: 'string', name: 'attribution', label: 'Attribution / project label' },
          { type: 'number', name: 'rating', label: 'Rating (out of 5)' },
          { type: 'number', name: 'order', label: 'Order' },
        ],
      },
    ],
  },
});
