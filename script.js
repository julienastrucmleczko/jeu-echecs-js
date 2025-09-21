// Initialisation de l'échiquier
const echiquierInitial = [
    ['t', 'c', 'f', 'd', 'r', 'f', 'c', 't'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['T', 'C', 'F', 'D', 'R', 'F', 'C', 'T']
];

// Variables globales
let echiquier = JSON.parse(JSON.stringify(echiquierInitial));
let caseSelectionnee = null;
let joueurActuel = 'blanc';
let statutJeu = "Déplacez une pièce";
let mouvementsPossibles = [];

// Éléments du DOM
const plateauEchecs = document.getElementById('echiquier');
const elementStatut = document.getElementById('statut');
const indicateurTour = document.getElementById('indicateur-tour');
const boutonReinitialiser = document.getElementById('bouton-reinitialiser');

// Initialisation du plateau
function initialiserPlateau() {
    plateauEchecs.innerHTML = '';
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const casePlateau = document.createElement('div');
            casePlateau.className = `case ${(x + y) % 2 === 0 ? 'blanc' : 'noir'}`;
            casePlateau.dataset.x = x;
            casePlateau.dataset.y = y;

            if (echiquier[y][x]) {
                const piece = document.createElement('div');
                piece.className = 'piece';
                piece.textContent = obtenirPieceUnicode(echiquier[y][x]);
                piece.dataset.x = x;
                piece.dataset.y = y;
                casePlateau.appendChild(piece);
            }

            casePlateau.addEventListener('click', () => gererClicCase(x, y));
            plateauEchecs.appendChild(casePlateau);
        }
    }
    mettreAJourStatut();
}

// Convertit les lettres en symboles Unicode
function obtenirPieceUnicode(piece) {
    const piecesUnicode = {
        'P': '♙', 'C': '♘', 'F': '♗', 'T': '♖', 'D': '♕', 'R': '♔',
        'p': '♟', 'c': '♞', 'f': '♝', 't': '♜', 'd': '♛', 'r': '♚'
    };
    return piecesUnicode[piece] || '';
}

// Gère les clics sur les cases
function gererClicCase(x, y) {
    const piece = echiquier[y][x];

    // Si une pièce est déjà sélectionnée
    if (caseSelectionnee) {
        const [xSelection, ySelection] = caseSelectionnee;
        const pieceSelectionnee = echiquier[ySelection][xSelection];

        // Vérifie si le mouvement est valide
        if (estMouvementValide(xSelection, ySelection, x, y)) {
            deplacerPiece(xSelection, ySelection, x, y);
            effacerSurlignages();

            // Vérifie si le roi est en échec
            if (estRoiEnEchec(joueurActuel === 'blanc' ? 'noir' : 'blanc')) {
                statutJeu = "ÉCHEC !";
                elementStatut.style.color = "red";
            } else {
                statutJeu = "Déplacez une pièce";
                elementStatut.style.color = "black";
            }

            // Changement de tour
            joueurActuel = joueurActuel === 'blanc' ? 'noir' : 'blanc';
            indicateurTour.textContent = `Tour des ${joueurActuel === 'blanc' ? 'Blancs' : 'Noirs'}`;

            // Tour de l'IA (noirs)
            if (joueurActuel === 'noir') {
                setTimeout(effectuerMouvementIA, 500);
            }
        } else {
            // Sélectionne une nouvelle pièce
            if (piece && ((joueurActuel === 'blanc' && piece === piece.toUpperCase()) ||
                          (joueurActuel === 'noir' && piece === piece.toLowerCase()))) {
                caseSelectionnee = [x, y];
                mouvementsPossibles = obtenirMouvementsPossibles(x, y);
                surlignerMouvementsPossibles(x, y);
            } else {
                effacerSurlignages();
                caseSelectionnee = null;
            }
        }
    } else {
        // Sélectionne une pièce
        if (piece && ((joueurActuel === 'blanc' && piece === piece.toUpperCase()) ||
                      (joueurActuel === 'noir' && piece === piece.toLowerCase()))) {
            caseSelectionnee = [x, y];
            mouvementsPossibles = obtenirMouvementsPossibles(x, y);
            surlignerMouvementsPossibles(x, y);
        }
    }
    mettreAJourStatut();
}

