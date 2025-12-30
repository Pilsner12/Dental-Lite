export interface Visit {
  id: string
  date: Date
  duration: number // minutes
  service: string
  diagnosis: string
  treatment: string
  procedures: string[]
  notes: string
  price: number
  paymentStatus: "paid" | "unpaid" | "partial"
  doctor: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  date: Date
  dueDate: Date
  items: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  subtotal: number
  tax: number
  total: number
  status: "paid" | "unpaid" | "partial" | "overdue"
  paidAmount?: number
  paidDate?: Date
  paymentMethod?: "cash" | "card" | "transfer"
  notes?: string
}

export interface Patient {
  id: string
  personalInfo: {
    firstName: string
    lastName: string
    dateOfBirth: Date
    age: number
    gender: "male" | "female"
    phone: string
    email: string
    address?: {
      street: string
      city: string
      zip: string
    }
  }
  medicalInfo: {
    allergies?: string[]
    conditions?: string[]
    medications?: string[]
    notes?: string
    bloodType?: string
  }
  visitHistory: {
    firstVisit: Date
    lastVisit: Date
    totalVisits: number
    upcomingAppointments: number
    noShows: number
    cancellations: number
    visits?: Visit[] // Detailní historie návštěv
  }
  preferences: {
    preferredDoctor?: string
    preferredDays?: string[]
    communicationChannel: "phone" | "email" | "sms" | "whatsapp"
    marketingConsent: boolean
  }
  financial: {
    totalSpent: number
    lastPayment?: Date
    paymentMethod: "cash" | "card" | "transfer"
    insurance?: string
    invoices?: Invoice[] // Faktury pacienta
  }
  tags?: string[]
  status: "active" | "inactive" | "archived"
  contactVerifiedAt?: Date
  verificationToken?: string
  createdAt: Date
  updatedAt: Date
}

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    personalInfo: {
      firstName: "Jana",
      lastName: "Svobodová",
      dateOfBirth: new Date("1989-03-15"),
      age: 35,
      gender: "female",
      phone: "+420 731 234 567",
      email: "jana.svobodova@email.cz",
      address: { street: "Hlavní 45", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: ["Penicilin"],
      conditions: [],
      medications: [],
      notes: "Preferuje ranní termíny",
      bloodType: "A+"
    },
    visitHistory: {
      firstVisit: new Date("2020-05-10"),
      lastVisit: new Date("2024-11-15"),
      totalVisits: 18,
      upcomingAppointments: 0,
      noShows: 1,
      cancellations: 2,
      visits: [
        {
          id: "visit-1-1",
          date: new Date("2024-11-15"),
          duration: 30,
          service: "Kontrola",
          diagnosis: "Drobný kaz na zub 16",
          treatment: "Preventivní kontrola, doporučena plomba",
          procedures: ["RTG snímek", "Odstranění kamene", "Fluoridace"],
          notes: "Pacientka má lehké krvácení dásní, doporučena změna kartáčku na měkčí. Zubní hygiena celkově dobrá, ale je třeba věnovat větší pozornost mezizubním prostorům.",
          price: 800,
          paymentStatus: "paid",
          doctor: "MUDr. Jana Nováková"
        },
        {
          id: "visit-1-2",
          date: new Date("2024-05-20"),
          duration: 60,
          service: "Plomba",
          diagnosis: "Kaz 2. stupně na zub 36",
          treatment: "Výplň kompozitní pryskyřicí",
          procedures: ["Lokální anestezie", "Odstranění kazu", "Kompozitní výplň", "Leštění"],
          notes: "Bez komplikací, pacientka dobře snášela anestezii. Aplikována Articain 4% s adrenalinem 1:100000. Kaz byl hluboký, ale nedosahoval k pulpě. Výplň byla přizpůsobena k okluzi.",
          price: 1500,
          paymentStatus: "paid",
          doctor: "MUDr. Jana Nováková"
        },
        {
          id: "visit-1-3",
          date: new Date("2024-02-12"),
          duration: 45,
          service: "Dentální hygiena",
          diagnosis: "Mírný zubní kámen, gingivitis",
          treatment: "Profesionální čištění zubů ultrazvukem",
          procedures: ["Ultrazvukový scaling", "Air-flow", "Polishing", "Fluoridace gelová"],
          notes: "Zubní kámen především v oblasti dolních řezáků. Dásně prokrvené, místy krvácení při sondování. Pacientce doporučeno používat mezizubní kartáčky a ústní vodu s chlorhexidinem na 14 dní.",
          price: 850,
          paymentStatus: "paid",
          doctor: "MUDr. Jana Nováková"
        },
        {
          id: "visit-1-4",
          date: new Date("2023-11-10"),
          duration: 30,
          service: "Preventivka",
          diagnosis: "Gingivitis marginalis",
          treatment: "Preventivní kontrola s odstran ěním plaku",
          procedures: ["Scaling", "Polishing", "Fluoridace"],
          notes: "Zánět dásní, doporučena lepší ústní hygiena. Pacientka přiznala nepravidelné čištění zubů večer. Edukována o správné technice čištění.",
          price: 600,
          paymentStatus: "paid",
          doctor: "MUDr. Jana Nováková"
        },
        {
          id: "visit-1-5",
          date: new Date("2023-05-08"),
          duration: 90,
          service: "Korunka",
          diagnosis: "Fraktura zub 26 po endodontickém ošetření",
          treatment: "Příprava zubu a nasazení dočasné korunky",
          procedures: ["Lokální anestezie", "Preparace zubu", "Otisk", "Dočasná korunka", "Cementace"],
          notes: "Zub po ošetření kořenového kanálku před 2 lety se zlomil při kousání. Provedena preparace, odebrán otisk pro keramickou korunku. Nasazena provizorní korunka, pacientka objednána za 14 dní na nasazení definitivní.",
          price: 4500,
          paymentStatus: "paid",
          doctor: "MUDr. Jana Nováková"
        },
        {
          id: "visit-1-6",
          date: new Date("2023-04-24"),
          duration: 30,
          service: "Kontrola",
          diagnosis: "Bolest zub 26",
          treatment: "RTG vyšetření, diagnostika",
          procedures: ["RTG snímek", "Klinické vyšetření", "Perkuse", "Vitalita"],
          notes: "Pacientka udává bolest při kousání na levém horním moláru. RTG potvrdilo frakturu zubu. Zub má endodontické ošetření, je avitální. Doporučena korunka, pacientka souhlasila.",
          price: 400,
          paymentStatus: "paid",
          doctor: "MUDr. Jana Nováková"
        },
        {
          id: "visit-1-7",
          date: new Date("2022-11-22"),
          duration: 30,
          service: "Preventivka",
          diagnosis: "Bez patologického nálezu",
          treatment: "Preventivní prohlídka",
          procedures: ["Klinické vyšetření", "Odstranění měkkého plaku", "Fluoridace"],
          notes: "Stav chrupu dobrý, bez kazu. Lehká hypersenzitivita krčků zubů 43, 44 - aplikován desenzitizační lak. Pacientka si stěžovala na citlivost na studené nápoje.",
          price: 500,
          paymentStatus: "paid",
          doctor: "MUDr. Jana Nováková"
        },
        {
          id: "visit-1-8",
          date: new Date("2022-06-15"),
          duration: 60,
          service: "Plomba",
          diagnosis: "Kaz aproximální 47",
          treatment: "Výplň kompozitní pryskyřicí",
          procedures: ["Lokální anestezie", "Cofferdam", "Odstranění kazu", "Adhezivní systém", "Kompozitní výplň", "Modelace", "Leštění"],
          notes: "Kaz mezi zuby 46 a 47, proximální kavita Class II. Použit cofferdam pro optimální adhezi. Aplikován Articain 4%. Výplň ve 3 vrstvách s průběžnou polymerizací. Kontrola okluze artikulačním papírem.",
          price: 1800,
          paymentStatus: "paid",
          doctor: "MUDr. Jana Nováková"
        },
        {
          id: "visit-1-9",
          date: new Date("2021-12-03"),
          duration: 120,
          service: "Ošetření kořenových kanálků",
          diagnosis: "Pulpitis acuta zub 26",
          treatment: "Endodontické ošetření",
          procedures: ["Lokální anestezie", "Přístupová kavita", "Extirpace pulpy", "Měření délky kanálků", "Chemomechanická preparace", "Výplň kanálků guttaperčou", "Rentgenová kontrola"],
          notes: "Pacientka přišla s akutními bolestmi zub 26. Diagnostikována akutní pulpitida. Provedeno endodontické ošetření ve 3 kořenových kanálcích (MB, DB, P). Kanálky vyplněny guttaperčou metodou laterální kondenzace. RTG kontrola potvrdila správné zaplnění do apexu. Doporučena korunka.",
          price: 3500,
          paymentStatus: "paid",
          doctor: "MUDr. Petr Novák"
        },
        {
          id: "visit-1-10",
          date: new Date("2021-11-18"),
          duration: 30,
          service: "Urgentní vyšetření",
          diagnosis: "Pulpitis acuta",
          treatment: "Analgezie, antibiotika",
          procedures: ["Klinické vyšetření", "RTG", "Vitalitní testy"],
          notes: "Pacientka přišla s prudkou bolestí zub 26. Zub pozitivní na perkusi, extrémně citlivý na teplo/chlad. RTG ukázalo hluboký kaz s pravděpodobným postižením pulpy. Předepsán Ibuprofen 400mg 3x denně a Amoxicilin 1g 2x denně. Objednána na endodontické ošetření za 2 týdny.",
          price: 600,
          paymentStatus: "paid",
          doctor: "MUDr. Jana Nováková"
        },
        {
          id: "visit-1-11",
          date: new Date("2021-05-10"),
          duration: 45,
          service: "Bělení zubů",
          diagnosis: "Zabarvení zubů",
          treatment: "Profesionální bělení metodou Beyond",
          procedures: ["Čištění zubů", "Aplikace bělícího gelu", "LED aktivace", "Fluoridace"],
          notes: "Pacientka požadovala vyšší estetiku úsměvu. Před bělením provedeno profesionální čištění. Aplikován peroxidový gel 35% ve 3 cyklech po 15 minutách. Dosaženo zesvětlení o 4 odstíny dle stupnice Vita. Doporučeno vyhýbat se barvícím látkám 48 hodin.",
          price: 3500,
          paymentStatus: "paid",
          doctor: "MUDr. Jana Nováková"
        },
        {
          id: "visit-1-12",
          date: new Date("2020-11-20"),
          duration: 30,
          service: "Preventivka",
          diagnosis: "Stav po sanaci chrupu",
          treatment: "Kontrolní vyšetření",
          procedures: ["Klinické vyšetření", "Kontrola výplní"],
          notes: "Kontrola 6 měsíců po dokončení komplexní sanace. Všechny výplně v pořádku, bez sekundárního kazu. Pacientka spokojená, bez obtíží.",
          price: 300,
          paymentStatus: "paid",
          doctor: "MUDr. Jana Nováková"
        },
        {
          id: "visit-1-13",
          date: new Date("2020-08-14"),
          duration: 60,
          service: "Plomba",
          diagnosis: "Kaz 15, 25",
          treatment: "Dvě kompozitní výplně",
          procedures: ["Lokální anestezie", "Odstranění kazu obou zubů", "Kompozitní výplně", "Leštění"],
          notes: "Ošetřeny dva horní premoláry, symetrický kaz okluzálních ploch. Výplně zhotoveny kompozitem odstín A2. Kontrola okluze.",
          price: 2400,
          paymentStatus: "paid",
          doctor: "MUDr. Jana Nováková"
        },
        {
          id: "visit-1-14",
          date: new Date("2020-07-22"),
          duration: 60,
          service: "Plomba",
          diagnosis: "Kaz 37",
          treatment: "Kompozitní výplň",
          procedures: ["Lokální anestezie", "Odstranění kazu", "Kompozitní výplň", "Modelace", "Leštění"],
          notes: "Hluboký kaz na molaru, preparace provedena s opatrností k pulpě. Aplikována vložka s Ca(OH)2. Výplň bez komplikací.",
          price: 1600,
          paymentStatus: "paid",
          doctor: "MUDr. Jana Nováková"
        },
        {
          id: "visit-1-15",
          date: new Date("2020-06-18"),
          duration: 30,
          service: "Kontrola",
          diagnosis: "Multiple kazy",
          treatment: "Diagnostika, plán léčby",
          procedures: ["Panoramatický RTG", "Klinické vyšetření", "Sondování"],
          notes: "Nalezeno 5 kazů různé hloubky. Vytvořen plán sanace: prioritně ošetřit zuby 37, 15, 25, následně 46, 47. Pacientka informována o rozsahu ošetření.",
          price: 800,
          paymentStatus: "paid",
          doctor: "MUDr. Jana Nováková"
        },
        {
          id: "visit-1-16",
          date: new Date("2020-05-25"),
          duration: 45,
          service: "Dentální hygiena",
          diagnosis: "Zubní kámen, plak",
          treatment: "Iniciální ošetření před sanací",
          procedures: ["Ultrazvukový scaling", "Air-flow", "Polishing", "Motivace a edukace"],
          notes: "První dentální hygiena před započetím sanace. Značné množství zubního kamene, především v oblasti dolních frontálních zubů. Pacientka edukována o správné technice čištění, ukázána metoda Bass.",
          price: 900,
          paymentStatus: "paid",
          doctor: "MUDr. Jana Nováková"
        },
        {
          id: "visit-1-17",
          date: new Date("2020-05-10"),
          duration: 30,
          service: "První návštěva",
          diagnosis: "Komplexní vyšetření nového pacienta",
          treatment: "Anamnéza, vyšetření",
          procedures: ["Anamnéza", "Klinické vyšetření", "Plán preventivní péče"],
          notes: "První návštěva v ordinaci. Pacientka dlouho nebyla u zubaře (cca 3 roky). Obecný zdravotní stav dobrý, alergie na penicilin zaznamenána. Doporučena dentální hygiena a následně RTG pro kompletní diagnostiku.",
          price: 400,
          paymentStatus: "paid",
          doctor: "MUDr. Jana Nováková"
        }
      ]
    },
    preferences: {
      preferredDoctor: "MUDr. Jana Nováková",
      preferredDays: ["monday", "wednesday"],
      communicationChannel: "email",
      marketingConsent: true
    },
    financial: {
      totalSpent: 18500,
      lastPayment: new Date("2024-11-15"),
      paymentMethod: "card",
      insurance: "VZP",
      invoices: [
        {
          id: "inv-1-1",
          invoiceNumber: "2024110001",
          date: new Date("2024-11-15"),
          dueDate: new Date("2024-11-29"),
          items: [
            { description: "Preventivní kontrola", quantity: 1, unitPrice: 300, total: 300 },
            { description: "RTG snímek", quantity: 1, unitPrice: 200, total: 200 },
            { description: "Odstranění kamene", quantity: 1, unitPrice: 200, total: 200 },
            { description: "Fluoridace", quantity: 1, unitPrice: 100, total: 100 }
          ],
          subtotal: 800,
          tax: 0,
          total: 800,
          status: "paid",
          paidAmount: 800,
          paidDate: new Date("2024-11-15"),
          paymentMethod: "card"
        },
        {
          id: "inv-1-2",
          invoiceNumber: "2024050012",
          date: new Date("2024-05-20"),
          dueDate: new Date("2024-06-03"),
          items: [
            { description: "Lokální anestezie", quantity: 1, unitPrice: 150, total: 150 },
            { description: "Kompozitní výplň", quantity: 1, unitPrice: 1200, total: 1200 },
            { description: "Leštění", quantity: 1, unitPrice: 150, total: 150 }
          ],
          subtotal: 1500,
          tax: 0,
          total: 1500,
          status: "paid",
          paidAmount: 1500,
          paidDate: new Date("2024-05-20"),
          paymentMethod: "card"
        }
      ]
    },
    tags: ["Pravidelný", "VIP"],
    status: "active",
    contactVerifiedAt: new Date("2024-11-15"),
    createdAt: new Date("2020-05-10"),
    updatedAt: new Date("2024-11-15")
  },
  {
    id: "2",
    personalInfo: {
      firstName: "Petr",
      lastName: "Novák",
      dateOfBirth: new Date("1975-08-22"),
      age: 49,
      gender: "male",
      phone: "+420 732 345 678",
      email: "petr.novak@email.cz",
      address: { street: "Lidická 123", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: ["Diabetes typu 2"],
      medications: ["Metformin"],
      notes: "Diabetik - opatrně s anesteziií",
      bloodType: "B+"
    },
    visitHistory: {
      firstVisit: new Date("2018-03-20"),
      lastVisit: new Date("2024-12-10"),
      totalVisits: 24,
      upcomingAppointments: 1,
      noShows: 0,
      cancellations: 1,
      visits: [
        {
          id: "visit-2-1",
          date: new Date("2024-12-10"),
          duration: 90,
          service: "Korunka",
          diagnosis: "Zlomený zub 46, nutná korunka",
          treatment: "Preparace zubu, otisk pro keramickou korunku",
          procedures: ["Lokální anestezie (opatrně - diabetes)", "Broušení zubu", "Digitální otisk", "Dočasná korunka"],
          notes: "Diabetik - prodloužené hojení, kontrola za týden",
          price: 4500,
          paymentStatus: "partial",
          doctor: "MUDr. Jana Nováková"
        },
        {
          id: "visit-2-2",
          date: new Date("2024-09-15"),
          duration: 60,
          service: "Plomba",
          diagnosis: "Kaz 3. stupně na zub 27",
          treatment: "Odstranění rozsáhlého kazu, kompozitní výplň",
          procedures: ["Lokální anestezie", "Odstranění kazu", "Podložka", "Kompozitní výplň", "Tvarování"],
          notes: "Rozsáhlý kaz, pravidelné kontroly nutné",
          price: 1800,
          paymentStatus: "paid",
          doctor: "MUDr. Jana Nováková"
        },
        {
          id: "visit-2-3",
          date: new Date("2024-06-05"),
          duration: 30,
          service: "Kontrola",
          diagnosis: "Stav po léčbě dobrý",
          treatment: "Preventivní kontrola",
          procedures: ["Klinické vyšetření", "Odstranění kamene", "Fluoridace"],
          notes: "Pravidelná kontrola diabetika, dobrý stav chrupu",
          price: 700,
          paymentStatus: "paid",
          doctor: "MUDr. Jana Nováková"
        },
        {
          id: "visit-2-4",
          date: new Date("2024-03-10"),
          duration: 120,
          service: "Implantát",
          diagnosis: "Chybějící zub 36",
          treatment: "Konzultace implantátu, plánování",
          procedures: ["RTG panorama", "3D CT snímek", "Konzultace", "Plánování implantace"],
          notes: "Pacient zvažuje implantát, nutná konzultace s diabetologem",
          price: 2500,
          paymentStatus: "paid",
          doctor: "MUDr. Jana Nováková"
        }
      ]
    },
    preferences: {
      preferredDoctor: "MUDr. Jana Nováková",
      preferredDays: ["tuesday", "thursday"],
      communicationChannel: "phone",
      marketingConsent: false
    },
    financial: {
      totalSpent: 45200,
      lastPayment: new Date("2024-12-10"),
      paymentMethod: "cash",
      insurance: "VZP",
      invoices: [
        {
          id: "inv-2-1",
          invoiceNumber: "2024120015",
          date: new Date("2024-12-10"),
          dueDate: new Date("2024-12-24"),
          items: [
            { description: "Preparace pro korunky", quantity: 1, unitPrice: 2000, total: 2000 },
            { description: "Digitální otisk", quantity: 1, unitPrice: 800, total: 800 },
            { description: "Dočasná korunka", quantity: 1, unitPrice: 500, total: 500 },
            { description: "Keramická korunka (záloha 50%)", quantity: 1, unitPrice: 6000, total: 3000 }
          ],
          subtotal: 6300,
          tax: 0,
          total: 6300,
          status: "partial",
          paidAmount: 2500,
          paidDate: new Date("2024-12-10"),
          paymentMethod: "cash",
          notes: "Záloha 2500 Kč, zbytek po osazení korunky"
        },
        {
          id: "inv-2-2",
          invoiceNumber: "2024090008",
          date: new Date("2024-09-15"),
          dueDate: new Date("2024-09-29"),
          items: [
            { description: "Lokální anestezie", quantity: 1, unitPrice: 150, total: 150 },
            { description: "Odstranění kazu", quantity: 1, unitPrice: 500, total: 500 },
            { description: "Podložka", quantity: 1, unitPrice: 200, total: 200 },
            { description: "Kompozitní výplň", quantity: 1, unitPrice: 950, total: 950 }
          ],
          subtotal: 1800,
          tax: 0,
          total: 1800,
          status: "paid",
          paidAmount: 1800,
          paidDate: new Date("2024-09-15"),
          paymentMethod: "cash"
        },
        {
          id: "inv-2-3",
          invoiceNumber: "2024030005",
          date: new Date("2024-03-10"),
          dueDate: new Date("2024-03-24"),
          items: [
            { description: "RTG panorama", quantity: 1, unitPrice: 500, total: 500 },
            { description: "3D CT snímek", quantity: 1, unitPrice: 1200, total: 1200 },
            { description: "Konzultace implantologie", quantity: 1, unitPrice: 800, total: 800 }
          ],
          subtotal: 2500,
          tax: 0,
          total: 2500,
          status: "paid",
          paidAmount: 2500,
          paidDate: new Date("2024-03-10"),
          paymentMethod: "cash"
        }
      ]
    },
    tags: ["Pravidelný", "VIP"],
    status: "active",
    contactVerifiedAt: new Date("2024-06-10"),
    createdAt: new Date("2018-03-20"),
    updatedAt: new Date("2024-12-10")
  },
  {
    id: "3",
    personalInfo: {
      firstName: "Eva",
      lastName: "Dvořáková",
      dateOfBirth: new Date("1995-12-05"),
      age: 29,
      gender: "female",
      phone: "+420 733 456 789",
      email: "eva.dvorakova@email.cz",
      address: { street: "Klatovská 78", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "Má strach z jehel",
      bloodType: "O+"
    },
    visitHistory: {
      firstVisit: new Date("2022-06-15"),
      lastVisit: new Date("2024-09-20"),
      totalVisits: 6,
      upcomingAppointments: 0,
      noShows: 2,
      cancellations: 3
    },
    preferences: {
      preferredDoctor: "MUDr. Jana Nováková",
      preferredDays: ["friday"],
      communicationChannel: "whatsapp",
      marketingConsent: true
    },
    financial: {
      totalSpent: 8900,
      lastPayment: new Date("2024-09-20"),
      paymentMethod: "card",
      insurance: "VOZP"
    },
    tags: ["Rizikový"],
    status: "active",
    contactVerifiedAt: new Date("2023-09-20"),
    createdAt: new Date("2022-06-15"),
    updatedAt: new Date("2024-09-20")
  },
  {
    id: "4",
    personalInfo: {
      firstName: "Martin",
      lastName: "Procházka",
      dateOfBirth: new Date("1987-04-18"),
      age: 37,
      gender: "male",
      phone: "+420 734 567 890",
      email: "martin.prochazka@email.cz",
      address: { street: "Americká 56", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: ["Latex"],
      conditions: [],
      medications: [],
      notes: "Použít latexové rukavice bez pudru",
      bloodType: "AB+"
    },
    visitHistory: {
      firstVisit: new Date("2019-11-05"),
      lastVisit: new Date("2024-10-30"),
      totalVisits: 15,
      upcomingAppointments: 0,
      noShows: 0,
      cancellations: 0
    },
    preferences: {
      preferredDoctor: "MUDr. Jana Nováková",
      preferredDays: ["monday", "wednesday", "friday"],
      communicationChannel: "email",
      marketingConsent: true
    },
    financial: {
      totalSpent: 28400,
      lastPayment: new Date("2024-10-30"),
      paymentMethod: "card",
      insurance: "VZP"
    },
    tags: ["Pravidelný"],
    status: "active",
    contactVerifiedAt: new Date("2024-10-30"),
    createdAt: new Date("2019-11-05"),
    updatedAt: new Date("2024-10-30")
  },
  {
    id: "5",
    personalInfo: {
      firstName: "Lucie",
      lastName: "Černá",
      dateOfBirth: new Date("2001-07-30"),
      age: 23,
      gender: "female",
      phone: "+420 735 678 901",
      email: "lucie.cerna@email.cz",
      address: { street: "Borská 234", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "",
      bloodType: "A-"
    },
    visitHistory: {
      firstVisit: new Date("2024-08-15"),
      lastVisit: new Date("2024-08-15"),
      totalVisits: 1,
      upcomingAppointments: 0,
      noShows: 0,
      cancellations: 0
    },
    preferences: {
      preferredDays: ["monday", "tuesday", "wednesday"],
      communicationChannel: "sms",
      marketingConsent: true
    },
    financial: {
      totalSpent: 1200,
      lastPayment: new Date("2024-08-15"),
      paymentMethod: "card",
      insurance: "OZP"
    },
    tags: ["Nový"],
    status: "active",
    createdAt: new Date("2024-08-15"),
    updatedAt: new Date("2024-08-15")
  },
  {
    id: "6",
    personalInfo: {
      firstName: "Tomáš",
      lastName: "Veselý",
      dateOfBirth: new Date("1968-02-14"),
      age: 56,
      gender: "male",
      phone: "+420 736 789 012",
      email: "tomas.vesely@email.cz",
      address: { street: "Slovanská 45", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: ["Hypertenze"],
      medications: ["Enalapril"],
      notes: "Vysoký krevní tlak pod kontrolou",
      bloodType: "O-"
    },
    visitHistory: {
      firstVisit: new Date("2015-01-20"),
      lastVisit: new Date("2024-11-05"),
      totalVisits: 35,
      upcomingAppointments: 1,
      noShows: 1,
      cancellations: 2
    },
    preferences: {
      preferredDoctor: "MUDr. Jana Nováková",
      preferredDays: ["tuesday", "thursday"],
      communicationChannel: "phone",
      marketingConsent: false
    },
    financial: {
      totalSpent: 52000,
      lastPayment: new Date("2024-11-05"),
      paymentMethod: "transfer",
      insurance: "VZP"
    },
    tags: ["Pravidelný", "VIP"],
    status: "active",
    createdAt: new Date("2015-01-20"),
    updatedAt: new Date("2024-11-05")
  },
  {
    id: "7",
    personalInfo: {
      firstName: "Barbora",
      lastName: "Horáková",
      dateOfBirth: new Date("1992-09-08"),
      age: 32,
      gender: "female",
      phone: "+420 737 890 123",
      email: "barbora.horakova@email.cz",
      address: { street: "Táborská 89", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "Těhotná - 2. trimestr",
      bloodType: "B-"
    },
    visitHistory: {
      firstVisit: new Date("2021-04-10"),
      lastVisit: new Date("2024-12-01"),
      totalVisits: 10,
      upcomingAppointments: 1,
      noShows: 0,
      cancellations: 1
    },
    preferences: {
      preferredDays: ["wednesday", "friday"],
      communicationChannel: "email",
      marketingConsent: true
    },
    financial: {
      totalSpent: 14200,
      lastPayment: new Date("2024-12-01"),
      paymentMethod: "card",
      insurance: "VZP"
    },
    tags: ["Pravidelný"],
    status: "active",
    createdAt: new Date("2021-04-10"),
    updatedAt: new Date("2024-12-01")
  },
  {
    id: "8",
    personalInfo: {
      firstName: "Jakub",
      lastName: "Kučera",
      dateOfBirth: new Date("1980-11-23"),
      age: 44,
      gender: "male",
      phone: "+420 738 901 234",
      email: "jakub.kucera@email.cz",
      address: { street: "Denisovo náb. 12", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "",
      bloodType: "A+"
    },
    visitHistory: {
      firstVisit: new Date("2017-09-15"),
      lastVisit: new Date("2024-07-20"),
      totalVisits: 20,
      upcomingAppointments: 0,
      noShows: 3,
      cancellations: 4
    },
    preferences: {
      preferredDays: ["monday"],
      communicationChannel: "sms",
      marketingConsent: false
    },
    financial: {
      totalSpent: 31500,
      lastPayment: new Date("2024-07-20"),
      paymentMethod: "cash",
      insurance: "VZP"
    },
    tags: ["Rizikový"],
    status: "active",
    createdAt: new Date("2017-09-15"),
    updatedAt: new Date("2024-07-20")
  },
  {
    id: "9",
    personalInfo: {
      firstName: "Tereza",
      lastName: "Němcová",
      dateOfBirth: new Date("1998-05-12"),
      age: 26,
      gender: "female",
      phone: "+420 739 012 345",
      email: "tereza.nemcova@email.cz",
      address: { street: "Lochotínská 167", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "Zájem o bělení zubů",
      bloodType: "O+"
    },
    visitHistory: {
      firstVisit: new Date("2023-02-28"),
      lastVisit: new Date("2024-10-15"),
      totalVisits: 4,
      upcomingAppointments: 1,
      noShows: 0,
      cancellations: 0
    },
    preferences: {
      preferredDays: ["thursday", "friday"],
      communicationChannel: "whatsapp",
      marketingConsent: true
    },
    financial: {
      totalSpent: 6800,
      lastPayment: new Date("2024-10-15"),
      paymentMethod: "card",
      insurance: "ČPZP"
    },
    tags: [],
    status: "active",
    createdAt: new Date("2023-02-28"),
    updatedAt: new Date("2024-10-15")
  },
  {
    id: "10",
    personalInfo: {
      firstName: "David",
      lastName: "Šmíd",
      dateOfBirth: new Date("1965-10-07"),
      age: 59,
      gender: "male",
      phone: "+420 740 123 456",
      email: "david.smid@email.cz",
      address: { street: "Karlovarská 234", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: ["Anestetika"],
      conditions: ["Kardiovaskulární onemocnění"],
      medications: ["Warfarin", "Atorvastatin"],
      notes: "Konzultovat s kardiologem před zákroky",
      bloodType: "AB-"
    },
    visitHistory: {
      firstVisit: new Date("2012-07-10"),
      lastVisit: new Date("2024-11-20"),
      totalVisits: 48,
      upcomingAppointments: 0,
      noShows: 0,
      cancellations: 1
    },
    preferences: {
      preferredDoctor: "MUDr. Jana Nováková",
      preferredDays: ["tuesday", "wednesday"],
      communicationChannel: "phone",
      marketingConsent: false
    },
    financial: {
      totalSpent: 68500,
      lastPayment: new Date("2024-11-20"),
      paymentMethod: "transfer",
      insurance: "VZP"
    },
    tags: ["Pravidelný", "VIP", "Rizikový"],
    status: "active",
    createdAt: new Date("2012-07-10"),
    updatedAt: new Date("2024-11-20")
  },
  // Pokračování dalších 20 pacientů...
  {
    id: "11",
    personalInfo: {
      firstName: "Markéta",
      lastName: "Vlčková",
      dateOfBirth: new Date("1991-01-15"),
      age: 33,
      gender: "female",
      phone: "+420 741 234 567",
      email: "marketa.vlckova@email.cz",
      address: { street: "Mikulášská 67", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "",
      bloodType: "A+"
    },
    visitHistory: {
      firstVisit: new Date("2020-09-05"),
      lastVisit: new Date("2024-06-10"),
      totalVisits: 8,
      upcomingAppointments: 0,
      noShows: 1,
      cancellations: 0
    },
    preferences: {
      preferredDays: ["monday", "friday"],
      communicationChannel: "email",
      marketingConsent: true
    },
    financial: {
      totalSpent: 12400,
      lastPayment: new Date("2024-06-10"),
      paymentMethod: "card",
      insurance: "VZP"
    },
    tags: [],
    status: "active",
    createdAt: new Date("2020-09-05"),
    updatedAt: new Date("2024-06-10")
  },
  {
    id: "12",
    personalInfo: {
      firstName: "Michal",
      lastName: "Beneš",
      dateOfBirth: new Date("1978-06-20"),
      age: 46,
      gender: "male",
      phone: "+420 742 345 678",
      email: "michal.benes@email.cz",
      address: { street: "Doubravecká 123", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "Kuřák - vysoké riziko parodontózy",
      bloodType: "B+"
    },
    visitHistory: {
      firstVisit: new Date("2016-03-12"),
      lastVisit: new Date("2024-09-28"),
      totalVisits: 28,
      upcomingAppointments: 0,
      noShows: 2,
      cancellations: 3
    },
    preferences: {
      preferredDays: ["tuesday", "thursday"],
      communicationChannel: "phone",
      marketingConsent: false
    },
    financial: {
      totalSpent: 38900,
      lastPayment: new Date("2024-09-28"),
      paymentMethod: "cash",
      insurance: "VZP"
    },
    tags: ["Pravidelný", "Rizikový"],
    status: "active",
    createdAt: new Date("2016-03-12"),
    updatedAt: new Date("2024-09-28")
  },
  {
    id: "13",
    personalInfo: {
      firstName: "Kateřina",
      lastName: "Marková",
      dateOfBirth: new Date("2003-08-25"),
      age: 21,
      gender: "female",
      phone: "+420 743 456 789",
      email: "katerina.markova@email.cz",
      address: { street: "Košutka 45", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "Nosí rovnátka",
      bloodType: "O-"
    },
    visitHistory: {
      firstVisit: new Date("2024-01-10"),
      lastVisit: new Date("2024-12-05"),
      totalVisits: 5,
      upcomingAppointments: 1,
      noShows: 0,
      cancellations: 0
    },
    preferences: {
      preferredDays: ["wednesday", "friday"],
      communicationChannel: "whatsapp",
      marketingConsent: true
    },
    financial: {
      totalSpent: 15200,
      lastPayment: new Date("2024-12-05"),
      paymentMethod: "card",
      insurance: "OZP"
    },
    tags: ["Nový"],
    status: "active",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-12-05")
  },
  {
    id: "14",
    personalInfo: {
      firstName: "Vladimír",
      lastName: "Král",
      dateOfBirth: new Date("1955-12-01"),
      age: 69,
      gender: "male",
      phone: "+420 744 567 890",
      email: "vladimir.kral@email.cz",
      address: { street: "Jateční 78", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: ["Diabetes typu 2", "Hypertenze"],
      medications: ["Metformin", "Ramipril"],
      notes: "Senior - vyžaduje více času",
      bloodType: "A-"
    },
    visitHistory: {
      firstVisit: new Date("2010-05-15"),
      lastVisit: new Date("2024-11-12"),
      totalVisits: 50,
      upcomingAppointments: 0,
      noShows: 0,
      cancellations: 0
    },
    preferences: {
      preferredDoctor: "MUDr. Jana Nováková",
      preferredDays: ["monday", "wednesday"],
      communicationChannel: "phone",
      marketingConsent: false
    },
    financial: {
      totalSpent: 72300,
      lastPayment: new Date("2024-11-12"),
      paymentMethod: "cash",
      insurance: "VZP"
    },
    tags: ["Pravidelný", "VIP"],
    status: "active",
    createdAt: new Date("2010-05-15"),
    updatedAt: new Date("2024-11-12")
  },
  {
    id: "15",
    personalInfo: {
      firstName: "Simona",
      lastName: "Jelínková",
      dateOfBirth: new Date("1986-04-03"),
      age: 38,
      gender: "female",
      phone: "+420 745 678 901",
      email: "simona.jelinkova@email.cz",
      address: { street: "Resslova 234", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: ["Jód"],
      conditions: [],
      medications: [],
      notes: "Alergie na jód",
      bloodType: "B-"
    },
    visitHistory: {
      firstVisit: new Date("2019-08-22"),
      lastVisit: new Date("2024-10-08"),
      totalVisits: 14,
      upcomingAppointments: 0,
      noShows: 1,
      cancellations: 1
    },
    preferences: {
      preferredDays: ["tuesday", "thursday"],
      communicationChannel: "email",
      marketingConsent: true
    },
    financial: {
      totalSpent: 22100,
      lastPayment: new Date("2024-10-08"),
      paymentMethod: "card",
      insurance: "VOZP"
    },
    tags: ["Pravidelný"],
    status: "active",
    createdAt: new Date("2019-08-22"),
    updatedAt: new Date("2024-10-08")
  },
  {
    id: "16",
    personalInfo: {
      firstName: "Roman",
      lastName: "Pokorný",
      dateOfBirth: new Date("1993-07-17"),
      age: 31,
      gender: "male",
      phone: "+420 746 789 012",
      email: "roman.pokorny@email.cz",
      address: { street: "Roudná 56", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "",
      bloodType: "O+"
    },
    visitHistory: {
      firstVisit: new Date("2021-11-05"),
      lastVisit: new Date("2024-05-18"),
      totalVisits: 7,
      upcomingAppointments: 0,
      noShows: 4,
      cancellations: 5
    },
    preferences: {
      preferredDays: ["friday"],
      communicationChannel: "sms",
      marketingConsent: false
    },
    financial: {
      totalSpent: 9200,
      lastPayment: new Date("2024-05-18"),
      paymentMethod: "cash",
      insurance: "VZP"
    },
    tags: ["Rizikový"],
    status: "active",
    createdAt: new Date("2021-11-05"),
    updatedAt: new Date("2024-05-18")
  },
  {
    id: "17",
    personalInfo: {
      firstName: "Veronika",
      lastName: "Součková",
      dateOfBirth: new Date("1999-02-28"),
      age: 25,
      gender: "female",
      phone: "+420 747 890 123",
      email: "veronika.souckova@email.cz",
      address: { street: "Škroupova 89", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "Studentka - preferuje odpolední termíny",
      bloodType: "A+"
    },
    visitHistory: {
      firstVisit: new Date("2023-09-10"),
      lastVisit: new Date("2024-11-30"),
      totalVisits: 3,
      upcomingAppointments: 1,
      noShows: 0,
      cancellations: 0
    },
    preferences: {
      preferredDays: ["monday", "wednesday", "friday"],
      communicationChannel: "whatsapp",
      marketingConsent: true
    },
    financial: {
      totalSpent: 4500,
      lastPayment: new Date("2024-11-30"),
      paymentMethod: "card",
      insurance: "ČPZP"
    },
    tags: [],
    status: "active",
    createdAt: new Date("2023-09-10"),
    updatedAt: new Date("2024-11-30")
  },
  {
    id: "18",
    personalInfo: {
      firstName: "Filip",
      lastName: "Urban",
      dateOfBirth: new Date("1972-09-11"),
      age: 52,
      gender: "male",
      phone: "+420 748 901 234",
      email: "filip.urban@email.cz",
      address: { street: "Proluka 123", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "Podnikatel - často ruší termíny",
      bloodType: "B+"
    },
    visitHistory: {
      firstVisit: new Date("2014-02-20"),
      lastVisit: new Date("2024-08-15"),
      totalVisits: 32,
      upcomingAppointments: 0,
      noShows: 5,
      cancellations: 8
    },
    preferences: {
      preferredDays: ["monday"],
      communicationChannel: "phone",
      marketingConsent: false
    },
    financial: {
      totalSpent: 48700,
      lastPayment: new Date("2024-08-15"),
      paymentMethod: "transfer",
      insurance: "VZP"
    },
    tags: ["VIP", "Rizikový"],
    status: "active",
    createdAt: new Date("2014-02-20"),
    updatedAt: new Date("2024-08-15")
  },
  {
    id: "19",
    personalInfo: {
      firstName: "Lenka",
      lastName: "Pospíšilová",
      dateOfBirth: new Date("1983-11-29"),
      age: 41,
      gender: "female",
      phone: "+420 749 012 345",
      email: "lenka.pospisilova@email.cz",
      address: { street: "Manětínská 234", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "",
      bloodType: "O-"
    },
    visitHistory: {
      firstVisit: new Date("2018-06-08"),
      lastVisit: new Date("2024-10-22"),
      totalVisits: 18,
      upcomingAppointments: 0,
      noShows: 0,
      cancellations: 0
    },
    preferences: {
      preferredDoctor: "MUDr. Jana Nováková",
      preferredDays: ["tuesday", "wednesday", "thursday"],
      communicationChannel: "email",
      marketingConsent: true
    },
    financial: {
      totalSpent: 25800,
      lastPayment: new Date("2024-10-22"),
      paymentMethod: "card",
      insurance: "VZP"
    },
    tags: ["Pravidelný"],
    status: "active",
    createdAt: new Date("2018-06-08"),
    updatedAt: new Date("2024-10-22")
  },
  {
    id: "20",
    personalInfo: {
      firstName: "Ondřej",
      lastName: "Marek",
      dateOfBirth: new Date("1996-05-06"),
      age: 28,
      gender: "male",
      phone: "+420 750 123 456",
      email: "ondrej.marek@email.cz",
      address: { street: "Bendova 67", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "Sportovec - riziko úrazu zubů",
      bloodType: "AB+"
    },
    visitHistory: {
      firstVisit: new Date("2022-03-15"),
      lastVisit: new Date("2024-12-08"),
      totalVisits: 9,
      upcomingAppointments: 0,
      noShows: 0,
      cancellations: 1
    },
    preferences: {
      preferredDays: ["monday", "friday"],
      communicationChannel: "sms",
      marketingConsent: true
    },
    financial: {
      totalSpent: 13600,
      lastPayment: new Date("2024-12-08"),
      paymentMethod: "card",
      insurance: "VZP"
    },
    tags: [],
    status: "active",
    createdAt: new Date("2022-03-15"),
    updatedAt: new Date("2024-12-08")
  },
  // Dalších 10 pacientů
  {
    id: "21",
    personalInfo: {
      firstName: "Alena",
      lastName: "Křížová",
      dateOfBirth: new Date("1960-03-22"),
      age: 64,
      gender: "female",
      phone: "+420 751 234 567",
      email: "alena.krizova@email.cz",
      address: { street: "Saská 45", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: ["Osteoporóza"],
      medications: ["Calcium", "Vitamin D"],
      notes: "Stařenka - vyžaduje šetrný přístup",
      bloodType: "A+"
    },
    visitHistory: {
      firstVisit: new Date("2008-10-12"),
      lastVisit: new Date("2024-11-18"),
      totalVisits: 42,
      upcomingAppointments: 0,
      noShows: 0,
      cancellations: 0
    },
    preferences: {
      preferredDoctor: "MUDr. Jana Nováková",
      preferredDays: ["tuesday", "thursday"],
      communicationChannel: "phone",
      marketingConsent: false
    },
    financial: {
      totalSpent: 58900,
      lastPayment: new Date("2024-11-18"),
      paymentMethod: "cash",
      insurance: "VZP"
    },
    tags: ["Pravidelný", "VIP"],
    status: "active",
    createdAt: new Date("2008-10-12"),
    updatedAt: new Date("2024-11-18")
  },
  {
    id: "22",
    personalInfo: {
      firstName: "Daniel",
      lastName: "Růžička",
      dateOfBirth: new Date("1989-12-10"),
      age: 35,
      gender: "male",
      phone: "+420 752 345 678",
      email: "daniel.ruzicka@email.cz",
      address: { street: "Ady Bohořové 12", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "",
      bloodType: "B-"
    },
    visitHistory: {
      firstVisit: new Date("2020-01-18"),
      lastVisit: new Date("2024-09-05"),
      totalVisits: 11,
      upcomingAppointments: 0,
      noShows: 2,
      cancellations: 2
    },
    preferences: {
      preferredDays: ["wednesday", "friday"],
      communicationChannel: "email",
      marketingConsent: true
    },
    financial: {
      totalSpent: 16700,
      lastPayment: new Date("2024-09-05"),
      paymentMethod: "card",
      insurance: "VOZP"
    },
    tags: [],
    status: "active",
    createdAt: new Date("2020-01-18"),
    updatedAt: new Date("2024-09-05")
  },
  {
    id: "23",
    personalInfo: {
      firstName: "Michaela",
      lastName: "Novotná",
      dateOfBirth: new Date("2000-06-14"),
      age: 24,
      gender: "female",
      phone: "+420 753 456 789",
      email: "michaela.novotna@email.cz",
      address: { street: "Částková 89", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "",
      bloodType: "O+"
    },
    visitHistory: {
      firstVisit: new Date("2024-03-20"),
      lastVisit: new Date("2024-11-25"),
      totalVisits: 2,
      upcomingAppointments: 0,
      noShows: 1,
      cancellations: 1
    },
    preferences: {
      preferredDays: ["friday"],
      communicationChannel: "whatsapp",
      marketingConsent: true
    },
    financial: {
      totalSpent: 2800,
      lastPayment: new Date("2024-11-25"),
      paymentMethod: "card",
      insurance: "OZP"
    },
    tags: ["Nový"],
    status: "active",
    createdAt: new Date("2024-03-20"),
    updatedAt: new Date("2024-11-25")
  },
  {
    id: "24",
    personalInfo: {
      firstName: "Zdeněk",
      lastName: "Válek",
      dateOfBirth: new Date("1970-08-30"),
      age: 54,
      gender: "male",
      phone: "+420 754 567 890",
      email: "zdenek.valek@email.cz",
      address: { street: "Husova 123", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "",
      bloodType: "AB-"
    },
    visitHistory: {
      firstVisit: new Date("2013-05-08"),
      lastVisit: new Date("2024-10-10"),
      totalVisits: 38,
      upcomingAppointments: 1,
      noShows: 1,
      cancellations: 1
    },
    preferences: {
      preferredDays: ["monday", "wednesday"],
      communicationChannel: "phone",
      marketingConsent: false
    },
    financial: {
      totalSpent: 51200,
      lastPayment: new Date("2024-10-10"),
      paymentMethod: "transfer",
      insurance: "VZP"
    },
    tags: ["Pravidelný", "VIP"],
    status: "active",
    createdAt: new Date("2013-05-08"),
    updatedAt: new Date("2024-10-10")
  },
  {
    id: "25",
    personalInfo: {
      firstName: "Nikola",
      lastName: "Bartošová",
      dateOfBirth: new Date("1994-02-19"),
      age: 30,
      gender: "female",
      phone: "+420 755 678 901",
      email: "nikola.bartosova@email.cz",
      address: { street: "Nádražní 234", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "Zájem o estetickou stomatologii",
      bloodType: "A-"
    },
    visitHistory: {
      firstVisit: new Date("2021-07-22"),
      lastVisit: new Date("2024-12-02"),
      totalVisits: 8,
      upcomingAppointments: 1,
      noShows: 0,
      cancellations: 0
    },
    preferences: {
      preferredDays: ["tuesday", "thursday"],
      communicationChannel: "email",
      marketingConsent: true
    },
    financial: {
      totalSpent: 19400,
      lastPayment: new Date("2024-12-02"),
      paymentMethod: "card",
      insurance: "ČPZP"
    },
    tags: ["Pravidelný"],
    status: "active",
    createdAt: new Date("2021-07-22"),
    updatedAt: new Date("2024-12-02")
  },
  {
    id: "26",
    personalInfo: {
      firstName: "Radek",
      lastName: "Holub",
      dateOfBirth: new Date("1985-04-25"),
      age: 39,
      gender: "male",
      phone: "+420 756 789 012",
      email: "radek.holub@email.cz",
      address: { street: "Částkova 67", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "",
      bloodType: "B+"
    },
    visitHistory: {
      firstVisit: new Date("2017-11-30"),
      lastVisit: new Date("2024-07-18"),
      totalVisits: 22,
      upcomingAppointments: 0,
      noShows: 3,
      cancellations: 4
    },
    preferences: {
      preferredDays: ["friday"],
      communicationChannel: "sms",
      marketingConsent: false
    },
    financial: {
      totalSpent: 34500,
      lastPayment: new Date("2024-07-18"),
      paymentMethod: "cash",
      insurance: "VZP"
    },
    tags: ["Rizikový"],
    status: "active",
    createdAt: new Date("2017-11-30"),
    updatedAt: new Date("2024-07-18")
  },
  {
    id: "27",
    personalInfo: {
      firstName: "Pavlína",
      lastName: "Málková",
      dateOfBirth: new Date("1977-10-03"),
      age: 47,
      gender: "female",
      phone: "+420 757 890 123",
      email: "pavlina.malkova@email.cz",
      address: { street: "Domažlická 45", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "",
      bloodType: "O-"
    },
    visitHistory: {
      firstVisit: new Date("2015-09-12"),
      lastVisit: new Date("2024-11-08"),
      totalVisits: 30,
      upcomingAppointments: 0,
      noShows: 0,
      cancellations: 1
    },
    preferences: {
      preferredDoctor: "MUDr. Jana Nováková",
      preferredDays: ["monday", "wednesday", "friday"],
      communicationChannel: "email",
      marketingConsent: true
    },
    financial: {
      totalSpent: 42600,
      lastPayment: new Date("2024-11-08"),
      paymentMethod: "card",
      insurance: "VZP"
    },
    tags: ["Pravidelný"],
    status: "active",
    createdAt: new Date("2015-09-12"),
    updatedAt: new Date("2024-11-08")
  },
  {
    id: "28",
    personalInfo: {
      firstName: "Stanislav",
      lastName: "Moravec",
      dateOfBirth: new Date("1963-01-28"),
      age: 61,
      gender: "male",
      phone: "+420 758 901 234",
      email: "stanislav.moravec@email.cz",
      address: { street: "Plzeňská 123", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: ["Hypertenze", "CHOPN"],
      medications: ["Losartan", "Spiriva"],
      notes: "Respirační problémy - opatrně",
      bloodType: "A+"
    },
    visitHistory: {
      firstVisit: new Date("2011-04-15"),
      lastVisit: new Date("2024-10-25"),
      totalVisits: 46,
      upcomingAppointments: 0,
      noShows: 0,
      cancellations: 0
    },
    preferences: {
      preferredDoctor: "MUDr. Jana Nováková",
      preferredDays: ["tuesday"],
      communicationChannel: "phone",
      marketingConsent: false
    },
    financial: {
      totalSpent: 64800,
      lastPayment: new Date("2024-10-25"),
      paymentMethod: "transfer",
      insurance: "VZP"
    },
    tags: ["Pravidelný", "VIP"],
    status: "active",
    createdAt: new Date("2011-04-15"),
    updatedAt: new Date("2024-10-25")
  },
  {
    id: "29",
    personalInfo: {
      firstName: "Ivana",
      lastName: "Sýkorová",
      dateOfBirth: new Date("1997-09-16"),
      age: 27,
      gender: "female",
      phone: "+420 759 012 345",
      email: "ivana.sykorova@email.cz",
      address: { street: "Koterovská 234", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "",
      bloodType: "B-"
    },
    visitHistory: {
      firstVisit: new Date("2023-05-10"),
      lastVisit: new Date("2024-11-28"),
      totalVisits: 4,
      upcomingAppointments: 0,
      noShows: 0,
      cancellations: 0
    },
    preferences: {
      preferredDays: ["wednesday", "thursday"],
      communicationChannel: "whatsapp",
      marketingConsent: true
    },
    financial: {
      totalSpent: 5600,
      lastPayment: new Date("2024-11-28"),
      paymentMethod: "card",
      insurance: "VOZP"
    },
    tags: [],
    status: "active",
    createdAt: new Date("2023-05-10"),
    updatedAt: new Date("2024-11-28")
  },
  {
    id: "30",
    personalInfo: {
      firstName: "Jiří",
      lastName: "Horák",
      dateOfBirth: new Date("1982-07-12"),
      age: 42,
      gender: "male",
      phone: "+420 760 123 456",
      email: "jiri.horak@email.cz",
      address: { street: "Štruncovy sady 67", city: "Plzeň", zip: "301 00" }
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      notes: "",
      bloodType: "O+"
    },
    visitHistory: {
      firstVisit: new Date("2016-08-20"),
      lastVisit: new Date("2024-09-15"),
      totalVisits: 26,
      upcomingAppointments: 0,
      noShows: 1,
      cancellations: 2
    },
    preferences: {
      preferredDays: ["monday", "friday"],
      communicationChannel: "email",
      marketingConsent: true
    },
    financial: {
      totalSpent: 36900,
      lastPayment: new Date("2024-09-15"),
      paymentMethod: "card",
      insurance: "VZP"
    },
    tags: ["Pravidelný"],
    status: "active",
    createdAt: new Date("2016-08-20"),
    updatedAt: new Date("2024-09-15")
  }
]
