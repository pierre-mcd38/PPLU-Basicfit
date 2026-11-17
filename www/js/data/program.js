/* =========================================================================
   BASE DE DONNÉES STATIQUE DU PROGRAMME PPLU 4 JOURS — BASIC-FIT
   Approches Schoenfeld / Beardsley / Israetel • 3 Séries Effectives (Zéro Junk Volume)
   Protection Biomécanique Stricte du Tendon du Long Biceps
   ========================================================================= */

export const WORKOUTS = [
    {
        id: "push",
        icon: "🔥",
        shortTab: "PUSH",
        subTab: "6 Exos • 18 S.",
        tab: "1. PUSH (6 Exos)",
        title: "SÉANCE 1 : PUSH",
        subtitle: "2 Pectoraux • 2 Épaules • 2 Triceps (3 séries effectives • Gouttière bicipitale protégée)",
        exercises: [
            {
                muscle: "Pectoraux (Faisceau moyen)",
                sets: "3 x 6-8",
                numSets: 3,
                repMin: 6,
                repMax: 8,
                rir: "RIR 1-2",
                rest: "3 min",
                restSec: 180,
                variants: [
                    { name: "Chest Press assise", grip: "Poignées verticales en prise neutre (ou pronation siège haut)" },
                    { name: "Développé couché haltères", grip: "Prise semi-pronation à 30-45° (haltères en biais)" },
                    { name: "Cadre guidé plat", grip: "Prise pronation 1,5x largeur d'épaules, pouces fermés" }
                ],
                bio: "Coudes fléchis à 45° dans le plan scapulaire. Contrôle la descente (2s) et stoppe bras parallèles au buste (zéro hyperextension)."
            },
            {
                muscle: "Deltoïdes Antérieurs & Moyens",
                sets: "3 x 8-10",
                numSets: 3,
                repMin: 8,
                repMax: 10,
                rir: "RIR 1-2",
                rest: "2.5 min",
                restSec: 150,
                variants: [
                    { name: "Shoulder Press machine", grip: "Poignées parallèles intérieures en prise neutre" },
                    { name: "Développé épaules haltères (75-80°)", grip: "Prise neutre ou semi-pronation à 45°" },
                    { name: "Développé militaire guidé assis", grip: "Prise pronation légèrement supérieure aux épaules" }
                ],
                bio: "Pousse dans le plan scapulaire (coudes rentrés de 30° vers l'avant) sans descendre sous le niveau du menton."
            },
            {
                muscle: "Haut des Pectoraux (Claviculaire)",
                sets: "3 x 8-10",
                numSets: 3,
                repMin: 8,
                repMax: 10,
                rir: "RIR 1",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Écarté poulie basse (de bas en haut)", grip: "Poignées D en prise neutre / semi-supination" },
                    { name: "Développé incliné haltères (30°)", grip: "Prise semi-pronation à 30° (ou prise neutre)" },
                    { name: "Cadre guidé incliné (30°)", grip: "Prise pronation moyenne, poignets strictement alignés" }
                ],
                bio: "Placé en 3e position après les 2 développés polyarticulaires pour isoler le faisceau claviculaire sans hyperextension d'épaule (permutable via ↑ si variante haltères V1)."
            },
            {
                muscle: "Deltoïdes Latéraux",
                sets: "3 x 10-12",
                numSets: 3,
                repMin: 10,
                repMax: 12,
                rir: "RIR 0-1",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Élévations latérales poulie basse", grip: "Poignée D ou sangle de poignet neutre (câble devant soi)" },
                    { name: "Machine élévations latérales", grip: "Mains ouvertes relâchées, poussée par les coudes" },
                    { name: "Élévations latérales haltères assis", grip: "Prise neutre, paumes tournées vers les cuisses" }
                ],
                bio: "Passe toujours le câble devant le bassin (jamais derrière le dos). Monte dans le plan scapulaire (30° avant) jusqu'à l'horizontale."
            },
            {
                muscle: "Triceps (Chefs Latéral & Médial)",
                sets: "3 x 8-10",
                numSets: 3,
                repMin: 8,
                repMax: 10,
                rir: "RIR 1",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Extensions triceps poulie haute (Barre V)", grip: "Barre en V coudée en prise semi-pronation à 45°" },
                    { name: "Extension poulie haute unilatérale", grip: "Poignée D ou boule du câble en prise neutre" },
                    { name: "Extensions poulie haute corde", grip: "Corde double en prise neutre (paumes face à face)" }
                ],
                bio: "La prise semi-pronation (barre en V) ou neutre évite l'enroulement d'épaule de la barre droite. Épaules basses verrouillées, zéro dips."
            },
            {
                muscle: "Triceps (Chef Long)",
                sets: "3 x 10-12",
                numSets: 3,
                repMin: 10,
                repMax: 12,
                rir: "RIR 0-1",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Extensions poulie haute corde (buste 30°)", grip: "Corde double en prise neutre • Reculé d'un pas, bras à 30°" },
                    { name: "Barre au front haltères sur banc plat", grip: "Haltères en prise neutre stricte (marteau) • Bras à 90°" },
                    { name: "Barre au front barre EZ banc 30°", grip: "Barre EZ sur le pli intérieur en semi-pronation" }
                ],
                bio: "Le chef long du triceps a son bras de levier maximal lorsque l'épaule est basse ou fléchie à 30-90° devant soi (évite l'Overhead qui pince le labrum et le long biceps)."
            }
        ]
    },
    {
        id: "pull",
        icon: "🧲",
        shortTab: "PULL",
        subTab: "6 Exos • 18 S.",
        tab: "2. PULL (6 Exos)",
        title: "SÉANCE 2 : PULL",
        subtitle: "2 Grand Dorsal • 2 Haut du Dos/Post. • 2 Biceps & Brachio-radial",
        exercises: [
            {
                muscle: "Grand Dorsal (Largeur)",
                sets: "3 x 8-10",
                numSets: 3,
                repMin: 8,
                repMax: 10,
                rir: "RIR 1-2",
                rest: "2.5 min",
                restSec: 150,
                variants: [
                    { name: "Tirage vertical prise neutre", grip: "Barre MAG neutre largeur d'épaules (avec sangles)" },
                    { name: "Tirage vertical poulie unilatéral", grip: "Poignée D en prise neutre (paume face au buste)" },
                    { name: "Tirage vertical barre coudée", grip: "Extrémités coudées en semi-pronation 1,3x épaules" }
                ],
                bio: "Conserve une légère flexion des coudes en haut (5-10°) pour éviter toute traction passive sur le labrum supérieur et le long biceps."
            },
            {
                muscle: "Grand Dorsal (Épaisseur basse)",
                sets: "3 x 8-10",
                numSets: 3,
                repMin: 8,
                repMax: 10,
                rir: "RIR 1-2",
                rest: "2.5 min",
                restSec: 150,
                variants: [
                    { name: "Rowing machine appui thoracique", grip: "Poignées verticales basses en prise neutre" },
                    { name: "Rowing poulie basse assis", grip: "Triangle double (poignée V) en prise neutre serrée" },
                    { name: "Rowing haltère unilatéral sur banc", grip: "Prise neutre stricte (haltère parallèle au banc)" }
                ],
                bio: "Tire les coudes vers les hanches en rasant le buste. Retiens le retour (2s) sans laisser l'épaule partir en protraction complète."
            },
            {
                muscle: "Trapèzes Moyens & Rhomboïdes",
                sets: "3 x 8-10",
                numSets: 3,
                repMin: 8,
                repMax: 10,
                rir: "RIR 1",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Rowing T-Bar appui poitrine", grip: "Poignées inclinées en semi-pronation ou prise neutre large" },
                    { name: "Rowing poulie basse barre MAG large", grip: "Poignées ergonomiques MAG en semi-pronation" },
                    { name: "Rowing haltères banc incliné 45°", grip: "Prise neutre ou semi-pronation à 45°, coudes ouverts à 45-60°" }
                ],
                bio: "Tire avec les coudes ouverts à 45-60° en gardant les poignets en semi-pronation/neutre (évite la barre droite pronation qui pince le sous-acromial)."
            },
            {
                muscle: "Deltoïdes Postérieurs",
                sets: "3 x 10-12",
                numSets: 3,
                repMin: 10,
                repMax: 12,
                rir: "RIR 0-1",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Oiseau au Pec Deck inversé", grip: "Poignées verticales en prise neutre (paumes face à face)" },
                    { name: "Facepull poulie haute assis", grip: "Corde double en prise neutre, pouces vers l'arrière" },
                    { name: "Oiseau poulie vis-à-vis croisée", grip: "Prise directe sur les boules des câbles en prise neutre" }
                ],
                bio: "La prise neutre verticale sur le Pec Deck place l'épaule en rotation externe légère et supprime tout pincement du tendon du long biceps."
            },
            {
                muscle: "Biceps (Chef Court & Brachial)",
                sets: "3 x 8-10",
                numSets: 3,
                repMin: 8,
                repMax: 10,
                rir: "RIR 1",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Curl au pupitre (barre EZ)", grip: "Barre EZ sur le pli extérieur en semi-supination" },
                    { name: "Machine pupitre guidée", grip: "Poignées coudées en semi-supination, paumes relâchées" },
                    { name: "Curl pupitre haltère unilatéral", grip: "Prise semi-supination à 45° ou prise marteau neutre" }
                ],
                bio: "L'épaule fléchie vers l'avant sur le pupitre détend le tendon du long biceps proximal. Stoppe la descente à 15° de l'extension complète."
            },
            {
                muscle: "Dessus Avant-bras (Brachio-radial)",
                sets: "3 x 10-12",
                numSets: 3,
                repMin: 10,
                repMax: 12,
                rir: "RIR 0-1",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Curl marteau corde poulie basse", grip: "Corde double en prise neutre, pouces vers le plafond" },
                    { name: "Curl marteau haltères", grip: "Prise neutre stricte (pouce collé au disque supérieur)" },
                    { name: "Curl inversé barre EZ", grip: "Barre EZ pli extérieur en semi-pronation (paumes vers le sol)" }
                ],
                bio: "Coudes verrouillés le long des côtes. Cible le brachio-radial et le brachial antérieur avec zéro contrainte dans la gouttière bicipitale."
            }
        ]
    },
    {
        id: "legs",
        icon: "🦵",
        shortTab: "LEGS",
        subTab: "5 Exos • 15 S.",
        tab: "3. LEGS (5 Exos)",
        title: "SÉANCE 3 : LEGS (HAUTE INTENSITÉ)",
        subtitle: "6 Séries Quads • 3 Séries Ischios Assis • 3 Mollets • 3 Abdos (Zéro Junk Volume)",
        exercises: [
            {
                muscle: "Quadriceps (3 Vastes) & Fessiers",
                sets: "3 x 6-8",
                numSets: 3,
                repMin: 6,
                repMax: 8,
                rir: "RIR 1-2",
                rest: "3 min",
                restSec: 180,
                variants: [
                    { name: "Hack Squat", grip: "Mains poignées d'épaules neutres • Pieds bas largeur épaules" },
                    { name: "Presse à cuisses 45°", grip: "Mains poignées du siège • Pieds bas/milieu largeur épaules" },
                    { name: "Squat au cadre guidé", grip: "Prise pronation moyenne avec mousse • Pieds avancés 15 cm" }
                ],
                bio: "3 séries lourdes à intensité maximale en amplitude complète : étire les fessiers en bas et sature les 3 vastes sans fatigue nerveuse parasite."
            },
            {
                muscle: "Ischio-jambiers (Étirement)",
                sets: "3 x 8-10",
                numSets: 3,
                repMin: 8,
                repMax: 10,
                rir: "RIR 0-1",
                rest: "2.5 min",
                restSec: 150,
                variants: [
                    { name: "Leg Curl assis", grip: "Mains poignées du boudin • Chevilles fléchies (dorsiflexion)" },
                    { name: "Leg Curl debout unilatéral", grip: "Avant-bras sur coussins poignées neutres • Pied fléchi" },
                    { name: "Banc à lombaires 45° (focus ischios)", grip: "Bras croisés sur poitrine • Dos légèrement arrondi" }
                ],
                bio: "Penche le buste de 15° en avant sur le Leg Curl assis pour placer les ischios en étirement maximal à la hanche (supérieur au leg curl allongé)."
            },
            {
                muscle: "Quadriceps (Droit Fémoral)",
                sets: "3 x 10-12",
                numSets: 3,
                repMin: 10,
                repMax: 12,
                rir: "RIR 0-1",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Leg Extension assis", grip: "Mains verrouillées poignées siège • Dossier reculé d'un cran" },
                    { name: "Leg Extension unilatéral", grip: "Mains poignées du siège • Genou aligné à l'axe rouge" },
                    { name: "Leg Extension pause 2s en haut", grip: "Mains poignées du siège • Pause isométrique 2s jambes tendues" }
                ],
                bio: "Reculer le dossier ouvre l'angle de la hanche et cible spécifiquement le droit fémoral (seul chef du quadriceps non recruté par le Hack Squat)."
            },
            {
                muscle: "Mollets (Gastrocnémiens & Soléaire)",
                sets: "3 x 8-12",
                numSets: 3,
                repMin: 8,
                repMax: 12,
                rir: "RIR 0-1",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Mollets à la presse 45°", grip: "Mains poignées de sécurité • Avant-pieds bord inférieur" },
                    { name: "Mollets debout machine", grip: "Mains poignées d'épaules • Avant-pieds sur cale" },
                    { name: "Mollets assis machine", grip: "Mains poignées du boudin • Avant-pieds sur cale" }
                ],
                bio: "Genoux tendus (sans hyperextension) : marque 2 secondes complètes d'arrêt en bas en étirement pour dissiper le réflexe élastique du tendon d'Achille."
            },
            {
                muscle: "Sangle Abdominale",
                sets: "3 x 10-12",
                numSets: 3,
                repMin: 10,
                repMax: 12,
                rir: "RIR 0-1",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Crunch poulie haute à genoux", grip: "Corde double en prise neutre maintenue contre les tempes" },
                    { name: "Crunch machine assis", grip: "Poignées hautes en prise neutre, coudes sur boudins" },
                    { name: "Relevé de genoux chaise romaine", grip: "Avant-bras posés sur coussins + poignées neutres" }
                ],
                bio: "Enroule la colonne lombaire (sternum vers pubis) sous charge progressive. Ne jamais se suspendre bras tendus à une barre fixe."
            }
        ]
    },
    {
        id: "upper",
        icon: "⚡",
        shortTab: "UPPER",
        subTab: "7 Exos • 21 S.",
        tab: "4. UPPER (7 Exos)",
        title: "SÉANCE 4 : UPPER",
        subtitle: "Alternance Pecs / Dos • Épaules • Biceps • Triceps (3 séries par exercice)",
        exercises: [
            {
                muscle: "Pectoraux (Claviculaire)",
                sets: "3 x 8-10",
                numSets: 3,
                repMin: 8,
                repMax: 10,
                rir: "RIR 1-2",
                rest: "2.5 min",
                restSec: 150,
                variants: [
                    { name: "Développé incliné haltères (30°)", grip: "Prise semi-pronation à 30-45° ou prise neutre" },
                    { name: "Chest Press prise neutre (siège bas)", grip: "Poignées verticales en prise neutre, trajectoire haute" },
                    { name: "Développé incliné guidé (30°)", grip: "Prise pronation 1,5x épaules, butées réglées à 4 cm du torse" }
                ],
                bio: "Les haltères en semi-pronation (30-45°) ou la Chest Press neutre respectent le plan scapulaire sans verrouiller l'épaule en rotation interne."
            },
            {
                muscle: "Grand Dorsal (Fibres basses)",
                sets: "3 x 8-10",
                numSets: 3,
                repMin: 8,
                repMax: 10,
                rir: "RIR 1-2",
                rest: "2.5 min",
                restSec: 150,
                variants: [
                    { name: "Tirage vertical prise serrée", grip: "Triangle double (poignée V) en prise neutre serrée" },
                    { name: "Tractions assistées machine", grip: "Poignées parallèles en prise neutre (jamais supination)" },
                    { name: "Tirage poulie haute unilatéral", grip: "Poignée D en prise neutre (paume vers le buste)" }
                ],
                bio: "Tire les coudes devant toi dans le plan sagittal vers les hanches. La prise neutre protège le long biceps et recrute le brachio-radial."
            },
            {
                muscle: "Pectoraux (Isolation)",
                sets: "3 x 10-12",
                numSets: 3,
                repMin: 10,
                repMax: 12,
                rir: "RIR 1",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Pec Deck assis (Butterfly)", grip: "Poignées verticales en prise neutre (paumes face à face)" },
                    { name: "Écarté poulie vis-à-vis debout", grip: "Poignées D en prise neutre (poulies hauteur d'épaules)" },
                    { name: "Écarté poulie banc assis 80°", grip: "Sangles de poignets ou poignées D en prise neutre" }
                ],
                bio: "Garde les paumes face à face (prise neutre) et stoppe impérativement le retour quand les bras arrivent dans l'alignement du buste."
            },
            {
                muscle: "Haut du Dos & Arrière d'Épaule",
                sets: "3 x 8-10",
                numSets: 3,
                repMin: 8,
                repMax: 10,
                rir: "RIR 1",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Rowing poulie basse barre MAG large", grip: "Poignées ergonomiques MAG larges en semi-pronation" },
                    { name: "Rowing T-Bar appuyé", grip: "Poignées inclinées en semi-pronation ou neutres larges" },
                    { name: "Machine Rowing haut du dos", grip: "Poignées hautes en semi-pronation, coudes à 45-60°" }
                ],
                bio: "Tire avec les coudes ouverts à 45-60° en prise semi-pronation/neutre pour cibler trapèzes moyens, rhomboïdes et deltoïde postérieur sans conflit d'épaule."
            },
            {
                muscle: "Deltoïdes Latéraux",
                sets: "3 x 10-12",
                numSets: 3,
                repMin: 10,
                repMax: 12,
                rir: "RIR 0-1",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Élévations latérales machine", grip: "Mains ouvertes relâchées, poussée uniquement par les coudes" },
                    { name: "Élévations latérales poulie basse", grip: "Poignée D ou sangle en prise neutre, câble devant le bassin" },
                    { name: "Élévations latérales haltères", grip: "Prise neutre, paumes tournées vers les cuisses (plan à 30°)" }
                ],
                bio: "Pousse uniquement avec les coudes contre les boudins sans serrer les poignées pour isoler le deltoïde moyen."
            },
            {
                muscle: "Biceps & Dessus Avant-bras",
                sets: "3 x 10-12",
                numSets: 3,
                repMin: 10,
                repMax: 12,
                rir: "RIR 0-1",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Curl poulie basse face poulie", grip: "Barre EZ courte sur le pli extérieur en semi-supination" },
                    { name: "Spider Curl banc incliné 45°", grip: "Barre EZ pli extérieur en semi-supination (bras devant le buste)" },
                    { name: "Curl marteau corde poulie basse", grip: "Corde double en prise neutre (focus brachio-radial)" }
                ],
                bio: "Reste toujours face à la poulie avec les coudes légèrement devant le buste (jamais dos à la poulie type Bayesian curl)."
            },
            {
                muscle: "Triceps",
                sets: "3 x 10-12",
                numSets: 3,
                repMin: 10,
                repMax: 12,
                rir: "RIR 0-1",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Extensions triceps unilatérales", grip: "Prise directe sur la boule du câble en prise neutre" },
                    { name: "Extensions poulie haute corde", grip: "Corde double en prise neutre (paumes face à face)" },
                    { name: "Extensions poulie haute barre en V", grip: "Barre en V en prise semi-pronation à 45°" }
                ],
                bio: "Saisir directement la boule en caoutchouc aligne librement le poignet, le coude et l'épaule sans aucune torsion articulaire."
            }
        ]
    }
];

