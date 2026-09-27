/* Questionnaire et profils — d'après la méthode du Dr Michael Breus (« Quand ? »).
   Les questions et les textes sont reformulés ; la logique de score suit celle du livre.
   Chaque question porte un thème (affiché au-dessus de la question) et une aide
   qui explique ce qu'elle mesure et comment y répondre. Ton : tutoiement. */

// Présentation des étapes (page d'accueil et introductions de parties)
const QUIZ_PARTS = {
  p1: {
    title: "Partie 1 · Qualité du sommeil et tempérament",
    intro: "Dix affirmations pour évaluer la légèreté de ton sommeil et ta tendance à l'inquiétude. Elles permettent de repérer le profil Dauphin, celui des dormeurs légers. Réponds « Vrai » si l'affirmation te décrit la plupart du temps.",
    home: "10 affirmations Vrai / Faux sur la qualité de ton sommeil et ton rapport à l'inquiétude. Elles repèrent le profil Dauphin."
  },
  p2: {
    title: "Partie 2 · Horloge biologique, énergie et personnalité",
    intro: "Vingt questions sur tes heures de réveil, tes pics d'énergie, ton appétit et ta personnalité. Choisis la réponse qui décrit ce que ton corps préfère quand il est libre de toute contrainte.",
    home: "20 questions à choix multiple sur tes horaires naturels, tes pics d'énergie, ton alimentation et ta personnalité. Elles départagent Lion, Ours et Loup."
  },
  p3: {
    title: "Partie 3 · Analyse fine",
    intro: "Seize questions pour affiner ton profil : sommeil, énergie, alimentation, travail, relations et personnalité. Elles mesurent ta part de chacun des quatre chronotypes et tes nuances par domaine.",
    home: "16 questions sur ton sommeil, ton énergie, ton alimentation, ton travail, tes relations et ta personnalité. Elles mesurent ta répartition entre les quatre chronotypes."
  },
  e: {
    title: "Affinage · Énergie du matin et du soir",
    intro: "Ton score se situe à la frontière entre deux chronotypes. Comparer ton énergie du matin et du soir permet de trancher.",
    home: "Si ton score est à la limite entre deux profils : 2 questions sur ton énergie du matin et du soir."
  },
  d: {
    title: "Vérification · Es-tu un Dauphin ?",
    intro: "Plusieurs de tes réponses de la partie 1 évoquent aussi le profil Dauphin. Trois affirmations permettent de confirmer ou d'écarter cette piste.",
    home: "Si certaines réponses évoquent le Dauphin : 3 affirmations pour confirmer ou écarter cette piste."
  }
};

// Partie 1 : 7 « Vrai » ou plus => Dauphin
const PART1 = [
  { theme: "Sommeil", q: "La moindre lumière ou le moindre bruit m'empêche de m'endormir, ou me réveille.",
    hint: "Pense à une chambre qui n'est pas parfaitement noire et silencieuse : un filet de lumière sous la porte, une voiture qui passe, le souffle d'un partenaire." },
  { theme: "Alimentation", q: "Manger n'est pas quelque chose qui me passionne.",
    hint: "Réponds « Vrai » si tu manges surtout parce qu'il le faut, que tu oublies parfois un repas ou que la nourriture occupe peu tes pensées." },
  { theme: "Réveil", q: "J'ouvre généralement les yeux avant que mon réveil ne sonne.",
    hint: "Il s'agit de ces réveils spontanés, souvent quelques minutes avant l'alarme, sans parvenir à se rendormir ensuite." },
  { theme: "Sommeil", q: "En avion, impossible pour moi de bien dormir, même avec un masque et des bouchons d'oreilles.",
    hint: "Si tu ne prends pas l'avion, pense à un train de nuit, une voiture ou tout autre lieu inhabituel et bruyant." },
  { theme: "Tempérament", q: "Quand je suis fatigué(e), je deviens facilement irritable.",
    hint: "Une nuit trop courte te rend-elle plus impatient(e), plus susceptible, plus prompt(e) à t'agacer ?" },
  { theme: "Tempérament", q: "Je m'inquiète beaucoup trop pour des petits détails.",
    hint: "Par exemple : relire trois fois un e-mail avant de l'envoyer, repenser longtemps à une remarque anodine, vérifier plusieurs fois que la porte est bien fermée." },
  { theme: "Sommeil", q: "Un médecin m'a diagnostiqué une insomnie (ou je suis convaincu(e) d'en souffrir).",
    hint: "L'insomnie, c'est avoir du mal à s'endormir, se réveiller la nuit ou trop tôt, plusieurs fois par semaine et depuis longtemps, avec de la fatigue en journée." },
  { theme: "Tempérament", q: "Pendant ma scolarité, mes notes étaient une vraie source de stress.",
    hint: "Repense à tes années d'école ou d'études : une note moyenne t'empêchait-elle de dormir ou t'obsédait-elle ?" },
  { theme: "Sommeil", q: "Au lieu de m'endormir, je ressasse le passé et je m'inquiète pour l'avenir.",
    hint: "Une fois la lumière éteinte, ton esprit se met-il à rejouer la journée, tes erreurs, ou à anticiper les problèmes du lendemain ?" },
  { theme: "Tempérament", q: "Je me considère comme perfectionniste.",
    hint: "Tu as du mal à considérer un travail comme terminé tant qu'il n'est pas impeccable, et un « c'est assez bien » te satisfait rarement." }
];

