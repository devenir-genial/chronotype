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

## Mise en ligne (o2switch)

Le site est hébergé chez o2switch (DNS et hébergement) : https://chronotype.devenirgenial.com
Certificat HTTPS Let's Encrypt géré automatiquement par o2switch.

- `site/.htaccess` : force le HTTPS, règle le cache navigateur, la compression et les en-têtes de sécurité.
- `.cpanel.yml` : copie le contenu de `site/` vers `$HOME/chronotype.devenirgenial.com/` à chaque déploiement.

### Déploiement automatique depuis GitHub (cPanel > Git Version Control)

1. **Créer** un dépôt : cloner `https://github.com/devenir-genial/chronotype.git`
   dans un dossier **hors** de la racine web, par exemple `/home/<utilisateur>/repositories/chronotype`.
2. Vérifier que la racine du sous-domaine (cPanel > Domaines) est bien `/home/<utilisateur>/chronotype.devenirgenial.com` ;
   sinon, adapter `DEPLOYPATH` dans `.cpanel.yml`.
3. À chaque mise à jour : pousser sur GitHub, puis dans cPanel > Git Version Control > **Gérer** >
   onglet « Pull or Deploy » : **Update from Remote**, puis **Deploy HEAD Commit**.

Après une modification de `style.css`, `app.js` ou `data.js`, incrémenter le `?v=N` correspondant dans
`site/index.html` pour que les navigateurs chargent la nouvelle version.

Test en local : `cd site && python -m http.server 8000`, puis ouvrir http://localhost:8000.
