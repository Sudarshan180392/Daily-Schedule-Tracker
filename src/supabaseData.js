// ═══════════════════════════════════════════════════════════════
//  Supabase Data Access Layer
//  All CRUD operations for the UPSC Prep Tracker
// ═══════════════════════════════════════════════════════════════

import { supabase } from './supabaseClient'

/* ─────────────────────── Helpers ─────────────────────── */

/** Map a DB task row (snake_case) to the app shape (camelCase). */
function dbTaskToApp(row) {
  return {
    id: row.id,
    subject: row.subject || '',
    topic: row.topic || '',
    targetHours: row.target_hours || 0,
    actualHours: row.actual_hours || 0,
    notes: row.notes || '',
  }
}

/** Map a DB wellbeing row to the app shape. */
function dbWellbeingToApp(row) {
  return {
    sleepHours: row.sleep_hours ?? 7,
    waterLitres: row.water_litres ?? 2,
    exercise: row.exercise ?? false,
    mood: row.mood ?? 2,
  }
}

/** Map a DB settings row to the app shape. */
function dbSettingsToApp(row) {
  return {
    examDate: row.exam_date || '2027-05-23',
    periodName: row.period_name || '30-Day Sprint',
    subjects: row.subjects || ['History','Geography','Polity','Economy','Science & Tech','Environment','CSAT','Ethics','Essay'],
    showWellbeing: row.show_wellbeing ?? true,
    darkMode: row.dark_mode ?? false,
  }
}

/** Map a DB current affairs row to the app shape. */
function dbCAToApp(row) {
  return {
    id: row.id,
    date: row.date || '',
    topic: row.topic || '',
    category: row.category || 'Polity',
    source: row.source || '',
    notes: row.notes || '',
    revised: row.revised ?? false,
  }
}

/** Default wellbeing for a day that has no DB row. */
const DEFAULT_WELLBEING = { sleepHours: 7, waterLitres: 2, exercise: false, mood: 2 }

/* ═══════════════════════════════════════════════════════════════
   FETCH ALL USER DATA
   ═══════════════════════════════════════════════════════════════ */

/**
 * Fetches all data for a user in parallel.
 * @param {string} userId
 * @returns {{ settings: object|null, days: object, mocks: array, currentAffairs: array, error: string|null }}
 */
export async function fetchAllUserData(userId) {
  try {
    const [settingsRes, tasksRes, wellbeingRes, mocksRes, scoresRes, caRes] = await Promise.all([
      supabase.from('user_settings').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('day_tasks').select('*').eq('user_id', userId).order('day_number').order('sort_order'),
      supabase.from('day_wellbeing').select('*').eq('user_id', userId).order('day_number'),
      supabase.from('mock_tests').select('*').eq('user_id', userId).order('created_at'),
      supabase.from('mock_subject_scores').select('*').eq('user_id', userId),
      supabase.from('current_affairs').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ])

    // Check for errors
    for (const res of [settingsRes, tasksRes, wellbeingRes, mocksRes, scoresRes, caRes]) {
      if (res.error) return { settings: null, days: {}, mocks: [], currentAffairs: [], error: res.error.message }
    }

    // ── Transform settings ──
    const settings = settingsRes.data ? dbSettingsToApp(settingsRes.data) : null

    // ── Transform days (tasks + wellbeing) ──
    const days = {}

    // Group tasks by day_number
    const tasksByDay = {}
    for (const row of (tasksRes.data || [])) {
      if (!tasksByDay[row.day_number]) tasksByDay[row.day_number] = []
      tasksByDay[row.day_number].push(dbTaskToApp(row))
    }

    // Index wellbeing by day_number
    const wellbeingByDay = {}
    for (const row of (wellbeingRes.data || [])) {
      wellbeingByDay[row.day_number] = dbWellbeingToApp(row)
    }

    // Build days 1-30
    for (let d = 1; d <= 30; d++) {
      days[d] = {
        tasks: tasksByDay[d] || [],
        wellbeing: wellbeingByDay[d] || { ...DEFAULT_WELLBEING },
      }
    }

    // ── Transform mocks (re-nest subject scores) ──
    const scoresByMock = {}
    for (const row of (scoresRes.data || [])) {
      if (!scoresByMock[row.mock_id]) scoresByMock[row.mock_id] = {}
      scoresByMock[row.mock_id][row.subject] = {
        correct: row.correct || 0,
        wrong: row.wrong || 0,
        skipped: row.skipped || 0,
      }
    }

    const mocks = (mocksRes.data || []).map(m => ({
      id: m.id,
      name: m.name || '',
      date: m.date || '',
      totalScore: m.total_score || 0,
      maxScore: m.max_score || 200,
      subjectScores: scoresByMock[m.id] || {},
    }))

    // ── Transform current affairs ──
    const currentAffairs = (caRes.data || []).map(dbCAToApp)

    return { settings, days, mocks, currentAffairs, error: null }
  } catch (err) {
    return { settings: null, days: {}, mocks: [], currentAffairs: [], error: err.message }
  }
}

