import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data for NIT Trichy faculty members...');

  // 1. Get CSE Department
  let cseDept = await prisma.department.findUnique({ where: { code: 'cse' } });
  if (!cseDept) {
    cseDept = await prisma.department.create({
      data: { name: 'Computer Science & Engineering', code: 'cse' }
    });
  }
  let eceDept = await prisma.department.findUnique({ where: { code: 'ece' } });
  if (!eceDept) {
    eceDept = await prisma.department.create({
      data: { name: 'Electronics and Communication Engineering', code: 'ece' }
    });
  }

  const facultyList: any[] = [
    {
      email: 'ssk@nitt.edu',
      name: "Dr. Selvakumar Subramanian",
      designation: "Professor (HAG)",
      phone: "94438 35520",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-06/ssk.jpg.webp?itok=JVzmHHYR",
      researchTags: "Computer Networks, High Speed Networks, Distributed Computing, Network Security, Basics of Programming, Computer Organization, Operating Systems, Computer Architecture, Microprocessor Systems, Network Principles and Protocols, Advanced Network Principles and Protocols, Advanced Computer Organization",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'srajeswari@nitt.edu',
      name: "Dr. (Ms.) Rajeswari Sridhar",
      designation: "Professor",
      phone: "0431-2503205",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-03/Rajisheri.png.webp?itok=1IP9IvDY",
      researchTags: "Compilers, Algorithms, Machine learning, NLP, Cloud Computing, Social Media analysis",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'nrs@nitt.edu',
      name: "Dr. N Ramasubramanian",
      designation: "Professor",
      phone: "0431-2503204",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-06/nrs_0.jpeg.webp?itok=KFDVu64g",
      researchTags: "Multi-core Computer Architecture, Advanced Digital Design, Reconfigurable computing, Processor Design for ML and AI, Security Hardware",
      education: [
        { degree: "PhD", institution: "IIT Madras", year: 0, details: "Computer Science" }
      ],
      experience: [
        { title: "Senior Project Officer - VOIS Project", organization: "IIT, Madras.", from: "Sept. 1989", to: "Apr. 1991" },
        { title: "Lecturer – MIT CAMPUS MADRAS", organization: "Anna University", from: "Oct. 1991", to: "Aug. 1996" },
        { title: "Assistant Professor – CSE", organization: "NIT, Tiruchirappalli", from: "Aug. 1996", to: "Dec. 2005" },
        { title: "Associate Professor – CSE", organization: "NIT, Tiruchirappalli", from: "Jan. 2006", to: "Dec. 2018" },
        { title: "Professor", organization: "NIT, Tiruchirappalli", from: "Jan. 2018", to: "Till Date" }
      ],
      responsibilities: [
        { position: "Head of CSE Department", organization: "Department of CSE", from: "Dec. 2005", to: "Mar. 2009", type: "INTERNAL" },
        { position: "Additional Chief Warden", organization: "NIT, Trichy", from: "Sept. 2015", to: "Feb. 2018", type: "INTERNAL" },
        { position: "Chairman, PAC", organization: "Dept. of CSE (UG/ PG)", from: "Jul. 2006", to: "Ongoing", type: "INTERNAL" },
        { position: "Ph.D. Admissions", organization: "Dept. of CSE", from: "Oct. 2006", to: "Ongoing", type: "INTERNAL" },
        { position: "Member Board of Studies", organization: "SASTRA University", from: "2008", to: "Till Date", type: "EXTERNAL" },
        { position: "Member Board of Studies", organization: "Anna University, Chennai", from: "2009", to: "2012", type: "EXTERNAL" },
        { position: "Ph. D. Examiner", organization: "Anna University, Chennai", from: "2012", to: "Till Date", type: "EXTERNAL" }
      ],
      awards: [
        { title: "Distinguished Alumnus Award", awardedBy: "NIT TRICHY", year: 2015 },
        { title: "Award for Maximum number of Publications", awardedBy: "NIT TRICHY during Institute Day", year: 2017 },
        { title: "Intel Appreciation Award", awardedBy: "Intel India Bangalore", year: 2018 }
      ],
      projects: [
        { title: "Energy Efficient Implementation of Multi-Modular Exponential Techniques for Public-key Cryptosystems", fundingAgency: "DST", amount: "", duration: "2019-2021", status: "Completed" }
      ],
      phds: [
        { studentName: "Satyanarayana Vollala", thesisTitle: "Novel Energy Efficient Modular Exponential Techniques for Public-Key Cryptography", role: "Supervisor", year: 2017 },
        { studentName: "Manjith B. C", thesisTitle: "Enhancing Performance of FPGA based AES implementations for improved security", role: "Supervisor", year: 2018 },
        { studentName: "B. Shameedha Begum", thesisTitle: "Studies on Performance Evaluation of Reconfigurable Embedded Data Cache", role: "Supervisor", year: 2019 },
        { studentName: "P. S. Tamizharasan", thesisTitle: "Studies on the performance of GPU Architectures", role: "Supervisor", year: 2019 },
        { studentName: "J. Kokila", thesisTitle: "Enhancing Security and Reliability of Heterogeneous IPs for SoC FPGAs", role: "Supervisor", year: 2019 },
        { studentName: "R. Sathaana", thesisTitle: "Improving the performance of design space exploration for architectural synthesis", role: "Supervisor", year: 2020 }
      ],
      talks: [
        { topic: "Domain Specific Architecture", organization: "National College, Trichy", date: "September-2018" }
      ],
      memberships: [],
      patents: []
    },
    {
      email: 'mala@nitt.edu',
      name: "Dr. C. Mala",
      designation: "Professor",
      phone: "94435 59523",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-06/c.mala_.jpg.webp?itok=rn5lHZIE",
      researchTags: "Internet of Things, Wireless Sensor Networks, Machine Learning, Deep Learning, High Performance Computing, Network Security & Web Services, Image Processing",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'leela@nitt.edu',
      name: "Dr. (Mrs.) R. Leela Velusamy",
      designation: "Professor",
      phone: "94435 59523",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-06/leela.jpg.webp?itok=7mLeWzzi",
      researchTags: "Cryptography, Network Security",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'rmohan.nitt@gmail.com',
      name: "Dr. R. Mohan",
      designation: "Associate Professor",
      phone: "9442421326",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-06/R.Mohan_.jpg.webp?itok=tCM1ugzt",
      researchTags: "Computer Vision, Cyber Security, Distributed Systems, High Performance Computing, Machine Learning & Deep Learning, Security Engineering, Software Engineering, Wireless Sensor Networks",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'sjaya@nitt.edu',
      name: "Dr. S. Jaya Nirmala",
      designation: "Associate Professor",
      phone: "0431-2503200",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-06/JAYA_NIRMALA%20%281%29.png.webp?itok=XayHoEu_",
      researchTags: "Artificial Intelligence, Data Mining, Big Data Analytics",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'kunwar@nitt.edu',
      name: "Dr. Kunwar Singh",
      designation: "Associate Professor",
      phone: "0431-2503212",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-03/kunwar.jpg.webp?itok=yNTck1Gb",
      researchTags: "Cryptography",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'nithya@nitt.edu',
      name: "Dr. B. Nithya",
      designation: "Associate Professor",
      phone: "0431-2503214",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-06/nithya.jpg.webp?itok=MPktZs1_",
      researchTags: "Wireless Networks (Mobile ad-hoc Network, Wireless Sensor Network, Internet of things, Wireless Body Area Network, Unmanned Aerial Vehicle, Internet of Vehicles), Advanced Data Structures and Optimization Algorithms",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'sivasankar@nitt.edu',
      name: "Dr. E.Sivasankar",
      designation: "Associate Professor",
      phone: "0431-2503213",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-06/SivaSankar.jpeg.webp?itok=KvFyIA0W",
      researchTags: "Databases, Data Mining, Artificial Intelligence, Big Data Analytics",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'msridevi@nitt.edu',
      name: "Dr. M.Sridevi",
      designation: "Associate Professor",
      phone: "04312503217",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-06/sridevifinal.jpg.webp?itok=Dl2tniGZ",
      researchTags: "Computer Vision & Image Processing, Virtual Reality, Parallel Processing, Machine & Deep learning Algorithms",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'msb@nitt.edu',
      name: "Dr. S. Mary Saira Bhanu",
      designation: "Associate Professor",
      phone: "0431 2503207",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-06/marysaira.png.webp?itok=l2BDZxVh",
      researchTags: "Operating Systems, Computer Networks, Network Security, Wireless Networks, Distributed Computing, Grid Computing, Cloud Computing and Fog Computing, Big Data Analytics.",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'brindham@nitt.edu',
      name: "Dr. M.Brindha",
      designation: "Associate Professor",
      phone: "04312503217",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-06/brinda.jpg.webp?itok=pUIsWKO0",
      researchTags: "Multimedia security, Image Quality Assessment, Computer Vision, Data Science, Database, Full Stack Development, Deep learning",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'kamalika@nitt.edu',
      name: "Dr. Kamalika Bhattacharjee",
      designation: "Assistant Professor",
      phone: "0431-2503219",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-06/kamalika_0.jpg.webp?itok=wj3Nv6rH",
      researchTags: "Theoretical Computer Science",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'balakrishnan@nitt.edu',
      name: "Dr. R. Bala Krishnan",
      designation: "Assistant Professor",
      phone: "",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-06/R.Bala%20Krishnan_CSE.jpg.webp?itok=Ti44lFl0",
      researchTags: "Text Steganography, Information Security, Network Security, Network Protocols, Android Security, Android Apps, Machine Learning, Deep Learning, Natural Language Processing",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'pavan@nitt.edu',
      name: "Dr. Jakkepalli Pavan Kumar",
      designation: "Assistant Professor",
      phone: "0431 250 3202",
      office: "Department of CSE, NIT Trichy",
      profileImage: "",
      researchTags: "Graph Theory and Algorithms, Computer Networks",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'oswald@nitt.edu',
      name: "Dr. Oswald C",
      designation: "Assistant Professor",
      phone: "9941313457",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-06/Oswald.jpg.webp?itok=fw4EDXiM",
      researchTags: "Data Mining, Computational Science for Social Good, Machine Learning, Natural Language Processing, Human Computer Interaction",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'shameedha@nitt.edu',
      name: "Dr. B.Shameedha Begum",
      designation: "Assistant Professor",
      phone: "0431-2503215",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-06/shameedha.jpg.webp?itok=EGwGaOYr",
      researchTags: "Computer Architechure",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'usha@nitt.edu',
      name: "Dr. S. Usha Kiruthika",
      designation: "Assistant Professor",
      phone: "9444446959",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-06/usha.jpg.webp?itok=e39Yo_Mq",
      researchTags: "Multi-agent systems, Artificial Intelligence, Cloud Computing",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'vijayana@nitt.edu',
      name: "Dr. A. Santhanavijayan",
      designation: "Assistant Professor",
      phone: "04312503217",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-06/vijayan.png.webp?itok=2FVmoYpF",
      researchTags: "Semantic Web, Web Mining, Machine Learning, Ontology Engineering, Web Intelligence, Natural Language Processing, Deep Learning, Artificial Intelligence",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'sitara@nitt.edu',
      name: "Dr. K.Sitara",
      designation: "Assistant Professor",
      phone: "0431-2503200",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-06/sitara.jpeg.webp?itok=iC-WI7zT",
      researchTags: "Cyber Forensics, Video surveillance, Multimedia Forensics",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'saikrishna@nitt.edu',
      name: "Dr. Sai Krishna Mothku",
      designation: "Assistant Professor",
      phone: "0431-2503219",
      office: "Department of CSE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/styles/thumbnail/public/2025-06/sai.jpg.webp?itok=40cUzewy",
      researchTags: "Wireless ad-hoc Networks, Wireless Sensor Networks, Internet of Things, Cloud, Fog and Edge Computing",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    }

  ];

  const eceFacultyList: any[] = [
    {
      email: 'avikhati@nitt.edu',
      name: "Dr. AVIK HATI",
      designation: "Assistant Professor",
      phone: "",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/avik.jpg",
      researchTags: "Image Processing, Computer Vision and Machine Learning: image co-segmentation, subgraph matching, image saliency, scene analysis, robust computer vision, adversarial machine learning",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'bnkreddy@nitt.edu',
      name: "Dr. B. Naresh Kumar Reddy",
      designation: "Assistant Professor",
      phone: "0431-2503333",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/BNKReddy%20%281%29.jpg",
      researchTags: "FPGA Architectures, VLSI and Embedded Systems, System-on-Chip / Multi Processor System-on-Chip/ Network-on-Chip, Reconfigurable Architectures, System design using RISC-V cores.",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'rebekka@nitt.edu',
      name: "Dr. B.Rebekka",
      designation: "Associate Professor",
      phone: "0431-2503316",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/rebekka%20profile%20picture.png",
      researchTags: "Quality of Service Provisioning in Wireless Networks, Radio Resource Allocation, Energy Efficiency in Heterogeneous Networks, Wireless Powered Communication, Wireless Sensor Networks, Artificial Intelligence for Wireless Communication networks, Microwave Antennas",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'srk@nitt.edu',
      name: "Dr. D. Sriram Kumar",
      designation: "Professor",
      phone: "0431 2503311",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/975_374_sriram1.jpg",
      researchTags: "Microwave integrated circuits, Optical networks, Smart antennas, Carbon nanotube antennas, Free space optics, Optical & Reconfigurable antennas, Flexible electronics, Photonics",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'esgopi@nitt.edu',
      name: "Dr. E. S. Gopi",
      designation: "Professor",
      phone: "914312503314",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/gopi_photo.png",
      researchTags: "Investigations on Linear Discriminant Analysis, Machine intelligence, pattern recognition, statistical signal processing, and computational intelligence, Applications: Image processing, Speech processing, wireless communication, Bio-medical signal processing and other signal processing.",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'thavasi@nitt.edu',
      name: "Dr. G. Thavasi Raja",
      designation: "Associate Professor",
      phone: "0431-2503317",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/download%20%281%29.jpeg",
      researchTags: "Electronics and Communication Engineering",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'hemant@nitt.edu',
      name: "Dr. Hemant Kumar",
      designation: "Assistant Professor",
      phone: "0431-250-3328",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/DSC_8546-15.jpg",
      researchTags: "Electromagnetics: Smith Chart, Transmission Lines, Antennas: Broadband, Microstrip, Substrate Integrated Waveguide, Microwave Passive Circuits: Couplers, Power Divider & Combiners, Filters, Radar: Monopulse Tracking, Microwave/Millimeter-wave Imaging, Machine Learning: Machine Learning in RF Microwave Ciruits",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'sskarthikeyan@nitt.edu',
      name: "Dr. Karthikeyan S.S",
      designation: "Associate Professor",
      phone: "",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/ssk_2024.jpeg",
      researchTags: "Additive Manufacturing of RF Circuits and Antennas, Fluidically Reconfigurable Devices, RF Energy Harvesting and Wireless Power Transfer, SIW based Circutis and Antennas, Frequency Selective Surfaces",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'bhaskar@nitt.edu',
      name: "Dr. M.Bhaskar",
      designation: "Professor",
      phone: "0431-2503310",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/Bhaskar-2021.jpg",
      researchTags: "VLSI System Design, Low Power VLSI Design, On-chip wireless transceivers, On-chip antenna design, DSP Architectures, Signal Processing Algorithm Implementation in DSPs, Embedded System Design, VLSI implementation of Biomedical Algorithms, IoT System Design",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'mkr@nitt.edu',
      name: "Dr. Murali krishna",
      designation: "Assistant Professor",
      phone: "",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/muralikrishna.png",
      researchTags: "Electronics and Communication Engineering",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'gunavathi@nitt.edu',
      name: "Dr. N. Gunavathi",
      designation: "Associate Professor",
      phone: "0431 250 3315",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/download.jpeg",
      researchTags: "Planar antenna, Metamaterial Inspired Antennas, SIW Band Pass Filters and FSS for THz Applications",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'sudharsan@nitt.edu',
      name: "Dr. P. Sudharsan",
      designation: "Assistant Professor",
      phone: "",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/Screenshot%202025-06-16%20114656.png",
      researchTags: "Machine Learning for Wireless Communication, Image Processing, Heterogeneous Networks, Stochastic Geometry, MIMO Communication System",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'palan@nitt.edu',
      name: "Dr. P.Palanisamy",
      designation: "Professor",
      phone: "0431-2503312",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/palan.jpg",
      researchTags: "Signal Processing: Adaptive filter, Adaptive Noise Cancellation, Array Signal Processing: Detection and Bearing Estimation, Frequency Estimation, Image Processing: Medical Image Analysis, Medical Image Reconstruction, Image Fusion, Wireless/Mobile Communication, Channel Estimation, Computer Vision and Machine Learning",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'parthasarathy@nitt.edu',
      name: "Dr. Parthasarathy R",
      designation: "Assistant Professor",
      phone: "+91 9025862033",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/parthasarathy.jpg",
      researchTags: "Metamaterial based planar Antennas, Reconfigurable and multiband antennas, Metamaterial based Filter, Antennas for 5G mm-wave applications, Substrate Integrated Waveguide(SIW) based Antennas and Filters, EMI suppression in planar Antennas, Base Band Atnenna design for sub-6GHz Application, Intelligent Reconfigurable Surface (IRS) based MIMO antennas, Frequency Selective Surfaces",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'manirr@nitt.edu',
      name: "Dr. R R Manikandan",
      designation: "Assistant Professor",
      phone: "",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/Screenshot%202025-06-16%20161705.png",
      researchTags: "Electronics and Communication Engineering",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'jeyachithra@nitt.edu',
      name: "Dr. R. K. Jeyachitra",
      designation: "Professor",
      phone: "0431 2503320",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/969_944_jeyachitra1.jpg",
      researchTags: "Optical Wireless Communication (OWC), Communication Systems, Microwave Photonics, Optical Communication, Microwave Electronics, Radio-Over –Fiber (ROF) systems, Optical Networks, Wireless Sensor Networks",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'rkkavitha@gmail.com',
      name: "Dr. R. K. Kavitha",
      designation: "Assistant Professor",
      phone: "0431-2503322",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/kavitha.jpg",
      researchTags: "Asynchronous System Design, Memory Design, In-Memory-Computation",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'rmathan@nitt.edu',
      name: "Dr. R. Malmathanraj",
      designation: "Assistant Professor",
      phone: "0431-2503323.",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/Screenshot%202025-06-15%20233144.png",
      researchTags: "Reinforcement learning and Federated Learning, Medical Imaging, Machine Learning, Medical and Digital Image Processing, Soft Computing, Lately I have spanned my interests in RISC V architectures",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'rpands@nitt.edu',
      name: "Dr. R. Pandeeswari",
      designation: "Professor",
      phone: "0431 250 3318",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/download%20%282%29.jpeg",
      researchTags: "Electronics and Communication Engineering",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'thilagavathy@nitt.edu',
      name: "Dr. R.Thilagavathy",
      designation: "Assistant Professor",
      phone: "0431-2501801",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/pp_1.jpg",
      researchTags: "Compression and Artificial intelligence in biomedical applications, IoT Applications, FPGA Implementation",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'deiva@nitt.edu',
      name: "Dr. S.Deivalakshmi",
      designation: "Associate Professor",
      phone: "",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/photo.jpg",
      researchTags: "Deep learning based Image restoration techniques, Deep learning based Medical Image Analysis, Deep learning based Agricultural image Analysis, Deep learning based Remote sensing image Analysis, Image Denoising, Enhancement Techniques, Texture analysis, Document image analysis",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'sovanjyoti@nitt.edu',
      name: "Dr. Sovanjyoti Giri",
      designation: "Assistant Professor",
      phone: "9536899855",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/S%20Giri.png",
      researchTags: "Computer Communication and Networking, Information Theory, Channel Coding Techniques, Network Coding, Network Error Correction, Next-Generation Wireless Communication, Internet of Things, Wireless Sensor Networks, Probability, Stochastic Analysis, Markov Process, Queueing Theory, Linear Algebra, Abstract Algebra, Combinatorics, Graph Theory, Tensor Analysis, Design and Analysis of Algorithms, Machine Learning in Communication.",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'srinivasulu@nitt.edu',
      name: "Dr. Srinivasulu Jogi",
      designation: "Assistant Professor",
      phone: "+91-8248835354",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/Dr%20Srinivasulu%20Jogi.jpg",
      researchTags: "Nonlinear system design, Robust stability, Delayed systems, Multi-dimensional systems, FPGA based system design",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'vsudha@nitt.edu',
      name: "Dr. V. Sudha",
      designation: "Associate Professor",
      phone: "0431-2503319",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/vsudha.jpg",
      researchTags: "Millimeter Wave Communication Systems. RIS based Wireless Communication. MIMO Systems. OFDM, GFDM and OTFS. Vehicular Communication. Wireless Networks. IoT Optical Wireless Communication. Microwave Antennas",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'varun@nitt.edu',
      name: "Dr. Varun Gopi",
      designation: "Associate Professor",
      phone: "+91-431-2504501",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/VPGN.png",
      researchTags: "IoT in Healthcare, Augmented Reality in Healthcare, Signal Processing, Medical Image Processing, Artificial Intelligence, Compressed sensing, Circuits and systems, Hardware for Deep Learning",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'malark@nitt.edu',
      name: "Dr. B.Malarkodi",
      designation: "Professor",
      phone: "0431-2503308",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/20130709_170550-1%20%281%29.jpg",
      researchTags: "Optical Communication, Computer Networks, Adhoc networks, Wireless communication",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'bibin@nitt.edu',
      name: "Dr. Bibin Francis",
      designation: "Assistant Professor",
      phone: "+919902054468",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/bibin.png",
      researchTags: "Signal Processing, Medical Image Processing, Artificial Intelligence, Deep Learning, Optimization",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'chandrababu@nitt.edu',
      name: "Dr. Bukke Chandrababu Naik",
      designation: "Assistant Professor",
      phone: "+91-7396065605",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/CBNM.png",
      researchTags: "Electronics and Communication Engineering",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'mahes@nitt.edu',
      name: "Dr. Maheswaran P",
      designation: "Assistant Professor",
      phone: "+91 431 250 3326",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/MAHESWARAN_P.jpg",
      researchTags: "Wireless Communication, Signal Processing, MIMO Communication System, Index Modulation, Spatial Modulation",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'muthuc@nitt.edu',
      name: "Dr. P.Muthuchidambaranathan",
      designation: "Professor",
      phone: "+91-431-2503309",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/mc.jpg",
      researchTags: "Electronics and Communication Engineering",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    },
    {
      email: 'laksh@nitt.edu',
      name: "Prof. G. Lakshminarayanan",
      designation: "Professor",
      phone: "0431-2503307",
      office: "Department of ECE, NIT Trichy",
      profileImage: "https://web.nitt.edu/sites/default/files/2025-06/GL_photo.jpg",
      researchTags: "VLSI based Wireless System Design/Physical Layer Design, Algorithms and Techniques for Cognitive Radio",
      education: [],
      experience: [],
      responsibilities: [],
      awards: [],
      projects: [],
      phds: [],
      talks: [],
      memberships: [],
      patents: []
    }
  ];

  for (const f of facultyList) {
    console.log(`Upserting ${f.name}...`);
    const existingProfile = await prisma.facultyProfile.findFirst({
      where: {
        OR: [
          { officialEmail: f.email },
          { user: { email: f.email } },
          { departmentId: cseDept.id, name: f.name },
        ],
      },
    });
    const profile = existingProfile
      ? await prisma.facultyProfile.update({
        where: { id: existingProfile.id },
        data: {
        departmentId: cseDept.id,
        officialEmail: f.email,
        name: f.name,
        designation: f.designation,
        phone: f.phone,
        office: f.office,
        profileImage: f.profileImage,
        researchTags: (f.researchTags || '').slice(0, 190),
        profileCompletion: 95,
        isPublic: true
        },
      })
      : await prisma.facultyProfile.create({
        data: {
        officialEmail: f.email,
        departmentId: cseDept.id,
        name: f.name,
        designation: f.designation,
        phone: f.phone,
        office: f.office,
        profileImage: f.profileImage,
        researchTags: (f.researchTags || '').slice(0, 190),
        profileCompletion: 95,
        isPublic: true
        },
      });

    // Clear and Create Relations
    await prisma.education.deleteMany({ where: { facultyProfileId: profile.id } });
    if (f.education.length > 0) {
      await prisma.education.createMany({ data: f.education.map((e: any) => ({ ...e, facultyProfileId: profile.id })) });
    }

    await prisma.experience.deleteMany({ where: { facultyProfileId: profile.id } });
    if (f.experience.length > 0) {
      await prisma.experience.createMany({ data: f.experience.map((e: any) => ({ ...e, facultyProfileId: profile.id })) });
    }

    await prisma.responsibility.deleteMany({ where: { facultyProfileId: profile.id } });
    if (f.responsibilities.length > 0) {
      await prisma.responsibility.createMany({ data: f.responsibilities.map((r: any) => ({ ...r, facultyProfileId: profile.id })) });
    }

    await prisma.award.deleteMany({ where: { facultyProfileId: profile.id } });
    if (f.awards.length > 0) {
      await prisma.award.createMany({ data: f.awards.map((a: any) => ({ ...a, facultyProfileId: profile.id })) });
    }

    await prisma.project.deleteMany({ where: { facultyProfileId: profile.id } });
    if (f.projects.length > 0) {
      await prisma.project.createMany({ data: f.projects.map((p: any) => ({ ...p, facultyProfileId: profile.id })) });
    }

    await prisma.phDGuided.deleteMany({ where: { facultyProfileId: profile.id } });
    if (f.phds.length > 0) {
      await prisma.phDGuided.createMany({ data: f.phds.map((p: any) => ({ ...p, facultyProfileId: profile.id })) });
    }

    await prisma.invitedTalk.deleteMany({ where: { facultyProfileId: profile.id } });
    if (f.talks.length > 0) {
      await prisma.invitedTalk.createMany({ data: f.talks.map((t: any) => ({ ...t, facultyProfileId: profile.id })) });
    }

    await prisma.membership.deleteMany({ where: { facultyProfileId: profile.id } });
    if (f.memberships.length > 0) {
      await prisma.membership.createMany({ data: f.memberships.map((m: any) => ({ ...m, facultyProfileId: profile.id })) });
    }

    await prisma.patent.deleteMany({ where: { facultyProfileId: profile.id } });
    if (f.patents.length > 0) {
      await prisma.patent.createMany({ data: f.patents.map((p: any) => ({ ...p, facultyProfileId: profile.id })) });
    }
  }

  for (const f of eceFacultyList) {
    console.log(`Upserting ${f.name}...`);
    const existingProfile = await prisma.facultyProfile.findFirst({
      where: {
        OR: [
          { officialEmail: f.email },
          { user: { email: f.email } },
          { departmentId: eceDept.id, name: f.name },
        ],
      },
    });
    const profile = existingProfile
      ? await prisma.facultyProfile.update({
        where: { id: existingProfile.id },
        data: {
        departmentId: eceDept.id,
        officialEmail: f.email,
        name: f.name,
        designation: f.designation,
        phone: f.phone,
        office: f.office,
        profileImage: f.profileImage,
        researchTags: (f.researchTags || '').slice(0, 190),
        profileCompletion: 95,
        isPublic: true
        },
      })
      : await prisma.facultyProfile.create({
        data: {
        officialEmail: f.email,
        departmentId: eceDept.id,
        name: f.name,
        designation: f.designation,
        phone: f.phone,
        office: f.office,
        profileImage: f.profileImage,
        researchTags: (f.researchTags || '').slice(0, 190),
        profileCompletion: 95,
        isPublic: true
        },
      });

    await prisma.education.deleteMany({ where: { facultyProfileId: profile.id } });
    if (f.education.length > 0) {
      await prisma.education.createMany({ data: f.education.map((e: any) => ({ ...e, facultyProfileId: profile.id })) });
    }

    await prisma.experience.deleteMany({ where: { facultyProfileId: profile.id } });
    if (f.experience.length > 0) {
      await prisma.experience.createMany({ data: f.experience.map((e: any) => ({ ...e, facultyProfileId: profile.id })) });
    }

    await prisma.responsibility.deleteMany({ where: { facultyProfileId: profile.id } });
    if (f.responsibilities.length > 0) {
      await prisma.responsibility.createMany({ data: f.responsibilities.map((r: any) => ({ ...r, facultyProfileId: profile.id })) });
    }

    await prisma.award.deleteMany({ where: { facultyProfileId: profile.id } });
    if (f.awards.length > 0) {
      await prisma.award.createMany({ data: f.awards.map((a: any) => ({ ...a, facultyProfileId: profile.id })) });
    }

    await prisma.project.deleteMany({ where: { facultyProfileId: profile.id } });
    if (f.projects.length > 0) {
      await prisma.project.createMany({ data: f.projects.map((p: any) => ({ ...p, facultyProfileId: profile.id })) });
    }

    await prisma.phDGuided.deleteMany({ where: { facultyProfileId: profile.id } });
    if (f.phds.length > 0) {
      await prisma.phDGuided.createMany({ data: f.phds.map((p: any) => ({ ...p, facultyProfileId: profile.id })) });
    }

    await prisma.invitedTalk.deleteMany({ where: { facultyProfileId: profile.id } });
    if (f.talks.length > 0) {
      await prisma.invitedTalk.createMany({ data: f.talks.map((t: any) => ({ ...t, facultyProfileId: profile.id })) });
    }

    await prisma.membership.deleteMany({ where: { facultyProfileId: profile.id } });
    if (f.memberships.length > 0) {
      await prisma.membership.createMany({ data: f.memberships.map((m: any) => ({ ...m, facultyProfileId: profile.id })) });
    }

    await prisma.patent.deleteMany({ where: { facultyProfileId: profile.id } });
    if (f.patents.length > 0) {
      await prisma.patent.createMany({ data: f.patents.map((p: any) => ({ ...p, facultyProfileId: profile.id })) });
    }
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
