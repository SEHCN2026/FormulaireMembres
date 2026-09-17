let numeroAchat = 0;


/* ================================
   AFFICHAGE DES MONTANTS
================================ */

function afficherMontant(montant) {

    return montant
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        .replace(".", ",") + " $";
}


/* ================================
   CONVERSION D'UN MONTANT
================================ */

function montantEnNombre(texte) {

    return parseFloat(
        texte
            .replace(/\s/g, "")
            .replace("$", "")
            .replace(",", ".")
    ) || 0;
}

flatpickr.l10ns.fr.firstDayOfWeek = 0;


/* ================================
   CRÉATION D'UN ACHAT
================================ */

function ajouterAchat() {

    numeroAchat++;

    const numero = numeroAchat;

    const liste =
        document.getElementById("listeAchats");


    const achat =
        document.createElement("div");

    achat.className =
        "ligne-achat";

    achat.dataset.numero =
        numero;


    achat.innerHTML = `

        <span class="numero-achat">
            ${numero}
        </span>

        <div>
            <input
                type="text"
                id="dateAchat${numero}"
                name="dateAchat${numero}"
                class="date-achat"
                placeholder="Choisir une date"
                required
            >
        </div>

        <div>
            <input
                type="text"
                id="descriptionAchat${numero}"
                name="descriptionAchat${numero}"
                placeholder="Décrire l'achat"
                required
            >
        </div>

        <div>
            <input
                type="text"
                id="coutAchat${numero}"
                name="coutAchat${numero}"
                inputmode="decimal"
                placeholder="0,00 $"
                required
            >
        </div>

        <div class="pieces-achat">

            <button
                type="button"
                class="bouton-ajouter-piece"
                title="Ajouter une pièce justificative"
            >
		➕
	    </button>

	    <span
		class="nombre-pieces"
		id="nombrePieces${numero}"
	    >
		0
	    </span>

        </div>

	<div class="action-achat">

	    <button
		type="button"
		class="bouton-supprimer-achat"
		title="Supprimer cet achat"
	    >
		🗑️
	    </button>

	</div>

    `;


    liste.appendChild(achat);

const boutonSupprimerAchat =
    achat.querySelector(
        ".bouton-supprimer-achat"
    );


if (boutonSupprimerAchat) {

    boutonSupprimerAchat.addEventListener(
        "click",
        function() {

            /*
                ACHAT 1 :
                ON CONSERVE LA LIGNE
                ET ON EFFACE SON CONTENU
            */

if (numero === 1) {

    const date =
        document.getElementById(
            "dateAchat1"
        );

    const description =
        document.getElementById(
            "descriptionAchat1"
        );

    const cout =
        document.getElementById(
            "coutAchat1"
        );


    /*
        EFFACER LA DATE
    */

    if (date) {

        date.value = "";

        if (date._flatpickr) {

            date._flatpickr.clear();

        }

    }


    /*
        EFFACER LA DESCRIPTION
    */

    if (description) {

        description.value = "";

    }


    /*
        EFFACER LE COÛT
    */

    if (cout) {

        cout.value = "";

    }


    /*
        SUPPRIMER LES PIÈCES
        ASSOCIÉES À L'ACHAT 1
    */

    document
        .querySelectorAll(
            '.piece-justificative[data-numero-achat="1"]'
        )
        .forEach(
            function(piece) {

                piece.remove();

            }
        );


    mettreAJourNombrePieces();

    calculerTotalAchats();

    return;

mettreAJourBoutonsAction();

}


 /*
     AUTRES ACHATS :
     SUPPRIMER LA LIGNE
 */

 achat.remove();


 /*
     RENOMMER LES ACHATS
 */

 const lignesAchats =
     document.querySelectorAll(
         ".ligne-achat"
     );


 lignesAchats.forEach(
     function(ligne, index) {

         const nouveauNumero =
             index + 1;

         const ancienNumero =
             ligne.dataset.numero;


         ligne.dataset.numero =
             nouveauNumero;


         /*
             NUMÉRO AFFICHÉ
         */

         const numeroAffiche =
             ligne.querySelector(
                 ".numero-achat"
             );


         if (numeroAffiche) {

             numeroAffiche.textContent =
                 nouveauNumero;

         }


         /*
             DATE
         */

         const date =
             ligne.querySelector(
                 ".date-achat"
             );


         if (date) {

             date.id =
                 "dateAchat" +
                 nouveauNumero;

             date.name =
                 "dateAchat" +
                 nouveauNumero;

         }


         /*
             DESCRIPTION
         */

         const description =
             ligne.querySelector(
                 'input[id^="descriptionAchat"]'
             );


         if (description) {

             description.id =
                 "descriptionAchat" +
                 nouveauNumero;

             description.name =
                 "descriptionAchat" +
                 nouveauNumero;

         }


         /*
             COÛT
         */

         const cout =
             ligne.querySelector(
                 'input[id^="coutAchat"]'
             );


         if (cout) {

             cout.id =
                 "coutAchat" +
                 nouveauNumero;

             cout.name =
                 "coutAchat" +
                 nouveauNumero;

         }


         /*
             COMPTEUR DE PIÈCES
         */

         const compteur =
             ligne.querySelector(
                 ".nombre-pieces"
             );


         if (compteur) {

             compteur.id =
                 "nombrePieces" +
                 nouveauNumero;

         }

     }
 );


 /*
     LE PROCHAIN ACHAT
     DOIT UTILISER LE NOMBRE DE LIGNES
 */

 numeroAchat =
     lignesAchats.length;


 calculerTotalAchats();

 mettreAJourNombrePieces();

        }
    );

}

    const boutonAjouterPiece =
        achat.querySelector(
            ".bouton-ajouter-piece"
        );


    if (boutonAjouterPiece) {

        boutonAjouterPiece.addEventListener(
            "click",
            function() {

                ouvrirAjoutPieces(
                    numero
                );

            }
        );

    }

    mettreAJourBoutonsAction();


    /* ================================
       CALENDRIER
    ================================ */

    flatpickr(
        "#dateAchat" + numero,
        {

            locale: "fr",

            dateFormat: "Y-m-d",

            altInput: true,

            altFormat: "j F Y",

            allowInput: false,


            onReady: function(
                selectedDates,
                dateStr,
                instance
            ) {

                const bouton =
                    document.createElement("button");


                bouton.type =
                    "button";

                bouton.textContent =
                    "Aujourd'hui";


                bouton.style.width =
                    "100%";

                bouton.style.marginTop =
                    "8px";

                bouton.style.padding =
                    "8px";

                bouton.style.border =
                    "1px solid #ccc";

                bouton.style.borderRadius =
                    "4px";

                bouton.style.backgroundColor =
                    "#f5f5f5";

                bouton.style.cursor =
                    "pointer";


                bouton.addEventListener(
                    "click",
                    function() {

                        instance.setDate(
                            new Date(),
                            true
                        );

                        instance.close();

                    }
                );


                instance.calendarContainer
                    .appendChild(bouton);

            }

        }
    );


    /* ================================
       SURVEILLER LE COÛT
    ================================ */

    const cout =
        document.getElementById(
            "coutAchat" + numero
        );


    if (cout) {

        cout.addEventListener(
            "input",
            function() {

                calculerTotalAchats();

            }
        );


        cout.addEventListener(
            "focus",
            function() {

                const valeur =
                    cout.value
                        .replace(/\s/g, "")
                        .replace("$", "")
                        .replace(",", ".");


                cout.value = valeur;

                cout.select();

            }
        );


        cout.addEventListener(
            "blur",
            function() {

                if (cout.value.trim() !== "") {

                    const montant =
                        parseFloat(
                            cout.value
                                .replace(/\s/g, "")
                                .replace("$", "")
                                .replace(",", ".")
                        ) || 0;


                    cout.value =
                        montant
                            .toFixed(2)
                            .replace(".", ",") + " $";

                }


                calculerTotalAchats();

            }
        );

    }

}