/* ═══════════════════════════════════════════════════════════════
   SETTINGS
   ═══════════════════════════════════════════════════════════════ */

/**
 * Upsert user settings.
 * @param {string} userId
 * @param {object} settings - App-shape settings object
 * @returns {{ error: string|null }}
 */
export async function upsertSettings(userId, settings) {
  try {
    const { error } = await supabase.from('user_settings').upsert({
      user_id: userId,
      exam_date: settings.examDate,
      period_name: settings.periodName,
      subjects: settings.subjects,
      show_wellbeing: settings.showWellbeing,
      dark_mode: settings.darkMode,
    }, { onConflict: 'user_id' })
    return { error: error?.message || null }
  } catch (err) {
    return { error: err.message }
  }
}

/* ═══════════════════════════════════════════════════════════════
   DAY TASKS
   ═══════════════════════════════════════════════════════════════ */

/**
 * Replace all tasks for a given day with new ones (delete + insert).
 * @param {string} userId
 * @param {number} dayNumber - 1-30
 * @param {Array} tasks - App-shape task objects
 * @returns {{ data: Array|null, error: string|null }}
 */
export async function upsertDayTasks(userId, dayNumber, tasks) {
  try {
    // Delete existing tasks for this user+day
    const { error: delErr } = await supabase
      .from('day_tasks')
      .delete()
      .eq('user_id', userId)
      .eq('day_number', dayNumber)
    if (delErr) return { data: null, error: delErr.message }

    // Insert new tasks
    if (tasks.length === 0) return { data: [], error: null }

    const rows = tasks.map((t, i) => ({
      user_id: userId,
      day_number: dayNumber,
      sort_order: i,
      subject: t.subject || '',
      topic: t.topic || '',
      target_hours: t.targetHours || 0,
      actual_hours: t.actualHours || 0,
      notes: t.notes || '',
    }))

    const { data, error } = await supabase
      .from('day_tasks')
      .insert(rows)
      .select()
      .order('sort_order')

    if (error) return { data: null, error: error.message }
    return { data: (data || []).map(dbTaskToApp), error: null }
  } catch (err) {
    return { data: null, error: err.message }
  }
}

/* ═══════════════════════════════════════════════════════════════
   WELLBEING
   ═══════════════════════════════════════════════════════════════ */

/**
 * Upsert wellbeing for a given day.
 * @param {string} userId
 * @param {number} dayNumber
 * @param {object} wellbeing - App-shape wellbeing object
 * @returns {{ error: string|null }}
 */
export async function upsertWellbeing(userId, dayNumber, wellbeing) {
  try {
    const { error } = await supabase.from('day_wellbeing').upsert({
      user_id: userId,
      day_number: dayNumber,
      sleep_hours: wellbeing.sleepHours,
      water_litres: wellbeing.waterLitres,
      exercise: wellbeing.exercise,
      mood: wellbeing.mood,
    }, { onConflict: 'user_id,day_number' })
    return { error: error?.message || null }
  } catch (err) {
    return { error: err.message }
  }
}

