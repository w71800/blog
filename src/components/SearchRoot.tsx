import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';

export type SearchDoc = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  body: string;
};

function useSearchIndex() {
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/search-index.json');
        if (!res.ok) throw new Error(`載入搜尋索引失敗 (${res.status})`);
        const data = (await res.json()) as SearchDoc[];
        if (!cancelled) setDocs(data);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : '無法載入搜尋索引');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { docs, error };
}

export function SearchRoot() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { docs, error } = useSearchIndex();
  const inputRef = useRef<HTMLInputElement>(null);

  const fuse = useMemo(() => {
    if (!docs) return null;
    return new Fuse(docs, {
      keys: [
        { name: 'title', weight: 0.45 },
        { name: 'description', weight: 0.25 },
        { name: 'tags', weight: 0.2 },
        { name: 'body', weight: 0.1 },
      ],
      threshold: 0.32,
      ignoreLocation: true,
    });
  }, [docs]);

  const results = useMemo(() => {
    const q = query.trim();
    if (!fuse || !q) return [];
    return fuse.search(q, { limit: 12 }).map((r) => r.item);
  }, [fuse, query]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setOpen(false);
      if (e.key !== '/' || open) return;
      const t = document.activeElement;
      const tag = t?.tagName ?? '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || t?.getAttribute('contenteditable') === 'true')
        return;
      e.preventDefault();
      setOpen(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        style={{
          padding: '0.45rem 0.75rem',
          borderRadius: 8,
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          color: 'var(--text)',
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
      >
        搜尋
        <span style={{ opacity: 0.65, marginLeft: 6, fontSize: '0.8rem' }}>
          /
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="搜尋文章"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '12vh 1rem 2rem',
            background: 'rgba(15, 23, 42, 0.45)',
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div
            style={{
              width: 'min(36rem, 100%)',
              maxHeight: '75vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 12,
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
              <input
                ref={inputRef}
                type="search"
                autoComplete="off"
                placeholder="搜尋標題、摘要、標籤、內文…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.5rem',
                  fontSize: '1rem',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--text)',
                }}
              />
              {error && (
                <p style={{ color: 'crimson', margin: '0.5rem 0 0', fontSize: '0.85rem' }}>
                  {error}
                </p>
              )}
              {!docs && !error && (
                <p style={{ color: 'var(--muted)', margin: '0.5rem 0 0', fontSize: '0.85rem' }}>
                  載入索引中…
                </p>
              )}
            </div>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: '0.5rem',
                overflowY: 'auto',
                flex: 1,
              }}
            >
              {query.trim() && results.length === 0 && docs && (
                <li style={{ padding: '1rem', color: 'var(--muted)' }}>沒有符合的文章</li>
              )}
              {results.map((item) => (
                <li key={item.slug} style={{ borderRadius: 8 }}>
                  <a
                    href={`/blog/${item.slug}/`}
                    onClick={() => onClose()}
                    style={{
                      display: 'block',
                      padding: '0.65rem 0.75rem',
                      textDecoration: 'none',
                      color: 'var(--text)',
                      borderRadius: 8,
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 4 }}>
                      {item.description}
                    </div>
                    {item.tags.length > 0 && (
                      <div style={{ marginTop: 6, fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {item.tags.map((t) => (
                          <span key={t} style={{ marginRight: 8 }}>
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </a>
                </li>
              ))}
            </ul>
            <div
              style={{
                padding: '0.5rem 1rem',
                borderTop: '1px solid var(--border)',
                fontSize: '0.8rem',
                color: 'var(--muted)',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <span>Esc 關閉</span>
              <button
                type="button"
                onClick={onClose}
                style={{
                  border: 'none',
                  background: 'none',
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit',
                }}
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
