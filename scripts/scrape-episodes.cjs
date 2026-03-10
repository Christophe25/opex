const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// All 12 episode page URLs from Ausha public site
const EPISODE_URLS = [
    'https://podcast.ausha.co/excellence-operationnelle/new-episode-of-10-30-7-13-pm',
    'https://podcast.ausha.co/excellence-operationnelle/episode-2-qu-est-ce-que-l-excellence-operationnelle',
    'https://podcast.ausha.co/excellence-operationnelle/episode-3-la-chasse-au-gaspillage-les-7-mudas',
    'https://podcast.ausha.co/excellence-operationnelle/episode-4-le-5s-l-ordre-qui-libere',
    'https://podcast.ausha.co/excellence-operationnelle/episode-5-le-standard-de-travail-la-qualite-repetable',
    'https://podcast.ausha.co/excellence-operationnelle/episode-6-le-management-visuel-voir-pour-mieux-comprendre',
    'https://podcast.ausha.co/excellence-operationnelle/episode-7-le-gemba-aller-voir-ecouter-comprendre',
    'https://podcast.ausha.co/excellence-operationnelle/episode-8-le-kaizen-les-petites-ameliorations-au-quotidien',
    'https://podcast.ausha.co/excellence-operationnelle/episode-9-la-resolution-de-probleme-penser-autrement',
    'https://podcast.ausha.co/excellence-operationnelle/episode-10-le-takt-time-equilibrer-le-rythme-de-production',
    'https://podcast.ausha.co/excellence-operationnelle/episode-11-l-autonomation-detecter-sans-controle-final',
    'https://podcast.ausha.co/excellence-operationnelle/episode-12-cultiver-l-excellence-le-lean-a-l-ere-du-digital-et-de-l-ia',
];

const PODCAST_META = {
    title: "Le Temps Maîtrisé - Excellence opérationnelle dans l'horlogerie suisse",
    description: "Bienvenue dans Le Temps Maîtrisé, le podcast qui explore les coulisses de l'excellence opérationnelle dans l'horlogerie suisse. Chaque épisode vous plonge au cœur des ateliers, des méthodes Lean et des outils qualité qui façonnent la précision et la beauté du temps.",
    coverImage: "https://image.ausha.co/Qjf42vz69yOlOk88IwFbwxj6XxbJqGdlOkpBgqWs_1400x1400.jpeg?t=1761847626",
    author: "Christophe Fournier",
    link: "https://podcast.ausha.co/excellence-operationnelle"
};

const EPISODE_DESCRIPTIONS = [
    "Dans cet épisode, plongez aux origines de l'excellence horlogère. Découvrez comment la quête millimétrique de précision et du 'zéro défaut' a forgé une mentalité industrielle unique, socle idéal pour le Lean Management.",
    "Qu'est-ce que l'excellence opérationnelle ? Apprenez comment cette philosophie (le 'Lean'), axée sur la création de valeur et la satisfaction du client final, a transcendé l'industrie automobile pour s'appliquer à la haute horlogerie.",
    "La chasse aux Mudas ! Explorez les 7 grandes familles de gaspillages (surproduction, attente, mouvements inutiles...) et comprenez comment l'œil exercé de l'horloger les traque pour préserver la valeur de chaque seconde.",
    "Découvrez la méthode des '5S' : un outil fondamental pour créer un environnement de travail sécurisé, organisé et performant. L'ordre et la rigueur sont les premières fondations de la qualité esthétique et technique.",
    "Le standard de travail n'est pas une contrainte, mais une protection. Comprenez comment la définition et le respect rigoureux de la 'meilleure méthode connue' garantit une qualité de production répétable et sans stress.",
    "Voir pour comprendre instantanément : le Management Visuel. Comment l'utilisation de repères visuels simples, de codes couleurs et de tableaux (AIC) transforme un atelier complexe en un écosystème limpide piloté par ses équipes.",
    "Le 'Gemba', ou le lieu de la vérité. Pourquoi un manager de l'excellence opérationnelle doit quitter son bureau et ses tableaux de bord pour aller observer respectueusement la valeur ajoutée là où elle se crée : sur le terrain.",
    "Le Kaizen, la force des petits pas. Découvrez comment l'amélioration continue n'est pas faite de grandes révolutions technologiques, mais d'une multitude de petites idées quotidiennes portées par les artisans eux-mêmes.",
    "Plongez dans les méthodes de Résolution de Problème telles que les '5 Pourquoi' et le diagramme d'Ishikawa. Apprenez à remonter méticuleusement à la cause racine d'une anomalie plutôt que de n'en traiter que les symptômes.",
    "Le rythme musical de la manufacture : le Takt Time. Découvrez comment équilibrer harmonieusement la cadence de production avec la demande client, pour éviter à la fois la surproduction coûteuse et la précipitation.",
    "L'Autonomation (Jidoka) expliquée : pourquoi accorder aux machines et aux opérateurs le pouvoir (et le devoir) d'arrêter la production à la moindre anomalie est le secret d'une qualité intégrée parfaite avant l'étape suivante.",
    "L'industrie 4.0 rencontre le Lean. Comment la digitalisation, la récolte de données intelligentes et la précision de l'Intelligence Artificielle viennent démultiplier (sans remplacer) les fondamentaux humains de l'excellence opérationnelle."
];