/* ═══════════════════════════════════════════════════════════════
   MOCK TESTS
   ═══════════════════════════════════════════════════════════════ */

/**
 * Insert a mock test with subject scores.
 * @param {string} userId
 * @param {object} mock - App-shape mock object (with subjectScores nested)
 * @returns {{ data: object|null, error: string|null }}
 */
export async function insertMock(userId, mock) {
  try {
    // Insert mock header
    const { data: mockRow, error: mockErr } = await supabase
      .from('mock_tests')
      .insert({
        user_id: userId,
        name: mock.name,
        date: mock.date,
        total_score: mock.totalScore,
        max_score: mock.maxScore,
      })
      .select()
      .single()

    if (mockErr) return { data: null, error: mockErr.message }

    // Insert subject scores
    const scoreEntries = Object.entries(mock.subjectScores || {})
    if (scoreEntries.length > 0) {
      const scoreRows = scoreEntries.map(([subject, scores]) => ({
        mock_id: mockRow.id,
        user_id: userId,
        subject,
        correct: scores.correct || 0,
        wrong: scores.wrong || 0,
        skipped: scores.skipped || 0,
      }))

      const { error: scErr } = await supabase
        .from('mock_subject_scores')
        .insert(scoreRows)
      if (scErr) return { data: null, error: scErr.message }
    }

    return {
      data: {
        id: mockRow.id,
        name: mockRow.name,
        date: mockRow.date,
        totalScore: mockRow.total_score,
        maxScore: mockRow.max_score,
        subjectScores: mock.subjectScores || {},
      },
      error: null,
    }
  } catch (err) {
    return { data: null, error: err.message }
  }
}

/**
 * Delete a mock test (cascades to subject scores).
 * @param {string} userId
 * @param {string} mockId
 * @returns {{ error: string|null }}
 */
export async function deleteMock(userId, mockId) {
  try {
    const { error } = await supabase
      .from('mock_tests')
      .delete()
      .eq('id', mockId)
      .eq('user_id', userId)
    return { error: error?.message || null }
  } catch (err) {
    return { error: err.message }
  }
}

/* ═══════════════════════════════════════════════════════════════
   CURRENT AFFAIRS
   ═══════════════════════════════════════════════════════════════ */

/**
 * Insert a current affairs entry.
 * @param {string} userId
 * @param {object} entry - App-shape CA object (without id)
 * @returns {{ data: object|null, error: string|null }}
 */
export async function insertCA(userId, entry) {
  try {
    const { data, error } = await supabase
      .from('current_affairs')
      .insert({
        user_id: userId,
        date: entry.date || '',
        topic: entry.topic || '',
        category: entry.category || 'Polity',
        source: entry.source || '',
        notes: entry.notes || '',
        revised: entry.revised ?? false,
      })
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data: dbCAToApp(data), error: null }
  } catch (err) {
    return { data: null, error: err.message }
  }
}

/**
 * Update a current affairs entry.
 * @param {string} userId
 * @param {string} caId
 * @param {object} updates - Partial app-shape fields to update
 * @returns {{ error: string|null }}
 */
export async function updateCA(userId, caId, updates) {
  try {
    // Map camelCase keys to snake_case
    const mapped = {}
    if ('date' in updates) mapped.date = updates.date
    if ('topic' in updates) mapped.topic = updates.topic
    if ('category' in updates) mapped.category = updates.category
    if ('source' in updates) mapped.source = updates.source
    if ('notes' in updates) mapped.notes = updates.notes
    if ('revised' in updates) mapped.revised = updates.revised

    const { error } = await supabase
      .from('current_affairs')
      .update(mapped)
      .eq('id', caId)
      .eq('user_id', userId)
    return { error: error?.message || null }
  } catch (err) {
    return { error: err.message }
  }
}

/**
 * Delete a current affairs entry.
 * @param {string} userId
 * @param {string} caId
 * @returns {{ error: string|null }}
 */
