import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const deptCodes = ['architecture','cecase','chem','chemistry','civil','ca','cse','dee','eee','ece','humanities','ice','management','maths','mech','meta','physics','prod'];

type LinkRec = { email?: string; name: string; url: string };

const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').replace(/[()]/g, '').trim();
const clean = (s: string) => s
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<\/(p|div|li|tr|h1|h2|h3|h4|h5|h6|td|th)>/gi, '\n')
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&#39;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/\s+/g, ' ')
  .trim();

function cellsFromRow(rowHtml: string): string[] {
  const cells = [...rowHtml.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m => clean(m[1]));
  return cells.filter(Boolean);
}

function parseRows(html: string): string[][] {
  return [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m => cellsFromRow(m[1])).filter(r => r.length > 0);
}

function tableBlocks(html: string): { context: string; rows: string[][] }[] {
  return [...html.matchAll(/<table[^>]*>[\s\S]*?<\/table>/gi)]
    .map((m) => {
      const start = m.index ?? 0;
      const prefix = html.slice(Math.max(0, start - 3000), start);
      const headings = [...prefix.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi)];
      const context = headings.length > 0 ? clean(headings[headings.length - 1][1]) : '';
      return { context, rows: parseRows(m[0]) };
    })
    .filter((table) => table.rows.length > 0);
}

function yearFromText(s: string): number {
  const m = s.match(/\b(19|20)\d{2}\b/);
  return m ? Number(m[0]) : 0;
}

function uniqBy<T>(arr: T[], key: (x: T) => string): T[] {
  const map = new Map<string, T>();
  for (const a of arr) {
    const k = key(a);
    if (!map.has(k)) map.set(k, a);
  }
  return [...map.values()];
}

function rowHasHeader(row: string[]): boolean {
  return /(examination|board|university|job title|employer|position|title of project|author|journal|year|organization|institution|country|topic)/i.test(row.join(' '));
}

function cleanRows(rows: string[][]): string[][] {
  return rows
    .filter((r) => r.length > 0)
    .filter((r) => !rowHasHeader(r))
    .map((r) => r.map((cell) => cell.replace(/\s+/g, ' ').trim()));
}

function extractResearch(html: string): string | null {
  const txt = clean(html);
  const m = txt.match(/Research\s+(Interests?|Areas?)\s*[:\-]?\s*([^\n]{15,260})/i);
  if (!m) return null;
  return m[2].slice(0, 190);
}

function extractImage(html: string, base: string): string | null {
  const matches = [...html.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi)];
  if (matches.length === 0) return null;

  const scored = matches.map((m) => m[1]).map((src) => {
    const s = src.toLowerCase();
    let score = 0;

    // Positive hints for profile photos
    if (s.startsWith('data:image/')) score += 120;
    if (s.includes('/styles/thumbnail/public/')) score += 100;
    if (s.includes('/faculty/')) score += 60;
    if (s.match(/(kunwar|nrs|mala|sridevi|rajeswari|selvakumar)/)) score += 20;

    // Negative hints for logos/icons/social assets
    if (s.includes('nitt.png') || s.includes('logo') || s.includes('emblem')) score -= 250;
    if (s.includes('/images/32/') || s.includes('youtube') || s.includes('twitter') || s.includes('fb1') || s.includes('email1')) score -= 160;
    if (s.endsWith('.svg')) score -= 80;

    return { src, score };
  }).sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best || best.score < 0) return null;

  if (best.src.startsWith('http')) return best.src;
  if (best.src.startsWith('data:image/')) return best.src;
  if (best.src.startsWith('/')) return `${base}${best.src}`;
  return null;
}

