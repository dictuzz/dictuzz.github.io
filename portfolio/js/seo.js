/**
 * SEO & Structured Data Injection
 * Generates JSON-LD for Search Engines based on window.PORTFOLIO_CONTENT
 */

document.addEventListener('DOMContentLoaded', () => {
    const data = window.PORTFOLIO_CONTENT;
    if (!data) return;

    const isResume = window.location.pathname.includes('/resume');
    const canonicalUrl = isResume ? 'https://dictuzz.me/resume/' : 'https://dictuzz.me/';

    // 1. WebSite Schema (Global)
    injectJSONLD({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Benedictus Richard Ricardo",
        "url": "https://dictuzz.me/",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://dictuzz.me/?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    });

    // 2. Person Schema (Global/Resume)
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": data.portfolio.global.author,
        "url": "https://dictuzz.me",
        "image": "https://dictuzz.me/assets/images/Aku.webp",
        "jobTitle": "Data Science Student & Automation Specialist",
        "description": data.portfolio.curtain.tagline,
        "sameAs": data.portfolio.global.socials.map(s => s.url)
    };

    if (isResume) {
        // Detailed Person Schema for Resume
        Object.assign(personSchema, {
            "mainEntityOfPage": {
                "@type": "ProfilePage",
                "@id": "https://dictuzz.me/resume/"
            },
            "knowsAbout": ["Python", "SQL", "Data Science", "Event Management", "Automation"],
            "alumniOf": {
                "@type": "CollegeOrUniversity",
                "name": "Universitas Katolik Parahyangan"
            }
        });
        injectJSONLD(personSchema);
    } else {
        // 3. ItemList Schema for Portfolio (Home)
        const portfolioSchema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": data.portfolio.proof.experiences.map((exp, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "CreativeWork",
                    "name": exp.role + " at " + exp.company,
                    "description": exp.hook,
                    "image": exp.image,
                    "url": `https://dictuzz.me/#proof` // Anchor link
                }
            }))
        };
        injectJSONLD(portfolioSchema);
        injectJSONLD(personSchema);
    }
});

function injectJSONLD(schema) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
}
