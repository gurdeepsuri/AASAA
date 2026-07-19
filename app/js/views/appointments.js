// ============================================================================
// appointments.js — meetings, site visits and calls as an agenda list.
// ============================================================================

import { db } from '../db.js';
import { openSheet, closeSheet, toast, confirmDialog, emptyState, statusChip, readForm } from '../ui.js';
import { field, input, textarea, select, row, formActions } from '../form.js';
import { escapeHtml, fmtDate, fmtTime, relDay, indexById } from '../util.js';
import { navigate, start } from '../router.js';

export const TYPES = ['Meeting', 'Site Visit', 'Call', 'Consultation', 'Handover', 'Other'];
const TYPE_ICON = { Meeting: '🤝', 'Site Visit': '🏗️', Call: '📞', Consultation: '💬', Handover: '🔑', Other: '📌' };
const STATUS_CLASS = { Scheduled: 'info', Done: 'done', Cancelled: 'neutral' };

export async function render(outlet, param) {
  if (param) return renderDetail(outlet, param);
  return renderList(outlet);
}

async function renderList(outlet) {
  const [appts, clients] = await Promise.all([db.list('appointments'), db.list('clients')]);
  const cmap = indexById(clients);
  const now = Date.now();
  const withTime = appts.map((a) => ({ ...a, ts: new Date(a.datetime).getTime() }));
  const upcoming = withTime.filter((a) => a.ts >= now - 3600000 && a.status !== 'Cancelled').sort((a, b) => a.ts - b.ts);
  const past = withTime.filter((a) => a.ts < now - 3600000 || a.status === 'Cancelled').sort((a, b) => b.ts - a.ts);

  const card = (a) => `<button class="item" data-open="${a.id}">
    <span class="appt-when">
      <span class="appt-when__day">${relDay(a.datetime)}</span>
      <span class="appt-when__time">${fmtTime(a.datetime)}</span>
    </span>
    <span class="item__main">
      <span class="item__title">${TYPE_ICON[a.type] || '📌'} ${escapeHtml(a.title)}</span>
      <span class="item__sub">${escapeHtml(cmap.get(a.clientId)?.name || a.location || a.type || '')}</span>
    </span>
    ${a.status && a.status !== 'Scheduled' ? statusChip(a.status, STATUS_CLASS) : '<span class="item__chev">›</span>'}
  </button>`;

  outlet.innerHTML = `
    <div class="page-head">
      <div><h1>Schedule</h1><p class="muted">${upcoming.length} upcoming</p></div>
      <button class="btn btn--primary" id="add">+ Meeting</button>
    </div>
    ${!appts.length ? emptyState('📅', 'Nothing scheduled', 'Add a meeting, site visit or call.') : ''}
    ${upcoming.length ? `<h2 class="section-title">Upcoming</h2><div class="card-list">${upcoming.map(card).join('')}</div>` : ''}
    ${past.length ? `<h2 class="section-title">Past</h2><div class="card-list">${past.map(card).join('')}</div>` : ''}
  `;
  outlet.querySelector('#add').addEventListener('click', () => editAppt());
  outlet.querySelectorAll('[data-open]').forEach((el) =>
    el.addEventListener('click', () => navigate('appointments/' + el.getAttribute('data-open'))));
}

