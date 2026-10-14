import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = path.resolve(import.meta.dirname, '..');
const inputs = ['src/datas/hr-case-study.ts', 'src/components/pages/resume/resume-data.ts', 'scripts/render-resume-pdfs.py'];
const hash = createHash('sha256');
for (const input of inputs) hash.update(fs.readFileSync(path.join(root, input), 'utf8').replace(/\r\n/g, '\n'));
const saved = path.join(root, 'public/resumes/source.sha256');
if (!fs.existsSync(saved) || hash.digest('hex') !== fs.readFileSync(saved, 'utf8').trim()) {
  throw new Error('Résumé PDFs are out of date. Run npm run pdf:generate (Python + reportlab required).');
}
for (const language of ['fr', 'en']) for (const variant of ['full-stack', 'microsoft', 'project-management']) {
  const file = path.join(root, `public/resumes/arnaud-andre-${variant}-${language}.pdf`);
  if (!fs.existsSync(file) || fs.readFileSync(file).subarray(0, 5).toString() !== '%PDF-') throw new Error(`Missing PDF: ${file}`);
}
console.log('All six résumé PDFs match the current source content.');
