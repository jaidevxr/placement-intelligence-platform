// 60+ real Indian colleges for placement data
export const SEED_COLLEGES = [
  // IITs
  { slug: "iit-bombay", name: "IIT Bombay", short_name: "IITB", city: "Mumbai", state: "Maharashtra", is_featured: true },
  { slug: "iit-delhi", name: "IIT Delhi", short_name: "IITD", city: "New Delhi", state: "Delhi", is_featured: true },
  { slug: "iit-madras", name: "IIT Madras", short_name: "IITM", city: "Chennai", state: "Tamil Nadu", is_featured: true },
  { slug: "iit-kanpur", name: "IIT Kanpur", short_name: "IITK", city: "Kanpur", state: "Uttar Pradesh", is_featured: true },
  { slug: "iit-kharagpur", name: "IIT Kharagpur", short_name: "IITKgp", city: "Kharagpur", state: "West Bengal", is_featured: true },
  { slug: "iit-roorkee", name: "IIT Roorkee", short_name: "IITR", city: "Roorkee", state: "Uttarakhand", is_featured: true },
  { slug: "iit-guwahati", name: "IIT Guwahati", short_name: "IITG", city: "Guwahati", state: "Assam", is_featured: true },
  { slug: "iit-hyderabad", name: "IIT Hyderabad", short_name: "IITH", city: "Hyderabad", state: "Telangana", is_featured: true },
  { slug: "iit-bhu", name: "IIT (BHU) Varanasi", short_name: "IIT BHU", city: "Varanasi", state: "Uttar Pradesh", is_featured: true },
  { slug: "iit-dhanbad", name: "IIT (ISM) Dhanbad", short_name: "IIT ISM", city: "Dhanbad", state: "Jharkhand", is_featured: false },
  { slug: "iit-indore", name: "IIT Indore", short_name: "IITI", city: "Indore", state: "Madhya Pradesh", is_featured: false },
  { slug: "iit-patna", name: "IIT Patna", short_name: "IITP", city: "Patna", state: "Bihar", is_featured: false },
  { slug: "iit-gandhinagar", name: "IIT Gandhinagar", short_name: "IITGN", city: "Gandhinagar", state: "Gujarat", is_featured: false },

  // NITs
  { slug: "nit-trichy", name: "NIT Tiruchirappalli", short_name: "NIT-T", city: "Tiruchirappalli", state: "Tamil Nadu", is_featured: true },
  { slug: "nit-warangal", name: "NIT Warangal", short_name: "NITW", city: "Warangal", state: "Telangana", is_featured: true },
  { slug: "nit-surathkal", name: "NIT Karnataka (Surathkal)", short_name: "NITK", city: "Mangalore", state: "Karnataka", is_featured: true },
  { slug: "nit-calicut", name: "NIT Calicut", short_name: "NITC", city: "Kozhikode", state: "Kerala", is_featured: false },
  { slug: "nit-rourkela", name: "NIT Rourkela", short_name: "NITR", city: "Rourkela", state: "Odisha", is_featured: false },
  { slug: "nit-allahabad", name: "MNNIT Allahabad", short_name: "MNNIT", city: "Prayagraj", state: "Uttar Pradesh", is_featured: false },
  { slug: "nit-nagpur", name: "VNIT Nagpur", short_name: "VNIT", city: "Nagpur", state: "Maharashtra", is_featured: false },
  { slug: "nit-jaipur", name: "MNIT Jaipur", short_name: "MNIT", city: "Jaipur", state: "Rajasthan", is_featured: false },
  { slug: "nit-bhopal", name: "MANIT Bhopal", short_name: "MANIT", city: "Bhopal", state: "Madhya Pradesh", is_featured: false },
  { slug: "nit-durgapur", name: "NIT Durgapur", short_name: "NITDGP", city: "Durgapur", state: "West Bengal", is_featured: false },
  { slug: "nit-silchar", name: "NIT Silchar", short_name: "NITS", city: "Silchar", state: "Assam", is_featured: false },

  // IIITs
  { slug: "iiit-hyderabad", name: "IIIT Hyderabad", short_name: "IIITH", city: "Hyderabad", state: "Telangana", is_featured: true },
  { slug: "iiit-delhi", name: "IIIT Delhi", short_name: "IIITD", city: "New Delhi", state: "Delhi", is_featured: true },
  { slug: "iiit-bangalore", name: "IIIT Bangalore", short_name: "IIITB", city: "Bangalore", state: "Karnataka", is_featured: true },
  { slug: "iiit-allahabad", name: "IIIT Allahabad", short_name: "IIITA", city: "Prayagraj", state: "Uttar Pradesh", is_featured: false },

  // BITS
  { slug: "bits-pilani", name: "BITS Pilani", short_name: "BITS-P", city: "Pilani", state: "Rajasthan", is_featured: true },
  { slug: "bits-goa", name: "BITS Pilani Goa", short_name: "BITS-G", city: "Goa", state: "Goa", is_featured: false },
  { slug: "bits-hyderabad", name: "BITS Pilani Hyderabad", short_name: "BITS-H", city: "Hyderabad", state: "Telangana", is_featured: false },

  // Delhi Universities
  { slug: "dtu-delhi", name: "Delhi Technological University", short_name: "DTU", city: "New Delhi", state: "Delhi", is_featured: true },
  { slug: "nsut-delhi", name: "Netaji Subhas University of Technology", short_name: "NSUT", city: "New Delhi", state: "Delhi", is_featured: false },
  { slug: "iiitd-delhi", name: "Indraprastha Institute of IT Delhi", short_name: "IIITD", city: "New Delhi", state: "Delhi", is_featured: false },

  // Private Universities
  { slug: "vit-vellore", name: "VIT Vellore", short_name: "VIT", city: "Vellore", state: "Tamil Nadu", is_featured: false },
  { slug: "srm-chennai", name: "SRM Institute of Science and Technology", short_name: "SRM", city: "Chennai", state: "Tamil Nadu", is_featured: false },
  { slug: "manipal-mit", name: "Manipal Institute of Technology", short_name: "MIT Manipal", city: "Manipal", state: "Karnataka", is_featured: false },
  { slug: "kiit-bhubaneswar", name: "KIIT University", short_name: "KIIT", city: "Bhubaneswar", state: "Odisha", is_featured: false },
  { slug: "lpu-jalandhar", name: "Lovely Professional University", short_name: "LPU", city: "Phagwara", state: "Punjab", is_featured: false },
  { slug: "amity-noida", name: "Amity University", short_name: "Amity", city: "Noida", state: "Uttar Pradesh", is_featured: false },
  { slug: "chandigarh-university", name: "Chandigarh University", short_name: "CU", city: "Mohali", state: "Punjab", is_featured: false },
  { slug: "thapar-patiala", name: "Thapar Institute of Engineering", short_name: "Thapar", city: "Patiala", state: "Punjab", is_featured: false },
  { slug: "pec-chandigarh", name: "PEC University of Technology", short_name: "PEC", city: "Chandigarh", state: "Chandigarh", is_featured: false },
  { slug: "jadavpur-kolkata", name: "Jadavpur University", short_name: "JU", city: "Kolkata", state: "West Bengal", is_featured: false },
  { slug: "coep-pune", name: "COEP Technological University", short_name: "COEP", city: "Pune", state: "Maharashtra", is_featured: false },
  { slug: "rvce-bangalore", name: "RV College of Engineering", short_name: "RVCE", city: "Bangalore", state: "Karnataka", is_featured: false },
  { slug: "bmsce-bangalore", name: "BMS College of Engineering", short_name: "BMSCE", city: "Bangalore", state: "Karnataka", is_featured: false },
  { slug: "pesit-bangalore", name: "PES University", short_name: "PESU", city: "Bangalore", state: "Karnataka", is_featured: false },

  // ═══════════════ BBD — SPECIAL COLLEGE ═══════════════
  { slug: "bbd-lucknow", name: "BBD University", short_name: "BBDU", city: "Lucknow", state: "Uttar Pradesh", is_featured: true },
  { slug: "bbdnitm-lucknow", name: "BBDNITM (BBD National Institute of Technology & Management)", short_name: "BBDNITM", city: "Lucknow", state: "Uttar Pradesh", is_featured: true },

  // More UP / North India
  { slug: "iec-ghaziabad", name: "IEC College of Engineering", short_name: "IEC", city: "Greater Noida", state: "Uttar Pradesh", is_featured: false },
  { slug: "galgotias-noida", name: "Galgotias University", short_name: "GU", city: "Greater Noida", state: "Uttar Pradesh", is_featured: false },
  { slug: "glbitm-noida", name: "GL Bajaj Institute of Technology", short_name: "GLBITM", city: "Greater Noida", state: "Uttar Pradesh", is_featured: false },
  { slug: "aktu-lucknow", name: "AKTU (Dr. APJ Abdul Kalam Technical University)", short_name: "AKTU", city: "Lucknow", state: "Uttar Pradesh", is_featured: false },
  { slug: "knit-sultanpur", name: "KNIT Sultanpur", short_name: "KNIT", city: "Sultanpur", state: "Uttar Pradesh", is_featured: false },
  { slug: "hbtu-kanpur", name: "HBTU Kanpur", short_name: "HBTU", city: "Kanpur", state: "Uttar Pradesh", is_featured: false },
  { slug: "iiit-lucknow", name: "IIIT Lucknow", short_name: "IIITL", city: "Lucknow", state: "Uttar Pradesh", is_featured: false },
  { slug: "srmcem-lucknow", name: "SRMCEM Lucknow", short_name: "SRMCEM", city: "Lucknow", state: "Uttar Pradesh", is_featured: false },
  { slug: "iet-lucknow", name: "IET Lucknow (Dr. Ambedkar)", short_name: "IET", city: "Lucknow", state: "Uttar Pradesh", is_featured: false },
];
