import type { JSX } from "react";
import "./section.scss";
import { useMainSectionObserver } from "../../hooks/useMainSectionObserver";

interface IProps {
  children: React.ReactNode;
  data: {
    asset: string;
    theme: Record<string, string>;
  };
}

// Génère le style avec background + variables CSS
function renderStyle(asset: string, theme: Record<string, string>) {
  const cssVars = Object.entries(theme).reduce((vars, [key, value]) => {
    vars[key] = value;
    return vars;
  }, {} as Record<string, string>);

  return {
    backgroundImage: `url(${asset})`,
    ...cssVars,
  };
}

export default function Section({ children, data }: IProps): JSX.Element {
  const onEnterMainSection = () => {
    Object.entries(data.theme).forEach((value) => {
      document.documentElement.style.setProperty(value[0], value[1]);
    });
  };

  const ref = useMainSectionObserver(
    onEnterMainSection
  ) as React.RefObject<HTMLDivElement>;

  return (
    <div
      ref={ref}
      style={renderStyle(data.asset, data.theme)}
      className="section"
    >
      {children}
      <div className="fade-top"></div>
      <div className="fade-bottom"></div>
    </div>
  );
}
