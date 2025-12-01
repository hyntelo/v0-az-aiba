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
      "Aumentare la consapevolezza tra cardiologi e nefrologi sui vantaggi clinici di Lokelma nel mantenimento della normokaliemia consentendo la continuazione della terapia RAASi, enfatizzando le evidenze degli studi di fase III.",
    keyMessages: {
      emailMarketing: [
        {
          id: "km-1-email",
          tag: "EFFICACY",
          description: "Lokelma consente il mantenimento o l'up-titration della terapia RAASi nell'87% dei pazienti con iperkaliemia.",
        },
        {
          id: "km-2-email",
          tag: "AWARENESS",
          description: "L'iperkaliemia rimane una barriera importante all'ottimizzazione del trattamento, ora efficacemente gestibile con Lokelma",
        },
      ],
      printMaterials: [
        {
          id: "km-1-print",
          tag: "EFFICACY",
          description: "Lokelma consente il mantenimento o l'up-titration della terapia RAASi nell'87% dei pazienti con iperkaliemia.",
        },
        {
          id: "km-2-print",
          tag: "AWARENESS",
          description: "L'iperkaliemia rimane una barriera importante all'ottimizzazione del trattamento, ora efficacemente gestibile con Lokelma",
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
        "Materiale destinato esclusivamente agli operatori sanitari. Deve essere conforme alle normative pubblicitarie AIFA e ai processi di revisione interna dell'azienda. Includere le caratteristiche del prodotto e il riferimento al Riassunto delle Caratteristiche del Prodotto (RCP) di Lokelma. Assicurarsi che tutte le affermazioni siano supportate da evidenze peer-reviewed. Per email: includere disclaimer e link al RCP.",
      printMaterials:
        "Materiale destinato esclusivamente agli operatori sanitari. Deve essere conforme alle normative pubblicitarie AIFA e ai processi di revisione interna dell'azienda. Includere le caratteristiche del prodotto e il riferimento al Riassunto delle Caratteristiche del Prodotto (RCP) di Lokelma. Assicurarsi che tutte le affermazioni siano supportate da evidenze peer-reviewed. Per materiali stampati: includere codice magazzino, QR code e wording AIFA completo.",
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
      brand: "DiabetesGaurd",
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
    },
    generatedContent: {
      objectives:
        "Migliorare le pratiche di valutazione del rischio cardiovascolare tra gli operatori sanitari del 35% entro 4 mesi attraverso educazione digitale mirata e strumenti interattivi di supporto alle decisioni cliniche.",
      keyMessages:
        "La valutazione del rischio cardiovascolare basata sull'evidenza migliora gli esiti dei pazienti e riduce i costi sanitari a lungo termine attraverso interventi precoci e strategie di trattamento personalizzate.",
      toneOfVoice: "Clinico, autorevole, basato sull'evidenza con focus sull'implementazione pratica",
      complianceNotes:
        "Tutte le raccomandazioni cliniche devono allinearsi con le attuali linee guida ACC/AHA. Gli strumenti di valutazione del rischio richiedono studi di validazione e disclaimer appropriati.",
    },
    assets: [],
    references: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: "ai-reviewed" as const,
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
    ],
    isReadOnly: true,
  },
  {
    id: "existing-brief-2",
    title: "Serie Educativa per Pazienti sulla Gestione del Diabete",
    campaignData: {
      projectName: "Serie Educativa per Pazienti sulla Gestione del Diabete",
      brand: "DiabetesGaurd",
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
    },
    generatedContent: {
      objectives:
        "Migliorare i comportamenti di autogestione dei pazienti con diabete di tipo 2 del 50% entro 6 mesi attraverso contenuti educativi completi e strumenti di supporto, ottenendo un migliore controllo glicemico e riduzione delle complicanze.",
      keyMessages:
        "L'autogestione efficace del diabete attraverso modifiche dello stile di vita, aderenza alla terapia e monitoraggio regolare consente ai pazienti di vivere vite più sane e prevenire complicanze.",
      toneOfVoice: "Supportivo, incoraggiante, accessibile, culturalmente sensibile con enfasi sull'empowerment",
      complianceNotes:
        "Tutti i contenuti devono essere conformi alle linee guida ADA. I consigli medici devono essere generali e indirizzare i pazienti agli operatori sanitari. I contenuti bilingue richiedono una revisione di adattamento culturale.",
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
      brand: "DiabetesGaurd",
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
    },
    generatedContent: {
      objectives:
        "Stabilire leadership di pensiero in medicina respiratoria presentando ricerca all'avanguardia a oltre 500 specialisti respiratori, generando oltre 25 lead qualificati e rafforzando le relazioni con i key opinion leader del settore.",
      keyMessages:
        "Approcci terapeutici respiratori rivoluzionari supportati da solide evidenze cliniche dimostrano miglioramenti significativi negli esiti dei pazienti e nella qualità della vita per condizioni respiratorie croniche.",
      toneOfVoice: "Scientifico, autorevole, innovativo con enfasi sull'evidenza clinica e l'eccellenza della ricerca",
      complianceNotes:
        "Tutte le presentazioni di dati devono includere fonti peer-reviewed e analisi statistiche appropriate. I materiali per conferenze richiedono revisione medico-scientifica e aderenza agli standard di presentazione del settore.",
    },
    assets: [],
    references: [],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    status: "ai-reviewed" as const,
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
    ],
    isReadOnly: true,
  },
  {
    id: "existing-brief-4",
    title: "Campagna di Awareness per Terapia Oncologica Innovativa",
    campaignData: {
      projectName: "Campagna di Awareness per Terapia Oncologica Innovativa",
      brand: "DiabetesGaurd",
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
    },
    generatedContent: {
      objectives:
        "Aumentare la consapevolezza tra gli oncologi del 40% entro 6 mesi attraverso educazione mirata, generando oltre 50 lead qualificati e migliorando la comprensione dei meccanismi d'azione della terapia.",
      keyMessages:
        "La terapia target rappresenta un avanzamento significativo nel trattamento oncologico, dimostrando miglioramenti nella sopravvivenza globale e nella qualità della vita dei pazienti con tumori avanzati.",
      toneOfVoice: "Scientifico, rigoroso, basato sull'evidenza con focus sui risultati clinici e sulla sicurezza",
      complianceNotes:
        "Tutti i materiali devono essere conformi alle normative EMA e includere dati di sicurezza completi. Le affermazioni devono essere supportate da studi clinici peer-reviewed pubblicati.",
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
      brand: "DiabetesGaurd",
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
    },
    generatedContent: {
      objectives:
        "Migliorare la qualità della vita dei pazienti con malattie rare del 30% entro 8 mesi attraverso educazione e supporto, aumentando l'aderenza terapeutica e riducendo l'isolamento sociale.",
      keyMessages:
        "I pazienti con malattie rare non sono soli. Con le giuste risorse, supporto e informazioni, possono gestire meglio la loro condizione e vivere vite più piene.",
      toneOfVoice: "Empatico, supportivo, incoraggiante, accessibile con enfasi sulla speranza e sul supporto della comunità",
      complianceNotes:
        "Tutti i contenuti devono essere conformi alle linee guida per comunicazioni ai pazienti. I consigli medici devono essere generali e indirizzare sempre alla consultazione con operatori sanitari specializzati.",
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
      brand: "DiabetesGaurd",
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
    },
    generatedContent: {
      objectives:
        "Migliorare le competenze dei medici di base nella gestione del dolore cronico del 45% entro 6 mesi, aumentando l'uso di protocolli evidence-based e migliorando gli esiti dei pazienti.",
      keyMessages:
        "Una gestione efficace del dolore richiede un approccio multidisciplinare, protocolli evidence-based e attenzione alla qualità della vita del paziente, non solo alla riduzione del dolore.",
      toneOfVoice: "Educativo, pratico, basato sull'evidenza con focus sull'applicazione clinica e sugli esiti dei pazienti",
      complianceNotes:
        "Tutti i materiali formativi devono essere conformi alle linee guida nazionali e internazionali per la gestione del dolore. Richiede revisione medico-scientifica e accreditamento ECM.",
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