function parseDetails(html: string) {
  const lines = clean(html).split(/\n+/).map(x => x.trim()).filter(Boolean);
  const tables = tableBlocks(html);

  const education: any[] = [];
  const experience: any[] = [];
  const responsibilities: any[] = [];
  const projects: any[] = [];
  const awards: any[] = [];
  const phds: any[] = [];
  const talks: any[] = [];
  const memberships: any[] = [];
  const publications: any[] = [];
  const patents: any[] = [];
  const foreignVisits: any[] = [];

  for (const table of tables) {
    const context = table.context.toLowerCase();
    const rows = cleanRows(table.rows);

    if (/academic qualifications/.test(context)) {
      for (const r of rows) {
        if (r.length < 2) continue;
        education.push({
          degree: r[0].slice(0, 120),
          institution: (r[1] || '').slice(0, 180),
          year: yearFromText(r.join(' ')),
          details: r.slice(3).join(' ; ').slice(0, 250),
        });
      }
      continue;
    }

    if (/employment profile/.test(context)) {
      for (const r of rows) {
        if (r.length < 2) continue;
        experience.push({
          title: r[0].slice(0, 150),
          organization: (r[1] || '').slice(0, 180),
          from: (r[2] || '').slice(0, 60),
          to: (r[3] || '').slice(0, 60),
        });
      }
      continue;
    }

    if (/responsibilities within|within the university/.test(context)) {
      for (const r of rows) {
        if (r.length < 1) continue;
        responsibilities.push({
          position: r[0].slice(0, 180),
          organization: (r[1] || '').slice(0, 180),
          from: (r[2] || '').slice(0, 60),
          to: (r[3] || '').slice(0, 60),
          type: 'INTERNAL',
        });
      }
      continue;
    }

    if (/responsibilities outside|outside the university/.test(context)) {
      for (const r of rows) {
        if (r.length < 1) continue;
        responsibilities.push({
          position: r[0].slice(0, 180),
          organization: (r[1] || '').slice(0, 180),
          from: (r[2] || '').slice(0, 60),
          to: (r[3] || '').slice(0, 60),
          type: 'EXTERNAL',
        });
      }
      continue;
    }

    if (/major r&d projects|r&d projects|sponsored projects/.test(context)) {
      for (const r of rows) {
        if (r.length < 2) continue;
        const from = r[2] || '';
        const to = r[3] || '';
        projects.push({
          title: r[0].slice(0, 220),
          fundingAgency: (r[1] || '').slice(0, 150),
          amount: '',
          duration: [from, to].filter(Boolean).join(' - ').slice(0, 120),
          status: (r[4] || (/ongoing/i.test(r.join(' ')) ? 'Ongoing' : 'Completed')).slice(0, 40),
        });
      }
      continue;
    }

    if (/awards|fellowships|associateships/.test(context)) {
      for (const r of rows) {
        if (r.length < 2) continue;
        const firstIsYear = /^\d{4}$/.test(r[0]);
        awards.push({
          title: (firstIsYear ? r[1] : r[0]).slice(0, 220),
          awardedBy: (firstIsYear ? r[2] : r[1] || '').slice(0, 150),
          year: yearFromText(r.join(' ')),
        });
      }
      continue;
    }

    if (/number of phds|ph\.?d.*guided/.test(context)) {
      for (const r of rows) {
        if (r.length < 2) continue;
        phds.push({
          studentName: r[0].slice(0, 120),
          thesisTitle: (r[1] || '').slice(0, 220),
          role: (r[2] || (/co/i.test(r.join(' ')) ? 'Co-Supervisor' : 'Supervisor')).slice(0, 80),
          year: yearFromText(r.join(' ')),
        });
      }
      continue;
    }

    if (/invited talks/.test(context)) {
      for (const r of rows) {
        if (r.length < 2) continue;
        talks.push({
          topic: r[0].slice(0, 220),
          date: (r[1] || '').slice(0, 100),
          organization: (r[2] || '').slice(0, 180),
        });
      }
      continue;
    }

    if (/membership in learned societies|memberships?/.test(context)) {
      for (const r of rows) {
        if (r.length < 1) continue;
        memberships.push({
          type: (r[0] || 'Member').slice(0, 50),
          organization: (r[1] || r[0] || '').slice(0, 180),
          membershipNo: (r[2] || '').slice(0, 120),
        });
      }
      continue;
    }

    if (/academic foreign visits|foreign visits/.test(context)) {
      for (const r of rows) {
        if (r.length < 2) continue;
        foreignVisits.push({
          country: r[0].slice(0, 120),
          duration: (r[1] || '').slice(0, 120),
          purpose: (r[2] || '').slice(0, 250),
        });
      }
      continue;
    }

    if (/patents?/.test(context)) {
      for (const r of rows) {
        if (r.length < 2) continue;
        patents.push({
          title: r[0].slice(0, 220),
          inventors: (r[1] || '').slice(0, 200),
          patentNumber: (r[2] || '').slice(0, 80),
          year: yearFromText(r.join(' ')),
          status: (r[4] || r[3] || '').slice(0, 80),
        });
      }
      continue;
    }

    if (/publications|refereed research journals|conference papers/.test(context)) {
      for (const r of rows) {
        if (r.length < 2) continue;
        publications.push({
          authors: r[0].slice(0, 200),
          title: (r[1] || '').slice(0, 250),
          venue: (r[2] || '').slice(0, 200),
          year: yearFromText(r.join(' ')),
          link: null,
        });
      }
    }
  }

  for (const r of tables.length > 0 ? [] : parseRows(html)) {
    const row = r.join(' | ');
    if (/(ph\.?d|m\.?e|mtech|m\.tech|b\.?e|btech|m\.s\.?|msc|mba|ma\b)/i.test(row) && r.length >= 2) {
      education.push({
        degree: r[0].slice(0, 120),
        institution: (r[1] || '').slice(0, 180),
        year: yearFromText(row),
        details: (r.slice(2).join(' ; ') || '').slice(0, 250),
      });
      continue;
    }

    if (/(professor|lecturer|officer|scientist|engineer|assistant professor|associate professor|dean|director|warden)/i.test(row) && r.length >= 2) {
      experience.push({
        title: r[0].slice(0, 150),
        organization: (r[1] || '').slice(0, 180),
        from: (r[2] || '').slice(0, 60),
        to: (r[3] || '').slice(0, 60),
      });
      continue;
    }

    if (/(head|chair|member|coordinator|advisor|committee|bos|examiner|convenor|secretary)/i.test(row)) {
      responsibilities.push({
        position: r[0].slice(0, 180),
        organization: (r[1] || '').slice(0, 180),
        from: (r[2] || '').slice(0, 60),
        to: (r[3] || '').slice(0, 60),
        type: /external|outside|university|board/i.test(row) ? 'EXTERNAL' : 'INTERNAL',
      });
      continue;
    }

    if (/(title of project|project)/i.test(row) && r.length >= 2) {
      projects.push({
        title: r[0].slice(0, 220),
        fundingAgency: (r[1] || '').slice(0, 150),
        amount: (r[2] || '').slice(0, 80),
        duration: (r[3] || '').slice(0, 120),
        status: /ongoing/i.test(row) ? 'Ongoing' : 'Completed',
      });
      continue;
    }

    if (/(award|honou?r|fellowship|medal)/i.test(row) && r.length >= 2) {
      awards.push({
        title: r[0].slice(0, 220),
        awardedBy: (r[1] || '').slice(0, 150),
        year: yearFromText(row),
      });
      continue;
    }

    if (/(phd|thesis|scholar)/i.test(row) && r.length >= 2) {
      phds.push({
        studentName: r[0].slice(0, 120),
        thesisTitle: (r[1] || '').slice(0, 220),
        role: /co/i.test(row) ? 'Co-Supervisor' : 'Supervisor',
        year: yearFromText(row),
      });
      continue;
    }

    if (/(invited talk|speaker|seminar|workshop|conference)/i.test(row) && r.length >= 2) {
      talks.push({
        topic: r[0].slice(0, 220),
        organization: (r[1] || '').slice(0, 180),
        date: (r[2] || '').slice(0, 100),
      });
      continue;
    }

    if (/(life member|member|ieee|iste|csi)/i.test(row) && r.length >= 1) {
      memberships.push({
        type: (/life/i.test(row) ? 'Life Member' : 'Member').slice(0, 50),
        organization: r[0].slice(0, 180),
        membershipNo: (r[1] || '').slice(0, 120),
      });
      continue;
    }

    if (/(journal|conference|proceedings|transactions|springer|ieee|elsevier)/i.test(row) && r.length >= 2) {
      publications.push({
        title: r[0].slice(0, 250),
        authors: (r[1] || '').slice(0, 200),
        venue: (r[2] || r[1] || '').slice(0, 200),
        year: yearFromText(row),
        link: null,
      });
      continue;
    }
  }

  // Fallback from lines for talks/memberships when tables absent
  for (const line of lines.slice(0, 1500)) {
    if (talks.length < 5 && /invited talk|speaker/i.test(line) && line.length > 20) {
      talks.push({ topic: line.slice(0, 220), organization: '', date: '' });
    }
    if (memberships.length < 5 && /(life member|ieee|iste|csi|member of)/i.test(line) && line.length > 10) {
      memberships.push({ type: 'Member', organization: line.slice(0, 180), membershipNo: '' });
    }
  }

  return {
    education: uniqBy(education, e => `${e.degree}|${e.institution}|${e.year}`).slice(0, 20),
    experience: uniqBy(experience, e => `${e.title}|${e.organization}|${e.from}|${e.to}`).slice(0, 30),
    responsibilities: uniqBy(responsibilities, r => `${r.position}|${r.organization}|${r.from}|${r.to}|${r.type}`).slice(0, 40),
    projects: uniqBy(projects, p => `${p.title}|${p.fundingAgency}`).slice(0, 20),
    awards: uniqBy(awards, a => `${a.title}|${a.awardedBy}|${a.year}`).slice(0, 20),
    phds: uniqBy(phds, p => `${p.studentName}|${p.thesisTitle}|${p.year}`).slice(0, 30),
    talks: uniqBy(talks, t => `${t.topic}|${t.organization}|${t.date}`).slice(0, 30),
    memberships: uniqBy(memberships, m => `${m.type}|${m.organization}|${m.membershipNo}`).slice(0, 20),
    publications: uniqBy(publications, p => `${p.title}|${p.venue}|${p.year}`).slice(0, 80),
    patents: uniqBy(patents, p => `${p.title}|${p.patentNumber}|${p.year}`).slice(0, 20),
    foreignVisits: uniqBy(foreignVisits, v => `${v.country}|${v.duration}|${v.purpose}`).slice(0, 20),
  };
}