/* ================================
   CALCUL DU TOTAL DES ACHATS
================================ */

function calculerTotalAchats() {

    let total = 0;


    document
        .querySelectorAll(
            ".ligne-achat"
        )
        .forEach(
            function(achat) {

                const numero =
                    achat.dataset.numero;


                const cout =
                    document.getElementById(
                        "coutAchat" + numero
                    );


                if (cout) {

                    total +=
                        montantEnNombre(
                            cout.value
                        );

                }

            }
        );


    const totalAchats =
        document.getElementById(
            "totalAchats"
        );


    if (totalAchats) {

        totalAchats.textContent =
            afficherMontant(total);

    }

}


/* ================================
   BOUTON AJOUTER UN ACHAT
================================ */

document
    .getElementById("boutonAjouterAchats")
    .addEventListener(
        "click",
        function() {

            ajouterAchat();

        }
    );


/* ================================
   CRÉER LE PREMIER ACHAT
================================ */

ajouterAchat();

/* ================================
   PIÈCES JUSTIFICATIVES
================================ */

const inputPieces =
    document.getElementById(
        "piecesJustificatives"
    );


const listePieces =
    document.getElementById(
        "listePiecesJustificatives"
    );


const entetePieces =
    document.getElementById(
        "entetePiecesJustificatives"
    );

const messageAucunePiece =
    document.createElement("div");

messageAucunePiece.className =
    "message-aucune-piece";

messageAucunePiece.textContent =
    "Aucune pièce justificative ajoutée. Vous devez joindre au moins une pièce justificative à chaque achat pour envoyer le formulaire.";

listePieces.appendChild(
    messageAucunePiece
);


/*
    ACHAT ASSOCIÉ AU PROCHAIN AJOUT
*/

let numeroAchatPourPieces = null;


/*
    OUVRIR LE SÉLECTEUR DE FICHIERS
*/

function ouvrirAjoutPieces(numero) {

    numeroAchatPourPieces =
        String(numero);

    inputPieces.value = "";

    setTimeout(
	function() {

    	    inputPieces.click();

	},
	0
    );

}


