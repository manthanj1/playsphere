export interface TurfItem {
  id: number;
  name: string;
  city: string;
  location: string;
  sport: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  availability: string;
  description: string;
  amenities: string[];
}

export interface EventTicketTier {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export interface EventHost {
  id: string;
  name: string;
  email: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  location: string;
  date: string;
  price: number;
  host: EventHost;
  tiers: EventTicketTier[];
}

export interface BookingItem {
  id: string;
  type: "turf" | "event";
  itemId: string;
  itemName: string;
  sportOrCategory: string;
  city: string;
  date: string;
  slots: string[];
  tierId?: string;
  tierName?: string;
  amount: number;
  platformFee: number;
  total: number;
  location: string;
  userEmail?: string;
  createdAt: string;
}

export interface UserProfileBackend {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  city: string;
  bookingsCount: number;
  tournamentsCount: number;
  imageUrl: string;
}

export const users: UserProfileBackend[] = [];

export function findUserByEmail(email: string) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}

export function createOrUpdateUser(userData: Omit<UserProfileBackend, 'id'>) {
  const existingUser = findUserByEmail(userData.email);
  if (existingUser) {
    Object.assign(existingUser, userData);
    return existingUser;
  }

  const newUser: UserProfileBackend = {
    id: `user-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    ...userData,
  };
  users.push(newUser);
  return newUser;
}

export function findBookingsByUserEmail(email: string) {
  return bookings.filter((booking) => booking.userEmail?.toLowerCase() === email.toLowerCase());
}

export const turfs: TurfItem[] = [
  {
    id: 1,
    name: "Spartan Box Cricket",
    city: "Ahmedabad",
    location: "Sindhu Bhavan Road",
    sport: "Cricket",
    price: 1200,
    rating: 4.8,
    reviews: 124,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGfeX0XI_wpvEB1xxJFMRJ2f-K3RKFTfO7uI91bcYsjBr4bcBHLT9y3EYSM9u0l6yDYB3arqXj1meUTnWT59643bCrQBpdml-w0pswnULSj_D5Y7q1Ey122B7AXtBz2sh1znbwuGFPRFctu670WL3vHP1tpr_AtKtYG0ddB2wyjhlGW0dLoDpJLAHQiQY5xZAcLvZTCJSQEqwiXACf6n3iU-abOn4Gw1ai2kQrh41gYPtpD-RXu3nFiA",
    availability: "Available Tonight",
    description: "Top-tier indoor box cricket arena with premium turf and LED floodlights. Ideal for competitive teams and weekend matches.",
    amenities: ["Free Parking", "RO Water", "LED Floodlights", "Cafeteria"],
  },
  {
    id: 2,
    name: "KickOff Football Arena",
    city: "Ahmedabad",
    location: "SG Highway",
    sport: "Football",
    price: 1500,
    rating: 4.9,
    reviews: 89,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWszFO7fxEiOqntziJH-UA_0cTaOkgvM8MTC6YL8Jq1JJstsQYLtGViWCrEidQzTi40uaIjb1xJP0mt6RqoRWH6DdVE3wJ2UaigICABlBBvASi53QkqyHf6Ca4zaYzOP0KvNjhBYYsHvcbeJ-swjj07xwnHel3QFrO4xmr_e9R9b2-nAVWin1E2k3eyhA81rNUb2nVoTa-fbWZPJmnDvi8cNqhFdQ4GJ2hIZbOKsw3x0_T9yhvRUF9dg",
    availability: "Next Slot: 8:00 PM",
    description: "Expansive outdoor football arena with FIFA-grade turf and premium coaching staff. Great for leagues and practice sessions.",
    amenities: ["Locker Rooms", "RO Water", "Spectator Seating", "Night Lighting"],
  },
  {
    id: 3,
    name: "Titan Padel Hub",
    city: "Ahmedabad",
    location: "Thaltej",
    sport: "Padel",
    price: 1800,
    rating: 4.9,
    reviews: 32,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIYAl0mhbrDKB0O6fLp583SWF_-3FxSM_Rcq6aG-mu4tZDrRZQYYFUeZ0IL3_UtT--uGg5bsxE_hmcVhppWwSvyg-GXP33RDyjdTS1Es6sNfjQy6DC8yieogTbvHjzVWjOr-AW-LOQ5wOQaSI0fDnR8jXW5IHLhpQEBbv4xVQsQqAqzo61zuCLCmrBzwaWr8ah8S8tk0VXYGiDGtGKjDc4DoTctkRglNI4PdHw79O623k31isvI5jnpQ",
    availability: "Available Tonight",
    description: "Modern padel courts with comfortable seating and a coaching team on standby. Perfect for doubles play and social matches.",
    amenities: ["Equipment Rental", "Refreshments", "LED Lighting", "Match Referees"],
  },
  {
    id: 4,
    name: "Diamond City Sports Hub",
    city: "Surat",
    location: "Vesu",
    sport: "Cricket",
    price: 1000,
    rating: 4.7,
    reviews: 210,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGfeX0XI_wpvEB1xxJFMRJ2f-K3RKFTfO7uI91bcYsjBr4bcBHLT9y3EYSM9u0l6yDYB3arqXj1meUTnWT59643bCrQBpdml-w0pswnULSj_D5Y7q1Ey122B7AXtBz2sh1znbwuGFPRFctu670WL3vHP1tpr_AtKtYG0ddB2wyjhlGW0dLoDpJLAHQiQY5xZAcLvZTCJSQEqwiXACf6n3iU-abOn4Gw1ai2kQrh41gYPtpD-RXu3nFiA",
    availability: "Filling Fast",
    description: "Spacious cricket ground with turf wickets and an energetic local crowd. Ideal for tournament play and friendly matches.",
    amenities: ["Changing Rooms", "Food Court", "First Aid", "Coach on Call"],
  },
  {
    id: 5,
    name: "Tapi Green Football",
    city: "Surat",
    location: "Adajan",
    sport: "Football",
    price: 1400,
    rating: 4.6,
    reviews: 167,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWszFO7fxEiOqntziJH-UA_0cTaOkgvM8MTC6YL8Jq1JJstsQYLtGViWCrEidQzTi40uaIjb1xJP0mt6RqoRWH6DdVE3wJ2UaigICABlBBvASi53QkqyHf6Ca4zaYzOP0KvNjhBYYsHvcbeJ-swjj07xwnHel3QFrO4xmr_e9R9b2-nAVWin1E2k3eyhA81rNUb2nVoTa-fbWZPJmnDvi8cNqhFdQ4GJ2hIZbOKsw3x0_T9yhvRUF9dg",
    availability: "Available Tomorrow",
    description: "Professional football field with natural turf and advanced goalkeeping facilities. A favorite for amateur leagues.",
    amenities: ["Ball Rental", "Spectator Stands", "Cafeteria", "First Aid"],
  },
  {
    id: 6,
    name: "Surat Tennis Academy",
    city: "Surat",
    location: "Piplod",
    sport: "Tennis",
    price: 900,
    rating: 4.8,
    reviews: 88,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIYAl0mhbrDKB0O6fLp583SWF_-3FxSM_Rcq6aG-mu4tZDrRZQYYFUeZ0IL3_UtT--uGg5bsxE_hmcVhppWwSvyg-GXP33RDyjdTS1Es6sNfjQy6DC8yieogTbvHjzVWjOr-AW-LOQ5wOQaSI0fDnR8jXW5IHLhpQEBbv4xVQsQqAqzo61zuCLCmrBzwaWr8ah8S8tk0VXYGiDGtGKjDc4DoTctkRglNI4PdHw79O623k31isvI5jnpQ",
    availability: "Available Now",
    description: "High-performance tennis courts with practice walls, coaching spaces, and tournament-grade surfacing.",
    amenities: ["Coach Training", "Refreshments", "Indoor Courts", "Secure Lockers"],
  },
  {
    id: 7,
    name: "Banyan City Box",
    city: "Vadodara",
    location: "Alkapuri",
    sport: "Cricket",
    price: 1100,
    rating: 4.5,
    reviews: 56,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGfeX0XI_wpvEB1xxJFMRJ2f-K3RKFTfO7uI91bcYsjBr4bcBHLT9y3EYSM9u0l6yDYB3arqXj1meUTnWT59643bCrQBpdml-w0pswnULSj_D5Y7q1Ey122B7AXtBz2sh1znbwuGFPRFctu670WL3vHP1tpr_AtKtYG0ddB2wyjhlGW0dLoDpJLAHQiQY5xZAcLvZTCJSQEqwiXACf6n3iU-abOn4Gw1ai2kQrh41gYPtpD-RXu3nFiA",
    availability: "Next Slot: 9:00 PM",
    description: "Premium box cricket experience with fast-paced nets and strategic lighting. Comfortable seating for teams and guests.",
    amenities: ["Washrooms", "Hydration Station", "LED Lights", "Scoreboard"],
  },
  {
    id: 8,
    name: "Vadodara Multi-Sport Arena",
    city: "Vadodara",
    location: "Sama-Savli Road",
    sport: "Multi-sport",
    price: 1300,
    rating: 4.7,
    reviews: 142,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCALijbBIkKtCLNRjYE26kZ8HXn2wPWzKImGBd6WTKylX9XeYw8ENhGlI3DFh_g-PQTzfS8FfvLvKXDR1Yvgq3UCDDEpvf28UuRVFw-UJy9IM5lc__h3I1WJfQuHXKYoRCOcu6z7ButltxHOF-2z5d8HVCPunwtunrYEa8Q3cwyWRdGMqmB2bIpjYFX0MqA2icSArQRTjag9m19j1VOoQm84wMLdAQg8p8TjOTsUhWUY0tOEGjBEhG4sQ",
    availability: "Available Tonight",
    description: "Versatile multi-sport arena hosting basketball, volleyball, and futsal. Designed for team training and corporate tournaments.",
    amenities: ["Multipurpose Courts", "Sound System", "Air Cooling", "Refreshments"],
  }
];

export const events: EventItem[] = [
  {
    id: "event-1",
    title: "Ahmedabad Summer Sports Fest",
    description: "A weekend celebration of cricket, soccer, and fitness workouts at the Ahmedabad Exhibition Grounds.",
    category: "Sports",
    city: "Ahmedabad",
    location: "Ahmedabad Exhibition Grounds",
    date: "2026-09-10T17:00:00.000Z",
    price: 799,
    host: { id: "host-1", name: "PlaySphere Admin", email: "admin@playsphere.test" },
    tiers: [
      { id: "standard", name: "Standard Pass", price: 799, features: ["Access to all sports arenas", "Free hydration", "Spectator access"] },
      { id: "vip", name: "VIP Pass", price: 1499, features: ["Prime seating", "VIP lounge", "Complimentary snacks"] },
    ],
  },
  {
    id: "event-2",
    title: "Surat Power Yoga Championship",
    description: "A full-day yoga and wellness event with expert instructors and mindful sound baths.",
    category: "Wellness",
    city: "Surat",
    location: "Surat Yoga Complex",
    date: "2026-09-18T08:30:00.000Z",
    price: 599,
    host: { id: "host-2", name: "Yoga for Life", email: "contact@yogaforlife.test" },
    tiers: [
      { id: "general", name: "General Admission", price: 599, features: ["Event entry", "Workshop access"] },
      { id: "premium", name: "Premium", price: 1199, features: ["Front row access", "Meditation kit", "Refreshments"] },
    ],
  },
  {
    id: "event-3",
    title: "Gandhinagar Night Marathon",
    description: "A scenic night run through Gandhinagar with live music, hydration packs, and finish-line celebrations.",
    category: "Sports",
    city: "Gandhinagar",
    location: "Gandhinagar Riverfront",
    date: "2026-10-05T19:00:00.000Z",
    price: 999,
    host: { id: "host-3", name: "RunTogether", email: "hello@runtogether.test" },
    tiers: [
      { id: "participant", name: "Participant", price: 999, features: ["Entry bib", "Hydration", "Medal"] },
      { id: "elite", name: "Elite Runner", price: 1799, features: ["Priority start", "Recovery kit", "VIP lounge"] },
    ],
  },
  {
    id: "event-4",
    title: "Vadodara Garba Nights",
    description: "An electrifying Navratri celebration with live music, professional garba performers, and vibrant decor.",
    category: "Cultural",
    city: "Vadodara",
    location: "Vadodara Exhibition Centre",
    date: "2026-10-16T20:00:00.000Z",
    price: 499,
    host: { id: "host-4", name: "Garba Central", email: "connect@garbacentral.test" },
    tiers: [
      { id: "regular", name: "Regular Entry", price: 499, features: ["General seating", "Live show access"] },
      { id: "premium", name: "Premium Section", price: 999, features: ["Front row seating", "Refreshments"] },
    ],
  },
  {
    id: "event-5",
    title: "Ahmedabad Jazz & Food Carnival",
    description: "A musical evening with jazz artists, gourmet food stalls, and artisanal market pop-ups.",
    category: "Music",
    city: "Ahmedabad",
    location: "The Amphitheatre",
    date: "2026-11-02T18:00:00.000Z",
    price: 1299,
    host: { id: "host-5", name: "Melody Makers", email: "info@melodymakers.test" },
    tiers: [
      { id: "general", name: "General", price: 1299, features: ["Concert access", "Food vouchers"] },
      { id: "vip", name: "VIP", price: 2299, features: ["Lounge seating", "Meet & greet"] },
    ],
  },
  {
    id: "event-6",
    title: "Surat Wellness Retreat",
    description: "A weekend retreat focused on yoga, breathing sessions, and wellness workshops in a serene resort setting.",
    category: "Wellness",
    city: "Surat",
    location: "Tapi Valley Resort",
    date: "2026-11-12T09:00:00.000Z",
    price: 1499,
    host: { id: "host-6", name: "WellPath", email: "hello@wellpath.test" },
    tiers: [
      { id: "retreat", name: "Retreat Pass", price: 1499, features: ["All workshops", "Wellness kit"] },
      { id: "deluxe", name: "Deluxe Pass", price: 2499, features: ["Private session", "Spa access"] },
    ],
  },
  {
    id: "event-7",
    title: "Gandhinagar Tech Sports Meetup",
    description: "A niche event connecting tech enthusiasts with friendly sports competitions and networking opportunities.",
    category: "Sports",
    city: "Gandhinagar",
    location: "Capital Sports Complex",
    date: "2026-12-05T16:00:00.000Z",
    price: 299,
    host: { id: "host-7", name: "TechPlay", email: "events@techplay.test" },
    tiers: [
      { id: "general", name: "General Admission", price: 299, features: ["Match access", "Networking"] },
      { id: "pro", name: "Pro Admission", price: 599, features: ["Workshop access", "Complimentary snacks"] },
    ],
  },
  {
    id: "event-8",
    title: "Ahmedabad Rock & Rhythm Night",
    description: "A high-energy music concert featuring top Indian rock acts and gourmet street food stalls.",
    category: "Music",
    city: "Ahmedabad",
    location: "The Arena",
    date: "2026-11-15T19:30:00.000Z",
    price: 1599,
    host: { id: "host-8", name: "Rhythm House", email: "contact@rhythmhouse.test" },
    tiers: [
      { id: "standard", name: "General", price: 1599, features: ["Standard seating", "Concert access"] },
      { id: "vip", name: "VIP", price: 2799, features: ["VIP lounge", "Backstage access"] },
    ],
  },
  {
    id: "event-9",
    title: "Surat Family Fun Run",
    description: "A family-friendly 5km fun run with music, food stalls, and kid-friendly competitions.",
    category: "Sports",
    city: "Surat",
    location: "Tapi Riverfront",
    date: "2026-10-25T07:00:00.000Z",
    price: 699,
    host: { id: "host-9", name: "Family Run Co.", email: "hello@familyrun.test" },
    tiers: [
      { id: "runner", name: "Runner", price: 699, features: ["Race bib", "Hydration pack", "Medal"] },
      { id: "family", name: "Family Bundle", price: 1799, features: ["4 runner entries", "Family tent"] },
    ],
  },
  {
    id: "event-10",
    title: "Vadodara Street Food Festival",
    description: "A delicious cultural festival with 50+ food stalls, live performances, and local artisans.",
    category: "Cultural",
    city: "Vadodara",
    location: "Alkapuri Chakla",
    date: "2026-11-01T17:00:00.000Z",
    price: 399,
    host: { id: "host-10", name: "TasteBuds Collective", email: "events@tastebuds.test" },
    tiers: [
      { id: "general", name: "General", price: 399, features: ["Festival entry", "Food tasting vouchers"] },
      { id: "vip", name: "VIP", price: 799, features: ["Priority line", "Premium seating"] },
    ],
  }
];

export const bookings: BookingItem[] = [];

export function createBooking(payload: Omit<BookingItem, "id" | "createdAt">) {
  const booking: BookingItem = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  return booking;
}