async function scrapeDeptFacultyLinks(code: string): Promise<LinkRec[]> {
  const urls = [
    `https://web.nitt.edu/home/academics/departments/${code}/faculty`,
    `https://www.nitt.edu/home/academics/departments/${code}/faculty/`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) continue;
      const html = await res.text();
      if (!html || html.length < 1000) continue;

      const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m => m[1]);
      const recs: LinkRec[] = [];
      for (const row of rows) {
        const nameM = row.match(/<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/i);
        if (!nameM) continue;
        const href = nameM[1];
        const name = clean(nameM[2]);
        if (!/^(Dr\.|Prof\.|Mr\.|Ms\.)/i.test(name)) continue;
        const emailM = row.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
        const fullUrl = href.startsWith('http') ? href : (href.startsWith('/') ? `https://web.nitt.edu${href}` : new URL(href, url).toString());
        recs.push({ name, email: emailM?.[0]?.toLowerCase(), url: fullUrl });
      }

      if (recs.length > 0) return recs;

      // fallback by links list
      const links = [...html.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi)];
      for (const m of links) {
        const name = clean(m[2]);
        if (!/^(Dr\.|Prof\.|Mr\.|Ms\.)/i.test(name)) continue;
        const href = m[1];
        const fullUrl = href.startsWith('http') ? href : (href.startsWith('/') ? `https://www.nitt.edu${href}` : new URL(href, url).toString());
        recs.push({ name, url: fullUrl });
      }
      if (recs.length > 0) return uniqBy(recs, r => r.url);
    } catch {}
  }

  return [];
}

