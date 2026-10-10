# Version statique pour cPanel mutualisé

## Objectif
Produire un dossier de fichiers (HTML, CSS, JS, images) à copier dans `public_html` sur cPanel, sans aucun serveur Node. Le site garde son contenu dynamique, l'espace admin, le blog et le formulaire de contact. Toutes les données continuent de venir de Lovable Cloud, mais c'est le navigateur du visiteur qui les demande directement.

## Ce qui change pour vous
- Le site se télécharge sous forme d'un fichier ZIP prêt à envoyer sur cPanel.
- L'espace admin fonctionne comme aujourd'hui : connexion, publications, réalisations, blog, diaporama, messages.
- Point faible : comme les pages se remplissent dans le navigateur, Google voit moins bien le contenu au premier passage. Les titres et descriptions de base restent en place.
- Chaque fois que vous modifiez le design, il faudra refaire le ZIP et le renvoyer sur cPanel. Les contenus modifiés depuis l'admin, eux, apparaissent tout de suite, sans rien renvoyer.

## Étapes
1. Passer l'app en mode « application monopage » statique (aucun rendu côté serveur).
2. Remplacer les fonctions serveur :
   - Lectures publiques (diaporama, accueil, publications, réalisations, blog) : appels directs au backend depuis le navigateur. Les règles d'accès actuelles autorisent déjà ces lectures.
   - Formulaire de contact : enregistrement direct, déjà autorisé pour les visiteurs.
   - Admin : enregistrements et suppressions directs avec la session de l'admin. Les règles d'accès actuelles réservent déjà ces actions au rôle admin, donc la sécurité ne change pas.
3. Supprimer les fichiers de fonctions serveur devenus inutiles.
4. Ajouter un fichier `.htaccess` qui renvoie toutes les adresses vers `index.html`, pour que /blog/xxx ou /admin marchent quand on recharge la page sur cPanel.
5. Générer le ZIP et le mettre à disposition dans vos fichiers, avec une courte notice de mise en ligne.

## Détails techniques
- TanStack Start en mode SPA (`spa.enabled`), preset nitro statique ; sortie client uniquement.
- `public-content.functions.ts` et `admin.functions.ts` deviennent des modules client utilisant `@/integrations/supabase/client`. Les loaders passent par `queryClient.ensureQueryData` côté client.
- La règle de « au moins une diapositive » dans deleteHeroSlide passe côté client. On peut aussi la garantir avec un trigger en base, à ajouter en option.
- `.htaccess` : RewriteEngine, ne pas réécrire les vrais fichiers ni dossiers, tout le reste vers `/index.html`.
- La clé publique et l'adresse du backend sont intégrées au ZIP, ce qui est normal pour une clé publique. RLS reste la seule barrière de sécurité, et elle est déjà en place.
- Ajouter une règle dans AGENTS.md : pas de createServerFn, car la cible est un hébergement statique.