function fetchPage(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            // Handle redirects
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return fetchPage(res.headers.location).then(resolve).catch(reject);
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
        req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
    });
}

function extractAudioUrl(html) {
    // Look for audio URL in various patterns
    const patterns = [
        /https:\/\/audio\.ausha\.co\/[A-Za-z0-9]+\.mp3[^"'\s]*/g,
        /"audioUrl"\s*:\s*"([^"]+)"/,
        /enclosure[^>]*url="([^"]+\.mp3[^"]*)"/,
        /data-src="(https:\/\/audio[^"]+\.mp3[^"]*)"/,
        /src="(https:\/\/audio\.ausha\.co\/[^"]+)"/,
    ];

    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match) {
            // If it's the global regex, return first match
            if (pattern.global) return match[0];
            // If it's a capturing group, return the group
            return match[1] || match[0];
        }
    }
    return null;
}

function extractTitle(html) {
    const match = html.match(/<title>([^<]+)<\/title>/);
    if (match) {
        let title = match[1].replace(/ \| Ausha/, '').trim();
        // Remove everything after " | " (which usually contains the series name)
        title = title.split(' | ')[0].trim();
        // Decode HTML entities
        title = title.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
        return title;
    }
    return null;
}

function extractImage(html) {
    const match = html.match(/og:image[^>]*content="([^"]+)"/);
    return match ? match[1] : PODCAST_META.coverImage;
}

function extractDuration(html) {
    // Look for duration in meta or itunes:duration
    const match = html.match(/(\d+)min/);
    return match ? `${match[1]}:00` : 'N/A';
}

function extractPublishDate(html) {
    const match = html.match(/Published on ([A-Za-z]+ \d+, \d{4})/);
    if (match) return match[1];
    const ogMatch = html.match(/article:published_time[^>]*content="([^"]+)"/);
    if (ogMatch) return ogMatch[1];
    return null;
}

async function scrapeAllEpisodes() {
    console.log('🔄 Scraping all episodes from Ausha...\n');

    const episodes = [];

    for (let i = 0; i < EPISODE_URLS.length; i++) {
        const url = EPISODE_URLS[i];
        const epNum = i + 1;

        try {
            console.log(`  📡 Fetching Episode ${epNum}...`);
            const html = await fetchPage(url);

            const audioUrl = extractAudioUrl(html);
            const title = extractTitle(html);
            const image = extractImage(html);

            episodes.push({
                id: `ep-${epNum}`,
                episodeNumber: epNum,
                title: title || `Épisode ${epNum}`,
                audioUrl: audioUrl || '',
                description: EPISODE_DESCRIPTIONS[i],
                image: `/infographics/ep${epNum}.png`,
                link: url,
                keywords: ['excellence opérationnelle', 'lean management', 'horlogerie', 'suisse', 'qualité'],
            });

            console.log(`     ✅ ${title || `Episode ${epNum}`}`);
            if (audioUrl) console.log(`     🎵 Audio: ${audioUrl.substring(0, 60)}...`);
            else console.log(`     ⚠️  No audio URL found in HTML`);

            // Small delay to be respectful
            await new Promise(r => setTimeout(r, 500));
        } catch (err) {
            console.error(`     ❌ Error: ${err.message}`);
            episodes.push({
                id: `ep-${epNum}`,
                episodeNumber: epNum,
                title: `Épisode ${epNum}`,
                audioUrl: '',
                description: '',
                image: `/infographics/ep${epNum}.png`,
                link: url,
                keywords: [],
            });
        }
    }

    // Generate data.js
    const content = `// Auto-generated by scrape-episodes.cjs — ${new Date().toISOString()}
export const podcastMeta = ${JSON.stringify(PODCAST_META, null, 2)};

export const podcasts = ${JSON.stringify(episodes, null, 2)};
`;

    const outputPath = path.join(__dirname, '../src/data.js');
    fs.writeFileSync(outputPath, content);

    console.log(`\n✅ Successfully scraped ${episodes.length} episodes to src/data.js`);
    const withAudio = episodes.filter(e => e.audioUrl).length;
    console.log(`   🎵 ${withAudio}/${episodes.length} episodes have audio URLs`);
}

scrapeAllEpisodes();