/*
    AJOUTER LES FICHIERS
*/

inputPieces.addEventListener(
    "change",
    function() {

        const numeroAchat =
            numeroAchatPourPieces;


        if (!numeroAchat) {

            return;

        }


        /*
            RÉCUPÉRER LES FICHIERS EXISTANTS
        */

        let tousLesFichiers = [];


        if (
            inputPieces._fichiersSelectionnes &&
            inputPieces._fichiersSelectionnes.length > 0
        ) {

            tousLesFichiers =
                inputPieces._fichiersSelectionnes.slice();

        }


        /*
            AJOUTER LES NOUVEAUX FICHIERS
        */

        Array
            .from(inputPieces.files)
            .forEach(
                function(fichier) {

                    const dejaPresent =
                        tousLesFichiers.some(
                            function(
                                fichierExistant
                            ) {

                                return (
                                    fichierExistant.name === fichier.name &&
                                    fichierExistant.size === fichier.size &&
                                    fichierExistant.lastModified === fichier.lastModified
                                );

                            }
                        );


                    if (!dejaPresent) {

                        tousLesFichiers.push(
                            {
                                fichier: fichier,
                                numeroAchat: numeroAchat
                            }
                        );

                    }

                }
            );


        /*
            MÉMORISER LES FICHIERS
        */

        inputPieces._fichiersSelectionnes =
            tousLesFichiers;


        /*
            RECONSTRUIRE L'INPUT RÉEL
        */

        const transfert =
            new DataTransfer();


        tousLesFichiers.forEach(
            function(element) {

                transfert.items.add(
                    element.fichier
                );

            }
        );


        inputPieces.files =
            transfert.files;


        /*
            AFFICHER L'EN-TÊTE
        */

        if (entetePieces) {

            entetePieces.style.display =
                tousLesFichiers.length > 0
                    ? "grid"
                    : "none";

        }

if (messageAucunePiece) {
    messageAucunePiece.style.display =
        tousLesFichiers.length > 0
            ? "none"
            : "block";
}


        /*
            AJOUTER UNIQUEMENT LES NOUVELLES LIGNES
        */

        Array
            .from(inputPieces.files)
            .forEach(
                function(fichierActuel, index) {

                    const elementFichier =
                        tousLesFichiers[index];


                    /*
                        VÉRIFIER SI LA LIGNE EXISTE DÉJÀ
                    */

                    const dejaAffiche =
                        Array
                            .from(
                                listePieces.querySelectorAll(
                                    ".nom-piece"
                                )
                            )
                            .some(
                                function(element) {

                                    return (
                                        element.textContent ===
                                        fichierActuel.name
                                    );

                                }
                            );


                    if (dejaAffiche) {

                        return;

                    }


                    /*
                        CRÉER LA LIGNE
                    */

                    const ligne =
                        document.createElement(
                            "div"
                        );


                    ligne.className =
                        "piece-justificative";


                    ligne.dataset.numeroAchat =
                        elementFichier.numeroAchat;


                    /*
                        NOM DU FICHIER
                    */

                    const nomFichier =
                        document.createElement(
                            "span"
                        );


                    nomFichier.className =
                        "nom-piece";


                    nomFichier.textContent =
                        fichierActuel.name;


                    /*
                        ACHAT ASSOCIÉ
                    */

                    const achatAssocie =
                        document.createElement(
                            "span"
                        );


                    achatAssocie.className =
                        "achat-piece";


                    achatAssocie.textContent =
                        "Achat " +
                        elementFichier.numeroAchat;


                    /*
                        BOUTON SUPPRIMER
                    */

                    const boutonSupprimer =
                        document.createElement(
                            "button"
                        );


                    boutonSupprimer.type =
                        "button";


                    boutonSupprimer.className =
                        "bouton-supprimer-piece";


                    boutonSupprimer.textContent =
                        "🗑️";


                    boutonSupprimer.title =
                        "Supprimer cette pièce";


                    boutonSupprimer.addEventListener(
                        "click",
                        function() {

                            /*
                                RETIRER LE FICHIER
                                DE LA LISTE INTERNE
                            */

                            tousLesFichiers =
                                tousLesFichiers.filter(
                                    function(
                                        element
                                    ) {

                                        return (
                                            element.fichier !==
                                            fichierActuel
                                        );

                                    }
                                );


                            inputPieces._fichiersSelectionnes =
                                tousLesFichiers;


                            /*
                                RECONSTRUIRE L'INPUT
                            */

                            const nouveauTransfert =
                                new DataTransfer();


                            tousLesFichiers.forEach(
                                function(element) {

                                    nouveauTransfert
                                        .items
                                        .add(
                                            element.fichier
                                        );

                                }
                            );


                            inputPieces.files =
                                nouveauTransfert.files;


                            /*
                                RETIRER LA LIGNE
                            */

                            ligne.remove();


                            /*
                                ACTUALISER LES COMPTEURS
                            */

                            mettreAJourNombrePieces();


                            /*
                                MASQUER L'EN-TÊTE
                                S'IL N'Y A PLUS DE PIÈCES
                            */

                            if (
                                entetePieces &&
                                tousLesFichiers.length === 0
                            ) {

                                entetePieces.style.display =
                                    "none";

                            }

if (messageAucunePiece) {
    messageAucunePiece.style.display =
        tousLesFichiers.length === 0
            ? "block"
            : "none";
}

                        }
                    );


                    /*
                        AJOUTER LES ÉLÉMENTS
                    */

                    ligne.appendChild(
                        nomFichier
                    );


                    ligne.appendChild(
                        achatAssocie
                    );


                    ligne.appendChild(
                        boutonSupprimer
                    );


                    listePieces.appendChild(
                        ligne
                    );

                }
            );


        /*
            ACTUALISER LES COMPTEURS
        */

        mettreAJourNombrePieces();

    }
);


