# Test du chronotype — chronotype.devenirgenial.com

Application web statique (HTML/CSS/JS, sans dépendance ni base de données) qui détermine le chronotype
(Lion, Ours, Loup, Dauphin) selon la méthode du Dr Michael Breus (*Quand ?*), puis affiche le profil détaillé
et la journée idéale.

## Contenu

- `site/index.html` : structure de la page
- `site/style.css` : charte visuelle de devenirgenial.com (Rubik / Open Sans, bleu #07458f, rouge #d9534f)
- `site/logo.png` : logo Devenir Génial
- `site/data.js` : questions (avec thème et aide), parties du test et profils — c'est ici qu'on modifie les textes
- `site/app.js` : logique du questionnaire et affichage du résultat
- `source/` : le livre (ne pas mettre en ligne)

## Logique du score

1. **Partie 1** : 10 affirmations Vrai/Faux. 7 « Vrai » ou plus → Dauphin (on passe directement à la partie 3).
2. **Partie 2** : 20 questions, a = 1, b = 2, c = 3 points. 19–32 Lion, 33–47 Ours, 48–61 Loup.
3. **Affinage** (score entre 31–34 ou 46–49) : énergie matin − énergie soir (échelle 1 à 5).
   ≥ 2 → Lion, ≤ −2 → Loup, sinon Ours (règle du livre : à la frontière, on est le plus souvent Ours).
4. **Vérification Dauphin** (5 ou 6 « Vrai » en partie 1) : mini-test « Lion/Ours/Loup ou Dauphin ? ».
5. **Partie 3 – analyse fine** : 16 questions à 4 réponses (affichées dans un ordre aléatoire), chacune liée à un
   chronotype. Elle ne change pas le verdict ci-dessus mais calcule, avec les réponses des parties 1 et 2,
   la répartition en % entre les 4 chronotypes et par domaine (sommeil, énergie, alimentation, travail et relations,
   personnalité). Si le profil le plus représenté diffère du verdict, le résultat signale un profil hybride.

Parcours : 46 questions en général, 26 pour un Dauphin identifié dès la partie 1, jusqu'à 51 avec les départages.

Chaque profil est accessible directement par un lien : `/#lion`, `/#ours`, `/#loup`, `/#dauphin`.

## Mise en ligne

1. **DNS** : chez le gestionnaire du domaine `devenirgenial.com`, créer un enregistrement pour `chronotype`
   (CNAME vers l'hébergeur, ou A vers l'IP du serveur).
2. **Hébergement** : copier le contenu du dossier `site/` à la racine du sous-domaine. Options possibles :
   - hébergement mutualisé (o2switch, OVH…) : créer le sous-domaine dans le panneau et y déposer les fichiers par FTP ;
   - Netlify / Cloudflare Pages / Vercel : glisser-déposer le dossier `site/`, puis ajouter le domaine personnalisé.
3. Activer le **HTTPS** (Let's Encrypt, généralement automatique).

Test en local : `cd site && python -m http.server 8000`, puis ouvrir http://localhost:8000.
