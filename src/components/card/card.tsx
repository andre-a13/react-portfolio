import React from "react";
import { useTranslation } from "react-i18next";

interface CardProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, subtitle, children }) => {
  const { t } = useTranslation();
  return (
    <>
      <header className="card-header text-center">{title}</header>
      <h2 className="card-subtitle text-center">{t(subtitle)}</h2>
      <section className="card-content">{children}</section>
    </>
  );
};

export default Card;
