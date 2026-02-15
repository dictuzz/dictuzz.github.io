/**
 * PORTFOLIO CONTENT DATA
 * The Single Source of Truth for all text and images in the portfolio.
 */

window.PORTFOLIO_CONTENT = {
    // 1. GLOBAL (Footer, Meta, etc)
    global: {
        author: "Benedictus Richard Ricardo",
        email: "contact@dictuzz.me",
        navigation: [
            { label: "I. Curtain", url: "index.html" },
            { label: "II. Proof", url: "proof.html" },
            { label: "III. Thread", url: "thread.html" },
            { label: "IV. Signal", url: "signal.html" }
        ],
        socials: [
            { label: "LinkedIn", url: "https://www.linkedin.com/in/dictuzz" },
            { label: "WhatsApp", url: "https://api.whatsapp.com/send?phone=6285186888630" },
            { label: "Instagram", url: "https://instagram.com/dictuzz" },
            { label: "Resume", url: "resume/" }
        ],
        footer: {
            tagline: "Organizing disorder into structure.",
            copyright: "© 2026 Benedictus Richard. All Rights Reserved."
        }
    },

    // 2. CURTAIN (Act I - index.html)
    curtain: {
        textLines: [
            "BENEDICTUS",
            "RICHARD RICARDO"
        ],
        tagline: "I put rooms in order and people in motion."
    },

    // 3. PROOF (Act II - proof.html)
    proof: {
        experiences: [
            {
                id: "student-council",
                hook: "34 people. 10 divisions. One pandemic.",
                role: "Chairman, Student Council",
                company: "Saint Mary 2 High School, Bandung",
                date: "Nov 2021 – Nov 2022",
                image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=675&fit=crop&q=80",
                alt: "Student council team collaboration and leadership",
                body: `
                    <p>The council inherited a communication structure built for hallways. Then COVID shut the school. Ten divisions that used to coordinate face-to-face now ran through group chats and video calls. Half the members had never met each other in person.</p>
                    <p>The instinct was to centralize — run everything through the chair, reduce variables. We did the opposite. Each division head became autonomous over their own work, with one rule: a written one-paragraph update, weekly, on time. No meetings unless someone asked for one.</p>
                    <p>Three divisions outperformed the previous year's entire council output. Two stalled — their leads treated autonomy as permission to disappear. The fix was ugly: reassign members mid-term, fold one division into another. The promotional campaign to 12 feeder schools — which produced a viral TikTok — came from the division I almost shut down. It was rescued, not planned.</p>
                `,
                takeaway: "Trust without structure is abandonment. My job was never to lead 34 people. It was to build 10 leaders and intervene when one of them couldn't lead yet."
            },
            {
                id: "hdi",
                hook: "12 hours. Every week. That's how much time Finance lost to a process no one had questioned.",
                role: "Management Trainee",
                company: "Home Digital Indonesia",
                date: "Jul 2024 – Sep 2025",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop&q=80",
                alt: "Data dashboard and workflow automation system",
                body: `
                    <p>The Finance team ran weekly reports by copying data between three spreadsheets, reformatting columns, and emailing summaries to five people. Nobody thought it was broken. It was just how reporting works here.</p>
                    <p>I didn't ask for permission to change it. I built the macro on my own laptop, tested it against three weeks of manual reports, and sent the comparison to my supervisor: same output, six minutes instead of twelve hours.</p>
                    <p>The macro shipped. Finance adopted it. Then Sales asked for one. Then Operations. The work expanded into a cross-team SOP standardization project — something no one had planned or requested. It happened because solving one broken process exposed three more.</p>
                    <p>The uncomfortable part: automating someone's daily task means telling them the thing they've been doing for months was unnecessary. Not everyone took that well.</p>
                `,
                takeaway: "Automation isn't a technical problem. It's a political one. The code takes an afternoon. The conversation takes weeks."
            },
            {
                id: "stage-crew",
                hook: "1,000 people in the seats. No documented transition procedure. Showtime approaching.",
                role: "Stage Crew",
                company: "Ultimate Event Organizer",
                date: "Jun 2022 – Aug 2022",
                image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=675&fit=crop&q=80",
                alt: "Large-scale event production and stage management",
                body: `
                    <p>Event production looks like creativity from the audience side. From backstage, it's logistics. Which act transitions in what order. Where cables run so no one trips. Who has authority to call a hold if something breaks. These aren't artistic decisions. They're operational ones, and they have to be made before anything creative can happen.</p>
                    <p>The existing process was tribal knowledge — each crew member understood their piece but nobody had documented the sequence. Transitions ran on instinct, which meant they ran on luck.</p>
                    <p>I wrote the runsheet. Not because anyone asked — because a transition gap left 1,000 people watching dead air. After the runsheet, transitions tightened to under 90 seconds. The solution wasn't clever. It was a document.</p>
                `,
                takeaway: "Most problems that look like talent problems are actually documentation problems."
            },
            {
                id: "forum-osis",
                hook: "Zero historical data. 27 cities. One database.",
                role: "Head of Business",
                company: "Forum OSIS Jawa Barat",
                date: "Nov 2021 – Nov 2022",
                image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=675&fit=crop&q=80",
                alt: "Strategic partnership meeting and network mapping",
                body: `
                    <p>The organization covered 27 cities in West Java, but every time a new tenure began, they started from scratch. There was no contact list. No history of past sponsors. No institutional memory.</p>
                    <p>I didn't just 'manage' partnerships; I built the infrastructure for them. I created the organization's first centralized partnership database, tracking every interaction, every rejection, and every deal. We moved from cold-calling strangers to nurturing relationships.</p>
                    <p>By the end of the tenure, we hadn't just secured funding for the year. We handed the next generation something more valuable than money: a map.</p>
                `,
                takeaway: "Institutional memory is the difference between an organization and a group of people hanging out."
            },
            {
                id: "catholic-youth",
                hook: "400 attendees. 100 volunteers. The logistics of faith.",
                role: "Vice Chief",
                company: "Catholic Youth Organisation",
                date: "Aug 2023 – Aug 2024",
                image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=675&fit=crop&q=80",
                alt: "Community gathering night event",
                body: `
                    <p>Faith events often run on "good vibes" and vague timelines. But a worship night for 400 people isn't just a spiritual event; it's a crowd control operation.</p>
                    <p>As Vice Chief, my role wasn't to lead the worship. It was to ensure the worship wasn't interrupted by feedback loops, power outages, or bottlenecks at the entrance. We treated the logistics with the same reverence as the liturgy.</p>
                    <p>The result was invisible. The lights worked. The sound was clear. The seats were full. The focus remained entirely on the purpose of the gathering, precisely because the machinery behind it was silent.</p>
                `,
                takeaway: "Good detailed logistics is the highest form of respect for a guest's time."
            },
            {
                id: "acolyte",
                hook: "Discipline in silence. Coordination in shadows.",
                role: "Vice Chief Acolyte",
                company: "Zipur Church",
                date: "Mar 2020 – Mar 2022",
                image: "https://images.unsplash.com/photo-1548625361-9872e29787ee?w=1200&h=675&fit=crop&q=80",
                alt: "Solemn church ceremony service",
                body: `
                    <p>Most see the ritual. The acolytes see the clockwork. A service is a 90-minute live performance where mistakes are not just technical errors, but distractions from the divine.</p>
                    <p>Managing the roster for the entire parish meant balancing personalities, skill levels, and reliability. It wasn't just about filling slots; it was about ensuring that every team on the altar moved as one unit, invisible in their service.</p>
                `,
                takeaway: "True service is when the effort is invisible, and only the result is felt."
            },
            {
                id: "vertical-rescue",
                hook: "High stakes. High altitude. Zero margin for error.",
                role: "Path Climber",
                company: "Vertical Rescue Indonesia",
                date: "Jan 2021 – Present",
                image: "https://images.unsplash.com/photo-1522071901873-411886a10004?w=1200&h=675&fit=crop&q=80",
                alt: "Vertical cliff rescue training",
                body: `
                    <p>In vertical rescue, "good enough" gets people killed. Equipment maintenance isn't a chore; it's a life-or-death ritual. Every carabiner, every rope, every knot has to be perfect every single time.</p>
                    <p>Training isn't just about physical strength. It's about mental clarity under pressure. It's knowing that when things go wrong at 50 meters up, panic is the enemy and procedure is the only way down.</p>
                `,
                takeaway: "Reliability is doing the boring things right when no one is watching, so they hold when everyone is depending on them."
            }
        ]
    },

    // 4. THREAD (Act III - thread.html)
    thread: {
        thesis: "Every role I've held has been the same job: walk into disorder, find the structure it's missing, and leave something that runs without me.",
        clusters: [
            {
                title: "Structure",
                content: `
                    <p>The first real system I built was an acolyte schedule for a parish. It was a spreadsheet. Before that, the assignments were made by phone calls the week before each mass, and someone always got missed.</p>
                    <p>At Home Digital Indonesia, the scale changed but the pattern didn't. Three teams — Finance, Sales, Operations — had their own reporting formats, their own processes, their own definitions of what "done" meant. I wrote the SOPs. I built the macros. I ran the feedback surveys. The job title said Management Trainee. The actual job was: make this company's operations legible.</p>
                    <p>I study data science because structure is what I believe in. Data without structure is noise. Teams without structure are crowds. I'm not interested in data for its own sake — I'm interested in what happens when you organize it correctly.</p>
                `
            },
            {
                title: "Stage",
                content: `
                    <p>I've been an MC since high school. Not the hype kind — the kind that keeps a 400-person event on tempo. Reading a room is the same skill as reading a dataset: you're looking for the pattern, the outlier, the moment something shifts.</p>
                    <p>Stage crew taught me that what the audience sees is 10% of the work. Backstage is where the real coordination happens — cable runs, transition timing, contingency plans for equipment that hasn't been tested. I wrote the first runsheet my production team had ever used. It was a document, not a performance.</p>
                    <p>In 2023, I spoke to journalism and communications students at Universitas Parahyangan. The preparation took longer than the talk. The content part was easy. Learning to hold silence in front of 60 people — that took practice.</p>
                    <p>That same year, an Instagram Reel I made for a German-language competition won first place at Goethe-Institut Bandung. Back in 2019, a short film I directed placed first at a diocesan competition. I don't call myself a filmmaker. But I've spent enough time thinking about how to hold an audience's attention across media.</p>
                `
            },
            {
                title: "Service",
                content: `
                    <p>I've spent most of my volunteer life in Catholic organizations. Vice Chairman of the youth organization, Vice Chief Acolyte, council leadership in parish contexts. These roles don't go on most portfolios. I include them because they taught me something corporate roles didn't: how to lead people who can leave at any time.</p>
                    <p>Volunteers don't report to you. They chose to be there, and they can choose to stop. Managing 11 volunteers for a 400-person worship event is harder than managing 34 paid council members. You can't rely on obligation. You rely on clarity — clear roles, clear expectations, clear gratitude.</p>
                    <p>Vertical rescue is the most literal version of service I've done. Equipment maintenance, path climbing, training support. There's no audience. There's no metric. Someone might need help on a mountain, and when they do, the gear has to work.</p>
                `
            }
        ],
        footnotes: [
            {
                title: "Languages",
                value: "Sundanese (fluent), Indonesian (native), English (B2), German (B2), Latin (self-study)"
            },
            {
                title: "Education",
                value: "B.Sc. Data Science — ongoing, 2025"
            }
        ]
    },

    // 5. SIGNAL (Act IV - signal.html)
    signal: {
        sentence: "If something here resonated — I'd like to hear why.",
        form: {
            action: "https://formspree.io/f/xlgwgero",
            fields: {
                name: { label: "Full Name", placeholder: "John Doe" },
                email: { label: "Email Address", placeholder: "john@example.com" },
                phone: { label: "Phone Number", placeholder: "+62 812 3456 7890" },
                topic: { label: "Topic", placeholder: "Project collaboration, consultation, etc." }
            },
            submit: "Send Request"
        }
    }
};
