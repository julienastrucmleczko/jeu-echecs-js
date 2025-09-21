// script.js - Commit 5 : Détection d'échec et mat

document.addEventListener('DOMContentLoaded', () => {
    const echiquier = document.getElementById('echiquier');
    const statusElement = document.getElementById('status');
    const lettres = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const chiffres = [8, 7, 6, 5, 4, 3, 2, 1];

    let pieces = {
        'a8': { type: 'tour', couleur: 'noir', symbole: '♜', aBouge: false },
        'b8': { type: 'cavalier', couleur: 'noir', symbole: '♞', aBouge: false },
        'c8': { type: 'fou', couleur: 'noir', symbole: '♝', aBouge: false },
        'd8': { type: 'dame', couleur: 'noir', symbole: '♛', aBouge: false },
        'e8': { type: 'roi', couleur: 'noir', symbole: '♚', aBouge: false },
        'f8': { type: 'fou', couleur: 'noir', symbole: '♝', aBouge: false },
        'g8': { type: 'cavalier', couleur: 'noir', symbole: '♞', aBouge: false },
        'h8': { type: 'tour', couleur: 'noir', symbole: '♜', aBouge: false },
        'a7': { type: 'pion', couleur: 'noir', symbole: '♟', aBouge: false },
        'b7': { type: 'pion', couleur: 'noir', symbole: '♟', aBouge: false },
        'c7': { type: 'pion', couleur: 'noir', symbole: '♟', aBouge: false },
        'd7': { type: 'pion', couleur: 'noir', symbole: '♟', aBouge: false },
        'e7': { type: 'pion', couleur: 'noir', symbole: '♟', aBouge: false },
        'f7': { type: 'pion', couleur: 'noir', symbole: '♟', aBouge: false },
        'g7': { type: 'pion', couleur: 'noir', symbole: '♟', aBouge: false },
        'h7': { type: 'pion', couleur: 'noir', symbole: '♟', aBouge: false },

        'a2': { type: 'pion', couleur: 'blanc', symbole: '♙', aBouge: false },
        'b2': { type: 'pion', couleur: 'blanc', symbole: '♙', aBouge: false },
        'c2': { type: 'pion', couleur: 'blanc', symbole: '♙', aBouge: false },
        'd2': { type: 'pion', couleur: 'blanc', symbole: '♙', aBouge: false },
        'e2': { type: 'pion', couleur: 'blanc', symbole: '♙', aBouge: false },
        'f2': { type: 'pion', couleur: 'blanc', symbole: '♙', aBouge: false },
        'g2': { type: 'pion', couleur: 'blanc', symbole: '♙', aBouge: false },
        'h2': { type: 'pion', couleur: 'blanc', symbole: '♙', aBouge: false },
        'a1': { type: 'tour', couleur: 'blanc', symbole: '♖', aBouge: false },
        'b1': { type: 'cavalier', couleur: 'blanc', symbole: '♘', aBouge: false },
        'c1': { type: 'fou', couleur: 'blanc', symbole: '♗', aBouge: false },
        'd1': { type: 'dame', couleur: 'blanc', symbole: '♕', aBouge: false },
        'e1': { type: 'roi', couleur: 'blanc', symbole: '♔', aBouge: false },
        'f1': { type: 'fou', couleur: 'blanc', symbole: '♗', aBouge: false },
        'g1': { type: 'cavalier', couleur: 'blanc', symbole: '♘', aBouge: false },
        'h1': { type: 'tour', couleur: 'blanc', symbole: '♖', aBouge: false }
    };

    let pieceSelectionnee = null;
    let tourActuel = 'blanc';

    // Fonction pour créer l'échiquier
    function creerEchiquier() {
        echiquier.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const caseElement = document.createElement('div');
                caseElement.classList.add('case');
                caseElement.classList.add((i + j) % 2 === 0 ? 'blanche' : 'noire');

                const position = lettres[j] + chiffres[i];
                caseElement.dataset.position = position;

                if (pieces[position]) {
                    const pieceElement = document.createElement('div');
                    pieceElement.classList.add('piece');
                    pieceElement.textContent = pieces[position].symbole;
                    caseElement.appendChild(pieceElement);
                }

                echiquier.appendChild(caseElement);
            }
        }

        // Mettre en surbrillance les cases en échec
        const roiBlancPos = trouverRoi('blanc');
        const roiNoirPos = trouverRoi('noir');

        if (roiEnEchec('blanc')) {
            document.querySelector(`.case[data-position="${roiBlancPos}"]`).classList.add('echec');
        }
        if (roiEnEchec('noir')) {
            document.querySelector(`.case[data-position="${roiNoirPos}"]`).classList.add('echec');
        }

        // Mettre à jour le statut
        statusElement.textContent = `Tour des ${tourActuel}s`;
        if (roiEnEchecEtMat('blanc')) {
            statusElement.textContent = 'Échec et mat ! Les noirs gagnent.';
        } else if (roiEnEchecEtMat('noir')) {
            statusElement.textContent = 'Échec et mat ! Les blancs gagnent.';
        } else if (roiEnEchec('blanc')) {
            statusElement.textContent = 'Échec pour les blancs !';
        } else if (roiEnEchec('noir')) {
            statusElement.textContent = 'Échec pour les noirs !';
        }
    }

    // Fonction pour trouver la position du roi
    function trouverRoi(couleur) {
        for (const position in pieces) {
            if (pieces[position].type === 'roi' && pieces[position].couleur === couleur) {
                return position;
            }
        }
        return null;
    }

    // Fonction pour vérifier si le roi est en échec
    function roiEnEchec(couleur) {
        const roiPos = trouverRoi(couleur);
        if (!roiPos) return false;

        for (const position in pieces) {
            if (pieces[position].couleur !== couleur) {
                const typePiece = pieces[position].type;
                if (estMouvementValide(position, roiPos, typePiece, true)) {
                    return true;
                }
            }
        }
        return false;
    }

    // Fonction pour vérifier si le roi est en échec et mat
    function roiEnEchecEtMat(couleur) {
        if (!roiEnEchec(couleur)) return false;

        // Vérifier si un mouvement peut sortir le roi de l'échec
        for (const position in pieces) {
            if (pieces[position].couleur === couleur) {
                const typePiece = pieces[position].type;
                for (const cible in pieces) {
                    if (pieces[cible].couleur !== couleur || cible === position) {
                        if (estMouvementValide(position, cible, typePiece)) {
                            // Simuler le mouvement
                            const pieceDeplacee = pieces[position];
                            const pieceCible = pieces[cible];
                            delete pieces[position];
                            pieces[cible] = pieceDeplacee;

                            const estEnEchec = roiEnEchec(couleur);

                            // Annuler le mouvement
                            delete pieces[cible];
                            pieces[position] = pieceDeplacee;
                            if (pieceCible) pieces[cible] = pieceCible;

                            if (!estEnEchec) {
                                return false;
                            }
                        }
                    }
                }
            }
        }
        return true;
    }

    // Fonction pour vérifier si un mouvement est valide
    function estMouvementValide(depart, arrivee, typePiece, simulation = false) {
        const departX = lettres.indexOf(depart[0]);
        const departY = 8 - parseInt(depart[1]);
        const arriveeX = lettres.indexOf(arrivee[0]);
        const arriveeY = 8 - parseInt(arrivee[1]);

        const dx = arriveeX - departX;
        const dy = arriveeY - departY;

        const pieceDepart = pieces[depart];
        const pieceArrivee = pieces[arrivee];

        // Vérifier si la pièce de départ existe
        if (!pieceDepart) return false;

        // Vérifier si la pièce d'arrivée est de la même couleur
        if (pieceArrivee && pieceArrivee.couleur === pieceDepart.couleur) return false;

        // Logique spécifique à chaque type de pièce
        switch (typePiece) {
            case 'pion':
                const direction = pieceDepart.couleur === 'blanc' ? 1 : -1;
                // Mouvement vers l'avant
                if (dx === 0 && dy === direction && !pieceArrivee) {
                    return true;
                }
                // Premier mouvement de deux cases
                if (dx === 0 && dy === 2 * direction && !pieceDepart.aBouge && !pieceArrivee && !pieces[lettres[departX] + (chiffres[departY - direction])]) {
                    return true;
                }
                // Capture en diagonale
                if (Math.abs(dx) === 1 && dy === direction && pieceArrivee) {
                    return true;
                }
                return false;

            case 'tour':
                if (dx === 0 || dy === 0) {
                    if (dx === 0 && dy === 0) return false; // Pas de mouvement
                    const stepX = dx === 0 ? 0 : dx / Math.abs(dx);
                    const stepY = dy === 0 ? 0 : dy / Math.abs(dy);
                    for (let i = 1; i < Math.max(Math.abs(dx), Math.abs(dy)); i++) {
                        const posIntermediaire = lettres[departX + i * stepX] + chiffres[departY + i * stepY];
                        if (pieces[posIntermediaire]) return false;
                    }
                    return true;
                }
                return false;

            case 'cavalier':
                return (Math.abs(dx) === 2 && Math.abs(dy) === 1) || (Math.abs(dx) === 1 && Math.abs(dy) === 2);

            case 'fou':
                if (Math.abs(dx) === Math.abs(dy)) {
                    const stepX = dx / Math.abs(dx);
                    const stepY = dy / Math.abs(dy);
                    for (let i = 1; i < Math.abs(dx); i++) {
                        const posIntermediaire = lettres[departX + i * stepX] + chiffres[departY + i * stepY];
                        if (pieces[posIntermediaire]) return false;
                    }
                    return true;
                }
                return false;

            case 'dame':
                if ((dx === 0 || dy === 0) || (Math.abs(dx) === Math.abs(dy))) {
                    if (dx === 0 && dy === 0) return false; // Pas de mouvement
                    const stepX = dx === 0 ? 0 : dx / Math.abs(dx);
                    const stepY = dy === 0 ? 0 : dy / Math.abs(dy);
                    for (let i = 1; i < Math.max(Math.abs(dx), Math.abs(dy)); i++) {
                        const posIntermediaire = lettres[departX + i * stepX] + chiffres[departY + i * stepY];
                        if (pieces[posIntermediaire]) return false;
                    }
                    return true;
                }
                return false;

            case 'roi':
                return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;

            default:
                return false;
        }
    }

    // Gestion des clics sur les cases
    echiquier.addEventListener('click', (e) => {
        const caseCliquee = e.target.closest('.case');
        if (!caseCliquee) return;

        const position = caseCliquee.dataset.position;

        if (pieceSelectionnee) {
            if (pieces[position] && pieces[position].couleur === pieces[pieceSelectionnee].couleur) {
                pieceSelectionnee = position;
                return;
            }

            const typePiece = pieces[pieceSelectionnee].type;
            if (estMouvementValide(pieceSelectionnee, position, typePiece)) {
                // Simuler le mouvement pour vérifier l'échec
                const pieceDeplacee = pieces[pieceSelectionnee];
                const pieceCible = pieces[position];
                delete pieces[pieceSelectionnee];
                pieces[position] = pieceDeplacee;

                const couleurAdverse = tourActuel === 'blanc' ? 'noir' : 'blanc';
                if (roiEnEchec(tourActuel)) {
                    alert('Ce mouvement met votre roi en échec !');
                    delete pieces[position];
                    pieces[pieceSelectionnee] = pieceDeplacee;
                    if (pieceCible) pieces[position] = pieceCible;
                } else {
                    // Mettre à jour la propriété aBouge
                    pieces[position].aBouge = true;

                    // Changer de tour
                    tourActuel = tourActuel === 'blanc' ? 'noir' : 'blanc';
                }
            }

            pieceSelectionnee = null;
            creerEchiquier();
        } else if (pieces[position] && pieces[position].couleur === tourActuel) {
            pieceSelectionnee = position;
        }
    });

    // Initialiser l'échiquier
    creerEchiquier();
});