// Déplace une pièce
function deplacerPiece(deX, deY, versX, versY) {
    echiquier[versY][versX] = echiquier[deY][deX];
    echiquier[deY][deX] = '';
    initialiserPlateau();
}

// Vérifie si un mouvement est valide
function estMouvementValide(deX, deY, versX, versY) {
    const piece = echiquier[deY][deX];
    if (!piece) return false;

    // Vérifie si la destination est dans les mouvements possibles
    const mouvements = obtenirMouvementsPossibles(deX, deY);
    return mouvements.some(mouvement => mouvement[0] === versX && mouvement[1] === versY);
}

// Retourne les mouvements possibles pour une pièce
function obtenirMouvementsPossibles(x, y) {
    const piece = echiquier[y][x];
    if (!piece) return [];

    const mouvements = [];
    const estBlanc = piece === piece.toUpperCase();
    const adversaire = estBlanc ? 'noir' : 'blanc';

    switch (piece.toLowerCase()) {
        case 'p': // Pion
            const direction = estBlanc ? -1 : 1;
            // Avancer d'une case
            if (y + direction >= 0 && y + direction < 8 && !echiquier[y + direction][x]) {
                mouvements.push([x, y + direction]);
                // Avancer de deux cases depuis la position initiale
                if ((estBlanc && y === 6) || (!estBlanc && y === 1)) {
                    if (!echiquier[y + 2 * direction][x]) {
                        mouvements.push([x, y + 2 * direction]);
                    }
                }
            }
            // Prendre en diagonale
            for (const dx of [-1, 1]) {
                const nx = x + dx;
                if (nx >= 0 && nx < 8 && y + direction >= 0 && y + direction < 8) {
                    const pieceCible = echiquier[y + direction][nx];
                    if (pieceCible && ((estBlanc && pieceCible === pieceCible.toLowerCase()) ||
                                        (!estBlanc && pieceCible === pieceCible.toUpperCase()))) {
                        mouvements.push([nx, y + direction]);
                    }
                }
            }
            break;

        case 't': // Tour
            for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                for (let i = 1; i < 8; i++) {
                    const nx = x + dx * i;
                    const ny = y + dy * i;
                    if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
                        if (!echiquier[ny][nx]) {
                            mouvements.push([nx, ny]);
                        } else {
                            const pieceCible = echiquier[ny][nx];
                            if ((estBlanc && pieceCible === pieceCible.toLowerCase()) ||
                                (!estBlanc && pieceCible === pieceCible.toUpperCase())) {
                                mouvements.push([nx, ny]);
                            }
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }
            break;

        case 'c': // Cavalier
            for (const [dx, dy] of [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
                    const pieceCible = echiquier[ny][nx];
                    if (!pieceCible || (estBlanc && pieceCible === pieceCible.toLowerCase()) ||
                        (!estBlanc && pieceCible === pieceCible.toUpperCase())) {
                        mouvements.push([nx, ny]);
                    }
                }
            }
            break;

        case 'f': // Fou
            for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
                for (let i = 1; i < 8; i++) {
                    const nx = x + dx * i;
                    const ny = y + dy * i;
                    if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
                        if (!echiquier[ny][nx]) {
                            mouvements.push([nx, ny]);
                        } else {
                            const pieceCible = echiquier[ny][nx];
                            if ((estBlanc && pieceCible === pieceCible.toLowerCase()) ||
                                (!estBlanc && pieceCible === pieceCible.toUpperCase())) {
                                mouvements.push([nx, ny]);
                            }
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }
            break;

        case 'd': // Dame (combinaison Tour + Fou)
            for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
                for (let i = 1; i < 8; i++) {
                    const nx = x + dx * i;
                    const ny = y + dy * i;
                    if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
                        if (!echiquier[ny][nx]) {
                            mouvements.push([nx, ny]);
                        } else {
                            const pieceCible = echiquier[ny][nx];
                            if ((estBlanc && pieceCible === pieceCible.toLowerCase()) ||
                                (!estBlanc && pieceCible === pieceCible.toUpperCase())) {
                                mouvements.push([nx, ny]);
                            }
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }
            break;

        case 'r': // Roi
            for (const dx of [-1, 0, 1]) {
                for (const dy of [-1, 0, 1]) {
                    if (dx === 0 && dy === 0) continue;
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
                        const pieceCible = echiquier[ny][nx];
                        if (!pieceCible || (estBlanc && pieceCible === pieceCible.toLowerCase()) ||
                            (!estBlanc && pieceCible === pieceCible.toUpperCase())) {
                            mouvements.push([nx, ny]);
                        }
                    }
                }
            }
            break;
    }

    return mouvements;
}

// Vérifie si le roi est en échec
function estRoiEnEchec(joueur) {
    const pieceRoi = joueur === 'blanc' ? 'R' : 'r';
    let roiX = -1, roiY = -1;

    // Trouve la position du roi
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (echiquier[y][x] === pieceRoi) {
                roiX = x;
                roiY = y;
                break;
            }
        }
        if (roiX !== -1) break;
    }

    if (roiX === -1) return false; // Roi non trouvé (ne devrait pas arriver)

    // Vérifie si une pièce adverse peut capturer le roi
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const piece = echiquier[y][x];
            if (piece && ((joueur === 'blanc' && piece === piece.toLowerCase()) ||
                          (joueur === 'noir' && piece === piece.toUpperCase()))) {
                const mouvements = obtenirMouvementsPossibles(x, y);
                if (mouvements.some(mouvement => mouvement[0] === roiX && mouvement[1] === roiY)) {
                    return true;
                }
            }
        }
    }

    return false;
}

