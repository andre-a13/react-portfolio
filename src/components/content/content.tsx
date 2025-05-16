import { useState } from 'react';
import '../card/card.scss'
import Card from '../card/card';

const contentData = [
    {
        title: "Arnaud ANDRE",
        subtitle: "Développeur Full Stack",
        content: "Je conçois des solutions techniques modernes, robustes et scalables, passionné par le front-end et le back-end.",
    },
    {
        title: "Compétences",
        subtitle: "Front-end / Back-end / Cloud",
        content: "- React, Angular, JavaScript\n- Node.js, Laravel\n- MongoDB, PostgreSQL\n- Azure, AWS",
    },
    {
        title: "Expériences",
        subtitle: "Lead Developer chez WebexpR",
        content: "Gestion de projets SharePoint / Office 365 avec une équipe Agile, développement full stack, conseil clients.",
    },
    {
        title: "Contact",
        subtitle: "Restons en contact",
        content: "Email: arnaud.a.dev@gmail.com\nLinkedIn: linkedin.com/in/arnaud-andre",
    }
];

const Content = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prev = () => {
        setCurrentIndex((currentIndex - 1 + contentData.length) % contentData.length);
    };

    const next = () => {
        setCurrentIndex((currentIndex + 1) % contentData.length);
    };

    return (
        <div className="card-container" role="main">
            <Card
                title={contentData[currentIndex].title}
                subtitle={contentData[currentIndex].subtitle}
                content={contentData[currentIndex].content}
            />
            <button aria-label="Précédent" className="nav-button nav-prev" onClick={prev}>&lt;</button>
            <button aria-label="Suivant" className="nav-button nav-next" onClick={next}>&gt;</button>
        </div>
    );
};

export default Content;
