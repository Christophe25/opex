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
];

const PODCAST_META = {
    title: "Le Temps Maîtrisé - Excellence opérationnelle dans l'horlogerie suisse",
    description: "Bienvenue dans Le Temps Maîtrisé, le podcast qui explore les coulisses de l'excellence opérationnelle dans l'horlogerie suisse. Chaque épisode vous plonge au cœur des ateliers, des méthodes Lean et des outils qualité qui façonnent la précision et la beauté du temps.",
    coverImage: "https://image.ausha.co/Qjf42vz69yOlOk88IwFbwxj6XxbJqGdlOkpBgqWs_1400x1400.jpeg?t=1761847626",
    author: "Christophe Fournier",
    link: "https://podcast.ausha.co/excellence-operationnelle"
};

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
        return match[1].replace(/ \| Ausha/, '').trim();
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
                description: "Le Temps Maîtrisé - une série de Christophe Fournier dédiée à l'excellence opérationnelle dans l'horlogerie suisse. Chaque épisode explore les outils du Lean, la qualité et la précision, appliqués à un univers où le temps se mesure au micron.",
                image: image,
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
                image: PODCAST_META.coverImage,
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
