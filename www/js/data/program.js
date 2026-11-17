/* =========================================================================
   BASE DE DONNÉES STATIQUE DU PROGRAMME PPLU 4 JOURS — BASIC-FIT
   Approches Schoenfeld / Israetel • Protection Tendon du Long Biceps
   ========================================================================= */

export const WORKOUTS = [
    {
        id: "push",
        icon: "🔥",
        shortTab: "PUSH",
        subTab: "6 Exos",
        tab: "1. PUSH (6 Exos)",
        title: "SÉANCE 1 : PUSH",
        subtitle: "2 Pectoraux • 2 Épaules • 2 Triceps (Gouttière bicipitale protégée)",
        exercises: [
            {
                muscle: "Pectoraux (Faisceau moyen)",
                sets: "3 x 6-8",
                numSets: 3,
                rir: "RIR 1-2",
                rest: "3 min",
                restSec: 180,
                variants: [
                    { name: "Chest Press assise", grip: "Poignées verticales en prise neutre (ou pronation siège haut)" },
                    { name: "Développé couché haltères", grip: "Prise semi-pronation à 30-45° (haltères en biais)" },
                    { name: "Cadre guidé plat", grip: "Prise pronation 1,5x largeur d'épaules, pouces fermés" }
                ],
                bio: "Coudes fléchis à 45° dans le plan scapulaire. Contrôle la descente (1-2s) et stoppe bras parallèles au buste."
            },
            {
                muscle: "Deltoïdes Antérieurs & Moyens",
                sets: "3 x 8-10",
                numSets: 3,
                rir: "RIR 1-2",
                rest: "2.5 min",
                restSec: 150,
                variants: [
                    { name: "Shoulder Press machine", grip: "Poignées parallèles intérieures en prise neutre" },
                    { name: "Développé épaules haltères (75-80°)", grip: "Prise neutre ou semi-pronation à 45°" },
                    { name: "Développé militaire guidé assis", grip: "Prise pronation légèrement supérieure aux épaules" }
                ],
                bio: "Pousse dans le plan scapulaire (coudes rentrés de 30° vers l'avant) sans descendre sous le menton."
            },
            {
                muscle: "Haut des Pectoraux (Claviculaire)",
                sets: "3 x 8-10",
                numSets: 3,
                rir: "RIR 1-2",
                rest: "2.5 min",
                restSec: 150,
                variants: [
                    { name: "Écarté poulie basse (de bas en haut)", grip: "Poignées D en prise neutre / semi-supination" },
                    { name: "Développé incliné haltères (30°)", grip: "Prise semi-pronation à 30° (ou prise neutre)" },
                    { name: "Cadre guidé incliné (30°)", grip: "Prise pronation moyenne, poignets strictement alignés" }
                ],
                bio: "Placé en 3e position après les 2 développés polyarticulaires pour isoler le faisceau claviculaire sans hyperextension d'épaule (permutable avec ↑ si variante haltères V1)."
            },
            {
                muscle: "Deltoïdes Latéraux",
                sets: "4 x 12-15",
                numSets: 4,
                rir: "RIR 0-1",
                rest: "1.5 min",
                restSec: 90,
                variants: [
                    { name: "Élévations latérales poulie basse", grip: "Poignée D ou sangle poignet neutre (câble devant soi)" },
                    { name: "Machine élévations latérales", grip: "Mains ouvertes relâchées, poussée par les coudes" },
                    { name: "Élévations latérales haltères assis", grip: "Prise neutre, paumes tournées vers les cuisses" }
                ],
                bio: "Passe toujours le câble devant le bassin (jamais derrière le dos). Monte dans le plan scapulaire (30° avant)."
            },
            {
                muscle: "Triceps (Chefs Latéral & Médial)",
                sets: "3 x 10-12",
                numSets: 3,
                rir: "RIR 1",
                rest: "1.5 min",
                restSec: 90,
                variants: [
                    { name: "Extensions triceps poulie haute", grip: "Barre en V ou barre EZ courte en pronation" },
                    { name: "Extension poulie haute unilatérale", grip: "Poignée D ou boule du câble en prise neutre" },
                    { name: "Extensions poulie haute corde", grip: "Corde double en prise neutre (paumes face à face)" }
                ],
                bio: "Épaules basses et verrouillées. Seule l'articulation du coude bouge (zéro dips pour protéger le long biceps)."
            },
            {
                muscle: "Triceps (Chef Long)",
                sets: "3 x 12-15",
                numSets: 3,
                rir: "RIR 0-1",
                rest: "1.5 min",
                restSec: 90,
                variants: [
                    { name: "Extensions triceps overhead poulie", grip: "Corde double en prise neutre (poulie hauteur bassin)" },
                    { name: "Barre au front haltères sur banc plat", grip: "Haltères en prise neutre stricte (marteau)" },
                    { name: "Barre au front barre EZ banc 30°", grip: "Barre EZ prise semi-pronation étroite" }
                ],
                bio: "Règle la poulie à hauteur de bassin (et non tout en bas) pour étirer le chef long sans forcer sur l'épaule."
            }
        ]
    },
    {
        id: "pull",
        icon: "🧲",
        shortTab: "PULL",
        subTab: "6 Exos",
        tab: "2. PULL (6 Exos)",
        title: "SÉANCE 2 : PULL",
        subtitle: "2 Grand Dorsal • 2 Haut du Dos/Post. • 2 Biceps & Dessus Avant-bras",
        exercises: [
            {
                muscle: "Grand Dorsal (Largeur)",
                sets: "3 x 8-10",
                numSets: 3,
                rir: "RIR 1-2",
                rest: "2.5 min",
                restSec: 150,
                variants: [
                    { name: "Tirage vertical prise neutre", grip: "Barre MAG neutre largeur d'épaules (avec sangles)" },
                    { name: "Tirage vertical barre large", grip: "Barre coudée pronation 1,5x épaules sans les pouces" },
                    { name: "Tirage vertical poulie unilatéral", grip: "Poignée D en prise neutre ou semi-supination" }
                ],
                bio: "Conserve une légère flexion des coudes en haut pour éviter toute traction brusque sur le labrum et le long biceps."
            },
            {
                muscle: "Grand Dorsal (Épaisseur basse)",
                sets: "3 x 8-10",
                numSets: 3,
                rir: "RIR 1-2",
                rest: "2.5 min",
                restSec: 150,
                variants: [
                    { name: "Rowing machine appui thoracique", grip: "Poignées verticales basses en prise neutre" },
                    { name: "Rowing poulie basse assis", grip: "Triangle double (poignée V) en prise neutre serrée" },
                    { name: "Rowing haltère unilatéral sur banc", grip: "Prise neutre (haltère parallèle au banc)" }
                ],
                bio: "Tire les coudes vers les hanches en rasant le buste. Retiens le retour (1-2s) sans laisser l'épaule s'enrouler."
            },
            {
                muscle: "Trapèzes Moyens & Rhomboïdes",
                sets: "3 x 10-12",
                numSets: 3,
                rir: "RIR 1",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Rowing T-Bar appui poitrine", grip: "Poignées horizontales larges en pronation" },
                    { name: "Rowing poulie basse haut du dos", grip: "Barre droite longue ou MAG large en pronation" },
                    { name: "Rowing haltères banc incliné 45°", grip: "Prise pronation, coudes ouverts à 60°" }
                ],
                bio: "Tire avec les coudes ouverts à 60° vers le sternum en serrant fort les omoplates en fin de course."
            },
            {
                muscle: "Deltoïdes Postérieurs",
                sets: "4 x 12-15",
                numSets: 4,
                rir: "RIR 0-1",
                rest: "1.5 min",
                restSec: 90,
                variants: [
                    { name: "Oiseau au Pec Deck inversé", grip: "Poignées verticales en prise neutre (paumes face à face)" },
                    { name: "Facepull poulie haute assis", grip: "Corde double en prise neutre, pouces vers l'arrière" },
                    { name: "Oiseau poulie vis-à-vis croisée", grip: "Prise directe sur les boules des câbles sans poignée" }
                ],
                bio: "La prise neutre sur le Pec Deck évite la rotation interne d'épaule qui pince le tendon du long biceps."
            },
            {
                muscle: "Biceps (Chef Court & Brachial)",
                sets: "3 x 10-12",
                numSets: 3,
                rir: "RIR 1",
                rest: "1.5 min",
                restSec: 90,
                variants: [
                    { name: "Curl au pupitre (barre EZ)", grip: "Barre EZ sur le pli extérieur en semi-supination" },
                    { name: "Machine pupitre guidée", grip: "Poignées coudées en semi-supination, paumes relâchées" },
                    { name: "Curl pupitre haltère unilatéral", grip: "Prise supination fixe du début à la fin" }
                ],
                bio: "L'épaule fléchie sur le pupitre détend le long biceps proximal. Stoppe la descente à 10° de l'extension complète. (Permutable avec l'exo 6 via ↓)."
            },
            {
                muscle: "Dessus Avant-bras (Brachio-radial)",
                sets: "3 x 10-12",
                numSets: 3,
                rir: "RIR 0-1",
                rest: "1.5 min",
                restSec: 90,
                variants: [
                    { name: "Curl marteau corde poulie basse", grip: "Corde double en prise neutre, pouces vers le plafond" },
                    { name: "Curl marteau haltères", grip: "Prise neutre stricte (pouce collé au disque supérieur)" },
                    { name: "Curl inversé barre EZ", grip: "Barre EZ pli extérieur en pronation stricte (paumes sol)" }
                ],
                bio: "Garde les coudes fixes sous les épaules. Cible le brachio-radial et les extenseurs pour épaissir le dessus de l'avant-bras."
            }
        ]
    },
    {
        id: "legs",
        icon: "🦵",
        shortTab: "LEGS",
        subTab: "5 Exos",
        tab: "3. LEGS (5 Exos)",
        title: "SÉANCE 3 : LEGS (ÉPURÉE & OPTIMALE)",
        subtitle: "8 Séries Quads • 4 Séries Ischios Assis • 4 Mollets • 3 Abdos (Zéro doublon)",
        exercises: [
            {
                muscle: "Quadriceps (3 Vastes) & Fessiers",
                sets: "4 x 6-8",
                numSets: 4,
                rir: "RIR 1-2",
                rest: "3 min",
                restSec: 180,
                variants: [
                    { name: "Hack Squat", grip: "Mains poignées d'épaules neutres • Pieds bas largeur épaules" },
                    { name: "Presse à cuisses 45°", grip: "Mains poignées du siège • Pieds bas/milieu largeur épaules" },
                    { name: "Squat au cadre guidé", grip: "Prise pronation moyenne avec mousse • Pieds avancés 15 cm" }
                ],
                bio: "4 séries lourdes en amplitude complète : étire les fessiers en bas et recrute massivement les vastes sans doublon."
            },
            {
                muscle: "Ischio-jambiers (Étirement)",
                sets: "4 x 10-12",
                numSets: 4,
                rir: "RIR 1",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Leg Curl assis", grip: "Mains poignées du boudin • Chevilles fléchies (dorsiflexion)" },
                    { name: "Leg Curl debout unilatéral", grip: "Avant-bras sur coussins poignées neutres • Pied fléchi" },
                    { name: "Banc à lombaires 45° (focus ischios)", grip: "Bras croisés sur poitrine • Pieds à plat" }
                ],
                bio: "Buste penché de 15° en avant pour pré-étirer les ischios au niveau de la hanche (remplace soulevé de terre et leg curl allongé)."
            },
            {
                muscle: "Quadriceps (Droit Fémoral)",
                sets: "4 x 12-15",
                numSets: 4,
                rir: "RIR 0-1",
                rest: "1.5 min",
                restSec: 90,
                variants: [
                    { name: "Leg Extension assis", grip: "Mains verrouillées poignées siège • Pointes pieds droites" },
                    { name: "Leg Extension unilatéral", grip: "Mains poignées du siège • Jambe alignée au pivot" },
                    { name: "Goblet Squat talons surélevés", grip: "Prise Goblet verticale sous le disque supérieur" }
                ],
                bio: "4 séries avec dossier reculé pour recruter le droit fémoral (seul chef non saturé par le Hack Squat/Presse)."
            },
            {
                muscle: "Mollets (Gastrocnémiens & Soléaire)",
                sets: "4 x 10-15",
                numSets: 4,
                rir: "RIR 0-1",
                rest: "1.5 min",
                restSec: 90,
                variants: [
                    { name: "Mollets à la presse 45°", grip: "Mains poignées de sécurité • Avant-pieds bord inférieur" },
                    { name: "Mollets debout machine", grip: "Mains poignées d'épaules • Avant-pieds sur cale" },
                    { name: "Mollets assis machine", grip: "Mains poignées du boudin • Avant-pieds sur cale" }
                ],
                bio: "Genoux tendus sans verrouiller. Marque 2 secondes d'arrêt en bas pour supprimer le rebond élastique."
            },
            {
                muscle: "Sangle Abdominale",
                sets: "3 x 12-15",
                numSets: 3,
                rir: "RIR 1",
                rest: "1.5 min",
                restSec: 90,
                variants: [
                    { name: "Crunch poulie haute à genoux", grip: "Corde double en prise neutre plaquée contre la nuque" },
                    { name: "Crunch machine assis", grip: "Poignées hautes en prise neutre, coudes sur boudins" },
                    { name: "Relevé de genoux chaise romaine", grip: "Avant-bras posés sur coussins + poignées neutres" }
                ],
                bio: "Enroule le sternum vers le bassin. Ne jamais se suspendre bras tendus à une barre fixe."
            }
        ]
    },
    {
        id: "upper",
        icon: "⚡",
        shortTab: "UPPER",
        subTab: "7 Exos",
        tab: "4. UPPER (7 Exos)",
        title: "SÉANCE 4 : UPPER",
        subtitle: "Alternance Pecs / Dos • Épaules • Biceps/Avant-bras • Triceps",
        exercises: [
            {
                muscle: "Pectoraux (Claviculaire)",
                sets: "3 x 8-10",
                numSets: 3,
                rir: "RIR 1-2",
                rest: "2.5 min",
                restSec: 150,
                variants: [
                    { name: "Développé incliné guidé (30°)", grip: "Prise pronation 1,5x largeur d'épaules, pouces fermés" },
                    { name: "Chest Press prise neutre", grip: "Poignées verticales en prise neutre (siège réglé bas)" },
                    { name: "Développé incliné haltères (30°)", grip: "Prise semi-pronation à 30-45°" }
                ],
                bio: "Règle les butées de sécurité du cadre guidé pour arrêter la barre à 4 cm de la clavicule."
            },
            {
                muscle: "Grand Dorsal (Fibres basses)",
                sets: "3 x 10-12",
                numSets: 3,
                rir: "RIR 1-2",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Tirage vertical prise serrée", grip: "Triangle double (poignée V) en prise neutre serrée" },
                    { name: "Tractions assistées machine", grip: "Poignées parallèles en prise neutre (jamais supination)" },
                    { name: "Tirage poulie haute unilatéral", grip: "Poignée D en prise neutre (paume vers le buste)" }
                ],
                bio: "Tire les coudes devant toi dans le plan sagittal. La prise neutre protège le biceps et recrute le brachio-radial."
            },
            {
                muscle: "Pectoraux (Isolation)",
                sets: "3 x 10-12",
                numSets: 3,
                rir: "RIR 1",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Pec Deck assis (Butterfly)", grip: "Poignées verticales en prise neutre (paumes face à face)" },
                    { name: "Écarté poulie vis-à-vis debout", grip: "Poignées D en prise neutre (poulies hauteur d'épaules)" },
                    { name: "Écarté poulie banc assis 80°", grip: "Sangles de poignets ou poignées D en prise neutre" }
                ],
                bio: "Garde les paumes face à face (prise neutre) et stoppe le retour quand les bras arrivent dans l'axe du buste."
            },
            {
                muscle: "Haut du Dos & Arrière d'Épaule",
                sets: "3 x 10-12",
                numSets: 3,
                rir: "RIR 1-2",
                rest: "2 min",
                restSec: 120,
                variants: [
                    { name: "Rowing poulie basse prise large", grip: "Barre droite longue ou MAG large en pronation" },
                    { name: "Rowing T-Bar appuyé", grip: "Poignées horizontales larges en pronation" },
                    { name: "Machine Rowing haut du dos", grip: "Poignées horizontales hautes en pronation" }
                ],
                bio: "Tire avec les coudes ouverts à 60° vers l'arrière pour cibler trapèzes moyens, rhomboïdes et deltoïde postérieur."
            },
            {
                muscle: "Deltoïdes Latéraux",
                sets: "4 x 12-15",
                numSets: 4,
                rir: "RIR 0-1",
                rest: "1.5 min",
                restSec: 90,
                variants: [
                    { name: "Élévations latérales machine", grip: "Mains ouvertes relâchées, poussée par les coudes" },
                    { name: "Élévations latérales haltères", grip: "Prise neutre, paumes tournées vers les cuisses" },
                    { name: "Élévations latérales poulie basse", grip: "Poignée D en prise neutre, câble devant le bassin" }
                ],
                bio: "Pousse uniquement avec les coudes contre les boudins sans serrer les poignées."
            },
            {
                muscle: "Biceps & Dessus Avant-bras",
                sets: "3 x 12-15",
                numSets: 3,
                rir: "RIR 0-1",
                rest: "1.5 min",
                restSec: 90,
                variants: [
                    { name: "Curl poulie basse face poulie", grip: "Barre EZ courte sur le pli extérieur en semi-supination" },
                    { name: "Spider Curl banc incliné 45°", grip: "Barre EZ pli extérieur en semi-supination" },
                    { name: "Curl inversé poulie basse", grip: "Barre EZ en pronation stricte (focus dessus avant-bras)" }
                ],
                bio: "Reste toujours face à la poulie (jamais dos à la poulie type Bayesian curl)."
            },
            {
                muscle: "Triceps",
                sets: "3 x 12-15",
                numSets: 3,
                rir: "RIR 0-1",
                rest: "1.5 min",
                restSec: 90,
                variants: [
                    { name: "Extensions triceps unilatérales", grip: "Prise directe sur la boule du câble en prise neutre" },
                    { name: "Extensions poulie haute corde", grip: "Corde double en prise neutre (paumes face à face)" },
                    { name: "Kickback poulie basse buste 45°", grip: "Boule du câble ou sangle de poignet en prise neutre" }
                ],
                bio: "Saisir directement la boule en caoutchouc aligne le poignet, le coude et l'épaule sans torsion."
            }
        ]
    }
];