export async function deleteCA(userId, caId) {
  try {
    const { error } = await supabase
      .from('current_affairs')
      .delete()
      .eq('id', caId)
      .eq('user_id', userId)
    return { error: error?.message || null }
  } catch (err) {
    return { error: err.message }
  }
}

/**
 * Batch-update multiple current affairs entries.
 * @param {string} userId
 * @param {string[]} ids - Array of CA entry IDs
 * @param {object} updates - Fields to update (e.g., { revised: true })
 * @returns {{ error: string|null }}
 */
export async function batchUpdateCA(userId, ids, updates) {
  try {
    const mapped = {}
    if ('revised' in updates) mapped.revised = updates.revised

    const { error } = await supabase
      .from('current_affairs')
      .update(mapped)
      .in('id', ids)
      .eq('user_id', userId)
    return { error: error?.message || null }
  } catch (err) {
    return { error: err.message }
  }
}

/* ═══════════════════════════════════════════════════════════════
   BULK OPERATIONS
   ═══════════════════════════════════════════════════════════════ */

/**
 * Delete ALL data for a user across all tables.
 * @param {string} userId
 * @returns {{ error: string|null }}
 */
export async function deleteAllUserData(userId) {
  try {
    // Delete in order (children first due to FK, or rely on CASCADE)
    // mock_subject_scores cascade from mock_tests, so just delete parents
    const results = await Promise.all([
      supabase.from('day_tasks').delete().eq('user_id', userId),
      supabase.from('day_wellbeing').delete().eq('user_id', userId),
      supabase.from('mock_tests').delete().eq('user_id', userId), // cascades mock_subject_scores
      supabase.from('current_affairs').delete().eq('user_id', userId),
      supabase.from('user_settings').delete().eq('user_id', userId),
    ])

    for (const res of results) {
      if (res.error) return { error: res.error.message }
    }
    return { error: null }
  } catch (err) {
    return { error: err.message }
  }
}

/**
 * Full data import: delete everything then re-insert from app-shape data.
 * @param {string} userId
 * @param {object} data - Full app state { settings, days, mocks, currentAffairs }
 * @returns {{ error: string|null }}
 */
export async function bulkImportData(userId, data) {
  try {
    // 1. Delete all existing data
    const delResult = await deleteAllUserData(userId)
    if (delResult.error) return { error: delResult.error }

    // 2. Insert settings
    if (data.settings) {
      const settingsResult = await upsertSettings(userId, data.settings)
      if (settingsResult.error) return { error: settingsResult.error }
    }

    // 3. Insert day tasks and wellbeing for all 30 days
    const dayPromises = []
    for (let d = 1; d <= 30; d++) {
      const dayData = data.days?.[d]
      if (!dayData) continue

      if (dayData.tasks && dayData.tasks.length > 0) {
        dayPromises.push(upsertDayTasks(userId, d, dayData.tasks))
      }
      if (dayData.wellbeing) {
        dayPromises.push(upsertWellbeing(userId, d, dayData.wellbeing))
      }
    }
    const dayResults = await Promise.all(dayPromises)
    for (const res of dayResults) {
      if (res.error) return { error: res.error }
    }

    // 4. Insert mocks
    for (const mock of (data.mocks || [])) {
      const mockResult = await insertMock(userId, mock)
      if (mockResult.error) return { error: mockResult.error }
    }

    // 5. Insert current affairs
    if (data.currentAffairs && data.currentAffairs.length > 0) {
      const caRows = data.currentAffairs.map(e => ({
        user_id: userId,
        date: e.date || '',
        topic: e.topic || '',
        category: e.category || 'Polity',
        source: e.source || '',
        notes: e.notes || '',
        revised: e.revised ?? false,
      }))
      const { error } = await supabase.from('current_affairs').insert(caRows)
      if (error) return { error: error.message }
    }

    return { error: null }
  } catch (err) {
    return { error: err.message }
  }
}
