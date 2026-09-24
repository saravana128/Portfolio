import React from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import resume from '../outputs/resume.md?raw';
import './styles.css';

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const meta = {};
  if (match) match[1].split(/\r?\n/).forEach((line) => {
    const [key, ...value] = line.split(':');
    if (key && value.length) meta[key.trim()] = value.join(':').trim().replace(/^['"]|['"]$/g, '');
  });
  return { meta, body: markdown.slice(match?.[0].length || 0) };
}

function parseResume(markdown) {
  const { meta, body } = parseFrontmatter(markdown);
  const sections = [];
  let section;
  let item;
  body.split(/\r?\n/).forEach((line) => {
    if (line.startsWith('## ')) {
      section = { title: line.slice(3), intro: [], items: [] };
      sections.push(section); item = null;
    } else if (line.startsWith('### ') && section) {
      item = { title: line.slice(4), lines: [] };
      section.items.push(item);
    } else if (line.trim() && section) {
      (item ? item.lines : section.intro).push(line);
    }
  });
  return { meta, sections };
}

const linkify = (text) => {
  const parts = text.split(/(\[[^\]]+\]\([^\)]+\)|`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>;
    if (part.startsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    return part;
  });
};

const slug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const sectionId = (title) => (title === 'Work Experience' ? 'experience' : slug(title));

function Entry({ item }) {
  const metaLines = [];
  const bullets = [];
  item.lines.forEach((line) => (line.startsWith('- ') ? bullets : metaLines).push(line));
  return (
    <article className="entry reveal">
      <h2>{linkify(item.title)}</h2>
      {metaLines.map((line, index) => <p className="entry-meta" key={index}>{linkify(line)}</p>)}
      {bullets.length > 0 && (
        <ul>{bullets.map((line, index) => <li key={index}>{linkify(line.slice(2))}</li>)}</ul>
      )}
    </article>
  );
}

function App() {
  const { meta, sections } = parseResume(resume);
  const overview = sections.find((section) => section.title === 'Overview');
  const mainSections = sections.filter((section) => section !== overview);

  const [theme, setTheme] = React.useState(() => document.documentElement.dataset.theme || 'dark');
  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  React.useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <nav aria-label="Primary navigation">
        <a className="brand" href="#top">{meta.name}<em>.</em></a>
        <div className="nav-links">
          <a href="#experience">Experience</a>
          <a href="#skills">Skills</a>
          <a href="#selected-projects">Projects</a>
          <a href={meta.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href={meta.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a className="contact" href={`mailto:${meta.email}`}>Let’s talk</a>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      <main id="top">
        <section className="hero">
          <h1><span className="grad">{meta.role}</span></h1>
          {meta.secondaryRole && <p className="hero-sub">{meta.secondaryRole}</p>}
          <p className="lede">{meta.tagline}</p>
          <div className="hero-actions">
            <a className="button" href="#experience">Explore experience ↓</a>
            <a className="button ghost" href={`mailto:${meta.email}`}>{meta.email}</a>
            <span className="notice">Notice period: <strong>{meta.noticePeriod}</strong></span>
          </div>
        </section>

        {overview && (
          <section className="overview reveal">
            <p className="section-label">Overview</p>
            {overview.intro.map((line, index) => <p key={index}>{linkify(line)}</p>)}
          </section>
        )}

        {mainSections.map((section, index) => (
          <section className={`content-section section--${slug(section.title)}`} id={sectionId(section.title)} key={section.title}>
            <div className="section-heading reveal">
              <p className="section-label">{String(index + 1).padStart(2, '0')} / {section.title}</p>
            </div>
            <div className="section-content">
              {section.intro.filter((line) => !line.startsWith('- ')).map((line, i) => (
                <p className="section-intro reveal" key={i}>{linkify(line)}</p>
              ))}
              {section.intro.some((line) => line.startsWith('- ')) && (
                <ul className="section-list reveal">
                  {section.intro.filter((line) => line.startsWith('- ')).map((line, i) => (
                    <li key={i}>{linkify(line.slice(2))}</li>
                  ))}
                </ul>
              )}
              {section.items.length > 0 && (
                <div className="entries">
                  {section.items.map((item) => <Entry item={item} key={item.title} />)}
                </div>
              )}
            </div>
          </section>
        ))}
      </main>

      <footer>
        <span>© {new Date().getFullYear()} {meta.name}</span>
        <span>Built from one editable Markdown file · <a href="#top">Back to top ↑</a></span>
      </footer>

      <Analytics />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