export const VOLUME_DATA = [
    { muscle: "Épaules (Antérieur, Latéral, Postérieur)", sets: 15, target: "12-16 séries" },
    { muscle: "Dos (Grand Dorsal, Trapèzes, Rhomboïdes)", sets: 12, target: "12-16 séries" },
    { muscle: "Pectoraux (Moyen & Claviculaire)", sets: 12, target: "10-14 séries" },
    { muscle: "Biceps & Dessus Avant-bras (Brachio-radial)", sets: 9, target: "8-12 séries" },
    { muscle: "Triceps (Latéral, Médial, Chef Long)", sets: 9, target: "8-12 séries" },
    { muscle: "Quadriceps (4 Hack Squat/Presse + 4 Leg Ext.)", sets: 8, target: "8-10 séries" },
    { muscle: "Ischio-jambiers (4 Leg Curl assis en étirement)", sets: 4, target: "4-6 séries" }
];

export const BIOMECHANICS_RULES = [
    {
        title: "Zéro hyperextension",
        desc: "Aucun Dips, aucun Bayesian Curl dos à la poulie, aucun Curl incliné lourd."
    },
    {
        title: "Plan scapulaire",
        desc: "Poussées coudes à 30-45° et prises neutres / semi-pronation prioritaires."
    },
    {
        title: "Exclusions strictes",
        desc: "Aucun soulevé de terre, aucun leg curl allongé, aucune machine convergente."
    }
];
