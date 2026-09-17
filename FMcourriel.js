// ============================================================
// GESTION DU COURRIEL
// ============================================================

const parametresCourriel = {

    destinataireInterne: "info@sehcn.com",

    objet: "Rapport de dépenses — [Nom] — [DateRapport]",

    texte: `Bonjour Marie,

Voici mon rapport de dépenses concernant des achats effectués.

Les pièces justificatives requises sont jointes à ce courriel.

Merci,

[Nom]`

};


// ============================================================
// ADRESSE POWER AUTOMATE
// ============================================================

const adressePowerAutomate = "https://rapport-deplacements.xavier-37f.workers.dev";


// ============================================================
// REMPLACEMENT DES CODES
// ============================================================

function remplacerCodesCourriel() {

    const nom = 
	document.getElementById("nom").value.trim();

    const dateRapport =
	new Date().toLocaleDateString("fr-CA");

    const totalAchats =
	document.getElementById("totalAchats").textContent.trim();


    let objet =
	parametresCourriel.objet;

    let texte =
	parametresCourriel.texte;


    objet =
	objet.replace(
	    /\[Nom\]/g,
	    nom
	);

    objet =
	objet.replace(
	    /\[DateRapport\]/g,
	    dateRapport
	);

    texte =
	texte.replace(
	    /\[Nom\]/g,
	    nom
	);

    texte =
	texte.replace(
	    /\[DateRapport\]/g,
	    dateRapport
	);

    texte =
	texte.replace(
	    /\[TotalAchats\]/g,
	    totalAchats
	);

    return {

	destinataire:
	    document.getElementById("courriel").value.trim(),

	objet:
	    objet,

	texte:
	    texte

    };

}


// ============================================================
// CONVERSION D'UN FICHIER EN BASE64
// ============================================================

function fichierEnBase64(fichier) {

    return new Promise(
        function(resolve, reject) {

            const lecteur =
                new FileReader();

            lecteur.onload =
                function() {

                    const resultat =
                        lecteur.result;

                    const base64 =
                        resultat.split(",")[1];

                    resolve(base64);

                };

            lecteur.onerror =
                function() {

                    reject(
                        lecteur.error
                    );

                };

            lecteur.readAsDataURL(fichier);

        }
    );

}


// ============================================================
// PRÉPARATION DES PIÈCES JUSTIFICATIVES
// ============================================================

async function preparerPiecesJustificatives() {

    const pieces =
	[];

    const lignesPieces =
	document.querySelectorAll(
	    ".piece-justificative"
	);


    for (
	let i = 0;
	i < lignesPieces.length;
	i++
    ) {

	const ligne =
	    lignesPieces[i];

	const nom =
	    ligne.querySelector(
		".nom-piece"
	    ).textContent.trim();

	const fichiers =
	    document.getElementById(
		"piecesJustificatives"
	    ).files;

	let fichierCorrespondant =
	    null;

	for (
	    let j = 0;
	    j < fichiers.length;
	    j++
	) {
		
		if (
		    fichiers[j].name === nom
		) {

		    fichierCorrespondant =
			fichiers[j];

		    break;

		}

	    }

	    if (!fichierCorrespondant) {
		continue;
	    }

	    const contenu =
		await fichierEnBase64(
		    fichierCorrespondant
		);

	    pieces.push({

		nom:
		    fichierCorrespondant.name,

		type:
		    fichierCorrespondant.type,

		contenu:
		    contenu

	    });
	}

	return pieces;

    }


// ============================================================
// ENVOI DU RAPPORT
// ============================================================

function demanderConfirmationEnvoi() {

    return new Promise(function(resolve) {

        const fenetre =
            document.getElementById("fenetreConfirmation");

        const boutonAnnuler =
            document.getElementById(
                "boutonAnnulerConfirmation"
            );

        const boutonConfirmer =
            document.getElementById(
                "boutonConfirmerEnvoi"
            );

        fenetre.style.display = "flex";

        function fermerConfirmation(resultat) {

            fenetre.style.display = "none";

            boutonAnnuler.removeEventListener(
                "click",
                annuler
            );

            boutonConfirmer.removeEventListener(
                "click",
                confirmer
            );

            resolve(resultat);
        }

        function annuler() {

            fermerConfirmation(false);

        }

        function confirmer() {

            fermerConfirmation(true);

        }

        boutonAnnuler.addEventListener(
            "click",
            annuler
        );

        boutonConfirmer.addEventListener(
            "click",
            confirmer
        );

    });

}

function afficherSuccesEnvoi() {

    const fenetre =
        document.getElementById("fenetreSucces");

    fenetre.style.display = "flex";

}

document.getElementById(
    "boutonFermerSucces"
)
.addEventListener(
    "click",
    function() {

        document.getElementById(
            "fenetreSucces"
        ).style.display = "none";

    }
);

async function envoyerRapportParCourriel() {

    if (!adressePowerAutomate) {

	alert(
	    "L'envoi par courriel n'est pas encore configuré!"
	);

	return;

    }

    const confirmation =
        await demanderConfirmationEnvoi();

    if (!confirmation) {
        return;
    }


    const parametres =
        remplacerCodesCourriel();


    const pdf =
        await genererPDF();


    if (!pdf) {
        return;
    }


    const pdfBase64 =
        pdf.output("datauristring")
            .split(",")[1];


    const pieces =
        await preparerPiecesJustificatives();


    const donnees = {

        destinataireInterne:
            parametresCourriel.destinataireInterne,

        destinataire:
            parametres.destinataire,

        objet:
            parametres.objet,

        texte:
            parametres.texte,

        pdf: {

            nom:
                "Formulaire_de_demande_de_remboursement.pdf",

            type:
                "application/pdf",

            contenu:
                pdfBase64

        },

        piecesJustificatives:
            pieces

    };


    try {

        const reponse =
            await fetch(
                adressePowerAutomate,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            donnees
                        )

                }
            );


        if (!reponse.ok) {

            throw new Error(
                "Erreur lors de l'envoi."
            );

        }


        afficherSuccesEnvoi();


    }
    catch (erreur) {

        console.error(
            erreur
        );

        alert(
            "Une erreur est survenue lors de l'envoi de la demande de remboursement."
        );

    }

}


// ============================================================
// BOUTON « ENVOYER PAR COURRIEL »
// ============================================================

document.getElementById(
    "boutonEnvoyerCourriel"
)
.addEventListener(
    "click",
    envoyerRapportParCourriel
);