/* ================================
   METTRE À JOUR LE NOMBRE
   DE PIÈCES PAR ACHAT
================================ */

function mettreAJourNombrePieces() {

    /*
        REMETTRE TOUS LES COMPTEURS À 0
    */

document
    .querySelectorAll(".nombre-pieces")
    .forEach(
        function(compteur) {

            compteur.textContent = "0";
            compteur.style.color = "#c62828";

        }
    );


    /*
        COMPTER LES PIÈCES
    */

    document
        .querySelectorAll(
            ".piece-justificative"
        )
        .forEach(
            function(piece) {

                const numero =
                    piece.dataset.numeroAchat;


                const compteur =
                    document.getElementById(
                        "nombrePieces" +
                        numero
                    );


if (compteur) {

    const nombre =
        parseInt(
            compteur.textContent,
            10
        ) + 1;

    compteur.textContent =
        String(nombre);

    compteur.style.color =
        nombre > 0
            ? "#2f8f5b"
            : "#c62828";
}

            }
        );

}

/* ================================
   GÉNÉRATION DU PDF
================================ */

async function genererPDF() {

    /* ================================
       OUTILS
    ================================ */

    function obtenirValeur(id) {

        const element =
            document.getElementById(id);

        return element
            ? element.value || ""
            : "";
    }


    function formaterDate(dateString) {

        if (!dateString) {
            return "";
        }

        const date =
            new Date(
                dateString + "T00:00:00"
            );

        return date.toLocaleDateString(
            "fr-CA",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
    }


    function formaterDateCourte(dateString) {

        if (!dateString) {
            return "";
        }

        const date =
            new Date(
                dateString + "T00:00:00"
            );

        return date.toLocaleDateString(
            "fr-CA",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    }


    function valeurOuTiret(valeur) {

        if (
            valeur === "" ||
            valeur === null ||
            valeur === undefined
        ) {
            return "—";
        }

        return valeur;
    }


    /* ================================
       INFORMATIONS GÉNÉRALES
    ================================ */

    const nom =
        obtenirValeur("nom");

    const adresse =
        obtenirValeur("adresse");

    const courriel =
        obtenirValeur("courriel");

    const justification =
        obtenirValeur(
            "justificationAdditionnelle"
        );


    const totalAchats =
        document.getElementById(
            "totalAchats"
        )?.textContent || "0,00 $";


    /* ================================
       ACHATS
    ================================ */

    const achats =
        document.querySelectorAll(
            ".ligne-achat"
        );


    /* ================================
       PIÈCES JUSTIFICATIVES
    ================================ */

    const pieces =
        document.querySelectorAll(
            "#listePiecesJustificatives .piece-justificative"
        );


    /* ================================
       CRÉER LE CONTENEUR PDF
    ================================ */

    const conteneurPDF =
        document.createElement("div");

    conteneurPDF.style.position =
        "absolute";

    conteneurPDF.style.left =
        "-10000px";

    conteneurPDF.style.top =
        "0";

    conteneurPDF.style.width =
        "760px";

    conteneurPDF.style.backgroundColor =
        "white";

    conteneurPDF.style.fontFamily =
        "Arial, sans-serif";

    conteneurPDF.style.color =
        "#354352";

    document.body.appendChild(
        conteneurPDF
    );


    /* ================================
       CRÉATION D'UNE PAGE
    ================================ */

    function creerPagePDF(
        numeroPage
    ) {

        const page =
            document.createElement("div");

        page.style.width =
            "760px";

        page.style.minHeight =
            "1000px";

        page.style.boxSizing =
            "border-box";

        page.style.padding =
            "18px 20px";

        page.style.backgroundColor =
            "white";

	page.style.display = "flex";

	page.style.flexDirection = "column";


        /* ================================
           TITRE
        ================================ */

        const titre =
            document.createElement("div");

        titre.style.backgroundColor =
            "#354352";

        titre.style.color =
            "white";

        titre.style.padding =
            "8px 12px";

        titre.style.fontSize =
            "18px";

        titre.style.fontWeight =
            "700";

        titre.style.marginBottom =
            "8px";

        titre.textContent =
            "FORMULAIRE DE DEMANDE DE REMBOURSEMENT";

        page.appendChild(
            titre
        );


        /* ================================
           IDENTIFICATION
        ================================ */

        const identification =
            document.createElement("table");

        identification.style.width =
            "100%";

        identification.style.borderCollapse =
            "collapse";

        identification.style.fontSize =
            "11px";

        identification.style.color =
            "#202a33";

        identification.style.marginBottom =
            "8px";


        const dateRapport =
            new Date()
                .toISOString()
                .slice(0, 10);


        identification.innerHTML = `

            <tr>

                <td
                    style="
                        width:16%;
                        border:1px solid #bfc7ce;
                        background:#eef1f3;
                        font-weight:bold;
                        padding:4px;
                    "
                >
                    Nom
                </td>

                <td
                    style="
                        width:34%;
                        border:1px solid #bfc7ce;
                        padding:4px;
                    "
                >
                    ${valeurOuTiret(nom)}
                </td>

                <td
                    style="
                        width:16%;
                        border:1px solid #bfc7ce;
                        background:#eef1f3;
                        font-weight:bold;
                        padding:4px;
                    "
                >
                    Date du rapport
                </td>

                <td
                    style="
                        width:34%;
                        border:1px solid #bfc7ce;
                        padding:4px;
                    "
                >
                    ${formaterDate(dateRapport)}
                </td>

            </tr>

            <tr>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        background:#eef1f3;
                        font-weight:bold;
                        padding:4px;
                    "
                >
                    Adresse
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        padding:4px;
                    "
                >
                    ${valeurOuTiret(adresse)}
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        background:#eef1f3;
                        font-weight:bold;
                        padding:4px;
                    "
                >
                    Courriel
                </td>

                <td
                    style="
                        border:1px solid #bfc7ce;
                        padding:4px;
                    "
                >
                    ${valeurOuTiret(courriel)}
                </td>

            </tr>

        `;

        page.appendChild(
            identification
        );


        /* ================================
           TABLEAU DES ACHATS
        ================================ */

        const titreAchats =
            document.createElement("div");

        titreAchats.textContent =
            "ACHATS";

        titreAchats.style.backgroundColor =
            "#354352";

        titreAchats.style.color =
            "white";

        titreAchats.style.fontWeight =
            "700";

        titreAchats.style.fontSize =
            "11px";

        titreAchats.style.padding =
            "4px 6px";

        page.appendChild(
            titreAchats
        );


        const tableauAchats =
            document.createElement("table");

        tableauAchats.style.width =
            "100%";

        tableauAchats.style.borderCollapse =
            "collapse";

        tableauAchats.style.tableLayout =
            "fixed";

        tableauAchats.style.fontSize =
            "10px";

        tableauAchats.style.color =
            "#202a33";


        tableauAchats.innerHTML = `

            <tr
                style="
                    background:#eef1f3;
                    font-weight:bold;
                    text-align:center;
                "
            >

                <td
                    style="
                        width:7%;
                        border:1px solid #9faab3;
                        padding:3px;
                    "
                >
                    Item
                </td>

                <td
                    style="
                        width:17%;
                        border:1px solid #9faab3;
                        padding:3px;
                    "
                >
                    Date
                </td>

                <td
                    style="
                        width:56%;
                        border:1px solid #9faab3;
                        padding:3px;
                    "
                >
                    Description de l'achat
                </td>

                <td
                    style="
                        width:20%;
                        border:1px solid #9faab3;
                        padding:3px;
                    "
                >
                    Coût
                </td>

            </tr>

        `;


        achats.forEach(
            function(achat) {

                const numero =
                    achat.dataset.numero;

                const date =
                    document.getElementById(
                        "dateAchat" + numero
                    )?.value || "";

                const description =
                    document.getElementById(
                        "descriptionAchat" + numero
                    )?.value || "";

                const cout =
                    document.getElementById(
                        "coutAchat" + numero
                    )?.value || "";


                const ligne =
                    document.createElement("tr");


                ligne.innerHTML = `

                    <td
                        style="
                            border:1px solid #bfc7ce;
                            text-align:center;
                            padding:3px;
                        "
                    >
                        ${numero}
                    </td>

                    <td
                        style="
                            border:1px solid #bfc7ce;
                            text-align:center;
                            padding:3px;
                        "
                    >
                        ${formaterDateCourte(date)}
                    </td>

                    <td
                        style="
                            border:1px solid #bfc7ce;
                            padding:3px;
                            word-wrap:break-word;
                        "
                    >
                        ${valeurOuTiret(description)}
                    </td>

                    <td
                        style="
                            border:1px solid #bfc7ce;
                            text-align:right;
                            padding:3px;
                        "
                    >
                        ${valeurOuTiret(cout)}
                    </td>

                `;

                tableauAchats.appendChild(
                    ligne
                );
            }
        );


        /* ================================
           TOTAL DES ACHATS
        ================================ */

        const ligneTotal =
            document.createElement("tr");


        ligneTotal.innerHTML = `

            <td
                colspan="3"
                style="
                    border:1px solid #bfc7ce;
                    padding:4px;
                    text-align:right;
                    font-weight:bold;
                "
            >
                TOTAL DES ACHATS
            </td>

            <td
                style="
                    border:2px solid #354352;
                    padding:4px;
                    text-align:right;
                    font-weight:bold;
                    background:#dfe5e9;
                "
            >
                ${totalAchats}
            </td>

        `;

        tableauAchats.appendChild(
            ligneTotal
        );


        page.appendChild(
            tableauAchats
        );


        /* ================================
           JUSTIFICATIONS ADDITIONNELLES
        ================================ */

        if (
            justification.trim() !== ""
        ) {

            const titreJustification =
                document.createElement("div");

            titreJustification.textContent =
                "JUSTIFICATIONS ADDITIONNELLES";

            titreJustification.style.backgroundColor =
                "#354352";

            titreJustification.style.color =
                "white";

            titreJustification.style.fontWeight =
                "700";

            titreJustification.style.fontSize =
                "11px";

            titreJustification.style.padding =
                "4px 6px";

            titreJustification.style.marginTop =
                "8px";

            page.appendChild(
                titreJustification
            );


            const tableauJustification =
                document.createElement("table");

            tableauJustification.style.width =
                "100%";

            tableauJustification.style.borderCollapse =
                "collapse";

            tableauJustification.style.fontSize =
                "10px";

            tableauJustification.style.color =
                "#202a33";


            tableauJustification.innerHTML = `

                <tr>

                    <td
                        style="
                            border:1px solid #bfc7ce;
                            padding:5px;
                            white-space:pre-line;
                            word-wrap:break-word;
                        "
                    >
                        ${valeurOuTiret(justification)}
                    </td>

                </tr>

            `;


            page.appendChild(
                tableauJustification
            );
        }


        /* ================================
           PIÈCES JUSTIFICATIVES
        ================================ */

        if (
            pieces.length > 0
        ) {

            const titrePieces =
                document.createElement("div");

            titrePieces.textContent =
                "PIÈCES JUSTIFICATIVES";

            titrePieces.style.backgroundColor =
                "#354352";

            titrePieces.style.color =
                "white";

            titrePieces.style.fontWeight =
                "700";

            titrePieces.style.fontSize =
                "11px";

            titrePieces.style.padding =
                "4px 6px";

            titrePieces.style.marginTop =
                "8px";

            page.appendChild(
                titrePieces
            );


            const tableauPieces =
                document.createElement("table");

            tableauPieces.style.width =
                "100%";

            tableauPieces.style.borderCollapse =
                "collapse";

            tableauPieces.style.tableLayout =
                "fixed";

            tableauPieces.style.fontSize =
                "10px";

            tableauPieces.style.color =
                "#202a33";


            tableauPieces.innerHTML = `

                <tr
                    style="
                        background:#eef1f3;
                        font-weight:bold;
                    "
                >

                    <td
                        style="
                            width:70%;
                            border:1px solid #9faab3;
                            padding:3px;
                        "
                    >
                        Fichier
                    </td>

                    <td
                        style="
                            width:30%;
                            border:1px solid #9faab3;
                            padding:3px;
                        "
                    >
                        Achat
                    </td>

                </tr>

            `;


            pieces.forEach(
                function(piece) {

                    const nomFichier =
                        piece.querySelector(
                            ".nom-piece"
                        )?.textContent || "";

                    const achat =
                        piece.querySelector(
                            ".achat-piece"
                        )?.textContent || "";


                    const ligne =
                        document.createElement("tr");


                    ligne.innerHTML = `

                        <td
                            style="
                                border:1px solid #bfc7ce;
                                padding:3px;
                                word-wrap:break-word;
                            "
                        >
                            ${valeurOuTiret(nomFichier)}
                        </td>

                        <td
                            style="
                                border:1px solid #bfc7ce;
                                padding:3px;
                            "
                        >
                            ${valeurOuTiret(achat)}
                        </td>

                    `;


                    tableauPieces.appendChild(
                        ligne
                    );
                }
            );


            page.appendChild(
                tableauPieces
            );
        }

const administration = document.createElement("div");
administration.style.marginTop = "auto";

	    /* ================================
               RÉSERVÉ À L'ADMINISTRATION
            ================================ */

            const titreAdministration =
                document.createElement("div");

            titreAdministration.textContent =
                "RÉSERVÉ À L’ADMINISTRATION";

            titreAdministration.style.backgroundColor =
                "#354352";

            titreAdministration.style.color =
                "white";

            titreAdministration.style.fontWeight =
                "700";

            titreAdministration.style.fontSize =
                "11px";

            titreAdministration.style.padding =
                "4px 6px";

            titreAdministration.style.marginTop =
                "8px";

            administration.appendChild(
                titreAdministration
            );


            const tableauAdministration =
                document.createElement("table");

            tableauAdministration.style.width =
                "100%";

            tableauAdministration.style.borderCollapse =
                "collapse";

            tableauAdministration.style.tableLayout =
                "fixed";

            tableauAdministration.style.fontSize =
                "10px";

            tableauAdministration.innerHTML = `

                <tr
                    style="
                        background:#eef1f3;
                        font-weight:bold;
                    "
                >

                    <td
                        style="
                            width:66.67%;
                            border:1px solid #9faab3;
                            padding:4px;
                        "
                    >
                        Poste budgétaire
                    </td>

                    <td
                        style="
                            width:33.33%;
                            border:1px solid #9faab3;
                            padding:4px;
                        "
                    >
                        $
                    </td>

                </tr>

                <tr>

                    <td
                        style="
                            height:18px;
                            border:1px solid #bfc7ce;
                        "
                    ></td>

                    <td
                        style="
                            height:18px;
                            border:1px solid #bfc7ce;
                        "
                    ></td>

                </tr>

                <tr>

                    <td
                        style="
                            height:18px;
                            border:1px solid #bfc7ce;
                        "
                    ></td>

                    <td
                        style="
                            height:18px;
                            border:1px solid #bfc7ce;
                        "
                    ></td>

                </tr>

                <tr>

                    <td
                        style="
                            height:18px;
                            border:1px solid #bfc7ce;
                        "
                    ></td>

                    <td
                        style="
                            height:18px;
                            border:1px solid #bfc7ce;
                        "
                    ></td>

                </tr>

                <tr>

                    <td
                        style="
                            height:18px;
                            border:1px solid #bfc7ce;
                        "
                    ></td>

                    <td
                        style="
                            height:18px;
                            border:1px solid #bfc7ce;
                        "
                    ></td>

                </tr>

                <tr>

                    <td
                        style="
                            border:1px solid #bfc7ce;
                            padding:5px;
                        "
                    >
                        <strong>Autorisé par :</strong>
                    </td>

                    <td
                        style="
                            border:1px solid #bfc7ce;
                            padding:5px;
                        "
                    >
                        <strong>Date</strong>
                    </td>

                </tr>

            `;


            administration.appendChild(
                tableauAdministration
            );

	    page.appendChild(administration);


        /* ================================
           NUMÉRO DE PAGE
        ================================ */

        const pied =
            document.createElement("div");

        pied.style.textAlign =
            "right";

        pied.style.fontSize =
            "8px";

        pied.style.color =
            "#777";

        pied.style.marginTop =
            "5px";

        pied.textContent =
            "Page " +
            numeroPage;

        page.appendChild(
            pied
        );


        return page;
    }


    /* ================================
       CRÉER LA PAGE
    ================================ */

    const pagePDF =
        creerPagePDF(
            1
        );


    conteneurPDF.appendChild(
        pagePDF
    );


    /* ================================
       CRÉATION DU PDF
    ================================ */

    const {
        jsPDF
    } = window.jspdf;


    const pdf =
        new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "letter"
        });


    const largeurPage =
        pdf.internal.pageSize.getWidth();

    const hauteurPage =
        pdf.internal.pageSize.getHeight();


    const pages =
        conteneurPDF.children;


    for (
        let i = 0;
        i < pages.length;
        i++
    ) {

        const page =
            pages[i];


        const canvas =
            await html2canvas(
                page,
                {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#ffffff"
                }
            );


        const marge =
            8;

        const largeurDisponible =
            largeurPage -
            marge * 2;

        const hauteurDisponible =
            hauteurPage -
            marge * 2;


        const ratioLargeur =
            largeurDisponible /
            canvas.width;

        const ratioHauteur =
            hauteurDisponible /
            canvas.height;


        const ratio =
            Math.min(
                ratioLargeur,
                ratioHauteur
            );


        const largeurImage =
            canvas.width *
            ratio;

        const hauteurImage =
            canvas.height *
            ratio;


        const positionX =
            (
                largeurPage -
                largeurImage
            ) / 2;


        const positionY =
            (
                hauteurPage -
                hauteurImage
            ) / 2;


        if (i > 0) {
            pdf.addPage();
        }


        pdf.addImage(
            canvas.toDataURL(
                "image/jpeg",
                0.95
            ),
            "JPEG",
            positionX,
            positionY,
            largeurImage,
            hauteurImage
        );
    }


    /* ================================
       NETTOYAGE
    ================================ */

    document.body.removeChild(
        conteneurPDF
    );


    return pdf;
}

