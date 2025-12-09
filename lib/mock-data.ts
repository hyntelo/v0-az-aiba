export const demoBrief = {
  campaignData: {
    projectName: "Trattamento Iperkaliemia con Lokelma",
    brand: "Lokelma",
    therapeuticArea: "Cardiologia",
    expectedLaunchDate: "2025-12-31",
    specialty: "Cardiology",
    requestSummary:
      "Campagna educativa per evidenziare i benefici di Lokelma",
    channels: ["emailMarketing", "printMaterials"],
    additionalContext:
      "",
    attachments: [],
    communicationPersonalityId: "scientific-communication",
    targetAudiencePresetId: "datadriven-clinician",
  },
  generatedContent: {
    objectives:
      "Aumentare la consapevolezza degli oncologi sulla rilevanza del biomarcatori (MMRd/non-MMRd, p53abn, NSMP, POLEmut) nella scelta terapeutica e sul ruolo delle combinazioni terapeutiche Indicate dalle linee guida ESGO-ESTRO-ESP 2025. La campagna supporta una corretta identificazione dei pazienti per cui le linee guida prevedono l'integrazione di immunoterapia e, nei protocolli selezionati, l'impiego di PARP inibitori come parte delle strategie di mantenimento.",
    keyMessages: {
      emailMarketing: [
        {
          id: "km-1-email",
          tag: "EFFICACY",
          description: "Le linee guida 2025 prevedono, in pazienti selezionati, mantenimento con immunoterapia e PARP inibitori per migliorare il controllo di malattia.",
        },
        {
          id: "km-2-email",
          tag: "AWARENESS",
          description: "La classificazione molecolare guida le scelte terapeutiche e identifica i pazienti candidabili a strategie Integrate, incluse combinazioni con PARP inibitori.",
        },
      ],
      printMaterials: [
        {
          id: "km-1-print",
          tag: "EFFICACY",
          description: "Le linee guida 2025 prevedono, in pazienti selezionati, mantenimento con immunoterapia e PARP inibitori per migliorare il controllo di malattia.",
        },
        {
          id: "km-2-print",
          tag: "AWARENESS",
          description: "La classificazione molecolare guida le scelte terapeutiche e identifica i pazienti candidabili a strategie Integrate, incluse combinazioni con PARP inibitori.",
        },
      ],
    },
    toneOfVoice: {
      emailMarketing:
        "Scientifico, basato sui dati e clinicamente focalizzato. Linguaggio obiettivo che fa riferimento a risultati evidence-based e allineamento alle linee guida. Adatto per comunicazioni email dirette agli operatori sanitari.",
      printMaterials:
        "Scientifico, basato sui dati e clinicamente focalizzato. Linguaggio obiettivo che fa riferimento a risultati evidence-based e allineamento alle linee guida. Formato strutturato per materiali stampati con riferimenti completi.",
    },
    complianceNotes: {
      emailMarketing:
        "Materiale destinato esclusivamente agli operatori sanitari. Deve essere conforme alle normative pubblicitarie AIFA e al processi di revisione interna dell'azienda. Includere le caratteristiche del prodotto e il riferimento al Riassunto delle Caratteristiche del Prodotto (RCP) di Lynparza. Assicurarsi che tutte le affermazioni siano supportate da evidenze peer-reviewed. Per email: includere disclaimer e link al RCP.",
      printMaterials:
        "Materiale destinato esclusivamente agli operatori sanitari. Deve essere conforme alle normative pubblicitarie AIFA e al processi di revisione interna dell'azienda. Includere le caratteristiche del prodotto e il riferimento al Riassunto delle Caratteristiche del Prodotto (RCP) di Lynparza. Assicurarsi che tutte le affermazioni siano supportate da evidenze peer-reviewed. Per materiali stampati: includere codice magazzino, QR code e wording AIFA completo.",
    },
  },
}

export const demoData = demoBrief.campaignData

export const mockPromptSuggestions: Record<string, string[]> = {
  objectives: ["Aggiungi metriche specifiche", "Specifica il target temporale"],
  keyMessages: ["Aggiungi un key message"],
  toneOfVoice: ["Rendi più autorevole", "Aggiungi focus sul paziente"],
  complianceNotes: ["Cita normative AIFA specifiche", "Aggiungi riferimento RCP"],
}

export const mockBriefAISuggestions: Record<string, string> = {
  objectives:
    "Potresti ancorare le tempistiche al lancio della campagna.",
  keyMessages:
    "Assicurati di avere almeno 2-3 key messages fittanti.",
  toneOfVoice:
    "Ricordati di specificare l'uso di un linguaggio scientifico e sicuro per i cardiologi.",
  complianceNotes:
    "NA",
}

export const mockRegeneratedContent: Record<string, any> = {
  objectives: [
    "Educare cardiologi e nefrologi sui duplici benefici di Lokelma nel mantenimento della normokaliemia e nel consentire la continuazione della terapia RAASi, rafforzando l'aderenza alla gestione dell'iperkaliemia guidata dalle linee guida.",
  ],
  keyMessages: {
    emailMarketing: [
      [
        {
          id: "km-1-email",
          tag: "EFFICACY",
          description: "Lokelma consente il mantenimento o l'up-titration della terapia RAASi nell'87% dei pazienti con iperkaliemia.",
        },
        {
          id: "km-2-email",
          tag: "SAFETY",
          description: "La sospensione o il dosaggio subottimale dei RAASi raddoppia il rischio di mortalità.",
        },
        {
          id: "km-3-email",
          tag: "AWARENESS",
          description: "L'iperkaliemia rimane una barriera importante all'ottimizzazione del trattamento, ora efficacemente gestibile con Lokelma",
        },
      ],
    ],
    printMaterials: [
      [
        {
          id: "km-1-print",
          tag: "EFFICACY",
          description: "Lokelma consente il mantenimento o l'up-titration della terapia RAASi nell'87% dei pazienti con iperkaliemia.",
        },
        {
          id: "km-2-print",
          tag: "SAFETY",
          description: "La sospensione o il dosaggio subottimale dei RAASi raddoppia il rischio di mortalità.",
        },
        {
          id: "km-3-print",
          tag: "AWARENESS",
          description: "L'iperkaliemia rimane una barriera importante all'ottimizzazione del trattamento, ora efficacemente gestibile con Lokelma",
        },
      ],
    ],
  },
  toneOfVoice: {
    emailMarketing: [
      "Autorevole, basato su evidenze e professionale. Il linguaggio deve enfatizzare risultati clinici comprovati e rafforzare la credibilità attraverso i dati, rimanendo accessibile agli operatori sanitari con poco tempo. Per email: tono conciso e diretto.",
    ],
    printMaterials: [
      "Autorevole, basato su evidenze e professionale. Il linguaggio deve enfatizzare risultati clinici comprovati e rafforzare la credibilità attraverso i dati, rimanendo accessibile agli operatori sanitari con poco tempo. Per materiali stampati: tono più formale e dettagliato.",
    ],
  },
  complianceNotes: {
    emailMarketing: [
      "Tutti i materiali devono essere conformi alle normative AIFA per le comunicazioni dirette agli operatori sanitari e includere riferimenti al RCP di Lokelma. Le affermazioni devono rimanere bilanciate e supportate da evidenze. Assicurare la revisione medico-legale interna prima della diffusione. Per email: disclaimer completo nel footer.",
    ],
    printMaterials: [
      "Tutti i materiali devono essere conformi alle normative AIFA per le comunicazioni dirette agli operatori sanitari e includere riferimenti al RCP di Lokelma. Le affermazioni devono rimanere bilanciate e supportate da evidenze. Assicurare la revisione medico-legale interna prima della diffusione. Per materiali stampati: wording AIFA completo e codice magazzino.",
    ],
  },
}

