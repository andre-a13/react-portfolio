import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import ts from 'typescript';

const root = path.resolve(import.meta.dirname, '..');
const transpile = file => ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const moduleUrl = text => `data:text/javascript;base64,${Buffer.from(text).toString('base64')}`;
const studyUrl = moduleUrl(transpile('src/datas/hr-case-study.ts'));
const resumeCode = transpile('src/components/pages/resume/resume-data.ts')
  .replace('../../../datas/hr-case-study', studyUrl);
const { resumes, resumeLabels, contact, certifications } = await import(moduleUrl(resumeCode));
const temp = path.join(root, 'tmp/pdfs');
const output = path.join(root, 'public/resumes');
fs.mkdirSync(temp, { recursive: true });
fs.mkdirSync(output, { recursive: true });
const dataFile = path.join(temp, 'resume-data.json');
fs.writeFileSync(dataFile, JSON.stringify({ resumes, labels: resumeLabels, contact, certifications }));
const result = spawnSync(process.env.PYTHON || 'python', [path.join(root, 'scripts/render-resume-pdfs.py'), dataFile, output], { stdio: 'inherit' });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
const inputs = ['src/datas/hr-case-study.ts', 'src/components/pages/resume/resume-data.ts', 'scripts/render-resume-pdfs.py'];
const hash = createHash('sha256');
for (const input of inputs) hash.update(fs.readFileSync(path.join(root, input), 'utf8').replace(/\r\n/g, '\n'));
fs.writeFileSync(path.join(output, 'source.sha256'), hash.digest('hex') + '\n');
fs.unlinkSync(dataFile);