async function main() {
  console.log('Building faculty profile URL map...');
  const byEmail = new Map<string, string>();
  const byName = new Map<string, string>();

  for (const code of deptCodes) {
    const recs = await scrapeDeptFacultyLinks(code);
    for (const r of recs) {
      if (r.email) byEmail.set(r.email.toLowerCase(), r.url);
      byName.set(normalize(r.name), r.url);
    }
  }

  console.log(`URL map: ${byEmail.size} by email, ${byName.size} by name`);

  const profiles = await prisma.facultyProfile.findMany({
    include: { user: true, department: true },
  });

  let updated = 0;
  for (const fp of profiles) {
    const email = fp.user.email.toLowerCase();
    const n = normalize(fp.name);
    const url = byEmail.get(email) || byName.get(n);
    if (!url) continue;

    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) continue;
      const html = await res.text();
      if (!html || html.length < 1000) continue;

      const parsed = parseDetails(html);
      const research = extractResearch(html);
      const image = extractImage(html, url.includes('web.nitt.edu') ? 'https://web.nitt.edu' : 'https://www.nitt.edu');

      await prisma.$transaction(async (tx) => {
        await tx.facultyProfile.update({
          where: { id: fp.id },
          data: {
            ...(research ? { researchTags: research.slice(0, 190) } : {}),
            ...(image ? { profileImage: image } : {}),
            isPublic: true,
          },
        });

        const replace = async (name: string, del: any, data: any[]) => {
          if (data.length === 0) return;
          await del();
          // @ts-ignore
          await tx[name].createMany({ data: data.map(d => ({ ...d, facultyProfileId: fp.id })) });
        };

        await replace('education', () => tx.education.deleteMany({ where: { facultyProfileId: fp.id } }), parsed.education);
        await replace('experience', () => tx.experience.deleteMany({ where: { facultyProfileId: fp.id } }), parsed.experience);
        await replace('responsibility', () => tx.responsibility.deleteMany({ where: { facultyProfileId: fp.id } }), parsed.responsibilities);
        await replace('project', () => tx.project.deleteMany({ where: { facultyProfileId: fp.id } }), parsed.projects);
        await replace('award', () => tx.award.deleteMany({ where: { facultyProfileId: fp.id } }), parsed.awards);
        await replace('phDGuided', () => tx.phDGuided.deleteMany({ where: { facultyProfileId: fp.id } }), parsed.phds);
        await replace('invitedTalk', () => tx.invitedTalk.deleteMany({ where: { facultyProfileId: fp.id } }), parsed.talks);
        await replace('membership', () => tx.membership.deleteMany({ where: { facultyProfileId: fp.id } }), parsed.memberships);
        await replace('publication', () => tx.publication.deleteMany({ where: { facultyProfileId: fp.id } }), parsed.publications);
        await replace('patent', () => tx.patent.deleteMany({ where: { facultyProfileId: fp.id } }), parsed.patents);
        await replace('foreignVisit', () => tx.foreignVisit.deleteMany({ where: { facultyProfileId: fp.id } }), parsed.foreignVisits);
      });

      updated++;
      if (updated % 20 === 0) console.log(`Updated ${updated} profiles...`);
    } catch {}
  }

  console.log(`Completed. Updated profiles: ${updated}/${profiles.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
