const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser({
  customFields: {
    item: [
      ['itunes:duration', 'duration'],
      ['itunes:image', 'itunesImage', { keepArray: false }],
      ['itunes:keywords', 'keywords'],
    ],
    feed: [
      ['itunes:image', 'itunesImage', { keepArray: false }],
    ]
  }
});

const RSS_URL = 'https://feed.ausha.co/anNeKFxJwP0A';

// Read existing local infographic image paths from data.js
function getExistingLocalImages() {
  const outputPath = path.join(__dirname, '../src/data.js');
  const localImages = {};
  try {
    const existing = fs.readFileSync(outputPath, 'utf-8');
    // Extract episode number → image path for local infographics
    const episodeRegex = /\"title\":\s*\"[^"]*Épisode\s+(\d+)[^"]*\"[\s\S]*?\"image\":\s*\"(\/infographics\/[^"]+)\"/g;
    let match;
    while ((match = episodeRegex.exec(existing)) !== null) {
      localImages[parseInt(match[1])] = match[2];
    }
    if (Object.keys(localImages).length > 0) {
      console.log(`📌 ${Object.keys(localImages).length} infographies locales trouvées — elles seront conservées`);
    }
  } catch {
    // No existing file, that's fine
  }
  return localImages;
}

async function syncPodcasts() {
  try {
    console.log('🔄 Fetching RSS feed from Ausha...');
    const existingLocalImages = getExistingLocalImages();
    const feed = await parser.parseURL(RSS_URL);

    console.log(`📡 Podcast: ${feed.title}`);
    console.log(`📦 ${feed.items.length} épisodes trouvés`);

    const podcastMeta = {
      title: feed.title || 'Le Temps Maîtrisé',
      description: feed.description || '',
      coverImage: feed.itunesImage?.href || feed.image?.url || '',
      author: feed.itunes?.author || 'Christophe Fournier',
      link: feed.link || '',
    };

    const episodes = feed.items.map((item, index) => {
      const imageHref = item.itunesImage?.href || item.itunesImage?.['$']?.href || podcastMeta.coverImage;
      // Extract episode number from title to check for existing local infographic
      const epNum = parseInt(item.title.match(/Épisode\s+(\d+)/i)?.[1] || '0');
      const localImage = existingLocalImages[epNum];

      // Custom descriptions per episode to replace the generic boilerplate
      const customDescriptions = {
        1: "Dans cet épisode introductif, nous explorons comment les valeurs historiques de la haute horlogerie suisse posent les bases de l'excellence opérationnelle moderne.",
        2: "Qu'est-ce que l'excellence opérationnelle ? Découvrez les fondamentaux de cette philosophie visant l'amélioration continue et la maximisation de la valeur.",
        3: "Découvrez les 7 Mudas du Lean : les différentes formes de gaspillages dans les processus et comment les chasser efficacement dans un atelier.",
        4: "Le 5S expliquée en détails : Trier, Ranger, Nettoyer, Standardiser, Respecter. Comment un atelier en ordre libère l'esprit et augmente la productivité.",
        5: "Le standard de travail est le point de départ de toute amélioration. Comprenez pourquoi documenter la meilleure pratique actuelle garantit une qualité répétable.",
        6: "Le management visuel permet d'identifier les problèmes en un coup d'œil. Découvrez comment rendre l'information accessible et évidente sur le terrain.",
        7: "Le Gemba : là où la vraie valeur est créée. Plongez dans l'importance d'aller sur le terrain, d'écouter les opérateurs et de comprendre la réalité.",
        8: "Le principe du Kaizen : comment de petites améliorations quotidiennes impliquant tout le monde peuvent transformer durablement une manufacture.",
        9: "Les méthodes de résolution de problème : penser autrement pour s'attaquer aux causes racines plutôt qu'aux symptômes et éviter la récurrence.",
        10: "Le takt time est le chef d'orchestre de la production. Comprenez comment équilibrer le rythme de fabrication avec la demande client de manière fluide.",
        11: "L'autonomation, ou Jidoka : comment donner aux machines (et aux humains) l'intelligence d'arrêter la production au moindre défaut pour intégrer la qualité.",
        12: "L'industrie 4.0 rencontre le Lean : comment les outils digitaux, l'IA et l'automatisation avancée propulsent l'excellence opérationnelle à un niveau supérieur."
      };

      // Clean description: remove Ausha promotional text
      const rawDesc = item.contentSnippet || item.content || '';
      const fallbackDesc = rawDesc.replace(/\n*Hébergé par Ausha\..*$/s, '').replace(/Le Temps Maîtrisé - une série.*?parfait\./gs, '').trim();
      const cleanDesc = customDescriptions[epNum] || fallbackDesc || rawDesc;

      return {
        id: item.guid || `ep-${index}`,
        title: item.title,
        date: item.pubDate,
        audioUrl: item.enclosure?.url || '',
        description: cleanDesc,
        duration: item.duration || 'N/A',
        image: localImage || imageHref,
        keywords: item.keywords ? item.keywords.split(',').map(k => k.trim()) : [],
      };
    });

    // Sort by episode number (extract from title)
    episodes.sort((a, b) => {
      const numA = parseInt(a.title.match(/Épisode\s+(\d+)/i)?.[1] || '0');
      const numB = parseInt(b.title.match(/Épisode\s+(\d+)/i)?.[1] || '0');
      return numA - numB;
    });

    const content = `// Auto-generated by sync-podcasts.cjs — ${new Date().toISOString()}
export const podcastMeta = ${JSON.stringify(podcastMeta, null, 2)};

export const podcasts = ${JSON.stringify(episodes, null, 2)};
`;

    const outputPath = path.join(__dirname, '../src/data.js');
    fs.writeFileSync(outputPath, content);

    console.log('✅ Successfully synced to src/data.js');
    episodes.forEach(ep => console.log(`   → ${ep.title} (${ep.duration})`));
  } catch (error) {
    console.error('❌ Error syncing podcasts:', error.message);
    process.exit(1);
  }
}

syncPodcasts();