/* ================================
   VALIDATION DU FORMULAIRE
================================ */

function formulaireEstValide() {

    const nom =
        document.getElementById("nom");

    const courriel =
        document.getElementById("courriel");

    const adresse =
        document.getElementById("adresse");


    /*
        VÉRIFIER LES CHAMPS OBLIGATOIRES
    */

    if (
        !nom ||
        nom.value.trim() === "" ||
        !courriel ||
        courriel.value.trim() === "" ||
        !adresse ||
        adresse.value.trim() === ""
    ) {

        return false;

    }


    /*
        VÉRIFIER LES PIÈCES DE CHAQUE ACHAT
    */

    const achats =
        document.querySelectorAll(
            ".ligne-achat"
        );


    for (
        let i = 0;
        i < achats.length;
        i++
    ) {

        const achat =
            achats[i];

        const numero =
            achat.dataset.numero;


        const compteur =
            document.getElementById(
                "nombrePieces" + numero
            );


        const nombrePieces =
            compteur
                ? parseInt(
                    compteur.textContent,
                    10
                ) || 0
                : 0;


        if (nombrePieces === 0) {

            return false;

        }

    }


    return true;

}

/* ================================
   ACTIVER / DÉSACTIVER LES BOUTONS
================================ */

function mettreAJourBoutonsAction() {

    const boutons = [
        document.getElementById("boutonGenererPDF"),
        document.getElementById("boutonEnvoyerCourriel"),
        document.getElementById("boutonImprimer")
    ];


    const valide =
        formulaireEstValide();


    boutons.forEach(
        function(bouton) {

            if (bouton) {

                bouton.disabled =
                    !valide;

            }

        }
    );

}

