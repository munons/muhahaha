import { Octokit } from '@octokit/rest';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const path = `logs/${Date.now()}.json`;
  const content = Buffer.from(JSON.stringify(req.body, null, 2)).toString('base64');
  await octokit.repos.createOrUpdateFileContents({ owner, repo, path, message:'visitor log', content });
  res.status(200).json({ ok:true });
}