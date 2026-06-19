const Database = require('better-sqlite3')
const path = require('path')
const { app } = require('electron')

let db = null

function getDBPath() {
  if (app.isPackaged) {
    return path.join(app.getPath('userData'), 'scalpcraft.db')
  }
  // En dev: carpeta data/ dentro del proyecto
  return path.join(__dirname, '../../data/scalpcraft.db')
}

function initDB() {
  const dbPath = getDBPath()
  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  createTables()
  console.log('[DB] Lista en:', dbPath)
  return db
}

function createTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS trades (
      id                      INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha_hora              TEXT    NOT NULL,
      modo                    TEXT    NOT NULL DEFAULT 'demo',
      estrategia              TEXT,
      direccion               TEXT,
      timeframe_entrada       TEXT,
      timeframe_sesgo         TEXT,
      sesgo_ema200            TEXT,
      cruce_12_21             INTEGER,
      dmi_confirma            INTEGER,
      adx_valor               REAL,
      rsi_valor               REAL,
      rsi_en_extremo          INTEGER,
      cierre_confirmado_ema12 INTEGER,
      score_confluencia       REAL,
      semaforos_verdes        INTEGER,
      estado_semaforos        TEXT,
      precio_entrada          REAL,
      precio_stop             REAL,
      precio_target           REAL,
      ratio_rb                REAL,
      apalancamiento          INTEGER,
      monto_usdt              REAL,
      resultado               TEXT    DEFAULT 'abierta',
      pnl_usdt                REAL,
      fundamental_veto        INTEGER DEFAULT 0,
      notas                   TEXT,
      captura_path            TEXT
    );

    CREATE TABLE IF NOT EXISTS config_pesos (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      filtro      TEXT    NOT NULL UNIQUE,
      peso        REAL    NOT NULL DEFAULT 1.0,
      descripcion TEXT
    );
  `)

  const { cnt } = db.prepare('SELECT COUNT(*) as cnt FROM config_pesos').get()
  if (cnt === 0) {
    const insert = db.prepare(
      'INSERT INTO config_pesos (filtro, peso, descripcion) VALUES (?, ?, ?)'
    )
    ;[
      ['sesgo_ema200',  1.0, 'Sesgo macro EMA 200'],
      ['cruce_12_21',   1.0, 'Cruce EMA 12 / EMA 21'],
      ['dmi_adx',       1.0, 'DMI + ADX'],
      ['rsi',           1.0, 'RSI 14 — filtro de exceso'],
      ['cierre_ema12',  1.0, 'Cierre de vela confirmado EMA 12'],
      ['estructura_sr', 1.0, 'Estructura S/R + ratio 2:1'],
    ].forEach(row => insert.run(...row))
    console.log('[DB] Pesos iniciales cargados.')
  }
}

function getDB() {
  if (!db) throw new Error('DB no inicializada. Llamá a initDB() primero.')
  return db
}

module.exports = { initDB, getDB }