export const existingBriefs = [
  {
    id: "existing-brief-1",
    title: "Campagna Digitale per la Valutazione del Rischio Cardiovascolare",
    campaignData: {
      projectName: "Campagna Digitale per la Valutazione del Rischio Cardiovascolare",
      brand: "Wainzua",
      therapeuticArea: "Cardiologia",
      expectedLaunchDate: "2025-04-15",
      specialty: "Cardiology",
      requestSummary:
        "Iniziativa educativa digitale completa rivolta a cardiologi e medici di base per migliorare i protocolli di valutazione del rischio cardiovascolare e gli esiti dei pazienti attraverso strumenti di screening basati sull'evidenza.",
      channels: ["emailMarketing", "digitalAdvertising", "webinars"],
      additionalContext:
        "Deve includere le ultime linee guida ACC/AHA e garantire che tutti i calcolatori di rischio siano validati. La campagna richiede una revisione medico-legale per gli strumenti di supporto alle decisioni cliniche.",
      attachments: [],
      communicationPersonalityId: "scientific-publication",
      targetAudiencePresetId: "results-driven-manager",
      startingDocuments: [
        {
          id: "doc-1",
          documentId: "IT-762386",
          title: "Linee Guida ACC/AHA 2023 - Valutazione Rischio Cardiovascolare",
          usage: "global-adapt",
          pages: "1-15",
        },
        {
          id: "doc-2",
          documentId: "IT-7657865",
          title: "Calcolatore Rischio Cardiovascolare - Manuale Utente",
          usage: "update",
          pages: "3-8",
        },
      ],
      scientificReferences: [
        {
          id: "ref-001",
          referenceId: "IT-762386",
          title: "Cardiovascular Risk Assessment: A Comprehensive Meta-Analysis",
          authors: "Smith, J. et al.",
          journal: "Journal of Cardiology",
          publicationDate: "2024-01-15",
          claimsCount: 4,
          selectedClaims: ["claim-001-1", "claim-001-2"],
        },
        {
          id: "ref-002",
          referenceId: "IT-7657865",
          title: "Evidence-Based Guidelines for Cardiovascular Risk Management",
          authors: "Johnson, M. et al.",
          journal: "American Heart Journal",
          publicationDate: "2023-11-20",
          claimsCount: 3,
          selectedClaims: ["claim-002-1"],
        },
      ],
      technicalFields: {
        email: {
          vvpmPlaceholderId: "VVPM-CARDIO-001",
          utmCode: "utm_source=email&utm_campaign=cardio_risk&utm_medium=newsletter",
          ctas: [
            { id: "cta-1", name: "Scarica Linee Guida", link: "https://example.com/guidelines" },
            { id: "cta-2", name: "Calcola Rischio", link: "https://example.com/calculator" },
          ],
        },
        digitalAdvertising: {
          vvpmPlaceholderId: "VVPM-CARDIO-AD-001",
          utmCode: "utm_source=adwords&utm_campaign=cardio_risk&utm_medium=cpc",
        },
      },
    },
    generatedContent: {
      objectives:
        "Migliorare le pratiche di valutazione del rischio cardiovascolare tra gli operatori sanitari del 35% entro 4 mesi attraverso educazione digitale mirata e strumenti interattivi di supporto alle decisioni cliniche.",
      keyMessages: {
        emailMarketing: [
          {
            id: "km-1-email",
            tag: "EFFICACY",
            description: "La valutazione del rischio cardiovascolare basata sull'evidenza migliora gli esiti dei pazienti e riduce i costi sanitari a lungo termine.",
          },
          {
            id: "km-2-email",
            tag: "AWARENESS",
            description: "Gli strumenti di screening basati sull'evidenza supportano decisioni cliniche informate e interventi precoci.",
          },
        ],
        digitalAdvertising: [
          {
            id: "km-1-digital",
            tag: "EFFICACY",
            description: "Riduzione del 35% delle complicanze cardiovascolari attraverso screening tempestivo.",
          },
        ],
        webinars: [
          {
            id: "km-1-webinar",
            tag: "EDUCATION",
            description: "Formazione continua su protocolli evidence-based per la valutazione del rischio cardiovascolare.",
          },
        ],
      },
      toneOfVoice: {
        emailMarketing: "Clinico, autorevole, basato sull'evidenza con focus sull'implementazione pratica",
        digitalAdvertising: "Professionale, diretto, orientato ai risultati",
        webinars: "Educativo, interattivo, supportivo per l'apprendimento continuo",
      },
      complianceNotes: {
        emailMarketing:
          "Tutte le raccomandazioni cliniche devono allinearsi con le attuali linee guida ACC/AHA. Gli strumenti di valutazione del rischio richiedono studi di validazione e disclaimer appropriati.",
        digitalAdvertising:
          "Conformità alle normative pubblicitarie AIFA. Tutti i claim devono essere supportati da evidenze scientifiche pubblicate.",
        webinars:
          "Materiale formativo ECM. Richiede accreditamento e revisione medico-scientifica prima della pubblicazione.",
      },
    },
    assets: [],
    references: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: "completato" as const,
    lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    lastSavedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    statusHistory: [
      {
        id: "status-1",
        briefId: "existing-brief-1",
        fromStatus: null,
        toStatus: "draft" as const,
        changedBy: "Sarah Chen",
        changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        comment: "Bozza iniziale creata",
      },
      {
        id: "status-2",
        briefId: "existing-brief-1",
        fromStatus: "draft" as const,
        toStatus: "ai-reviewed" as const,
        changedBy: "AI Review System",
        changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        comment:
          "Revisione AI completata - il contenuto soddisfa gli standard di marketing farmaceutico e i requisiti di conformità",
      },
      {
        id: "status-2b",
        briefId: "existing-brief-1",
        fromStatus: "ai-reviewed" as const,
        toStatus: "completato" as const,
        changedBy: "Sarah Chen",
        changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        comment: "Brief completato dall'utente",
      },
    ],
    isReadOnly: true,
  },
  {
    id: "existing-brief-2",
    title: "Serie Educativa per Pazienti sulla Gestione del Diabete",
    campaignData: {
      projectName: "Serie Educativa per Pazienti sulla Gestione del Diabete",
      brand: "Wainzua",
      therapeuticArea: "Endocrinologia",
      expectedLaunchDate: "2025-03-30",
      specialty: "Endocrinology",
      requestSummary:
        "Campagna educativa multicanale per pazienti focalizzata sull'autogestione del diabete di tipo 2, modifiche dello stile di vita e aderenza alla terapia per migliorare gli esiti dei pazienti e ridurre l'utilizzo delle risorse sanitarie.",
      channels: ["socialMedia", "emailMarketing", "printMaterials"],
      additionalContext:
        "Il contenuto deve essere culturalmente sensibile e disponibile in italiano e inglese. Tutti i consigli medici devono indirizzare i pazienti a consultare gli operatori sanitari. Richiede conformità alle linee guida ADA.",
      attachments: [],
      communicationPersonalityId: "marketing",
      targetAudiencePresetId: "practical-parent",
      startingDocuments: [
        {
          id: "doc-3",
          documentId: "IT-7891234",
          title: "Linee Guida ADA 2024 - Gestione Diabete Tipo 2",
          usage: "global-adapt",
          pages: "1-20",
        },
        {
          id: "doc-4",
          documentId: "IT-7895678",
          title: "Materiali Educativi Pazienti - Diabete",
          usage: "inspiration",
          pages: "5-12",
        },
      ],
      scientificReferences: [
        {
          id: "ref-003",
          referenceId: "IT-7891234",
          title: "Diabetes Self-Management: Evidence-Based Strategies for Type 2 Diabetes",
          authors: "Garcia, M.L. et al.",
          journal: "Diabetes Care",
          publicationDate: "2023-09-10",
          claimsCount: 5,
          selectedClaims: ["claim-003-1", "claim-003-2"],
        },
        {
          id: "ref-004",
          referenceId: "IT-7895678",
          title: "Lifestyle Interventions in Type 2 Diabetes: A Systematic Review",
          authors: "Lee, S.H. et al.",
          journal: "Journal of Clinical Endocrinology",
          publicationDate: "2024-02-05",
          claimsCount: 4,
          selectedClaims: ["claim-004-1"],
        },
      ],
      technicalFields: {
        email: {
          vvpmPlaceholderId: "VVPM-DIAB-001",
          utmCode: "utm_source=email&utm_campaign=diabetes_edu&utm_medium=newsletter",
          ctas: [
            { id: "cta-3", name: "Scarica Guida", link: "https://example.com/diabetes-guide" },
            { id: "cta-4", name: "Registrati al Programma", link: "https://example.com/register" },
          ],
        },
        printMaterials: {
          warehouseCode: "WH-DIAB-2024-001",
          qrCodeLink: "https://example.com/diabetes-resources",
          rcp: "RCP-DIAB-001",
          aifaWording: "Materiale informativo destinato ai pazienti. Consultare sempre il medico per informazioni complete.",
        },
      },
    },
    generatedContent: {
      objectives:
        "Migliorare i comportamenti di autogestione dei pazienti con diabete di tipo 2 del 50% entro 6 mesi attraverso contenuti educativi completi e strumenti di supporto, ottenendo un migliore controllo glicemico e riduzione delle complicanze.",
      keyMessages: {
        socialMedia: [
          {
            id: "km-1-social",
            tag: "AWARENESS",
            description: "L'autogestione efficace del diabete attraverso modifiche dello stile di vita consente ai pazienti di vivere vite più sane.",
          },
          {
            id: "km-2-social",
            tag: "SUPPORT",
            description: "Non sei solo nella gestione del diabete. Scopri risorse e supporto per il tuo percorso.",
          },
        ],
        emailMarketing: [
          {
            id: "km-1-email-diab",
            tag: "EDUCATION",
            description: "Aderenza alla terapia e monitoraggio regolare sono fondamentali per prevenire complicanze.",
          },
          {
            id: "km-2-email-diab",
            tag: "LIFESTYLE",
            description: "Piccole modifiche allo stile di vita possono fare una grande differenza nel controllo glicemico.",
          },
        ],
        printMaterials: [
          {
            id: "km-1-print-diab",
            tag: "EDUCATION",
            description: "Guida completa all'autogestione del diabete: alimentazione, esercizio e monitoraggio.",
          },
        ],
      },
      toneOfVoice: {
        socialMedia: "Supportivo, incoraggiante, accessibile, empatico con enfasi sull'empowerment",
        emailMarketing: "Educativo, supportivo, chiaro e diretto per facilitare la comprensione",
        printMaterials: "Completo, strutturato, accessibile con focus su praticità e chiarezza",
      },
      complianceNotes: {
        socialMedia:
          "Tutti i contenuti devono essere conformi alle linee guida ADA. I consigli medici devono essere generali e indirizzare i pazienti agli operatori sanitari.",
        emailMarketing:
          "Contenuti bilingue richiedono revisione di adattamento culturale. Includere sempre disclaimer medico.",
        printMaterials:
          "Materiale informativo pazienti. Deve includere wording AIFA completo e riferimento al RCP.",
      },
    },
    assets: [],
    references: [],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    status: "draft" as const,
    lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastSavedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    statusHistory: [
      {
        id: "status-3",
        briefId: "existing-brief-2",
        fromStatus: null,
        toStatus: "draft" as const,
        changedBy: "Sarah Chen",
        changedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        comment: "Bozza iniziale creata",
      },
    ],
    isReadOnly: false,
  },
  {
    id: "existing-brief-3",
    title: "Materiali per Conferenza Professionale sulla Salute Respiratoria",
    campaignData: {
      projectName: "Materiali per Conferenza Professionale sulla Salute Respiratoria",
      brand: "Wainzua",
      therapeuticArea: "Malattie Respiratorie",
      expectedLaunchDate: "2025-02-28",
      specialty: "Respiratory",
      requestSummary:
        "Presentazione completa per conferenza e materiali educativi per il Summit Annuale di Medicina Respiratoria, focalizzati su approcci terapeutici innovativi per condizioni respiratorie croniche e ultimi risultati della ricerca clinica.",
      channels: ["medicalConferences", "printMaterials", "digitalAdvertising"],
      additionalContext:
        "La presentazione deve includere dati peer-reviewed da studi clinici di fase III. Tutti i materiali richiedono revisione medico-scientifica e conformità alle linee guida di presentazione della conferenza. Budget approvato per spazio stand premium.",
      attachments: [],
      communicationPersonalityId: "awareness",
      targetAudiencePresetId: "traditional-elder",
      startingDocuments: [
        {
          id: "doc-5",
          documentId: "IT-7901234",
          title: "Abstract Conferenza - Terapie Respiratorie Innovative",
          usage: "global-adapt",
          pages: "1-5",
        },
        {
          id: "doc-6",
          documentId: "IT-7905678",
          title: "Poster Scientifico - Studi Fase III",
          usage: "inspiration",
          pages: "1-2",
        },
      ],
      scientificReferences: [
        {
          id: "ref-005",
          referenceId: "IT-7901234",
          title: "Novel Therapeutic Approaches in Chronic Respiratory Conditions: Phase III Clinical Trial Results",
          authors: "Kumar, A. et al.",
          journal: "Respiratory Medicine",
          publicationDate: "2024-03-20",
          claimsCount: 6,
          selectedClaims: ["claim-005-1", "claim-005-2", "claim-005-3"],
        },
        {
          id: "ref-006",
          referenceId: "IT-7905678",
          title: "Long-term Outcomes in Chronic Obstructive Pulmonary Disease: A 5-Year Follow-up Study",
          authors: "Singh, R.P. et al.",
          journal: "European Respiratory Journal",
          publicationDate: "2023-12-15",
          claimsCount: 4,
          selectedClaims: ["claim-006-1"],
        },
      ],
      technicalFields: {
        printMaterials: {
          warehouseCode: "WH-RESP-2024-001",
          qrCodeLink: "https://example.com/respiratory-resources",
          rcp: "RCP-RESP-001",
          aifaWording: "Materiale scientifico destinato esclusivamente agli operatori sanitari. Dati da studi clinici peer-reviewed.",
        },
        digitalAdvertising: {
          vvpmPlaceholderId: "VVPM-RESP-AD-001",
          utmCode: "utm_source=adwords&utm_campaign=respiratory_conf&utm_medium=cpc",
        },
      },
    },
    generatedContent: {
      objectives:
        "Stabilire leadership di pensiero in medicina respiratoria presentando ricerca all'avanguardia a oltre 500 specialisti respiratori, generando oltre 25 lead qualificati e rafforzando le relazioni con i key opinion leader del settore.",
      keyMessages: {
        medicalConferences: [
          {
            id: "km-1-conf",
            tag: "INNOVATION",
            description: "Approcci terapeutici respiratori rivoluzionari supportati da solide evidenze cliniche dimostrano miglioramenti significativi negli esiti dei pazienti.",
          },
          {
            id: "km-2-conf",
            tag: "EFFICACY",
            description: "Risultati di studi di fase III mostrano miglioramenti nella qualità della vita per condizioni respiratorie croniche.",
          },
        ],
        printMaterials: [
          {
            id: "km-1-print-resp",
            tag: "EVIDENCE",
            description: "Dati peer-reviewed da studi clinici multicentrici supportano l'efficacia e sicurezza del trattamento.",
          },
        ],
        digitalAdvertising: [
          {
            id: "km-1-digital-resp",
            tag: "LEADERSHIP",
            description: "Scopri le ultime innovazioni in medicina respiratoria al Summit Annuale.",
          },
        ],
      },
      toneOfVoice: {
        medicalConferences: "Scientifico, autorevole, innovativo con enfasi sull'evidenza clinica e l'eccellenza della ricerca",
        printMaterials: "Rigoroso, dettagliato, basato su evidenze scientifiche pubblicate",
        digitalAdvertising: "Professionale, orientato ai risultati, evidenziando l'innovazione scientifica",
      },
      complianceNotes: {
        medicalConferences:
          "Tutte le presentazioni di dati devono includere fonti peer-reviewed e analisi statistiche appropriate. Richiede revisione medico-scientifica.",
        printMaterials:
          "Materiali per conferenze richiedono aderenza agli standard di presentazione del settore. Includere wording AIFA completo.",
        digitalAdvertising:
          "Conformità alle normative pubblicitarie. Tutti i claim devono essere supportati da evidenze scientifiche.",
      },
    },
    assets: [],
    references: [],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    status: "completato" as const,
    lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastSavedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    statusHistory: [
      {
        id: "status-6",
        briefId: "existing-brief-3",
        fromStatus: null,
        toStatus: "draft" as const,
        changedBy: "Sarah Chen",
        changedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        comment: "Bozza iniziale creata",
      },
      {
        id: "status-7",
        briefId: "existing-brief-3",
        fromStatus: "draft" as const,
        toStatus: "ai-reviewed" as const,
        changedBy: "AI Review System",
        changedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        comment:
          "Revisione AI completata - il contenuto dimostra un'eccellente presentazione dei dati clinici e soddisfa tutti i requisiti di conformità",
      },
      {
        id: "status-7b",
        briefId: "existing-brief-3",
        fromStatus: "ai-reviewed" as const,
        toStatus: "completato" as const,
        changedBy: "Sarah Chen",
        changedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        comment: "Brief completato dall'utente",
      },
    ],
    isReadOnly: true,
  },
  {
    id: "existing-brief-4",
    title: "Campagna di Awareness per Terapia Oncologica Innovativa",
    campaignData: {
      projectName: "Campagna di Awareness per Terapia Oncologica Innovativa",
      brand: "Wainzua",
      therapeuticArea: "Oncologia",
      expectedLaunchDate: "2025-06-30",
      specialty: "Oncology",
      requestSummary:
        "Iniziativa educativa per aumentare la consapevolezza tra oncologi e ematologi su una nuova terapia target per tumori solidi, evidenziando i benefici in termini di sopravvivenza e qualità della vita.",
      channels: ["medicalConferences", "digitalAdvertising", "webinars"],
      additionalContext:
        "La campagna deve rispettare le normative EMA e includere dati di sicurezza aggiornati. Richiede revisione medico-legale completa prima della pubblicazione.",
      attachments: [],
      communicationPersonalityId: "scientific-publication",
      targetAudiencePresetId: "results-driven-manager",
      startingDocuments: [
        {
          id: "doc-7",
          documentId: "IT-7911234",
          title: "RCP - Terapia Target Oncologica",
          usage: "global-adapt",
          pages: "1-30",
        },
        {
          id: "doc-8",
          documentId: "IT-7915678",
          title: "Dati di Sicurezza Aggiornati - Studi Clinici",
          usage: "update",
          pages: "10-25",
        },
      ],
      scientificReferences: [
        {
          id: "ref-007",
          referenceId: "IT-7911234",
          title: "Targeted Therapy in Advanced Solid Tumors: Efficacy and Safety Analysis",
          authors: "Johnson, M.D. et al.",
          journal: "Journal of Clinical Oncology",
          publicationDate: "2024-04-10",
          claimsCount: 7,
          selectedClaims: ["claim-007-1", "claim-007-2", "claim-007-3"],
        },
        {
          id: "ref-008",
          referenceId: "IT-7915678",
          title: "Predictors of Response to Targeted Therapy: A Comprehensive Meta-Analysis",
          authors: "Chen, L. et al.",
          journal: "Nature Medicine",
          publicationDate: "2024-01-25",
          claimsCount: 5,
          selectedClaims: ["claim-008-1", "claim-008-2"],
        },
      ],
      technicalFields: {
        digitalAdvertising: {
          vvpmPlaceholderId: "VVPM-ONCO-AD-001",
          utmCode: "utm_source=adwords&utm_campaign=oncology_target&utm_medium=cpc",
        },
        webinars: {
          vvpmPlaceholderId: "VVPM-ONCO-WEB-001",
          utmCode: "utm_source=webinar&utm_campaign=oncology_edu&utm_medium=registration",
        },
      },
    },
    generatedContent: {
      objectives:
        "Aumentare la consapevolezza tra gli oncologi del 40% entro 6 mesi attraverso educazione mirata, generando oltre 50 lead qualificati e migliorando la comprensione dei meccanismi d'azione della terapia.",
      keyMessages: {
        medicalConferences: [
          {
            id: "km-1-conf-onco",
            tag: "INNOVATION",
            description: "La terapia target rappresenta un avanzamento significativo nel trattamento oncologico, dimostrando miglioramenti nella sopravvivenza globale.",
          },
          {
            id: "km-2-conf-onco",
            tag: "EFFICACY",
            description: "Miglioramenti significativi nella qualità della vita dei pazienti con tumori avanzati supportati da evidenze cliniche robuste.",
          },
        ],
        digitalAdvertising: [
          {
            id: "km-1-digital-onco",
            tag: "AWARENESS",
            description: "Scopri le ultime innovazioni in terapia target per tumori solidi. Partecipa ai nostri eventi formativi.",
          },
        ],
        webinars: [
          {
            id: "km-1-webinar-onco",
            tag: "EDUCATION",
            description: "Approfondisci i meccanismi d'azione e i criteri di selezione dei pazienti per la terapia target.",
          },
        ],
      },
      toneOfVoice: {
        medicalConferences: "Scientifico, rigoroso, basato sull'evidenza con focus sui risultati clinici e sulla sicurezza",
        digitalAdvertising: "Professionale, orientato ai risultati, evidenziando l'innovazione scientifica",
        webinars: "Educativo, approfondito, supportivo per la formazione continua degli specialisti",
      },
      complianceNotes: {
        medicalConferences:
          "Tutti i materiali devono essere conformi alle normative EMA e includere dati di sicurezza completi. Le affermazioni devono essere supportate da studi clinici peer-reviewed pubblicati.",
        digitalAdvertising:
          "Conformità alle normative pubblicitarie EMA. Includere sempre disclaimer medico e riferimento al RCP.",
        webinars:
          "Materiale formativo ECM. Richiede revisione medico-legale completa prima della pubblicazione.",
      },
    },
    assets: [],
    references: [],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: "ai-reviewed" as const,
    lastModified: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    lastSavedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    statusHistory: [
      {
        id: "status-8",
        briefId: "existing-brief-4",
        fromStatus: null,
        toStatus: "draft" as const,
        changedBy: "John Smith",
        changedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        comment: "Bozza iniziale creata",
      },
      {
        id: "status-9",
        briefId: "existing-brief-4",
        fromStatus: "draft" as const,
        toStatus: "ai-reviewed" as const,
        changedBy: "AI Review System",
        changedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        comment:
          "Revisione AI completata - contenuto scientifico accurato e conforme alle normative",
      },
    ],
    isReadOnly: true,
  },
  {
    id: "existing-brief-5",
    title: "Programma Educativo per Pazienti con Malattie Rare",
    campaignData: {
      projectName: "Programma Educativo per Pazienti con Malattie Rare",
      brand: "Wainzua",
      therapeuticArea: "Malattie Rare",
      expectedLaunchDate: "2025-05-15",
      specialty: "Rare Diseases",
      requestSummary:
        "Iniziativa multicanale per supportare pazienti e caregiver nella gestione di malattie rare, fornendo risorse educative, supporto emotivo e informazioni su terapie disponibili.",
      channels: ["socialMedia", "emailMarketing", "printMaterials", "webinars"],
      additionalContext:
        "Il contenuto deve essere accessibile, empatico e culturalmente sensibile. Richiede traduzione in multiple lingue e adattamento per diverse comunità.",
      attachments: [],
      communicationPersonalityId: "marketing",
      targetAudiencePresetId: "practical-parent",
      startingDocuments: [
        {
          id: "doc-9",
          documentId: "IT-7921234",
          title: "Guida Pazienti - Malattie Rare",
          usage: "global-adapt",
          pages: "1-40",
        },
        {
          id: "doc-10",
          documentId: "IT-7925678",
          title: "Risorse Supporto - Comunità Malattie Rare",
          usage: "inspiration",
          pages: "1-15",
        },
      ],
      scientificReferences: [
        {
          id: "ref-009",
          referenceId: "IT-7921234",
          title: "Patient-Centered Care in Rare Diseases: Improving Quality of Life Through Education and Support",
          authors: "Roberts, C.D. et al.",
          journal: "Journal of Rare Diseases",
          publicationDate: "2023-11-30",
          claimsCount: 4,
          selectedClaims: ["claim-009-1"],
        },
        {
          id: "ref-010",
          referenceId: "IT-7925678",
          title: "Therapeutic Adherence in Rare Disease Patients: A Multicenter Study",
          authors: "Martinez, A.F. et al.",
          journal: "Rare Disease Research",
          publicationDate: "2024-02-18",
          claimsCount: 3,
          selectedClaims: ["claim-010-1", "claim-010-2"],
        },
      ],
      technicalFields: {
        email: {
          vvpmPlaceholderId: "VVPM-RARE-001",
          utmCode: "utm_source=email&utm_campaign=rare_diseases&utm_medium=newsletter",
          ctas: [
            { id: "cta-5", name: "Unisciti alla Comunità", link: "https://example.com/community" },
            { id: "cta-6", name: "Scarica Risorse", link: "https://example.com/resources" },
          ],
        },
        printMaterials: {
          warehouseCode: "WH-RARE-2024-001",
          qrCodeLink: "https://example.com/rare-diseases-support",
          rcp: "RCP-RARE-001",
          aifaWording: "Materiale informativo destinato ai pazienti e caregiver. Consultare sempre il medico specialista per informazioni complete.",
        },
        webinars: {
          vvpmPlaceholderId: "VVPM-RARE-WEB-001",
          utmCode: "utm_source=webinar&utm_campaign=rare_diseases&utm_medium=registration",
        },
      },
    },
    generatedContent: {
      objectives:
        "Migliorare la qualità della vita dei pazienti con malattie rare del 30% entro 8 mesi attraverso educazione e supporto, aumentando l'aderenza terapeutica e riducendo l'isolamento sociale.",
      keyMessages: {
        socialMedia: [
          {
            id: "km-1-social-rare",
            tag: "SUPPORT",
            description: "I pazienti con malattie rare non sono soli. Scopri risorse e una comunità che ti supporta.",
          },
          {
            id: "km-2-social-rare",
            tag: "HOPE",
            description: "Con le giuste risorse e informazioni, puoi gestire meglio la tua condizione e vivere una vita piena.",
          },
        ],
        emailMarketing: [
          {
            id: "km-1-email-rare",
            tag: "EDUCATION",
            description: "Informazioni complete e aggiornate per pazienti e caregiver su gestione e supporto.",
          },
          {
            id: "km-2-email-rare",
            tag: "COMMUNITY",
            description: "Unisciti a una comunità di supporto che comprende le tue sfide e celebra i tuoi successi.",
          },
        ],
        printMaterials: [
          {
            id: "km-1-print-rare",
            tag: "RESOURCES",
            description: "Guida completa con risorse pratiche per la gestione quotidiana delle malattie rare.",
          },
        ],
        webinars: [
          {
            id: "km-1-webinar-rare",
            tag: "EDUCATION",
            description: "Eventi formativi dedicati a pazienti e caregiver con esperti del settore.",
          },
        ],
      },
      toneOfVoice: {
        socialMedia: "Empatico, supportivo, incoraggiante, accessibile con enfasi sulla speranza e sul supporto della comunità",
        emailMarketing: "Caloroso, informativo, supportivo, chiaro e accessibile",
        printMaterials: "Completo, strutturato, empatico con focus su praticità e supporto",
        webinars: "Educativo, interattivo, supportivo per pazienti e caregiver",
      },
      complianceNotes: {
        socialMedia:
          "Tutti i contenuti devono essere conformi alle linee guida per comunicazioni ai pazienti. I consigli medici devono essere generali.",
        emailMarketing:
          "Contenuti multilingue richiedono revisione di adattamento culturale. Includere sempre disclaimer medico.",
        printMaterials:
          "Materiale informativo pazienti. Deve includere wording AIFA completo e riferimento al RCP.",
        webinars:
          "Eventi formativi per pazienti. Richiede revisione medico-scientifica e conformità alle normative.",
      },
    },
    assets: [],
    references: [],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    status: "draft" as const,
    lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    lastSavedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    statusHistory: [
      {
        id: "status-10",
        briefId: "existing-brief-5",
        fromStatus: null,
        toStatus: "draft" as const,
        changedBy: "Maria Rossi",
        changedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        comment: "Bozza iniziale creata",
      },
    ],
    isReadOnly: false,
  },
  {
    id: "existing-brief-6",
    title: "Materiali per Formazione Medici di Base su Gestione del Dolore",
    campaignData: {
      projectName: "Materiali per Formazione Medici di Base su Gestione del Dolore",
      brand: "Wainzua",
      therapeuticArea: "Neurologia",
      expectedLaunchDate: "2025-07-20",
      specialty: "Pain Management",
      requestSummary:
        "Programma formativo completo per medici di base e specialisti sulla gestione del dolore cronico, includendo protocolli evidence-based e approcci terapeutici multidisciplinari.",
      channels: ["medicalConferences", "printMaterials", "webinars"],
      additionalContext:
        "Il programma deve allinearsi con le linee guida nazionali per la gestione del dolore e includere casi clinici pratici. Richiede accreditamento ECM.",
      attachments: [],
      communicationPersonalityId: "scientific-publication",
      targetAudiencePresetId: "results-driven-manager",
      startingDocuments: [
        {
          id: "doc-11",
          documentId: "IT-7931234",
          title: "Linee Guida Nazionali - Gestione Dolore Cronico",
          usage: "global-adapt",
          pages: "1-35",
        },
        {
          id: "doc-12",
          documentId: "IT-7935678",
          title: "Casi Clinici - Gestione Dolore Multidisciplinare",
          usage: "inspiration",
          pages: "1-20",
        },
      ],
      scientificReferences: [
        {
          id: "ref-011",
          referenceId: "IT-7931234",
          title: "Multidisciplinary Approach to Chronic Pain Management: Evidence-Based Protocols",
          authors: "Thompson, B.R. et al.",
          journal: "Pain Medicine",
          publicationDate: "2024-01-12",
          claimsCount: 6,
          selectedClaims: ["claim-011-1", "claim-011-2"],
        },
        {
          id: "ref-012",
          referenceId: "IT-7935678",
          title: "Quality of Life Outcomes in Chronic Pain Patients: A Systematic Review",
          authors: "Clark, J.S. et al.",
          journal: "Journal of Pain Research",
          publicationDate: "2023-10-28",
          claimsCount: 4,
          selectedClaims: ["claim-012-1"],
        },
      ],
      technicalFields: {
        printMaterials: {
          warehouseCode: "WH-PAIN-2024-001",
          qrCodeLink: "https://example.com/pain-management-resources",
          rcp: "RCP-PAIN-001",
          aifaWording: "Materiale formativo destinato esclusivamente agli operatori sanitari. Conforme alle linee guida nazionali.",
        },
        webinars: {
          vvpmPlaceholderId: "VVPM-PAIN-WEB-001",
          utmCode: "utm_source=webinar&utm_campaign=pain_management&utm_medium=registration",
        },
      },
    },
    generatedContent: {
      objectives:
        "Migliorare le competenze dei medici di base nella gestione del dolore cronico del 45% entro 6 mesi, aumentando l'uso di protocolli evidence-based e migliorando gli esiti dei pazienti.",
      keyMessages: {
        medicalConferences: [
          {
            id: "km-1-conf-pain",
            tag: "EDUCATION",
            description: "Una gestione efficace del dolore richiede un approccio multidisciplinare e protocolli evidence-based.",
          },
          {
            id: "km-2-conf-pain",
            tag: "OUTCOMES",
            description: "Attenzione alla qualità della vita del paziente, non solo alla riduzione del dolore, migliora gli esiti complessivi.",
          },
        ],
        printMaterials: [
          {
            id: "km-1-print-pain",
            tag: "PROTOCOLS",
            description: "Protocolli evidence-based per la gestione del dolore cronico con casi clinici pratici.",
          },
        ],
        webinars: [
          {
            id: "km-1-webinar-pain",
            tag: "TRAINING",
            description: "Formazione ECM su approcci multidisciplinari alla gestione del dolore cronico.",
          },
        ],
      },
      toneOfVoice: {
        medicalConferences: "Educativo, pratico, basato sull'evidenza con focus sull'applicazione clinica e sugli esiti dei pazienti",
        printMaterials: "Strutturato, dettagliato, orientato alla pratica clinica quotidiana",
        webinars: "Interattivo, formativo, supportivo per l'apprendimento continuo",
      },
      complianceNotes: {
        medicalConferences:
          "Tutti i materiali formativi devono essere conformi alle linee guida nazionali e internazionali per la gestione del dolore.",
        printMaterials:
          "Richiede revisione medico-scientifica e accreditamento ECM. Includere wording AIFA completo.",
        webinars:
          "Eventi formativi ECM. Richiede accreditamento e conformità alle normative nazionali.",
      },
    },
    assets: [],
    references: [],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    status: "ai-reviewed" as const,
    lastModified: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    lastSavedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    statusHistory: [
      {
        id: "status-11",
        briefId: "existing-brief-6",
        fromStatus: null,
        toStatus: "draft" as const,
        changedBy: "David Brown",
        changedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        comment: "Bozza iniziale creata",
      },
      {
        id: "status-12",
        briefId: "existing-brief-6",
        fromStatus: "draft" as const,
        toStatus: "ai-reviewed" as const,
        changedBy: "AI Review System",
        changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        comment:
          "Revisione AI completata - materiale formativo completo e conforme alle linee guida",
      },
    ],
    isReadOnly: true,
  },
  {
    id: "existing-brief-duplicated-1",
    title: "Campagna Digitale per la Valutazione del Rischio Cardiovascolare (Copia)",
    campaignData: {
      projectName: "Campagna Digitale per la Valutazione del Rischio Cardiovascolare (Copia)",
      brand: "Wainzua",
      therapeuticArea: "Cardiologia",
      expectedLaunchDate: "2025-04-15",
      specialty: "Cardiology",
      requestSummary:
        "Iniziativa educativa digitale completa rivolta a cardiologi e medici di base per migliorare i protocolli di valutazione del rischio cardiovascolare e gli esiti dei pazienti attraverso strumenti di screening basati sull'evidenza.",
      channels: ["emailMarketing", "digitalAdvertising", "webinars"],
      additionalContext:
        "Deve includere le ultime linee guida ACC/AHA e garantire che tutti i calcolatori di rischio siano validati. La campagna richiede una revisione medico-legale per gli strumenti di supporto alle decisioni cliniche.",
      attachments: [],
      communicationPersonalityId: "scientific-publication",
      targetAudiencePresetId: "results-driven-manager",
      startingDocuments: [
        {
          id: "doc-1",
          documentId: "IT-762386",
          title: "Linee Guida ACC/AHA 2023 - Valutazione Rischio Cardiovascolare",
          usage: "global-adapt",
          pages: "1-15",
        },
        {
          id: "doc-2",
          documentId: "IT-7657865",
          title: "Calcolatore Rischio Cardiovascolare - Manuale Utente",
          usage: "update",
          pages: "3-8",
        },
      ],
      scientificReferences: [
        {
          id: "ref-001",
          referenceId: "IT-762386",
          title: "Cardiovascular Risk Assessment: A Comprehensive Meta-Analysis",
          authors: "Smith, J. et al.",
          journal: "Journal of Cardiology",
          publicationDate: "2024-01-15",
          claimsCount: 4,
          selectedClaims: ["claim-001-1", "claim-001-2"],
        },
        {
          id: "ref-002",
          referenceId: "IT-7657865",
          title: "Evidence-Based Guidelines for Cardiovascular Risk Management",
          authors: "Johnson, M. et al.",
          journal: "American Heart Journal",
          publicationDate: "2023-11-20",
          claimsCount: 3,
          selectedClaims: ["claim-002-1"],
        },
      ],
      validatedReferences: [], // Empty array to trigger warning
      technicalFields: {
        email: {
          vvpmPlaceholderId: "VVPM-CARDIO-001",
          utmCode: "utm_source=email&utm_campaign=cardio_risk&utm_medium=newsletter",
          ctas: [
            { id: "cta-1", name: "Scarica Linee Guida", link: "https://example.com/guidelines" },
            { id: "cta-2", name: "Calcola Rischio", link: "https://example.com/calculator" },
          ],
        },
        digitalAdvertising: {
          vvpmPlaceholderId: "VVPM-CARDIO-AD-001",
          utmCode: "utm_source=adwords&utm_campaign=cardio_risk&utm_medium=cpc",
        },
      },
    },
    generatedContent: {
      objectives:
        "Migliorare le pratiche di valutazione del rischio cardiovascolare tra gli operatori sanitari del 35% entro 4 mesi attraverso educazione digitale mirata e strumenti interattivi di supporto alle decisioni cliniche.",
      keyMessages: {
        emailMarketing: [
          {
            id: "km-1-email",
            tag: "EFFICACY",
            description: "La valutazione del rischio cardiovascolare basata sull'evidenza migliora gli esiti dei pazienti e riduce i costi sanitari a lungo termine.",
          },
          {
            id: "km-2-email",
            tag: "AWARENESS",
            description: "Gli strumenti di screening basati sull'evidenza supportano decisioni cliniche informate e interventi precoci.",
          },
        ],
        digitalAdvertising: [
          {
            id: "km-1-digital",
            tag: "EFFICACY",
            description: "Riduzione del 35% delle complicanze cardiovascolari attraverso screening tempestivo.",
          },
        ],
        webinars: [
          {
            id: "km-1-webinar",
            tag: "EDUCATION",
            description: "Formazione continua su protocolli evidence-based per la valutazione del rischio cardiovascolare.",
          },
        ],
      },
      toneOfVoice: {
        emailMarketing: "Clinico, autorevole, basato sull'evidenza con focus sull'implementazione pratica",
        digitalAdvertising: "Professionale, diretto, orientato ai risultati",
        webinars: "Educativo, interattivo, supportivo per l'apprendimento continuo",
      },
      complianceNotes: {
        emailMarketing:
          "Tutte le raccomandazioni cliniche devono allinearsi con le attuali linee guida ACC/AHA. Gli strumenti di valutazione del rischio richiedono studi di validazione e disclaimer appropriati.",
        digitalAdvertising:
          "Conformità alle normative pubblicitarie AIFA. Tutti i claim devono essere supportati da evidenze scientifiche pubblicate.",
        webinars:
          "Materiale formativo ECM. Richiede accreditamento e revisione medico-scientifica prima della pubblicazione.",
      },
    },
    assets: [],
    references: [],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "draft" as const,
    lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastSavedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    statusHistory: [
      {
        id: "status-duplicated-1",
        briefId: "existing-brief-duplicated-1",
        fromStatus: null,
        toStatus: "draft" as const,
        changedBy: "Sarah Chen",
        changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        comment: "Brief duplicated",
      },
    ],
    isReadOnly: false,
    duplicatedFromBriefId: "existing-brief-1", // Reference to original brief
  },
]