// Met en surbrillance les mouvements possibles
function surlignerMouvementsPossibles(x, y) {
    effacerSurlignages();
    const caseElement = document.querySelector(`.case[data-x="${x}"][data-y="${y}"]`);
    if (caseElement) caseElement.classList.add('selectionnee');

    mouvementsPossibles.forEach(([mouvementX, mouvementY]) => {
        const caseMouvement = document.querySelector(`.case[data-x="${mouvementX}"][data-y="${mouvementY}"]`);
        if (caseMouvement) caseMouvement.classList.add('mouvement-possible');
    });
}

// Efface les surbrillances
function effacerSurlignages() {
    document.querySelectorAll('.case').forEach(caseElement => {
        caseElement.classList.remove('selectionnee', 'mouvement-possible');
    });
}

// Met à jour le statut du jeu
function mettreAJourStatut() {
    elementStatut.textContent = statutJeu;
}

// Réinitialise le jeu
function reinitialiserJeu() {
    echiquier = JSON.parse(JSON.stringify(echiquierInitial));
    joueurActuel = 'blanc';
    statutJeu = "Déplacez une pièce";
    elementStatut.style.color = "black";
    indicateurTour.textContent = "Tour des Blancs";
    effacerSurlignages();
    caseSelectionnee = null;
    initialiserPlateau();
}

// Mouvement aléatoire pour l'IA (noirs)
function effectuerMouvementIA() {
    const mouvementsIAPossibles = [];

    // Trouve toutes les pièces noires et leurs mouvements possibles
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const piece = echiquier[y][x];
            if (piece && piece === piece.toLowerCase()) {
                const mouvements = obtenirMouvementsPossibles(x, y);
                mouvements.forEach(mouvement => {
                    mouvementsIAPossibles.push({
                        deX: x,
                        deY: y,
                        versX: mouvement[0],
                        versY: mouvement[1]
                    });
                });
            }
        }
    }

    // Choisit un mouvement aléatoire
    if (mouvementsIAPossibles.length > 0) {
        const mouvementAleatoire = mouvementsIAPossibles[Math.floor(Math.random() * mouvementsIAPossibles.length)];
        deplacerPiece(mouvementAleatoire.deX, mouvementAleatoire.deY, mouvementAleatoire.versX, mouvementAleatoire.versY);

        // Vérifie si le roi blanc est en échec
        if (estRoiEnEchec('blanc')) {
            statutJeu = "ÉCHEC !";
            elementStatut.style.color = "red";
        } else {
            statutJeu = "Déplacez une pièce";
            elementStatut.style.color = "black";
        }

        joueurActuel = 'blanc';
        indicateurTour.textContent = "Tour des Blancs";
        mettreAJourStatut();
    }
}

// Initialisation au chargement
window.addEventListener('load', () => {
    initialiserPlateau();
    boutonReinitialiser.addEventListener('click', reinitialiserJeu);
});

