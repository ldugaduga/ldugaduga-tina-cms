const SIMPLE_ICON_PREFIX = 'simpleicons:';

export function Icon({ icon }: { icon?: string | null }) {
  if (!icon) return null;

  if (icon.startsWith(SIMPLE_ICON_PREFIX)) {
    const slug = icon.slice(SIMPLE_ICON_PREFIX.length);
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={`https://cdn.simpleicons.org/${slug}/e8632f`} alt="" width={22} height={22} loading="lazy" />
    );
  }

  return <i className={`ph ${icon}`} aria-hidden="true" />;
}