async function renderDetail(outlet, id) {
  const a = await db.get('appointments', id);
  if (!a) { outlet.innerHTML = emptyState('🔍', 'Not found'); return; }
  const [clients, projects] = await Promise.all([db.list('clients'), db.list('projects')]);
  const client = clients.find((c) => c.id === a.clientId);
  const project = projects.find((p) => p.id === a.projectId);

  outlet.innerHTML = `
    <div class="detail-head">
      <button class="link-back" id="back">‹ Schedule</button>
      <div class="detail-actions">
        <button class="btn btn--ghost btn--sm" id="edit">Edit</button>
        <button class="btn btn--danger btn--sm" id="del">Delete</button>
      </div>
    </div>
    <h1>${TYPE_ICON[a.type] || '📌'} ${escapeHtml(a.title)}</h1>
    <div class="meta-line">${statusChip(a.status || 'Scheduled', STATUS_CLASS)}<span class="chip chip--neutral">${escapeHtml(a.type || 'Meeting')}</span></div>
    <div class="stat-grid">
      <div class="stat"><span class="stat__label">When</span><span class="stat__val stat__val--sm">${fmtDate(a.datetime)}<br>${fmtTime(a.datetime)}</span></div>
      ${a.durationMins ? `<div class="stat"><span class="stat__label">Duration</span><span class="stat__val">${a.durationMins} min</span></div>` : ''}
    </div>
    <div class="contact-grid">
      ${client ? `<button class="contact-cell" data-client="${client.id}"><span>👤</span>${escapeHtml(client.name)}</button>` : ''}
      ${project ? `<button class="contact-cell" data-project="${project.id}"><span>📐</span>${escapeHtml(project.title)}</button>` : ''}
      ${a.location ? `<div class="contact-cell"><span>📍</span>${escapeHtml(a.location)}</div>` : ''}
    </div>
    ${a.notes ? `<div class="note-box">${escapeHtml(a.notes)}</div>` : ''}
    <div class="quick-row">
      ${a.status !== 'Done' ? `<button class="btn btn--soft btn--sm" data-mark="Done">Mark done</button>` : ''}
      ${a.status !== 'Cancelled' ? `<button class="btn btn--soft btn--sm" data-mark="Cancelled">Cancel</button>` : ''}
      ${a.status !== 'Scheduled' ? `<button class="btn btn--soft btn--sm" data-mark="Scheduled">Reopen</button>` : ''}
    </div>
  `;
  outlet.querySelector('#back').addEventListener('click', () => navigate('appointments'));
  outlet.querySelector('#edit').addEventListener('click', () => editAppt(a));
  outlet.querySelector('#del').addEventListener('click', async () => {
    if (await confirmDialog('Delete this meeting?')) { await db.remove('appointments', id); toast('Deleted'); navigate('appointments'); }
  });
  outlet.querySelector('[data-client]')?.addEventListener('click', (e) => navigate('clients/' + e.currentTarget.getAttribute('data-client')));
  outlet.querySelector('[data-project]')?.addEventListener('click', (e) => navigate('projects/' + e.currentTarget.getAttribute('data-project')));
  outlet.querySelectorAll('[data-mark]').forEach((el) => el.addEventListener('click', async () => {
    await db.save('appointments', { ...a, status: el.getAttribute('data-mark') }); toast('Updated'); start();
  }));
}

export async function editAppt(preset = {}) {
  const a = preset.id ? preset : { datetime: defaultWhen(), status: 'Scheduled', type: 'Meeting', durationMins: 60, ...preset };
  const isNew = !a.id;
  const [clients, projects] = await Promise.all([db.list('clients'), db.list('projects')]);
  const s = openSheet({
    title: isNew ? 'New meeting' : 'Edit meeting',
    body: `<form id="f" class="form">
      ${field('Title', input('title', a.title, { required: true, placeholder: 'e.g. Site visit — Whitefield' }))}
      ${row(
        field('Type', select('type', a.type, TYPES)),
        field('When', input('datetime', toLocalInput(a.datetime), { type: 'datetime-local' })),
      )}
      ${row(
        field('Duration (min)', input('durationMins', a.durationMins, { type: 'number', min: 0, step: '15' })),
        field('Location', input('location', a.location, { placeholder: 'Address / link' })),
      )}
      ${row(
        field('Client', select('clientId', a.clientId, clients.map((c) => ({ value: c.id, label: c.name })), { placeholder: 'No client' })),
        field('Project', select('projectId', a.projectId, projects.map((p) => ({ value: p.id, label: p.title })), { placeholder: 'No project' })),
      )}
      ${field('Notes', textarea('notes', a.notes))}
      ${formActions(isNew ? 'Add meeting' : 'Save')}
    </form>`,
  });
  const form = s.root.querySelector('#f');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = readForm(form);
    if (!data.title.trim()) return;
    data.datetime = data.datetime ? new Date(data.datetime).toISOString() : a.datetime;
    await db.save('appointments', { ...a, ...data });
    closeSheet();
    toast(isNew ? 'Meeting added' : 'Saved');
    start();
  });
}

function defaultWhen() {
  const d = new Date(); d.setHours(d.getHours() + 1, 0, 0, 0); return d.toISOString();
}
function toLocalInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return '';
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}
