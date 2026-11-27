// Adicione aqui seus projetos reais quando estiverem disponíveis.
// Exemplo de estrutura: { title: 'Nome', description: 'Descrição', technologies: ['Linux'], repositoryUrl: 'https://github.com/usuario/repositorio' }
const projects = [];
const grid = document.getElementById('project-grid');
const empty = document.getElementById('project-empty');
function githubRepository(raw) {
  try { const url = new URL(raw); return url.protocol === 'https:' && url.hostname === 'github.com' && url.pathname.split('/').filter(Boolean).length >= 2 ? url.href : null; } catch { return null; }
}
for (const project of projects) {
  const repository = githubRepository(project.repositoryUrl);
  if (!repository) continue;
  const card = document.createElement('article'); card.className = 'project-card';
  const title = document.createElement('h3'); title.textContent = project.title;
  const description = document.createElement('p'); description.textContent = project.description;
  const tags = document.createElement('div'); tags.className = 'tags';
  for (const technology of project.technologies || []) { const tag = document.createElement('span'); tag.textContent = technology; tags.append(tag); }
  const link = document.createElement('a'); link.href = repository; link.textContent = 'Ver projeto no GitHub'; link.target = '_blank'; link.rel = 'noopener noreferrer';
  card.append(title, description, tags, link); grid.append(card);
}
empty.hidden = grid.children.length > 0;