// Partie 2 : a = 1 point, b = 2, c = 3. 19–32 Lion, 33–47 Ours, 48–61 Loup
const PART2 = [
  { theme: "Réveil", q: "Demain, rien d'obligatoire : tu peux dormir autant que tu veux. À quelle heure ton corps se réveille-t-il de lui-même ?",
    hint: "Imagine une journée sans réveil, sans enfants ni rendez-vous, après une nuit normale. C'est l'indicateur le plus direct de ton horloge interne.",
    a: ["Avant 6 h 30", "Entre 6 h 30 et 8 h 45", "Après 8 h 45"] },
  { theme: "Réveil", q: "Quand tu dois être debout à une heure précise, comment te réveilles-tu ?",
    hint: "Ce qui compte ici, c'est ta facilité à sortir du sommeil au moment voulu.",
    a: ["Sans réveil : mon corps se réveille tout seul au bon moment", "Avec un réveil, et je me lève dès qu'il sonne", "Avec un réveil que je repousse plusieurs fois"] },
  { theme: "Réveil", q: "Le week-end, à quelle heure te réveilles-tu par rapport à la semaine ?",
    hint: "Plus l'écart est grand, plus ton horloge est décalée par rapport aux horaires imposés en semaine (c'est ce qu'on appelle le « jet-lag social »).",
    a: ["À la même heure", "De 45 minutes à 1 h 30 plus tard", "Plus d'1 h 30 plus tard"] },
  { theme: "Adaptabilité", q: "Comment vis-tu le décalage horaire ?",
    hint: "Si tu ne voyages pas, pense au passage à l'heure d'été ou d'hiver, ou à une nuit décalée (soirée tardive, garde…).",
    a: ["Difficilement : il me faut du temps pour m'en remettre", "Je suis gêné(e), mais c'est passé en 48 heures", "Presque pas, surtout quand je voyage vers l'ouest"] },
  { theme: "Alimentation", q: "Quel est ton repas préféré ?",
    hint: "Pense au moment de la journée plutôt qu'au menu : à quelle heure as-tu le plus d'appétit et de plaisir à manger ?",
    a: ["Le petit-déjeuner", "Le déjeuner", "Le dîner"] },
  { theme: "Concentration", q: "Tu dois repasser un examen important. À quel moment préfères-tu le passer ?",
    hint: "Choisis le moment où tu serais le plus concentré(e), pas celui qui te permettrait d'en être débarrassé(e) au plus vite.",
    a: ["En début de matinée", "En début d'après-midi", "En milieu ou fin d'après-midi"] },
  { theme: "Énergie physique", q: "Tu as une séance de sport intense à caser. Quand la places-tu ?",
    hint: "Indépendamment de ton agenda : à quel moment ton corps serait-il le plus performant ?",
    a: ["Avant 8 h", "Entre 8 h et 16 h", "Après 16 h"] },
  { theme: "Concentration", q: "À quel moment es-tu le plus vif, le plus alerte ?",
    hint: "Compte à partir de ton heure de réveil habituelle : quand ton esprit est-il le plus clair et le plus rapide ?",
    a: ["1 à 2 heures après mon réveil", "2 à 4 heures après mon réveil", "4 à 6 heures après mon réveil"] },
  { theme: "Rythme de travail", q: "Tu choisis librement tes horaires de travail. Quel bloc de 5 heures d'affilée prends-tu ?",
    hint: "Imagine que ton employeur te laisse totalement libre, sans conséquence sur ton salaire ni ta vie de famille.",
    a: ["De 4 h à 9 h", "De 9 h à 14 h", "De 16 h à 21 h"] },
  { theme: "Personnalité", q: "Tu dirais que ton esprit est plutôt…",
    hint: "Face à un problème, ton premier réflexe est-il de l'analyser et de planifier, ou de chercher une idée originale et de suivre ton intuition ?",
    a: ["Analytique et stratégique", "Un peu des deux", "Créatif et intuitif"] },
  { theme: "Sommeil", q: "Et la sieste ?",
    hint: "Il s'agit de ton habitude réelle, et de l'effet d'une sieste sur ta nuit suivante.",
    a: ["Je n'en fais jamais", "Ça m'arrive le week-end", "Si j'en fais une, je ne dors plus de la nuit"] },
  { theme: "Énergie physique", q: "Tu dois consacrer deux heures à un gros effort physique (déménagement, jardinage…). Quel créneau choisis-tu ?",
    hint: "Choisis le moment où tu serais à la fois le plus efficace et le moins susceptible de te blesser.",
    a: ["De 8 h à 10 h", "De 11 h à 13 h", "De 18 h à 20 h"] },
  { theme: "Hygiène de vie", q: "Côté alimentation et activité physique, quelle phrase te correspond le mieux ?",
    hint: "Sois honnête : ce que tu fais réellement, pas ce que tu aimerais faire.",
    a: ["Je fais des choix sains la plupart du temps", "Je fais des choix sains de temps en temps", "J'ai du mal à faire des choix sains"] },
  { theme: "Personnalité", q: "Quel est ton rapport au risque ?",
    hint: "Pense à l'argent, aux décisions professionnelles, aux sports, aux voyages : es-tu attiré(e) par l'inconnu ou préfères-tu la sécurité ?",
    a: ["Je l'évite autant que possible", "Ça dépend des situations", "J'aime ça"] },
  { theme: "Personnalité", q: "Tu te vois plutôt comme quelqu'un…",
    hint: "Quel rapport au temps te ressemble le plus au quotidien ?",
    a: ["Tourné vers l'avenir, avec de grands projets et des objectifs clairs", "Qui tire les leçons du passé, espère en l'avenir et profite du présent", "Qui vit l'instant présent : l'important, c'est de se sentir bien"] },
  { theme: "Personnalité", q: "À l'école, tu étais plutôt un(e) élève…",
    hint: "Il s'agit de ton attitude (discipline, régularité), pas forcément de tes résultats.",
    a: ["Modèle", "Appliqué(e)", "Peu motivé(e)"] },
  { theme: "Réveil", q: "Au réveil, le matin, tu te sens…",
    hint: "Décris tes 30 premières minutes, un jour de semaine ordinaire.",
    a: ["En forme et prêt(e) à démarrer", "Un peu dans le brouillard, mais ça passe vite", "Groggy, les paupières lourdes"] },
  { theme: "Alimentation", q: "As-tu faim en te levant ?",
    hint: "L'appétit du matin suit ton horloge biologique : il apparaît quand ton corps se considère vraiment réveillé.",
    a: ["Oui, très faim", "Un peu", "Pas du tout"] },
  { theme: "Sommeil", q: "As-tu des épisodes d'insomnie ?",
    hint: "Difficulté à s'endormir, réveils nocturnes prolongés ou réveil trop matinal sans pouvoir se rendormir.",
    a: ["Presque jamais, sauf après un décalage horaire", "Parfois, quand je traverse une période difficile ou stressante", "Oui, régulièrement, par périodes"] },
  { theme: "Bien-être", q: "Globalement, es-tu satisfait(e) de la vie que tu mènes ?",
    hint: "Prends un peu de recul : sur les derniers mois, pas seulement aujourd'hui.",
    a: ["Très satisfait(e)", "Plutôt satisfait(e)", "Peu satisfait(e)"] }
];

