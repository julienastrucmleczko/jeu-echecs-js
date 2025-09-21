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

            // Couleur alternée
            if ((i + j) % 2 === 0) {
                caseElement.classList.add('blanche');
            } else {
                caseElement.classList.add('noire');
            }

            echiquier.appendChild(caseElement);
        }
    }
}

// Placement des pièces (position initiale)
function placerPieces() {
    // Pièces noires (en haut)
    const piecesNoires = [
        { type: 'tour', position: 'a8' }, { type: 'cavalier', position: 'b8' },
        { type: 'fou', position: 'c8' }, { type: 'dame', position: 'd8' },
        { type: 'roi', position: 'e8' }, { type: 'fou', position: 'f8' },
        { type: 'cavalier', position: 'g8' }, { type: 'tour', position: 'h8' }
    ];

    // Pions noirs
    for (let i = 0; i < 8; i++) {
        piecesNoires.push({ type: 'pion', position: `${lettres[i]}7` });
    }

    // Pièces blanches (en bas)
    const piecesBlanches = [
        { type: 'tour', position: 'a1' }, { type: 'cavalier', position: 'b1' },
        { type: 'fou', position: 'c1' }, { type: 'dame', position: 'd1' },
        { type: 'roi', position: 'e1' }, { type: 'fou', position: 'f1' },
        { type: 'cavalier', position: 'g1' }, { type: 'tour', position: 'h1' }
    ];

    // Pions blancs
    for (let i = 0; i < 8; i++) {
        piecesBlanches.push({ type: 'pion', position: `${lettres[i]}2` });
    }

    // Ajout des pièces au DOM
    [...piecesNoires, ...piecesBlanches].forEach(piece => {
        const caseElement = document.querySelector(`.case[data-position="${piece.position}"]`);
        if (caseElement) {
            const pieceElement = document.createElement('div');
            pieceElement.classList.add('piece', piece.type, 'noire');
            if (piecesBlanches.some(p => p.position === piece.position)) {
                pieceElement.classList.replace('noire', 'blanche');
            }
            caseElement.appendChild(pieceElement);
        }
    });
}

// Initialisation au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    initialiserEchiquier();
    placerPieces();
});
