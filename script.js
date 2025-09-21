// script.js - Commit 3 : Déplacement basique des pièces

// Variables globales
let pieceSelectionnee = null;
let positionInitiale = null;

// Initialisation de l'échiquier (8x8)
const echiquier = document.getElementById('echiquier');
const lettres = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const chiffres = [8, 7, 6, 5, 4, 3, 2, 1];

// Création de l'échiquier
function initialiserEchiquier() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const caseElement = document.createElement('div');
            caseElement.classList.add('case');
            caseElement.dataset.position = `${lettres[j]}${chiffres[i]}`;

            if ((i + j) % 2 === 0) {
                caseElement.classList.add('blanche');
            } else {
                caseElement.classList.add('noire');
            }

            // Événements pour sélectionner/déplacer les pièces
            caseElement.addEventListener('click', () => {
                gererClicCase(caseElement);
            });

            echiquier.appendChild(caseElement);
        }
    }
}

// Placement des pièces (position initiale)
function placerPieces() {
    const pieces = [
        // Pièces noires
        { type: 'tour', position: 'a8', couleur: 'noire' },
        { type: 'cavalier', position: 'b8', couleur: 'noire' },
        { type: 'fou', position: 'c8', couleur: 'noire' },
        { type: 'dame', position: 'd8', couleur: 'noire' },
        { type: 'roi', position: 'e8', couleur: 'noire' },
        { type: 'fou', position: 'f8', couleur: 'noire' },
        { type: 'cavalier', position: 'g8', couleur: 'noire' },
        { type: 'tour', position: 'h8', couleur: 'noire' },
        // Pions noirs
        ...Array.from({ length: 8 }, (_, i) => ({ type: 'pion', position: `${lettres[i]}7`, couleur: 'noire' })),
        // Pièces blanches
        { type: 'tour', position: 'a1', couleur: 'blanche' },
        { type: 'cavalier', position: 'b1', couleur: 'blanche' },
        { type: 'fou', position: 'c1', couleur: 'blanche' },
        { type: 'dame', position: 'd1', couleur: 'blanche' },
        { type: 'roi', position: 'e1', couleur: 'blanche' },
        { type: 'fou', position: 'f1', couleur: 'blanche' },
        { type: 'cavalier', position: 'g1', couleur: 'blanche' },
        { type: 'tour', position: 'h1', couleur: 'blanche' },
        // Pions blancs
        ...Array.from({ length: 8 }, (_, i) => ({ type: 'pion', position: `${lettres[i]}2`, couleur: 'blanche' }))
    ];

    pieces.forEach(piece => {
        const caseElement = document.querySelector(`.case[data-position="${piece.position}"]`);
        if (caseElement) {
            const pieceElement = document.createElement('div');
            pieceElement.classList.add('piece', piece.type, piece.couleur);
            pieceElement.dataset.type = piece.type;
            pieceElement.dataset.couleur = piece.couleur;
            caseElement.appendChild(pieceElement);
        }
    });
}

// Gestion du clic sur une case
function gererClicCase(caseElement) {
    const pieceElement = caseElement.querySelector('.piece');

    // Réinitialise la sélection précédente
    if (pieceSelectionnee) {
        pieceSelectionnee.classList.remove('selectionnee');
    }

    if (pieceSelectionnee) {
        // Déplacer la pièce
        if (!caseElement.querySelector('.piece')) {
            caseElement.appendChild(pieceSelectionnee);
            pieceSelectionnee.classList.remove('selectionnee');
            pieceSelectionnee = null;
        } else {
            // Sélectionner une autre pièce
            pieceSelectionnee = pieceElement;
            pieceSelectionnee.classList.add('selectionnee');
        }
    } else if (pieceElement) {
        // Sélectionner la pièce
        pieceSelectionnee = pieceElement;
        pieceSelectionnee.classList.add('selectionnee');
    }
}

