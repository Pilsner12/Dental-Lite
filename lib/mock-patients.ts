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
      totalVisits: 12,
      upcomingAppointments: 0,
      noShows: 1,
      cancellations: 2
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
      insurance: "VZP"
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
      cancellations: 1
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
      insurance: "VZP"
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
