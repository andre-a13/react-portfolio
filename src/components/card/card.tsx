import React from 'react';
import { useTranslation } from 'react-i18next';

interface CardProps {
  title: string;
  subtitle: string;
  content?: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, subtitle, content, children }) => {
  const { t } = useTranslation();
  return (
    <>
      <header className="card-header text-center">{title}</header>
      <h2 className="card-subtitle text-center">{t(subtitle)}</h2>
      <section className="card-content">
        {children}
        {content && content.split('\n').map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </section>
    </>
  );
};

export default Card;