mettreAJourBoutonsAction();

/* ================================
   SURVEILLER LE FORMULAIRE
================================ */

document.addEventListener(
    "input",
    function(e) {

        if (
            e.target.matches(
                "#nom, #courriel, #adresse, .ligne-achat input"
            )
        ) {

            mettreAJourBoutonsAction();

        }

    }
);


document.addEventListener(
    "change",
    function(e) {

        if (
            e.target.matches(
                "#nom, #courriel, #adresse, .ligne-achat input, #piecesJustificatives"
            )
        ) {

            mettreAJourBoutonsAction();

        }

    }
);

/* ================================
   BOUTON ENREGISTRER EN PDF
================================ */

document
    .getElementById("boutonGenererPDF")
    .addEventListener(
        "click",
        async function() {

            const pdf =
                await genererPDF();

            if (!pdf) {
                return;
            }

            pdf.save(
                "Formulaire_de_demande_de_remboursement.pdf"
            );

        }
    );

/* ================================
   BOUTON IMPRIMER
================================ */

document.getElementById(
    "boutonImprimer"
)
.addEventListener(
    "click",
    async function() {

        const pdf =
            await genererPDF();

        if (!pdf) {
            return;
        }

        const fichierPDF =
            pdf.output("blob");

        const url =
            URL.createObjectURL(
                fichierPDF
            );

        const fenetre =
            window.open(
                url,
                "_blank"
            );

        if (fenetre) {

            fenetre.onload =
                function() {

                    fenetre.print();

                };

        }

    }
);

