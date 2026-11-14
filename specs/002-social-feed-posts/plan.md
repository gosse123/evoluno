# Technical Implementation Plan: Fil Social, Publications et Interactions

**Spec Reference**: `specs/002-social-feed-posts/spec.md`  
**Feature ID**: `002-social-feed-posts`  
**Status**: Approved  

---

## 1. Summary of Changes & Architecture

Mise en oeuvre du moteur social central :
- Extension du schéma Prisma pour supporter les publications (`Post`), les commentaires imbriqués (`Comment`), les réactions (`Reaction`), les tags (`Tag`, `PostTag`) et les notifications (`Notification`).
- Implémentation d'un service de flux avec pagination par curseur (`cursor-based pagination`).
- Moteur de rendu Markdown sécurisé pour les publications techniques (coloration syntaxique côté client sans alourdir le HTML initial).
- Système de notifications avec badge non lu et polling optimiste.

---

## 2. Technical Stack & Dependencies

- **Rendu Markdown & Code** : `react-markdown`, `rehype-sanitize`, `rehype-highlight`
- **Gestion des états optimistes** : React 19 `useOptimistic` et `useActionState`
- **Validation des données** : `zod` pour les payloads de publication et commentaires
- **Assainissement HTML** : `isomorphic-dompurify` ou `rehype-sanitize`
- **Icônes & UI** : `lucide-react`, `@radix-ui/react-tabs`, `@radix-ui/react-dialog`

---

## 3. Data Model & Schema Changes

```prisma
// Extension prisma/schema.prisma

enum PostType {
  STANDARD
  CODE_SNIPPET
  PROJECT_SHOWCASE
  CONTRIBUTOR_CALL
  HELP_REQUEST
  CELEBRATION
  OPPORTUNITY
}

enum ReactionType {
  LIKE
  ROCKET
  LIGHTBULB
}

model Post {
  id             String       @id @default(uuid())
  authorId       String
  author         User         @relation(fields: [authorId], references: [id], onDelete: Cascade)
  type           PostType     @default(STANDARD)
  content        String       @db.Text
  codeSnippet    String?      @db.Text
  codeLanguage   String?
  mediaUrl       String?
  
  // Relations polymorphes ou références vers features associées
  projectId      String?      // Si lié à une carte de projet GitHub/GitLab
  
  reactionsCount Int          @default(0)
  commentsCount  Int          @default(0)
  
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  comments       Comment[]
  reactions      Reaction[]
  tags           PostTag[]

  @@index([authorId, createdAt(sort: Desc)])
  @@index([type, createdAt(sort: Desc)])
  @@index([createdAt(sort: Desc)])
}

model Comment {
  id             String       @id @default(uuid())
  postId         String
  post           Post         @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorId       String
  author         User         @relation(fields: [authorId], references: [id], onDelete: Cascade)
  parentId       String?
  parent         Comment?     @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies        Comment[]    @relation("CommentReplies")
  
  content        String       @db.Text
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@index([postId, createdAt(sort: Asc)])
  @@index([parentId])
}

model Reaction {
  postId         String
  userId         String
  type           ReactionType @default(LIKE)
  createdAt      DateTime     @default(now())

  post           Post         @relation(fields: [postId], references: [id], onDelete: Cascade)
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([postId, userId])
  @@index([userId])
}

model Tag {
  id             String       @id @default(uuid())
  name           String       @unique // ex: "python", "flutter", "opensource"
  postsCount     Int          @default(0)
  posts          PostTag[]

  @@index([name])
}

model PostTag {
  postId         String
  tagId          String
  post           Post         @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag            Tag          @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([postId, tagId])
}

enum NotificationType {
  NEW_FOLLOWER
  POST_LIKE
  POST_COMMENT
  COMMENT_REPLY
  USER_MENTION
  OPPORTUNITY_ALERT
}

model Notification {
  id             String           @id @default(uuid())
  recipientId    String
  actorId        String
  type           NotificationType
  targetId       String?          // ID du post ou du commentaire
  isRead         Boolean          @default(false)
  createdAt      DateTime         @default(now())

  recipient      User             @relation("UserNotifications", fields: [recipientId], references: [id], onDelete: Cascade)
  actor          User             @relation("ActorNotifications", fields: [actorId], references: [id], onDelete: Cascade)

  @@index([recipientId, isRead, createdAt(sort: Desc)])
}
```

---

## 4. API Contracts & Server Actions

### Server Actions (`src/actions/post.actions.ts`)
```typescript
export async function createPost(input: CreatePostInput): Promise<ActionResult<PostDto>>
export async function getFeed(params: {
  feedType: 'following' | 'discovery';
  cursor?: string;
  limit?: number;
}): Promise<PaginatedFeedResult>
export async function togglePostReaction(postId: string, reactionType: ReactionType): Promise<{ reacted: boolean; count: number }>
export async function addComment(postId: string, content: string, parentId?: string): Promise<ActionResult<CommentDto>>
export async function deletePost(postId: string): Promise<ActionResult<void>>
```

### Algorithme de Flux Découverte (`getDiscoveryFeed`)
- Score de pertinence : `Score = (Reactions * 2 + Comments * 3 + 1) / (AgeEnHeures + 2)^1.5`
- Priorité donnée aux publications contenant du contenu technique utile ou des appels à projets d'Afrique de l'Ouest/Centre.

---

## 5. Component Design & File Structure

```text
src/
├── app/(platform)/
│   ├── feed/
│   │   ├── page.tsx               # Vue du fil (Tabs: Abonnements / Découverte)
│   │   └── loading.tsx            # Skeleton screens ultra-légers
│   └── notifications/
│       └── page.tsx               # Centre de notifications
├── components/feed/
│   ├── post-composer.tsx          # Formulaire de publication (Markdown, Snippets)
│   ├── post-card.tsx              # Carte de publication réutilisable
│   ├── post-code-block.tsx        # Bloc de code avec coloration et bouton copier
│   ├── post-actions.tsx           # Boutons Like, Commenter, Partager
│   ├── comment-section.tsx        # Liste et formulaire de commentaires imbriqués
│   └── feed-empty-state.tsx       # Suggestions de profils quand le fil est vide
└── lib/
    ├── markdown.ts                # Parser et sanitizer Markdown
    └── feed-algorithm.ts          # Calculs des scores de flux
```

---

## 6. Risk Analysis & Mitigation

| Risque | Impact | Stratégie d'Atténuation |
| :--- | :--- | :--- |
| **Spam de publications et bots** | Élevé | Limiteur de requêtes par IP et par compte utilisateur (ex. 10 posts/h, 30 commentaires/h) via Redis / In-memory ratelimit. |
| **Injections XSS dans le Markdown** | Critique | Assainissement systématique côté client et côté serveur avec `rehype-sanitize` restreint à une liste blanche stricte de balises. |
| **Lenteur des requêtes sur gros volumes** | Moyen | Pagination par curseur basée sur un index composite `(createdAt, id)` pour garantir des requêtes SQL en $O(1)$. |

---

## 7. Verification & Testing Strategy

- **Tests unitaires (`vitest`)** :
  - `src/lib/markdown.test.ts` : Vérification du blocage des balises `<script>`, `onerror`, `javascript:`.
  - `src/lib/feed-algorithm.test.ts` : Vérification de la décroissance temporelle du score.
- **Tests d'intégration (`Playwright`)** :
  - Scénario complet : Création de publication avec snippet, ajout de commentaire, vérification de l'incrémentation du like et notification.