// Affinage (score à la frontière) : énergie matin − énergie soir
const ENERGY = [
  { theme: "Énergie", q: "Sur une échelle de 1 (très faible) à 5 (très élevée), comment évalues-tu ton niveau d'énergie le matin ?",
    hint: "Pense à la première partie de matinée, un jour ordinaire, après une nuit normale." },
  { theme: "Énergie", q: "Et ton niveau d'énergie le soir, de 1 (très faible) à 5 (très élevée) ?",
    hint: "Pense à la soirée, après le dîner : es-tu éteint(e) ou encore plein(e) d'élan ?" }
];

// Départage « X ou Dauphin ? » — proposé si la partie 1 est proche du seuil (5 ou 6 « Vrai »)
// Pour Lion et Ours : 2 « Vrai » ou plus => Dauphin. Pour Loup : 2 « Faux » ou plus => Dauphin.
const DOLPHIN_CHECK = {
  lion: { dolphinIf: true, items: [
    { theme: "Alimentation", q: "Je n'ai pas vraiment faim au réveil.", hint: "Un Lion a généralement très faim dès le lever ; un Dauphin, beaucoup moins." },
    { theme: "Sommeil", q: "Mon sommeil est léger et agité.", hint: "Tu te réveilles souvent, tu bouges beaucoup, ou tu as l'impression de ne jamais dormir profondément." },
    { theme: "Personnalité", q: "Prendre des responsabilités ne m'attire pas.", hint: "Diriger une équipe ou porter un projet te pèse plus qu'il ne te motive." }
  ]},
  ours: { dolphinIf: true, items: [
    { theme: "Alimentation", q: "La nourriture ne m'intéresse pas plus que ça.", hint: "Un Ours aime manger et grignote volontiers ; un Dauphin mange surtout par nécessité." },
    { theme: "Sommeil", q: "J'aimerais réussir à dormir plus de six heures par nuit.", hint: "Réponds « Vrai » si tes nuits dépassent rarement six heures, même quand tu as le temps de dormir." },
    { theme: "Personnalité", q: "Je n'aime pas travailler en équipe.", hint: "Tu es plus efficace et plus serein(e) quand tu travailles seul(e)." }
  ]},
  loup: { dolphinIf: false, items: [
    { theme: "Vie sociale", q: "Dans une soirée, je suis souvent parmi les derniers à partir.", hint: "Le Loup s'anime le soir ; le Dauphin, lui, a rarement l'énergie de prolonger." },
    { theme: "Personnalité", q: "Il m'arrive de faire un gros achat ou de réserver des vacances sur un coup de tête.", hint: "La spontanéité est typique du Loup ; le Dauphin pèse longuement chaque décision." },
    { theme: "Réveil", q: "Chaque matin, je repousse mon réveil au moins deux fois.", hint: "Le Loup peine à sortir du sommeil profond ; le Dauphin, au sommeil léger, se réveille plus facilement." }
  ]}
};