export const VOLUME_DATA = [
    { muscle: "Pectoraux (Moyen & Claviculaire)", sets: 12, target: "10-14 séries (6 Push + 6 Upper)" },
    { muscle: "Dos (Grand Dorsal, Trapèzes, Rhomboïdes)", sets: 12, target: "10-14 séries (6 Pull + 6 Upper)" },
    { muscle: "Épaules (Antérieur, Latéral, Postérieur)", sets: 12, target: "10-14 séries (6 Push + 3 Pull + 3 Upper)" },
    { muscle: "Biceps & Brachio-radial (Avant-bras)", sets: 9, target: "8-12 séries (6 Pull + 3 Upper)" },
    { muscle: "Triceps (Latéral, Médial, Chef Long)", sets: 9, target: "8-12 séries (6 Push + 3 Upper)" },
    { muscle: "Quadriceps & Fessiers (Hack Squat + Leg Ext.)", sets: 6, target: "6 séries RIR 0-1 (Zéro Junk Volume)" },
    { muscle: "Ischios, Mollets & Sangle Abdominale", sets: 9, target: "3 Ischios + 3 Mollets + 3 Abdos" }
];

export const BIOMECHANICS_RULES = [
    {
        title: "3 séries effectives (Zéro Junk Volume)",
        desc: "100 % des exercices sont calibrés en 3 séries (6-12 reps, repos 2 à 3 min) pour maximiser le recrutement moteur sans usure tendineuse parasite."
    },
    {
        title: "Zéro hyperextension & Zéro Overhead",
        desc: "Aucun Dips, aucun Bayesian Curl dos à la poulie, aucune extension triceps Overhead qui pince le labrum et le long biceps."
    },
    {
        title: "Plan scapulaire & Prises neutres",
        desc: "Poussées et tirages coudes à 30-45° en prise neutre ou semi-pronation (jamais de barre droite pronation coudes hauts)."
    },
    {
        title: "Exclusions strictes",
        desc: "Aucun soulevé de terre, aucun leg curl allongé, aucune machine convergente."
    }
];
