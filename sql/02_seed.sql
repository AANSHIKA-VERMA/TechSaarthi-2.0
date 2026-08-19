-- TechSaarthi — seed data
-- Run this AFTER 01_schema.sql (or after 03_migration if you're updating an
-- existing project). Replace apply_link / notion_link with your real links
-- whenever you have them — this just gets the app looking alive today.
-- Re-run safely: it clears existing rows first.

truncate table saved_opportunities, opportunities restart identity cascade;

insert into opportunities (title, organization, category, deadline, deadline_text, tags, apply_link, reference_video, notion_link) values

-- Internships
('Software Engineering Internship', 'Google STEP', 'internships', '2026-10-15', null,
 'Remote, Paid, 1st-2nd year',
 'https://buildyourfuture.withgoogle.com/programs/step',
 'https://youtube.com/watch?v=example1',
 'https://notion.so/your-page'),

('Summer Internship Program', 'Microsoft', 'internships', '2026-11-01', null,
 'On-site, Paid, 2nd-3rd year',
 'https://careers.microsoft.com/students/us/en/usinternship',
 null,
 'https://notion.so/your-page'),

('Explore Internship', 'Adobe India', 'internships', '2026-09-30', null,
 'Remote, Paid, Female-friendly',
 'https://www.adobe.com/in/careers/university.html',
 null,
 'https://notion.so/your-page'),

('AICTE Virtual Internship', 'AICTE', 'internships', null, 'Rolling admissions — apply anytime',
 'Remote, Free, Open to all years',
 'https://internship.aicte-india.org',
 null,
 'https://notion.so/your-page'),

-- Scholarships
('Women in Tech Scholarship', 'Google', 'scholarships', '2026-11-20', null,
 'Female-only, Tuition support, Final year',
 'https://buildyourfuture.withgoogle.com/scholarships',
 'https://youtube.com/watch?v=example2',
 'https://notion.so/your-page'),

('AWS re/Start Scholarship', 'Amazon Web Services', 'scholarships', '2026-10-30', null,
 'Merit-based, Cloud track',
 'https://aws.amazon.com/education/aws-restart',
 null,
 'https://notion.so/your-page'),

('Undergraduate Scholarship Program', 'Tata Trusts', 'scholarships', null, 'Applications open on a rolling basis',
 'Need-based, Open to all years',
 'https://www.tatatrusts.org/our-work/individual-grants-programme',
 null,
 'https://notion.so/your-page'),

('Anita Borg Scholarship', 'Google', 'scholarships', '2026-08-31', null,
 'Female-only, Final year, Merit-based',
 'https://www.womentechmakers.com/scholars',
 null,
 'https://notion.so/your-page'),

-- Hackathons
('Smart India Hackathon', 'Government of India', 'hackathons', '2026-09-05', null,
 'National, Team event, Cash prizes',
 'https://sih.gov.in',
 'https://youtube.com/watch?v=example3',
 'https://notion.so/your-page'),

('HackHer', 'She Codes Africa x Global', 'hackathons', '2026-10-10', null,
 'Female-only, Virtual, 48 hours',
 'https://mlh.io',
 null,
 'https://notion.so/your-page'),

('HackMIT', 'MIT', 'hackathons', '2026-09-20', null,
 'International, On-site, Beginner-friendly',
 'https://hackmit.org',
 null,
 'https://notion.so/your-page'),

('Campus Weekend Sprint', 'Devfolio', 'hackathons', '2026-08-28', null,
 'Weekend, Remote, Open to all years',
 'https://devfolio.co',
 null,
 'https://notion.so/your-page'),

-- Leadership
('Women Techmakers Ambassador Program', 'Google', 'leadership', '2026-11-05', null,
 'Female-only, Community leadership, Year-long',
 'https://www.womentechmakers.com/ambassadors',
 'https://youtube.com/watch?v=example4',
 'https://notion.so/your-page'),

('Girl Up Leadership Fellowship', 'United Nations Foundation', 'leadership', null, 'Cohorts open twice a year — check site for next intake',
 'Female-only, Global cohort',
 'https://girlup.org/programs',
 null,
 'https://notion.so/your-page'),

('Student Ambassador Program', 'Microsoft Learn', 'leadership', '2026-09-18', null,
 'Open to all years, Community, Certification',
 'https://mlsa.microsoft.com',
 null,
 'https://notion.so/your-page');
