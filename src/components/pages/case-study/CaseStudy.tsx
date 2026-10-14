import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowUpRight, Mail } from 'lucide-react';
import { hrCaseStudy, hrTechnologies } from '../../../datas/hr-case-study';
import type { CaseStudyLanguage } from '../../../datas/hr-case-study';
import { trackAnalyticsEvent } from '../../../services/analytics.service';
import './case-study.css';

export default function CaseStudy() {
  const { i18n } = useTranslation();
  const [params, setParams] = useSearchParams();
  const requested = params.get('lang');
  const language: CaseStudyLanguage = requested === 'fr' || requested === 'en'
    ? requested : i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'fr';
  const study = hrCaseStudy[language];

  useEffect(() => {
    document.title = `${study.title} | Arnaud André`;
    document.documentElement.lang = language;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previous = description?.content;
    if (description) description.content = study.summary;
    return () => { if (description && previous !== undefined) description.content = previous; };
  }, [language, study.title, study.summary]);

  function changeLanguage(value: CaseStudyLanguage) {
    setParams({ lang: value });
    void i18n.changeLanguage(value);
  }

  return <div className="case-study-page" lang={language}>
    <a className="case-skip" href="#case-main">{language === 'fr' ? 'Aller au contenu' : 'Skip to content'}</a>
    <header className="case-header">
      <Link to="/"><ArrowLeft size={18} aria-hidden="true" />{study.back}</Link>
      <div role="group" aria-label={language === 'fr' ? 'Langue' : 'Language'}>
        {(['fr', 'en'] as const).map(value => <button key={value} type="button" lang={value} aria-pressed={language === value} onClick={() => changeLanguage(value)}>{value.toUpperCase()}</button>)}
      </div>
    </header>
    <main id="case-main" tabIndex={-1}>
      <p className="case-eyebrow">{study.eyebrow}</p>
      <h1>{study.title}</h1>
      <p className="case-lead">{study.summary}</p>
      <dl className="case-facts">{study.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
      <div className="case-sections">{study.sections.map(section => <section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}</div>
      <section className="case-tools"><h2>{study.technologiesLabel}</h2><ul>{hrTechnologies.map(technology => <li key={technology}>{technology}</li>)}</ul></section>
      <nav className="case-resumes" aria-label={language === 'fr' ? 'CV ciblés' : 'Targeted résumés'}>
        <Link to={`/cv/full-stack?lang=${language}`}>{study.engineeringLabel}<ArrowUpRight size={18} aria-hidden="true" /></Link>
        <Link to={`/cv/project-management?lang=${language}`}>{study.managementLabel}<ArrowUpRight size={18} aria-hidden="true" /></Link>
      </nav>
      <a className="case-contact" href="mailto:arnaud.a.dev@gmail.com" onClick={() => trackAnalyticsEvent('contact_clicked', { item: 'email' })}><Mail size={18} aria-hidden="true" />{study.contact}</a>
    </main>
  </div>;
}