// Partie 3 (analyse fine) : chaque réponse renforce un chronotype.
// Elle ne modifie pas le verdict de la méthode Breus, mais mesure la répartition
// entre les quatre profils et les nuances par domaine.
const PART3 = [
  { theme: "Sommeil", q: "Le soir, à quel moment la fatigue arrive-t-elle naturellement ?",
    hint: "Pas l'heure à laquelle tu te couches, mais celle où ton corps réclame le lit.",
    a: [["Vers 21 h – 21 h 30, parfois même avant", "lion"], ["Vers 22 h 30 – 23 h", "ours"], ["Rarement avant minuit", "loup"], ["Je suis fatigué(e) mais je reste « branché(e) », impossible de décrocher", "dauphin"]] },
  { theme: "Sommeil", q: "Une fois au lit, lumière éteinte, que se passe-t-il ?",
    hint: "Pense à un soir ordinaire de semaine.",
    a: [["Je m'endors en quelques minutes", "lion"], ["Je m'endors assez vite et je dors profondément", "ours"], ["Je tourne longtemps : je ne suis pas encore fatigué(e)", "loup"], ["Mon esprit s'emballe, je rumine et mon sommeil reste léger", "dauphin"]] },
  { theme: "Sommeil", q: "Et pendant la nuit ?",
    hint: "Les réveils de quelques secondes dont tu ne te souviens pas ne comptent pas.",
    a: [["Je dors d'une traite, mais je me réveille parfois très tôt", "lion"], ["Je dors d'une traite jusqu'au réveil", "ours"], ["Je dors bien une fois endormi(e), surtout en fin de nuit", "loup"], ["Je me réveille plusieurs fois et j'ai du mal à me rendormir", "dauphin"]] },
  { theme: "Sommeil", q: "Combien d'heures de sommeil te faut-il pour être vraiment en forme ?",
    hint: "Le besoin de sommeil est en partie génétique : réponds selon ton expérience, pas selon ce qui est « recommandé ».",
    a: [["Environ 7 heures, idéalement tôt dans la nuit", "lion"], ["8 heures ou plus, sinon je le sens", "ours"], ["7 à 8 heures, mais décalées tard dans la matinée", "loup"], ["Moins de 6 heures : de toute façon, je n'arrive pas à dormir plus", "dauphin"]] },
  { theme: "Réveil", q: "Quel est ton premier réflexe au réveil ?",
    hint: "Décris tes cinq premières minutes, un jour de semaine.",
    a: [["Je me lève d'un bond, prêt(e) à attaquer", "lion"], ["Je repousse une fois l'alarme, puis douche et café", "ours"], ["Je resterais bien au lit encore une heure, de mauvaise humeur", "loup"], ["Fatigué(e) mais nerveux(se), je ne peux pas rester couché(e)", "dauphin"]] },
  { theme: "Énergie", q: "Quand survient ton principal coup de fatigue dans la journée ?",
    hint: "Ce moment où tu piques du nez ou où ta concentration s'effondre.",
    a: [["En fin d'après-midi", "lion"], ["En début d'après-midi, après le déjeuner", "ours"], ["Le matin, jusqu'à la fin de la matinée", "loup"], ["Par vagues, à des moments imprévisibles", "dauphin"]] },
  { theme: "Énergie", q: "À quel moment tes idées les plus créatives surgissent-elles ?",
    hint: "Les idées nouvelles, les déclics, les solutions originales.",
    a: [["Tôt le matin, quand tout est calme", "lion"], ["En milieu de journée, en échangeant avec d'autres", "ours"], ["Tard le soir, voire la nuit", "loup"], ["Quand je suis seul(e), souvent au moment où je devrais dormir", "dauphin"]] },
  { theme: "Alimentation", q: "Et le grignotage ?",
    hint: "Tout ce que tu manges en dehors des repas.",
    a: [["Rarement : je mange à heures fixes", "lion"], ["Assez souvent, dès que quelque chose est à portée de main", "ours"], ["Surtout le soir, devant le frigo ou un écran", "loup"], ["Presque jamais ; il m'arrive même d'oublier un repas", "dauphin"]] },
  { theme: "Alimentation", q: "Quel est ton rapport au café (ou au thé) ?",
    hint: "La caféine agit sur la vigilance : la façon dont tu l'utilises en dit long sur ton horloge.",
    a: [["Pas vraiment besoin, un seul le matin me suffit", "lion"], ["Plusieurs dans la journée pour tenir le rythme", "ours"], ["Indispensable pour démarrer le matin", "loup"], ["Il me rend nerveux(se), je fais très attention", "dauphin"]] },
  { theme: "Travail", q: "Dans quel environnement de travail es-tu le plus épanoui(e) ?",
    hint: "Imagine ton cadre idéal, pas forcément ton poste actuel.",
    a: [["Je pilote une équipe vers des objectifs clairs", "lion"], ["Au sein d'un collectif, dans une bonne ambiance", "ours"], ["Avec une grande liberté créative et des horaires souples", "loup"], ["Seul(e), sur des tâches pointues qui demandent de la précision", "dauphin"]] },
  { theme: "Travail", q: "Face à un nouveau projet, comment t'y prends-tu ?",
    hint: "Ta façon naturelle de faire, quand personne ne t'impose de méthode.",
    a: [["Je bâtis un plan détaillé avant de commencer", "lion"], ["J'avance régulièrement, pas à pas, avec les autres", "ours"], ["J'attends l'inspiration… et je fonce souvent à la dernière minute", "loup"], ["Je peaufine chaque détail, parfois au point de bloquer", "dauphin"]] },
  { theme: "Relations", q: "Dans une soirée entre amis, tu es plutôt…",
    hint: "Pense à une soirée qui commence vers 20 h.",
    a: [["Le premier (la première) à partir, parce que demain on se lève tôt", "lion"], ["Celui ou celle qui s'occupe du barbecue et met l'ambiance", "ours"], ["Au centre de l'attention, et parmi les derniers à partir", "loup"], ["En petit comité dans un coin, ou déjà rentré(e) discrètement", "dauphin"]] },
  { theme: "Relations", q: "En cas de désaccord avec un proche, tu…",
    hint: "Ta réaction spontanée, avant de prendre du recul.",
    a: [["Cherches calmement une solution et passes à autre chose", "lion"], ["Arrondis les angles pour éviter le conflit", "ours"], ["Réagis à chaud, avec intensité", "loup"], ["Évites la confrontation… mais y repenses pendant des heures", "dauphin"]] },
  { theme: "Personnalité", q: "Comment décrirais-tu ton humeur habituelle ?",
    hint: "Sur plusieurs semaines, pas seulement aujourd'hui.",
    a: [["Stable et optimiste", "lion"], ["Égale et plutôt joviale", "ours"], ["En montagnes russes : des hauts très hauts et des bas très bas", "loup"], ["Souvent inquiète ou tendue", "dauphin"]] },
  { theme: "Personnalité", q: "Face à une décision importante, tu…",
    hint: "Un changement de poste, un achat important, un déménagement…",
    a: [["Analyses les options et suis ta stratégie", "lion"], ["Demandes l'avis de tes proches", "ours"], ["Suis ton instinct, quitte à te décider très vite", "loup"], ["Pèses longuement le pour et le contre, par peur de te tromper", "dauphin"]] },
  { theme: "Hygiène de vie", q: "Quelle place l'activité physique a-t-elle dans ta vie ?",
    hint: "Ce que tu fais réellement, sur les derniers mois.",
    a: [["Une vraie priorité, avec des objectifs (course, compétition…)", "lion"], ["Je m'y mets par périodes, puis j'arrête", "ours"], ["Irrégulière, plutôt en fin de journée quand j'en ai envie", "loup"], ["Pas une priorité : je bouge assez peu", "dauphin"]] }
];

