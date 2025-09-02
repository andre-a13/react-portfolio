import { Mail, Link } from "lucide-react";
import "./ContactCard.scss";

export default function ContactCard() {
  return (
    <div className="contact-card">
      <ul className="contact-card__list">
        <li className="contact-card__item">
          <Mail className="contact-card__icon" />
          <a href="mailto:arnaud.a.dev@gmail.com" className="contact-card__link">
            arnaud.a.dev@gmail.com
          </a>
        </li>

        <li className="contact-card__item">
          <Link className="contact-card__icon" />
          <a
            href="https://linkedin.com/in/arnaud-andre-356314177"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card__link"
          >
            LinkedIn
          </a>
        </li>
      </ul>
    </div>
  );
}
