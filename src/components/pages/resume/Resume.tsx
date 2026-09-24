import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowUpRight, Award, BadgeCheck, Blocks, BriefcaseBusiness, Check, Cloud, CodeXml, Database, Github, Globe2, Languages, Linkedin, Mail, MapPin, Printer, Server, Share2, Workflow } from 'lucide-react';
import { certifications, contact, resumeLabels, resumePath, resumes } from './resume-data';
import type { ResumeLanguage, ResumeVariant } from './resume-data';
import './resume.css';

const icons = { platform: Blocks, code: CodeXml, cloud: Cloud, workflow: Workflow, server: Server, database: Database };

export default function Resume({ variant = 'full-stack' }: { variant?: ResumeVariant }) {
  const { i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedLanguage = searchParams.get('lang');
  const language: ResumeLanguage = requestedLanguage === 'en' || requestedLanguage === 'fr'
    ? requestedLanguage : i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'fr';
  const labels = resumeLabels[language];
  const resume = resumes[language][variant];
  const [shareResult, setShareResult] = useState<{ url: string; status: 'idle' | 'copied' | 'manual' }>({ url: '', status: 'idle' });
  const manualLink = useRef<HTMLInputElement>(null);
  const shareUrl = typeof window === 'undefined' ? resumePath(variant, language)
    : new URL(resumePath(variant, language), window.location.origin).href;
  const shareState = shareResult.url === shareUrl ? shareResult.status : 'idle';

  function resetShare() {
    setShareResult({ url: '', status: 'idle' });
  }

  useEffect(() => {
    const previousTitle = document.title;
    const previousLanguage = document.documentElement.lang;
    document.title = `${contact.name} | ${resume.title}`;
    document.documentElement.lang = language;
    const existing = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const description = existing ?? document.createElement('meta');
    const previousDescription = description.content;
    description.name = 'description';
    description.content = resume.intro;
    if (!existing) document.head.appendChild(description);
    return () => {
      document.title = previousTitle;
      document.documentElement.lang = previousLanguage;
      if (existing) description.content = previousDescription;
      else description.remove();
    };
  }, [language, resume.title, resume.intro]);

  useEffect(() => {
    if (shareState === 'manual') manualLink.current?.select();
    if (shareState !== 'copied') return;
    const timer = window.setTimeout(() => setShareResult({ url: '', status: 'idle' }), 3000);
    return () => window.clearTimeout(timer);
  }, [shareState]);

  function changeLanguage(value: ResumeLanguage) {
    setSearchParams({ lang: value });
    void i18n.changeLanguage(value);
    resetShare();
  }

  async function copyLink() {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(shareUrl);
      setShareResult({ url: shareUrl, status: 'copied' });
    } catch {
      setShareResult({ url: shareUrl, status: 'manual' });
    }
  }

  return (
    <div className={`resume-page resume-page--${variant}`} lang={language}>
      <a className="resume-skip" href="#resume-main">{labels.skip}</a>
      <header className="resume-header resume-shell">
        <Link className="resume-home" to="/"><ArrowLeft size={17} aria-hidden="true" />{labels.portfolio}</Link>
        <span className="resume-header-label">{labels.resume}</span>
        <div className="resume-language" role="group" aria-label={labels.chooseLanguage}>
          {(['fr', 'en'] as const).map((value) => <button key={value} type="button" lang={value} aria-pressed={language === value} onClick={() => changeLanguage(value)}>{value.toUpperCase()}</button>)}
        </div>
      </header>

      <main id="resume-main" className="resume-shell" tabIndex={-1}>
        <nav className="resume-versions" aria-label={labels.chooseVersion}>
          <Link to={resumePath('microsoft', language)} onClick={resetShare} className={variant === 'microsoft' ? 'is-active' : ''} aria-current={variant === 'microsoft' ? 'page' : undefined}><Blocks size={18} aria-hidden="true" />Microsoft</Link>
          <Link to={resumePath('full-stack', language)} onClick={resetShare} className={variant === 'full-stack' ? 'is-active' : ''} aria-current={variant === 'full-stack' ? 'page' : undefined}><CodeXml size={18} aria-hidden="true" />{labels.fullStack}</Link>
        </nav>

        <section className="resume-hero" aria-labelledby="resume-title">
          <div className="resume-hero-copy">
            <p className="resume-eyebrow">{resume.label}</p>
            <p className="resume-name">{contact.name}</p>
            <h1 id="resume-title">{resume.title}</h1>
            <p className="resume-intro">{resume.intro}</p>
            <div className="resume-actions">
              <button className="resume-button resume-button--primary" type="button" onClick={() => void copyLink()}>
                {shareState === 'copied' ? <Check size={18} aria-hidden="true" /> : <Share2 size={18} aria-hidden="true" />}
                {shareState === 'copied' ? labels.copied : labels.copy}
              </button>
              <a className="resume-button" href={`mailto:${contact.email}`}><Mail size={18} aria-hidden="true" />{labels.contact}</a>
              <button className="resume-print" type="button" onClick={() => window.print()}><Printer size={17} aria-hidden="true" />{labels.print}</button>
            </div>
            <div className="resume-share-status" role="status" aria-live="polite">{shareState === 'copied' ? labels.copied : shareState === 'manual' ? labels.copyError : ''}</div>
            {shareState === 'manual' && <label className="resume-share-manual">{labels.copyHelp}<input ref={manualLink} readOnly value={shareUrl} onFocus={(event) => event.target.select()} /></label>}
          </div>
          <aside className="resume-profile">
            <div className="resume-monogram" aria-hidden="true">AA<span><CodeXml size={20} /></span></div>
            <p className="resume-positioning">{resume.positioning}</p>
            <ul className="resume-facts">
              <li><MapPin size={18} aria-hidden="true" />{labels.location}</li>
              <li><Globe2 size={18} aria-hidden="true" />{labels.remote}</li>
              <li><CodeXml size={18} aria-hidden="true" />{labels.since}</li>
            </ul>
            <span className="resume-engagement">{labels.b2b}</span>
          </aside>
        </section>

        <section className="resume-section" aria-labelledby="resume-expertise">
          <div className="resume-section-heading"><span aria-hidden="true">01</span><h2 id="resume-expertise">{labels.expertise}</h2></div>
          <div className="resume-expertise-grid">
            {resume.expertise.map((item) => {
              const Icon = icons[item.icon];
              return <article className="resume-expertise" key={item.title}>
                <span className="resume-icon"><Icon size={24} aria-hidden="true" /></span>
                <h3>{item.title}</h3><p>{item.description}</p>
                <ul className="resume-tags">{item.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul>
              </article>;
            })}
          </div>
          <div className="resume-additional"><h3>{labels.additional}</h3><p>{resume.complementary.join(' · ')}</p></div>
        </section>

        <div className="resume-career-grid">
          <section className="resume-section resume-experience-section" aria-labelledby="resume-experience">
            <div className="resume-section-heading"><span aria-hidden="true">02</span><h2 id="resume-experience">{labels.experience}</h2></div>
            <div className="resume-timeline">
              {resume.experiences.map((experience) => <article className="resume-experience" key={experience.company}>
                <span className="resume-timeline-marker" aria-hidden="true"><BriefcaseBusiness size={18} /></span>
                <div className="resume-experience-top"><h3>{experience.company}</h3><span className="resume-period">{experience.period}</span></div>
                <p className="resume-role">{experience.role}</p>
                <p className="resume-context">{experience.context}</p>
                <ul className="resume-achievements">{experience.points.map((point) => <li key={point}>{point}</li>)}</ul>
              </article>)}
            </div>
          </section>
          <aside className="resume-credentials">
            <section aria-labelledby="resume-certifications">
              <h2 id="resume-certifications"><Award size={21} aria-hidden="true" />{labels.certifications}</h2>
              <ul className="resume-certificates">{certifications.map((certificate) => <li key={certificate.code}>
                <BadgeCheck size={21} aria-hidden="true" />
                <div><span className="resume-certificate-code">{certificate.code}</span><p>{certificate.name}</p></div>
              </li>)}</ul>
            </section>
            <section className="resume-spoken" aria-labelledby="resume-languages">
              <h2 id="resume-languages"><Languages size={21} aria-hidden="true" />{labels.languages}</h2>
              <dl>
                <div><dt>{labels.french}</dt><dd>{labels.native}</dd></div>
                <div><dt>{labels.english}</dt><dd><strong>B2+</strong> · {labels.professional}</dd></div>
                <div><dt>{labels.german}</dt><dd><strong>B1</strong> · {labels.professional}</dd></div>
              </dl>
            </section>
          </aside>
        </div>

        <section className="resume-section" aria-labelledby="resume-projects">
          <div className="resume-section-heading"><span aria-hidden="true">03</span><h2 id="resume-projects">{labels.projects}</h2></div>
          <div className="resume-project-grid" style={{ '--resume-project-count': resume.projects.length } as CSSProperties}>
            {resume.projects.map((project) => {
              const Icon = icons[project.icon];
              return <article className="resume-project" key={project.title}>
                <div className="resume-project-title"><Icon size={22} aria-hidden="true" /><h3>{project.title}</h3></div>
                <p>{project.description}</p>
                <ul className="resume-tags">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
              </article>;
            })}
          </div>
        </section>

        <section className="resume-contact" aria-labelledby="resume-contact-title">
          <div><p className="resume-eyebrow">{labels.remote} · {labels.b2b}</p><h2 id="resume-contact-title">{labels.contactTitle}</h2><p>{labels.contactText}</p></div>
          <div className="resume-contact-links">
            <a className="resume-email" href={`mailto:${contact.email}`}><Mail size={20} aria-hidden="true" />{contact.email}<ArrowUpRight size={19} aria-hidden="true" /></a>
            <div className="resume-socials"><a href={contact.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={19} aria-hidden="true" />LinkedIn<ArrowUpRight size={14} aria-hidden="true" /></a><a href={contact.github} target="_blank" rel="noopener noreferrer"><Github size={19} aria-hidden="true" />GitHub<ArrowUpRight size={14} aria-hidden="true" /></a></div>
          </div>
        </section>

        <footer className="resume-footer">
          <span>{contact.name}</span>
          <span>{labels.resume} · {variant === 'microsoft' ? labels.microsoft : labels.fullStack}</span>
          <a href="/third-party/lucide-LICENSE.txt" target="_blank" rel="noopener noreferrer">{labels.iconLicense}</a>
        </footer>
      </main>
    </div>
  );
}
