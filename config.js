/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONFIGURATION — LINK IN BIO
 * Edit this file to change your profile, links, and icons.
 * No HTML knowledge required.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const CONFIG_DATA = {
    // 1. PROFILE INFO
    profile: {
        avatar: "assets/images/dictuzz.webp", // Path to your image
        name: "dictuzz",
        tagline: "Data Scientist • Content Creator • MC • Vibe Coder",
        // Use <br> for line breaks
        bio: "Data science student dengan passion untuk memimpin dan menginspirasi.<br>Aktif di GeMa, VRI, \u0026 OMK. MC \u0026 Newscaster enthusiast.<br>Turning data into stories, code into vibes. 🔥"
    },

    // 2. MAIN LINKS
    // Icons are from FontAwesome 6 (https://fontawesome.com)
    links: [
        {
            label: "About Me",
            url: "http://dictuzz.github.io/resume",
            icon: "fas fa-briefcase",
            style: "primary"
        },
        {
            label: "Send Me an E-Mail",
            url: "mailto:cadrichardricardo@gmail.com",
            icon: "fas fa-envelope",
            style: "primary"
        },
        {
            label: "Send Me WhatsApp Message",
            url: "https://api.whatsapp.com/send?phone=6285186888630",
            icon: "fab fa-whatsapp",
            style: "primary"
        },
        {
            label: "Find Me on LinkedIn",
            url: "https://www.linkedin.com/in/dictuzz",
            icon: "fab fa-linkedin",
            style: "primary"
        },
        {
            label: "Follow My Insta",
            url: "https://www.instagram.com/dictuzz",
            icon: "fab fa-instagram",
            style: "primary"
        },
        {
            label: "Contribute to My Code",
            url: "https://github.com/dictuzz",
            icon: "fab fa-github",
            style: "primary"
        }
    ],

    // 3. FOOTER
    footer: {
        year: "2025",
        copyright: "© 2025 <a href='https://dictuzz.github.io/resume' target='_blank'>dictuzz</a>. All rights reserved."
    }
};