export const formatCitation = (citation: any): string => {
  const authorsText =
    citation.authors.length > 3 ? `${citation.authors.slice(0, 3).join(", ")} et al.` : citation.authors.join(", ")

  return `${authorsText}. ${citation.title}. ${citation.journal}. ${citation.year}. [${citation.studyType}]`
}

export const mockMedicalCitations = [
  // Lokelma-specific citations at the beginning with high relevance scores
  {
    id: "CIT-LOK-001",
    title: "Sodium Zirconium Cyclosilicate among Individuals with Hyperkalemia: A 12-Month Phase 3 Study",
    authors: ["Spinowitz, B.S.", "et al."],
    journal: "Clinical Journal of the American Society of Nephrology",
    year: 2019,
    studyType: "RCT",
    type: "clinical-study",
    addedAt: new Date(),
    isSelected: true,
    relevanceScore: 95,
  },
  {
    id: "CIT-LOK-002",
    title:
      "Evaluation of the Treatment Gap Between Clinical Guidelines and the Utilization of Renin-Angiotensin-Aldosterone System Inhibitors",
    authors: ["Epstein, M.", "et al."],
    journal: "The American Journal of Managed Care",
    year: 2015,
    studyType: "Systematic Review",
    type: "clinical-study",
    addedAt: new Date(),
    isSelected: true,
    relevanceScore: 90,
  },
  {
    id: "CIT-LOK-003",
    title: "Physician perceptions, attitudes, and strategies towards implementing guideline-directed medical therapy in heart failure with reduced ejection fraction. A survey of the Heart Failure Association of the ESC and the ESC Council for Cardiology Practice",
    authors: ["Savarese, G.", "et al."],
    journal: "European Journal of Heart Failure",
    year: 2024,
    studyType: "Survey Study",
    type: "clinical-study",
    addedAt: new Date(),
    isSelected: true,
    relevanceScore: 88,
  },
  {
    id: "CIT-LOK-004",
    title: "Recommendations for the management of hyperkalemia in patients receiving renin–angiotensin–aldosterone system inhibitors",
    authors: ["De Nicola, L.", "et al."],
    journal: "Internal and Emergency Medicine",
    year: 2023,
    studyType: "Meta-analysis",
    type: "clinical-study",
    addedAt: new Date(),
    isSelected: true,
    relevanceScore: 85,
  },
  {
    id: "CIT-IMMU-001",
    title: "Efficacy and Safety of Novel Immunotherapy in Advanced Solid Tumors",
    authors: ["Johnson, M.D.", "Smith, R.K.", "Williams, A.B."],
    journal: "Journal of Clinical Oncology",
    year: 2024,
    studyType: "RCT",
    type: "clinical-study",
    addedAt: new Date(),
    isSelected: false,
    relevanceScore: 75,
  },
  {
    id: "CIT-IMMU-002",
    title: "Predictors of Response to Immunotherapy in Oncology: A Comprehensive Meta-Analysis",
    authors: ["Chen, L.", "Rodriguez, P.M.", "Thompson, K.J.", "Davis, S.R."],
    journal: "Nature Medicine",
    year: 2024,
    studyType: "Meta-analysis",
    type: "clinical-study",
    addedAt: new Date(),
    isSelected: false,
    relevanceScore: 72,
  },
  {
    id: "CIT-IMMU-003",
    title: "Long-Term Outcomes of Checkpoint Inhibitor Therapy in Patients with Advanced Cancer",
    authors: ["Anderson, T.L.", "Brown, M.K."],
    journal: "The Lancet Oncology",
    year: 2023,
    studyType: "Clinical Trial",
    type: "clinical-study",
    addedAt: new Date(),
    isSelected: false,
    relevanceScore: 70,
  },
  {
    id: "CIT-GEN-001",
    title: "Cardiovascular Risk Assessment in Primary Care: Updated Guidelines",
    authors: ["Miller, J.A.", "Wilson, D.C.", "Taylor, R.M."],
    journal: "American Heart Journal",
    year: 2024,
    studyType: "Systematic Review",
    type: "clinical-study",
    addedAt: new Date(),
    isSelected: false,
    relevanceScore: 85,
  },
  {
    id: "CIT-GEN-002",
    title: "Diabetes Management Strategies: A Randomized Controlled Trial",
    authors: ["Garcia, M.L.", "Lee, S.H.", "Patel, N.K."],
    journal: "Diabetes Care",
    year: 2023,
    studyType: "RCT",
    type: "clinical-study",
    addedAt: new Date(),
    isSelected: false,
    relevanceScore: 82,
  },
  {
    id: "CIT-GEN-003",
    title: "Improving Respiratory Function with Novel Therapeutic Approach",
    authors: ["Kumar, A.", "Singh, R.P.", "Johnson, E.M.", "White, K.L."],
    journal: "Respiratory Medicine",
    year: 2024,
    studyType: "Clinical Trial",
    type: "clinical-study",
    addedAt: new Date(),
    isSelected: false,
    relevanceScore: 80,
  },
  {
    id: "CIT-GEN-004",
    title: "Neurological Disorders: Current Treatment Paradigms and Future Directions",
    authors: ["Roberts, C.D.", "Martinez, A.F."],
    journal: "The Lancet Neurology",
    year: 2023,
    studyType: "Systematic Review",
    type: "clinical-study",
    addedAt: new Date(),
    isSelected: false,
    relevanceScore: 78,
  },
  {
    id: "CIT-GEN-005",
    title: "Management of Infectious Diseases in Hospital Settings: A Multicenter Study",
    authors: ["Thompson, B.R.", "Clark, J.S.", "Adams, M.T."],
    journal: "Clinical Infectious Diseases",
    year: 2024,
    studyType: "Case Study",
    type: "clinical-study",
    addedAt: new Date(),
    isSelected: false,
    relevanceScore: 75,
  },
  {
    id: "CIT-GEN-006",
    title: "Mental Health Interventions: Efficacy and Patient Outcomes",
    authors: ["Davis, L.K.", "Wilson, P.J.", "Brown, S.A.", "Green, T.M."],
    journal: "Journal of Clinical Psychiatry",
    year: 2023,
    studyType: "RCT",
    type: "clinical-study",
    addedAt: new Date(),
    isSelected: false,
    relevanceScore: 72,
  },
  {
    id: "CIT-GEN-007",
    title: "Pediatric Medicine: Safety and Efficacy in Young Populations",
    authors: ["Young, R.L.", "Parker, M.D."],
    journal: "Pediatrics",
    year: 2024,
    studyType: "Meta-analysis",
    type: "clinical-study",
    addedAt: new Date(),
    isSelected: false,
    relevanceScore: 70,
  },
  {
    id: "CIT-GEN-008",
    title: "Optimizing Geriatric Care: Evidence-Based Approaches",
    authors: ["Evans, K.R.", "Murphy, D.L.", "Collins, J.P."],
    journal: "Journal of the American Geriatrics Society",
    year: 2023,
    studyType: "Systematic Review",
    type: "clinical-study",
    addedAt: new Date(),
    isSelected: false,
    relevanceScore: 68,
  },
  {
    id: "CIT-GEN-009",
    title: "Preventive Medicine Strategies: Assessing Impact on Population Health",
    authors: ["Foster, A.M.", "Bell, R.K.", "Hayes, S.J.", "Cooper, L.T."],
    journal: "American Journal of Preventive Medicine",
    year: 2024,
    studyType: "Case Study",
    type: "clinical-study",
    addedAt: new Date(),
    isSelected: false,
    relevanceScore: 65,
  },
]
