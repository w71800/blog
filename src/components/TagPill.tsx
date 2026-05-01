export type TagPillProps = {
  label: string;
  href?: string;
}
  
const TagPill = ({ label, href }: TagPillProps) => {
  const encodedHref = href ? `/tags/${encodeURIComponent(href)}/` : undefined;
  const style = {
    display: 'inline-block',
    padding: '0.35rem 0.75rem',
    borderRadius: '999px',
    background: 'var(--tag-bg)',
    color: 'var(--tag-text)',
    textDecoration: 'none',
    fontSize: '0.95rem',
  }
  return (
    href 
      ? <a href={encodedHref} style={style}>{label}</a>
      : <span style={style}>{label}</span>
  );
}

export default TagPill;