// Regroupement des thèmes en domaines pour l'analyse détaillée
const DIMENSIONS = [
  { name: "Sommeil et réveil", themes: ["Sommeil", "Réveil", "Adaptabilité"] },
  { name: "Énergie et concentration", themes: ["Énergie", "Énergie physique", "Concentration", "Rythme de travail"] },
  { name: "Alimentation et hygiène de vie", themes: ["Alimentation", "Hygiène de vie", "Bien-être"] },
  { name: "Travail et relations", themes: ["Travail", "Relations", "Vie sociale"] },
  { name: "Personnalité", themes: ["Personnalité", "Tempérament"] }
];

const PROFILES = {
  dauphin: {
    name: "Dauphin", article: "un Dauphin", the: "Le Dauphin", emoji: "🐬", color: "#1d8fc9",
    share: "environ 10 % de la population",
    tagline: "L'esprit vigilant : un sommeil léger, une intelligence aiguisée et un sens du détail hors du commun.",
    why: "Le dauphin ne dort qu'avec une moitié de son cerveau : l'autre reste en éveil pour nager et surveiller les prédateurs. Le Dauphin humain lui ressemble : sommeil léger, faible besoin de sommeil, et un cerveau qui a du mal à se mettre en veille.",
    traits: ["Prudent", "Introverti", "Anxieux", "Intelligent"],
    behaviors: ["Évite les situations risquées", "Recherche la perfection", "Tendance obsessionnelle", "Focalisé sur les détails"],
    rhythm: [
      ["Réveil", "Souvent fatigué, avec l'impression de ne pas avoir récupéré"],
      ["Pic de forme", "En fin de soirée"],
      ["Pic de productivité", "Par vagues tout au long de la journée, surtout en milieu de matinée"],
      ["Sieste", "Tentante, mais elle compromet la nuit suivante : à éviter"],
      ["Besoin de sommeil", "Faible, mais sommeil fragile et souvent interrompu"]
    ],
    portrait: [
      "Le moindre bruit suffit à te réveiller. Même si tu n'as pas besoin de beaucoup de sommeil, tu peines à en obtenir assez : endormissement difficile, réveils nocturnes, et ces longues minutes où l'esprit ressasse les erreurs d'hier et les soucis de demain. Parfois, au matin, tu ne sais même plus si tu as vraiment dormi.",
      "Cette vigilance ne s'éteint pas en journée. Très intelligent, souvent nerveux, tu as un souci du détail et un perfectionnisme qui font merveille dans les métiers de précision : relecture, programmation, ingénierie, sciences, musique… Le revers : le risque de t'enliser dans les détails au point de ne plus avancer."
    ],
    work: "Tu es à ton meilleur quand on te laisse travailler seul et décider par toi-même. Le travail d'équipe te coûte, surtout quand les autres ne partagent pas ton exigence.",
    relations: "Tu es à l'écoute, fin et lucide sur ce qui se joue vraiment entre les gens. Tu fuis les conflits, mais la fatigue peut créer des tensions dans le couple. Les Dauphins s'entendent souvent bien avec les Loups.",
    health: "Plutôt « manger pour vivre » que l'inverse, avec un métabolisme rapide. Tu fais attention à ce que tu consommes, mais le sommeil reste ton point faible : c'est lui qu'il faut protéger en priorité.",
    strengths: ["Précision et rigueur", "Intelligence émotionnelle", "Esprit d'analyse", "Conscience professionnelle"],
    watch: ["La rumination au coucher", "Le perfectionnisme paralysant", "Les écrans en soirée", "Le manque chronique de sommeil"],
    tips: [
      "Lève-toi à heure fixe, même après une mauvaise nuit, et bouge tout de suite quelques minutes pour faire monter ton énergie.",
      "Expose-toi 5 à 15 minutes à la lumière du jour dès le matin.",
      "Privilégie un petit-déjeuner riche en protéines plutôt que des glucides qui t'« endorment ».",
      "Une seule tasse de café, en milieu de matinée — et plus aucune caféine l'après-midi.",
      "Réserve les glucides au dîner : ils favorisent l'apaisement avant la nuit.",
      "Coupe les écrans au moins une heure avant le coucher et ne te couche que lorsque tu es vraiment fatigué."
    ],
    bedtime: "23 h 30", waketime: "6 h 30",
    day: [
      ["6 h 30", "Réveil et quelques minutes d'exercice, à la lumière du jour si possible"],
      ["7 h 20 – 9 h", "Douche fraîche, grand verre d'eau, petit-déjeuner protéiné"],
      ["9 h 30 – 12 h", "Réflexion libre et brainstorming ; un café si tu en bois"],
      ["12 h – 13 h", "Déjeuner : ne saute pas ce repas"],
      ["13 h – 16 h", "Recharger les batteries sans faire de sieste ; tâches concrètes"],
      ["16 h – 18 h 30", "Pic de concentration : travail exigeant et détaillé"],
      ["18 h 30 – 19 h 30", "Un moment seul pour décompresser"],
      ["19 h 30 – 20 h 30", "Dîner, avec des glucides complexes"],
      ["20 h 30 – 21 h", "Moment d'intimité"],
      ["21 h – 23 h 30", "Ralentir progressivement, sans écrans"],
      ["23 h 30", "Coucher"]
    ]
  },

  lion: {
    name: "Lion", article: "un Lion", the: "Le Lion", emoji: "🦁", color: "#c98400",
    share: "10 à 20 % de la population",
    tagline: "Le leader du matin : debout avant tout le monde, plein d'énergie et tourné vers ses objectifs.",
    why: "Les lionnes chassent à l'aube, au moment où leurs proies sont encore endormies. Le Lion humain se lève lui aussi avant le soleil, affamé et prêt à passer à l'action.",
    traits: ["Consciencieux", "Stable", "Pragmatique", "Optimiste"],
    behaviors: ["En fait (parfois trop)", "Priorise santé et sport", "Recherche des échanges positifs", "Élabore des stratégies"],
    rhythm: [
      ["Réveil", "En forme dès l'aube, voire avant"],
      ["Pic de forme", "Vers midi"],
      ["Pic de productivité", "Le matin"],
      ["Sieste", "Très rare : tu préfères rester productif"],
      ["Besoin de sommeil", "Moyen ; fatigue dès la fin d'après-midi, endormissement facile"]
    ],
    portrait: [
      "Tu ouvres les yeux avant le réveil, avec faim et l'envie d'attaquer la journée. Enthousiasme, tonus et ambition te caractérisent : tu te fixes des objectifs clairs, tu élabores une stratégie, et tu avances étape par étape, du point A au point B.",
      "Ton esprit analytique et organisé te tient à distance des risques inutiles. Quand les choses tournent mal, tu encaisses sans te décourager et tu ajustes ton plan. Beaucoup de dirigeants et d'entrepreneurs sont des Lions."
    ],
    work: "Tu prends naturellement la tête d'un groupe et tu adores mener un projet à son terme. Tes meilleures heures sont celles du matin, quand les autres commencent à peine à émerger.",
    relations: "Tu aimes la compagnie des autres, mais ton énergie baisse tôt : tu es souvent le premier à quitter une soirée. En couple, tu cherches le positif et préfères résoudre les problèmes plutôt que ruminer.",
    health: "La santé passe avant tout : alimentation plutôt saine, sport régulier (les Lions sont nombreux parmi les marathoniens et les triathlètes). En général, tu es très satisfait de ta vie.",
    strengths: ["Discipline et constance", "Leadership", "Vision stratégique", "Optimisme"],
    watch: ["La fatigue de fin de journée", "Une vie sociale qui s'étiole le soir", "La créativité parfois bridée", "La tendance à en faire trop"],
    tips: [
      "Prends ton petit-déjeuner dans la demi-heure qui suit le réveil, avec deux grands verres d'eau.",
      "Utilise le calme du petit matin pour la réflexion de fond : vision, planification, décisions importantes.",
      "Place ton travail le plus exigeant entre 8 h et midi.",
      "Fais du sport en fin de journée (vers 17 h – 18 h) plutôt qu'à l'aube : il relancera ton énergie au moment où elle retombe.",
      "Garde l'après-midi pour les tâches plus légères, les échanges et les réunions faciles.",
      "Vise un coucher vers 22 h – 22 h 30 pour garder ton rythme sans sacrifier toute vie sociale."
    ],
    bedtime: "22 h – 22 h 30", waketime: "5 h 30 – 6 h",
    day: [
      ["5 h 30 – 6 h", "Réveil, petit-déjeuner protéiné et hydratation"],
      ["6 h – 7 h", "Réflexion stratégique, planification, méditation"],
      ["7 h – 7 h 30", "Moment d'intimité"],
      ["7 h 30 – 9 h", "Échanges et contacts de début de journée"],
      ["9 h – 10 h", "Collation ; idéal pour faire bonne impression (réunion, rendez-vous)"],
      ["10 h – 12 h", "Travail exigeant, tenir le cap"],
      ["12 h – 13 h", "Déjeuner"],
      ["13 h – 18 h", "Tâches plus légères, échanges, créativité détendue"],
      ["18 h – 19 h", "Sport"],
      ["19 h – 20 h 30", "Dîner"],
      ["20 h 30 – 22 h", "Soirée détente"],
      ["22 h – 22 h 30", "Ralentir, puis coucher"]
    ]
  },

  ours: {
    name: "Ours", article: "un Ours", the: "L’Ours", emoji: "🐻", color: "#9c4a2a",
    share: "environ 50 % de la population",
    tagline: "Le sociable réglé sur le soleil : actif le jour, grand dormeur la nuit, apprécié de tous.",
    why: "L'ours est un animal diurne, adaptable, joueur et toujours en quête de nourriture. L'Ours humain vit au rythme du soleil, a un fort besoin de sommeil et tisse des liens étroits avec les autres.",
    traits: ["Prudent", "Extraverti", "Sympathique", "Ouvert d'esprit"],
    behaviors: ["Évite les conflits", "Aspire à une bonne santé", "Privilégie le bonheur", "Aime ce qui est familier"],
    rhythm: [
      ["Réveil", "Difficile, souvent après avoir repoussé le réveil une ou deux fois"],
      ["Pic de forme", "Du milieu de matinée au début d'après-midi"],
      ["Pic de productivité", "En fin de matinée"],
      ["Sieste", "Tu rattrapes volontiers ton sommeil le week-end"],
      ["Besoin de sommeil", "Élevé : 8 heures idéalement, sommeil profond"]
    ],
    portrait: [
      "Ton rythme suit celui du soleil, ce qui colle assez bien aux horaires de la société (qui ont d'ailleurs été pensés par et pour des Ours). Il te faut toutefois un moment pour émerger le matin, et tu aimerais souvent dormir davantage.",
      "Tu as souvent faim, parfois même en dehors des repas. Ton hygiène de vie n'est ni excellente ni mauvaise : tu fais des efforts par à-coups, ce qui explique des résultats parfois en demi-teinte. Même si ton rythme est « dans la norme », il gagne à être ajusté pour tirer le meilleur de tes journées."
    ],
    work: "Excellent coéquipier, esprit équilibré, travailleur fiable : tu t'entends avec tout le monde et fais bien ton travail avant de rentrer décompresser. Tu prends rarement des risques, sauf si tu te sens tout près du but.",
    relations: "Tu adores être entouré et tu t'ennuies vite seul : dans une fête, c'est toi qui tiens le barbecue. En couple, tu peux manquer un peu de profondeur dans la résolution des problèmes, ce qui peut frustrer un partenaire Loup ou Dauphin.",
    health: "Plutôt en bonne santé à tes yeux, mais la tentation du grignotage (surtout le soir) est ton principal écueil. Émotionnellement stable, tu es globalement satisfait de ta vie.",
    strengths: ["Sociabilité", "Fiabilité", "Esprit d'équipe", "Stabilité émotionnelle"],
    watch: ["Le grignotage du soir", "La somnolence après le déjeuner", "Le manque de sommeil en semaine", "Les efforts irréguliers"],
    tips: [
      "Lève-toi à heure fixe (vers 7 h), y compris le week-end, et expose-toi à la lumière dès le réveil.",
      "Place ton travail le plus exigeant entre 10 h et midi : c'est ton pic cognitif.",
      "Si tu le peux, marche ou fais du sport autour du déjeuner.",
      "Une courte sieste de 20 minutes vers 14 h 30 peut effacer le coup de barre de l'après-midi.",
      "Fais du dîner ton repas le plus léger et arrête de manger après 20 h.",
      "Écrans éteints à partir de 22 h, coucher vers 23 h."
    ],
    bedtime: "23 h", waketime: "7 h",
    day: [
      ["7 h", "Réveil (sans repousser l'alarme), moment d'intimité"],
      ["7 h 30 – 9 h", "Petit-déjeuner sain dans la demi-heure qui suit le réveil"],
      ["9 h – 10 h", "Organiser ta journée, traiter les messages"],
      ["10 h – 12 h", "Pic cognitif : travail exigeant et concentré"],
      ["12 h – 13 h", "Marche ou sport, déjeuner"],
      ["13 h – 14 h 30", "Réunions, décisions, prise en main des dossiers"],
      ["14 h 30 – 14 h 50", "Petite sieste de 20 minutes"],
      ["15 h – 18 h 30", "Échanges, appels, collation"],
      ["18 h 30 – 19 h 30", "Sport"],
      ["19 h 30 – 20 h 30", "Dîner (le repas le plus léger) et conversation"],
      ["20 h 30 – 22 h", "Loisirs stimulants : lecture, jeux, apprentissage"],
      ["22 h – 23 h", "Écrans éteints, détente, puis coucher"]
    ]
  },

  loup: {
    name: "Loup", article: "un Loup", the: "Le Loup", emoji: "🐺", color: "#5b4fa8",
    share: "15 à 20 % de la population",
    tagline: "Le créatif nocturne : lent au démarrage, brillant le soir, toujours en quête de nouveauté.",
    why: "Le loup s'éveille à la tombée de la nuit et chasse en meute avec créativité et ruse. Le Loup humain peine le matin mais s'épanouit quand les autres commencent à s'éteindre.",
    traits: ["Impulsif", "Pessimiste", "Créatif", "Lunatique"],
    behaviors: ["Prend des risques", "Privilégie le plaisir", "Recherche la nouveauté", "Réagit avec intensité"],
    rhythm: [
      ["Réveil", "Difficile avant 9 h (possible, mais pas de bonne humeur)"],
      ["Pic de forme", "Vers 19 h"],
      ["Pic de productivité", "En fin de matinée et en fin de soirée"],
      ["Sieste", "Tentante, mais elle t'empêche de dormir la nuit"],
      ["Besoin de sommeil", "Moyen ; pas de fatigue avant minuit"]
    ],
    portrait: [
      "Les matins sont laborieux : tu te traînes jusqu'à midi, puis ton énergie monte au fil de la journée pour culminer le soir. Pas faim au réveil, mais un appétit qui se réveille après le coucher du soleil — avec une tendance au grignotage nocturne.",
      "Curieux et intuitif, tu fais des liens inattendus entre les idées. Tu brilles dans les domaines créatifs (arts, écriture, technologie, médecine…). Spontané, tu aimes la nouveauté et le risque. Le décalage avec les horaires de la société peut te donner l'impression, injuste, d'être « paresseux »."
    ],
    work: "Tes meilleures idées naissent l'après-midi et le soir. Les horaires de bureau classiques te désavantagent le matin : protège tes créneaux de fin de matinée et d'après-midi pour le travail qui compte.",
    relations: "À l'aise seul, tu sais aussi être le centre de la fête et le dernier à partir. Tes émotions sont puissantes et parfois difficiles à canaliser, ce qui peut peser sur ton entourage.",
    health: "Attention aux fringales du soir, au sucre et à l'alcool. Le décalage chronique avec les horaires sociaux te rend plus sensible au stress et aux baisses de moral : caler ton rythme est un vrai levier de bien-être.",
    strengths: ["Créativité", "Intuition", "Ouverture à la nouveauté", "Énergie en soirée"],
    watch: ["Les grignotages nocturnes", "Les écrans tard le soir", "La dette de sommeil en semaine", "L'impulsivité"],
    tips: [
      "Programme deux réveils : le premier pour ouvrir les rideaux et t'exposer à la lumière, le second 15 minutes plus tard pour te lever.",
      "Prends tout de même un petit-déjeuner, même léger, pour lancer ton métabolisme.",
      "Bouge dès le matin (marche, vélo) pour accélérer le réveil.",
      "Café plutôt vers 11 h, quand ton cortisol naturel redescend — pas au saut du lit.",
      "Place tes tâches importantes entre 14 h et 16 h et garde les soirées pour la création.",
      "Déconnecte les écrans vers 23 h et vise un coucher vers minuit, à heure fixe."
    ],
    bedtime: "Minuit", waketime: "7 h – 7 h 30",
    day: [
      ["7 h – 7 h 30", "Deux réveils : lumière d'abord, lever ensuite"],
      ["7 h 30 – 8 h 30", "Petit-déjeuner, même léger"],
      ["8 h 30 – 9 h", "Bouger : marche, vélo, trajet actif"],
      ["9 h – 11 h", "Continuer à te réveiller : tâches simples"],
      ["11 h", "Pause café"],
      ["11 h 15 – 13 h", "Première vague de concentration"],
      ["13 h – 14 h", "Petite marche puis déjeuner"],
      ["14 h – 16 h", "Travail important : ton créneau le plus efficace de la journée"],
      ["16 h", "Collation"],
      ["16 h 15 – 18 h 30", "Échanges, réunions, collaboration"],
      ["18 h 30 – 19 h 30", "Sport"],
      ["19 h 30 – 21 h 30", "Liens sociaux, puis dîner"],
      ["21 h 30 – 23 h", "Création, loisirs, moments à deux"],
      ["23 h – minuit", "Écrans coupés, douche chaude, puis coucher"]
    ]
  }
};
