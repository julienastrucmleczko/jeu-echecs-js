document.addEventListener('DOMContentLoaded', () => {
    const echiquier = document.getElementById('echiquier');
    const statusElement = document.getElementById('status');
    const lettres = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const chiffres = [8, 7, 6, 5, 4, 3, 2, 1];

    // Positions initiales des pièces (avec propriété `aBouge` pour le roque)
    let pieces = {
        'a8': { type: 'tour',   couleur: 'noir', symbole: '♜', aBouge: false },
        'b8': { type: 'cavalier', couleur: 'noir', symbole: '♞', aBouge: false },
        'c8': { type: 'fou',    couleur: 'noir', symbole: '♝', aBouge: false },
        'd8': { type: 'dame',   couleur: 'noir', symbole: '♛', aBouge: false },
        'e8': { type: 'roi',    couleur: 'noir', symbole: '♚', aBouge: false },
        'f8': { type: 'fou',    couleur: 'noir', symbole: '♝', aBouge: false },
        'g8': { type: 'cavalier', couleur: 'noir', symbole: '♞', aBouge: false },
        'h8': { type: 'tour',   couleur: 'noir', symbole: '♜', aBouge: false },
        'a7': { type: 'pion',   couleur: 'noir', symbole: '♟', aBouge: false },
        'b7': { type: 'pion',   couleur: 'noir', symbole: '♟', aBouge: false },
        'c7': { type: 'pion',   couleur: 'noir', symbole: '♟', aBouge: false },
        'd7': { type: 'pion',   couleur: 'noir', symbole: '♟', aBouge: false },
        'e7': { type: 'pion',   couleur: 'noir', symbole: '♟', aBouge: false },
        'f7': { type: 'pion',   couleur: 'noir', symbole: '♟', aBouge: false },
        'g7': { type: 'pion',   couleur: 'noir', symbole: '♟', aBouge: false },
        'h7': { type: 'pion',   couleur: 'noir', symbole: '♟', aBouge: false },

        'a2': { type: 'pion',   couleur: 'blanc', symbole: '♙', aBouge: false },
        'b2': { type: 'pion',   couleur: 'blanc', symbole: '♙', aBouge: false },
        'c2': { type: 'pion',   couleur: 'blanc', symbole: '♙', aBouge: false },
        'd2': { type: 'pion',   couleur: 'blanc', symbole: '♙', aBouge: false },
        'e2': { type: 'pion',   couleur: 'blanc', symbole: '♙', aBouge: false },
        'f2': { type: 'pion',   couleur: 'blanc', symbole: '♙', aBouge: false },
        'g2': { type: 'pion',   couleur: 'blanc', symbole: '♙', aBouge: false },
        'h2': { type: 'pion',   couleur: 'blanc', symbole: '♙', aBouge: false },
        'a1': { type: 'tour',   couleur: 'blanc', symbole: '♖', aBouge: false },
        'b1': { type: 'cavalier', couleur: 'blanc', symbole: '♘', aBouge: false },
        'c1': { type: 'fou',    couleur: 'blanc', symbole: '♗', aBouge: false },
        'd1': { type: 'dame',   couleur: 'blanc', symbole: '♕', aBouge: false },
        'e1': { type: 'roi',    couleur: 'blanc', symbole: '♔', aBouge: false },
        'f1': { type: 'fou',    couleur: 'blanc', symbole: '♗', aBouge: false },
        'g1': { type: 'cavalier', couleur: 'blanc', symbole: '♘', aBouge: false },
        'h1': { type: 'tour',   couleur: 'blanc', symbole: '♖', aBouge: false }
    };

    let pieceSelectionnee = null;
    let tourActuel = 'blanc';
    let dernierMouvement = null; // Pour la prise en passant

    // ================== FONCTIONS PRINCIPALES ==================

    // Crée l'échiquier visuel
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

        // Mise en surbrillance des rois en échec
        const roiBlancPos = trouverRoi('blanc');
        const roiNoirPos = trouverRoi('noir');

        if (roiEnEchec('blanc')) {
            document.querySelector(`.case[data-position="${roiBlancPos}"]`).classList.add('echec');
        }
        if (roiEnEchec('noir')) {
            document.querySelector(`.case[data-position="${roiNoirPos}"]`).classList.add('echec');
        }

        // Mise à jour du statut
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

    // Trouve la position du roi d'une couleur donnée
    function trouverRoi(couleur) {
        for (const position in pieces) {
            if (pieces[position].type === 'roi' && pieces[position].couleur === couleur) {
                return position;
            }
        }
        return null;
    }

    // Vérifie si le roi est en échec
    function roiEnEchec(couleur) {
        const roiPos = trouverRoi(couleur);
        if (!roiPos) return false;

        for (const position in pieces) {
            if (pieces[position].couleur !== couleur) {
                if (estMouvementValide(position, roiPos, pieces[position].type, true)) {
                    return true;
                }
            }
        }
        return false;
    }

    // Vérifie si le roi est en échec et mat
    function roiEnEchecEtMat(couleur) {
        if (!roiEnEchec(couleur)) return false;

        for (const position in pieces) {
            if (pieces[position].couleur === couleur) {
                const typePiece = pieces[position].type;
                for (const cible in pieces) {
                    if (pieces[cible]?.couleur !== couleur || cible === position) {
                        if (estMouvementValide(position, cible, typePiece, true)) {
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

                            if (!estEnEchec) return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    // Vérifie si un mouvement est valide (sans vérifier l'échec)
    function estMouvementValide(depart, arrivee, typePiece, simulation = false) {
        if (!pieces[depart]) return false;
        if (pieces[arrivee]?.couleur === pieces[depart].couleur) return false;

        const departX = lettres.indexOf(depart[0]);
        const departY = 8 - parseInt(depart[1]);
        const arriveeX = lettres.indexOf(arrivee[0]);
        const arriveeY = 8 - parseInt(arrivee[1]);

        const dx = arriveeX - departX;
        const dy = arriveeY - departY;

        switch (typePiece) {
            case 'pion':
                const direction = pieces[depart].couleur === 'blanc' ? 1 : -1;
                // Mouvement vers l'avant
                if (dx === 0 && dy === direction && !pieces[arrivee]) {
                    return true;
                }
                // Premier mouvement de deux cases
                if (dx === 0 && dy === 2 * direction && !pieces[depart].aBouge &&
                    !pieces[arrivee] && !pieces[lettres[departX] + chiffres[departY - direction]]) {
                    return true;
                }
                // Capture en diagonale
                if (Math.abs(dx) === 1 && dy === direction && pieces[arrivee]) {
                    return true;
                }
                // Prise en passant
                if (!simulation && Math.abs(dx) === 1 && dy === direction &&
                    !pieces[arrivee] && dernierMouvement) {
                    const [derniereDepart, derniereArrivee] = dernierMouvement;
                    if (pieces[derniereDepart]?.type === 'pion' &&
                        Math.abs(parseInt(derniereDepart[1]) - parseInt(derniereArrivee[1])) === 2 &&
                        arrivee[1] === (direction > 0 ? '6' : '3') &&
                        arrivee[0] === derniereArrivee[0]) {
                        return true;
                    }
                }
                return false;

            case 'tour':
                if ((dx === 0 || dy === 0) && !(dx === 0 && dy === 0)) {
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
                if ((dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) && !(dx === 0 && dy === 0)) {
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
                if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) return true;
                // Roque
                if (!pieces[depart].aBouge && dy === 0 && Math.abs(dx) === 2) {
                    const direction = dx > 0 ? 1 : -1;
                    const tourPos = lettres[departX + (direction > 0 ? 3 : -4)] + depart[1];
                    if (pieces[tourPos]?.type === 'tour' && !pieces[tourPos].aBouge) {
                        for (let i = 1; i < (direction > 0 ? 2 : 3); i++) {
                            const posIntermediaire = lettres[departX + i * direction] + depart[1];
                            if (pieces[posIntermediaire]) return false;
                        }
                        return true;
                    }
                }
                return false;

            default:
                return false;
        }
    }

    // Gère le roque
    function roque(depart, arrivee) {
        const departX = lettres.indexOf(depart[0]);
        const arriveeX = lettres.indexOf(arrivee[0]);
        const direction = arriveeX > departX ? 1 : -1;

        const tourDepart = lettres[departX + (direction > 0 ? 3 : -4)] + depart[1];
        const tourArrivee = lettres[departX + (direction > 0 ? 1 : -1)] + depart[1];

        if (pieces[tourDepart] && !pieces[tourDepart].aBouge) {
            pieces[tourArrivee] = pieces[tourDepart];
            delete pieces[tourDepart];
            pieces[tourArrivee].aBouge = true;
        }
    }

    // Gère la promotion des pions
    function promouvoirPion(position) {
        const couleur = pieces[position].couleur;
        const promotion = prompt(`Promouvoir le pion en (dame, tour, fou, cavalier):`).toLowerCase();

        const symboles = {
            'dame': couleur === 'blanc' ? '♕' : '♛',
            'tour': couleur === 'blanc' ? '♖' : '♜',
            'fou': couleur === 'blanc' ? '♗' : '♝',
            'cavalier': couleur === 'blanc' ? '♘' : '♞'
        };

        if (promotion && symboles[promotion]) {
            pieces[position].type = promotion;
            pieces[position].symbole = symboles[promotion];
        } else {
            // Par défaut, promouvoir en dame
            pieces[position].type = 'dame';
            pieces[position].symbole = symboles['dame'];
        }
    }

    // Gère la prise en passant
    function priseEnPassant(depart, arrivee) {
        const arriveeX = lettres.indexOf(arrivee[0]);
        const arriveeY = parseInt(arrivee[1]);

        if (Math.abs(parseInt(depart[1]) - arriveeY) === 1 &&
            dernierMouvement &&
            pieces[depart].type === 'pion') {
            const [derniereDepart, derniereArrivee] = dernierMouvement;
            if (pieces[derniereDepart]?.type === 'pion' &&
                Math.abs(parseInt(derniereDepart[1]) - parseInt(derniereArrivee[1])) === 2 &&
                arrivee[0] === derniereArrivee[0] &&
                arrivee[1] === (pieces[depart].couleur === 'blanc' ? '6' : '3')) {
                delete pieces[derniereArrivee];
            }
        }
    }

    // ================== GESTION DES CLIKS ==================
    echiquier.addEventListener('click', (e) => {
        const caseCliquee = e.target.closest('.case');
        if (!caseCliquee) return;

        const position = caseCliquee.dataset.position;

        if (pieceSelectionnee) {
            // Si on clique sur une pièce de la même couleur, on la sélectionne
            if (pieces[position]?.couleur === pieces[pieceSelectionnee].couleur) {
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

                // Vérifier si le roi est en échec après le mouvement
                if (roiEnEchec(tourActuel)) {
                    alert('Ce mouvement met votre roi en échec !');
                    // Annuler le mouvement
                    delete pieces[position];
                    pieces[pieceSelectionnee] = pieceDeplacee;
                    if (pieceCible) pieces[position] = pieceCible;
                } else {
                    // Mettre à jour la propriété aBouge
                    pieces[position].aBouge = true;

                    // Gérer le roque
                    if (typePiece === 'roi' && Math.abs(lettres.indexOf(pieceSelectionnee[0]) - lettres.indexOf(position[0])) === 2) {
                        roque(pieceSelectionnee, position);
                    }

                    // Gérer la promotion des pions
                    if (typePiece === 'pion' && (parseInt(position[1]) === 8 || parseInt(position[1]) === 1)) {
                        promouvoirPion(position);
                    }

                    // Gérer la prise en passant
                    priseEnPassant(pieceSelectionnee, position);

                    // Enregistrer le dernier mouvement pour la prise en passant
                    dernierMouvement = [pieceSelectionnee, position];

                    // Changer de tour
                    tourActuel = tourActuel === 'blanc' ? 'noir' : 'blanc';
                }
            }
            pieceSelectionnee = null;
            creerEchiquier();
        } else if (pieces[position]?.couleur === tourActuel) {
            // Sélectionner une pièce
            pieceSelectionnee = position;
        }
    });

    // Initialiser l'échiquier
    creerEchiquier();
});
