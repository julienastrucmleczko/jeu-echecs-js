document.addEventListener('DOMContentLoaded', () => {
    const echiquier = document.getElementById('echiquier');
    const lettres = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const chiffres = [8, 7, 6, 5, 4, 3, 2, 1];

    // Positions initiales des pièces
    let pieces = {
        'a8': { type: 'tour',   couleur: 'noir', symbole: '♜' },
        'b8': { type: 'cavalier', couleur: 'noir', symbole: '♞' },
        'c8': { type: 'fou',    couleur: 'noir', symbole: '♝' },
        'd8': { type: 'dame',   couleur: 'noir', symbole: '♛' },
        'e8': { type: 'roi',    couleur: 'noir', symbole: '♚' },
        'f8': { type: 'fou',    couleur: 'noir', symbole: '♝' },
        'g8': { type: 'cavalier', couleur: 'noir', symbole: '♞' },
        'h8': { type: 'tour',   couleur: 'noir', symbole: '♜' },
        'a7': { type: 'pion',   couleur: 'noir', symbole: '♟' },
        'b7': { type: 'pion',   couleur: 'noir', symbole: '♟' },
        'c7': { type: 'pion',   couleur: 'noir', symbole: '♟' },
        'd7': { type: 'pion',   couleur: 'noir', symbole: '♟' },
        'e7': { type: 'pion',   couleur: 'noir', symbole: '♟' },
        'f7': { type: 'pion',   couleur: 'noir', symbole: '♟' },
        'g7': { type: 'pion',   couleur: 'noir', symbole: '♟' },
        'h7': { type: 'pion',   couleur: 'noir', symbole: '♟' },
        'a2': { type: 'pion',   couleur: 'blanc', symbole: '♙' },
        'b2': { type: 'pion',   couleur: 'blanc', symbole: '♙' },
        'c2': { type: 'pion',   couleur: 'blanc', symbole: '♙' },
        'd2': { type: 'pion',   couleur: 'blanc', symbole: '♙' },
        'e2': { type: 'pion',   couleur: 'blanc', symbole: '♙' },
        'f2': { type: 'pion',   couleur: 'blanc', symbole: '♙' },
        'g2': { type: 'pion',   couleur: 'blanc', symbole: '♙' },
        'h2': { type: 'pion',   couleur: 'blanc', symbole: '♙' },
        'a1': { type: 'tour',   couleur: 'blanc', symbole: '♖' },
        'b1': { type: 'cavalier', couleur: 'blanc', symbole: '♘' },
        'c1': { type: 'fou',    couleur: 'blanc', symbole: '♗' },
        'd1': { type: 'dame',   couleur: 'blanc', symbole: '♕' },
        'e1': { type: 'roi',    couleur: 'blanc', symbole: '♔' },
        'f1': { type: 'fou',    couleur: 'blanc', symbole: '♗' },
        'g1': { type: 'cavalier', couleur: 'blanc', symbole: '♘' },
        'h1': { type: 'tour',   couleur: 'blanc', symbole: '♖' }
    };

    let tourActuel = 'blanc'; // Commence avec les blancs

    // Fonction pour créer l'échiquier
    function creerEchiquier() {
        echiquier.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const caseElement = document.createElement('div');
                caseElement.classList.add('case');
                const position = lettres[j] + chiffres[i];
                if ((i + j) % 2 === 0) {
                    caseElement.classList.add('blanche');
                } else {
                    caseElement.classList.add('noire');
                }
                caseElement.dataset.position = position;

                // Ajouter la pièce si elle existe
                if (pieces[position]) {
                    const pieceElement = document.createElement('div');
                    pieceElement.classList.add('piece');
                    pieceElement.textContent = pieces[position].symbole;
                    pieceElement.dataset.couleur = pieces[position].couleur;
                    pieceElement.dataset.type = pieces[position].type;
                    caseElement.appendChild(pieceElement);
                }

                echiquier.appendChild(caseElement);
            }
        }
    }

    // Fonction pour vérifier si le roi est en échec
    function roiEnEchec(couleur) {
        const roiPosition = Object.keys(pieces).find(
            pos => pieces[pos].type === 'roi' && pieces[pos].couleur === couleur
        );

        if (!roiPosition) return false;

        // Vérifier si une pièce adverse attaque le roi
        for (const [position, piece] of Object.entries(pieces)) {
            if (piece.couleur !== couleur) {
                if (estMouvementValide(position, roiPosition, piece.type)) {
                    return true;
                }
            }
        }
        return false;
    }

    // Fonction pour vérifier si un mouvement est valide selon le type de pièce
    function estMouvementValide(de, a, typePiece) {
        const deCol = de.charAt(0);
        const deLig = parseInt(de.charAt(1));
        const aCol = a.charAt(0);
        const aLig = parseInt(a.charAt(1));

        const colDiff = Math.abs(aCol.charCodeAt(0) - deCol.charCodeAt(0));
        const ligDiff = Math.abs(aLig - deLig);

        switch (typePiece) {
            case 'pion':
                // Logique simplifiée pour les pions
                if (pieces[de].couleur === 'blanc') {
                    return (aCol === deCol && aLig === deLig + 1) || // Avancer d'une case
                           (aCol === deCol && deLig === 2 && aLig === 4); // Premier coup (2 cases)
                } else {
                    return (aCol === deCol && aLig === deLig - 1) ||
                           (aCol === deCol && deLig === 7 && aLig === 5);
                }
            case 'tour':
                return (deCol === aCol || deLig === aLig); // Même colonne ou ligne
            case 'cavalier':
                return (colDiff === 2 && ligDiff === 1) || (colDiff === 1 && ligDiff === 2);
            case 'fou':
                return colDiff === ligDiff; // Diagonale
            case 'dame':
                return (deCol === aCol || deLig === aLig || colDiff === ligDiff);
            case 'roi':
                return colDiff <= 1 && ligDiff <= 1; // Une case dans n'importe quelle direction
            default:
                return false;
        }
    }

    // Gestion des clics pour déplacer les pièces
    let pieceSelectionnee = null;

    echiquier.addEventListener('click', (e) => {
        const caseCliquee = e.target.closest('.case');
        if (!caseCliquee) return;

        const position = caseCliquee.dataset.position;

        if (pieceSelectionnee) {
            // Essayer de déplacer la pièce
            if (pieces[position] && pieces[position].couleur === pieces[pieceSelectionnee].couleur) {
                // Sélectionner une autre pièce de la même couleur
                pieceSelectionnee = position;
                return;
            }

            // Vérifier si le mouvement est valide
            const typePiece = pieces[pieceSelectionnee].type;
            if (estMouvementValide(pieceSelectionnee, position, typePiece)) {
                // Déplacer la pièce
                const piece = pieces[pieceSelectionnee];
                delete pieces[pieceSelectionnee];
                pieces[position] = piece;

                // Vérifier si le roi est en échec après le mouvement
                const couleurAdverse = tourActuel === 'blanc' ? 'noir' : 'blanc';
                if (roiEnEchec(couleurAdverse)) {
                    alert('Échec !');
                    // Annuler le mouvement si cela met son propre roi en échec
                    delete pieces[position];
                    pieces[pieceSelectionnee] = piece;
                } else {
                    // Changer de tour
                    tourActuel = tourActuel === 'blanc' ? 'noir' : 'blanc';
                }
            }

            pieceSelectionnee = null;
            creerEchiquier();
        } else if (pieces[position] && pieces[position].couleur === tourActuel) {
            // Sélectionner une pièce
            pieceSelectionnee = position;
        }
    });

    // Initialiser l'échiquier
    creerEchiquier();
});