/* ================================
   BOUTON RÉINITIALISER
================================ */

document.getElementById(
    "boutonReinitialiser"
)
.addEventListener(
    "click",
    function() {

        /* ================================
           RÉINITIALISER LES CHAMPS
        ================================ */

        const champs =
            document.querySelectorAll(
                "input, textarea, select"
            );

        champs.forEach(
            function(champ) {

                if (
                    champ.type === "checkbox" ||
                    champ.type === "radio"
                ) {

                    champ.checked = false;

                } else if (
                    champ.type !== "file"
                ) {

                    champ.value = "";

                }

            }
        );

        /* ================================
           CONSERVER UNE SEULE LIGNE D'ACHAT
        ================================ */

        const lignesAchats =
            document.querySelectorAll(
                ".ligne-achat"
            );

        lignesAchats.forEach(
            function(ligne, index) {

                if (index > 0) {

                    ligne.remove();

                }

            }
        );


        numeroAchat = 1;


        /* ================================
           RÉINITIALISER LES PIÈCES
        ================================ */

        const pieces =
            document.getElementById(
                "piecesJustificatives"
            );

        if (pieces) {

            pieces.value = "";

            pieces._fichiersSelectionnes = [];

        }


        const listePieces =
            document.getElementById(
                "listePiecesJustificatives"
            );

        if (listePieces) {

            listePieces
                .querySelectorAll(
                    ".piece-justificative"
                )
                .forEach(
                    function(piece) {

                        piece.remove();

                    }
                );

        }


        const entetePieces =
            document.getElementById(
                "entetePiecesJustificatives"
            );

        if (entetePieces) {

            entetePieces.style.display =
                "none";

        }


        if (messageAucunePiece) {

            messageAucunePiece.style.display =
                "block";

        }


        /* ================================
           RÉINITIALISER LES COMPTEURS
        ================================ */

        mettreAJourNombrePieces();


        /* ================================
           RÉINITIALISER LES COMPTEURS
        ================================ */

        document
            .querySelectorAll(
                ".nombre-pieces"
            )
            .forEach(
                function(compteur) {

                    compteur.textContent =
                        "0";

                    compteur.style.color =
                        "#c62828";

                }
            );


        /* ================================
           RÉINITIALISER LE TOTAL
        ================================ */

        const totalAchats =
            document.getElementById(
                "totalAchats"
            );

        if (totalAchats) {

            totalAchats.textContent =
                "0,00 $";

        }

mettreAJourBoutonsAction();

    }
);