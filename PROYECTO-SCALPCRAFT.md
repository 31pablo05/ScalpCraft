# ScalpCraft — BTC/USDT

**Asistente de trading para scalping en el par BTC/USDT con apoyo de IA.**
Documento vivo. Se va puliendo a medida que la fase demo muestre qué funciona.

> ⚠️ **Aviso**: Esto no es asesoramiento financiero. La app reduce el error humano
> (disciplina, registro, consistencia), pero NO elimina el riesgo del mercado.
> Con apalancamiento alto, el riesgo de liquidación es real y rápido. Todo arranca
> y se queda en modo demo/testnet hasta que el winrate sea sólido y medible.

---

## 1. Filosofía del proyecto

La ventaja no está en *adivinar* el mercado —eso no se puede— sino en **jugar con probabilidad**:
acumular condiciones que históricamente movieron las chances a favor (confluencia). Cuando
se alinean varias señales, la probabilidad de acierto sube; cuando hay pocas, no se opera.

La IA aplica las reglas **sin emoción**, que es justo donde el humano falla. El "entrenamiento"
no es magia del modelo: es **estadística sobre tu propio historial de operaciones**. Cuantos más
trades registrados con su contexto completo, mejor se sabe qué confluencias ganan más.

**Objetivo**: ganancias chicas y constantes (2–3 USD/día como referencia), priorizando
**minimizar pérdidas** por encima de maximizar ganancias. Días sin setup = días sin operar.
No forzar entradas es parte de la estrategia, no una falla.

**Métrica real de éxito**: no es "gané 3 USD hoy", es **winrate + ratio riesgo/beneficio**
(expectativa matemática positiva sostenida en el tiempo).

---

## 2. El Cerebro — Reglas de la estrategia

### 2.1 Indicadores del tablero

| Indicador | Rol | Lectura |
|---|---|---|
| **EMA 200** (SMA lenta, línea roja) | Sesgo macro | Precio arriba = solo long. Precio abajo = solo short. Filtro maestro. |
| **EMA 12 / EMA 21** (cruce) | Gatillo de tendencia | 12 cruza arriba de 21 = momentum alcista (y viceversa). |
| **DMI 14 + ADX** | Confirmación de fuerza | +DI > -DI para long. **ADX > 20–25** = hay tendencia real (si está plano, el cruce miente). |
| **RSI 14** | Filtro de exceso | Si vas a entrar long con RSI en 75–80 (sobrecompra), esperar. Evita entradas tarde. |
| **EMA 12 — cierre de vela** | **Disparo de entrada** | Ver regla 2.3. Es el clic exacto. |
| **Soportes / Resistencias** | Estructura | Definen dónde va el stop y hacia dónde el target. La estructura manda. |
| **Fibonacci** (0.618) | *(Estrategia 2, a futuro)* | Zona de retroceso/rebote, idealmente coincidiendo con EMA 200. |

### 2.2 Las dos estrategias

**Estrategia 1 — Tendencia + cruce** *(la principal, la que ya operás)*
- Long: precio sobre EMA 200 + EMA 12 cruza arriba de EMA 21 + DMI confirma (+DI > -DI, ADX > 20) + RSI sin extremo.
- Short: espejo exacto, todo para abajo.
- Brilla en mercado con tendencia clara y direccional.

**Estrategia 2 — Rebote en zona (Fibonacci)** *(a incorporar en demo)*
- Esperás retroceso del precio a zona de soporte fuerte (Fib 0.618 coincidiendo con EMA 200)
  y que el DMI muestre el momentum dándose vuelta a favor.
- Brilla en mercado que respeta niveles y rebota.
- Se registra por separado para comparar rendimiento contra la Estrategia 1.

### 2.3 Regla de disparo de entrada (la pieza fina) ⭐

> Cuando una vela queda **atravesada por la EMA 12** (la línea de puntos azules le pasa por
> el medio del cuerpo), **NO se entra todavía**. Se espera a que esa vela **CIERRE por debajo
> del punto azul** (en short) o **por encima** (en long). Recién con el **cierre confirmado**
> se dispara la entrada.

Esto es **esperar confirmación en vez de anticipar**. Filtra las mechas falsas que se comen
a los que entran cuando el precio solo *toca* la media. Es una regla de paciencia → la IA la
respeta mejor que el humano en caliente.

### 2.4 Gestión de riesgo

**Orden correcto: primero el STOP (según estructura), después el TARGET.**

1. **Stop loss**: detrás del punto de la EMA 12 de la vela que quedó atravesada
   (en short, arriba de ese punto; en long, abajo). Si el precio vuelve a cruzar ese punto,
   la señal quedó invalidada. Stop ajustado y lógico.
2. **Esa distancia = riesgo "1"**.
3. **Target**: distancia × 2 → **ratio 2:1** (apuntando al próximo soporte/resistencia relevante).
4. **Validación de estructura**: si para llegar al target 2:1 el precio tiene que atravesar
   una resistencia fuerte, el trade NO sirve → se descarta.

**Por qué 2:1**: con ratio 2:1 alcanza con acertar el **~35–40%** de las veces para ser
rentable. Permite equivocarse más de la mitad de las veces y aun así ganar. Ideal para
"constancia sin presión de acertar siempre". El 3:1 paga más pero se cumple menos en 5m.
(Validar 2:1 vs 3:1 en demo.)

### 2.5 Confluencia ponderada (el "aprendizaje")

Cada señal es un voto. No todas pesan igual. Con la data de la demo medimos qué confluencias
tienen mejor winrate y **ajustamos los pesos**. Ejemplo del tipo de insight que buscamos:
"cuando Fib + DMI coinciden, ganás 70%; cuando entrás solo por media móvil, 45%" → el sistema
le da más peso a la primera. Eso es entrenar de verdad.

### 2.6 Multi-timeframe

- **30m / 1h** → definir la **dirección** (sesgo EMA 200) y marcar soportes/resistencias.
- **5m** → afinar el **momento exacto de entrada** (regla 2.3).
- Operar las dos temporalidades alineadas reduce muchísimo las entradas falsas.

### 2.7 Análisis fundamental diario

A la mañana (10–11 hs ARG, apertura): chequear noticias/eventos macro que digan "hoy mejor
no operar" (ej. anuncios de tasas de la Fed, datos de inflación). El fundamental no da la
entrada, pero puede **vetar** el día.

### 2.8 El Semáforo de Confluencia ⭐ (corazón de la interfaz)

El cerebro se muestra como un **semáforo de 6 filtros**, uno por condición. Cada filtro tiene
3 estados visuales que dan lectura instantánea (mejor que números o un sí/no binario):

- 🔴 **Rojo**: la condición NO se cumple.
- 🟡 **Amarillo**: está *por cumplirse* (inminente). ← el estado más valioso: avisa ANTES.
- 🟢 **Verde**: la condición está OK.

**Los 6 filtros y cómo cambian de color:**

| # | Filtro | 🔴 Rojo | 🟡 Amarillo | 🟢 Verde |
|---|---|---|---|---|
| 1 | Sesgo EMA 200 | Precio del lado contrario | — (es binario) | Precio del lado correcto |
| 2 | Cruce 12 / 21 | Sin cruce / en contra | Medias juntándose, cruce inminente | Ya cruzó a favor |
| 3 | DMI / ADX | -DI/+DI en contra o ADX<20 | Cerca del cruce o ADX subiendo a 20 | DI a favor + ADX>20 |
| 4 | RSI 14 | En extremo (sobrecompra/venta) | Acercándose a extremo | Zona sana |
| 5 | **Cierre EMA 12** ⭐ | Sin vela en juego | Vela atravesada, esperando cierre | Cerró confirmada (long/short) |
| 6 | Estructura S/R | Sin nivel claro / 2:1 no entra | Nivel dudoso | Soporte/resistencia claro, 2:1 OK |

**El medidor de probabilidad** (arriba de los semáforos): un **score de confluencia** =
cuántos filtros en verde, ponderados por el peso que la demo les fue dando (sección 2.5).
NO es una probabilidad real del mercado — es un resumen visual de "qué tan alineado está todo".
Ej: "Confluencia 67% — 4 de 6 en verde".

**El flujo que habilita** (lo que querés lograr):
1. La app vigila los 6 filtros en vivo y actualiza colores + score solo.
2. Cuando el score sube (varios verdes / amarillos clave), **te avisa** (alerta sonora /
   notificación) → vos mirás el gráfico con tus propios ojos.
3. Ese es el **primer filtro objetivo**: la máquina te dice "acá hay probabilidades a favor".
4. Apretás "Analizar" → la app me manda el estado de los 6 filtros + datos + captura.
   Yo leo esa "foto del momento" y damos la lectura final juntos.
5. Decidís y ejecutás vos.

> **Importante sobre "ver en vivo"**: la IA NO puede mirar tu pantalla en streaming continuo.
> El modelo correcto es por "fotos": cuando el semáforo está caliente, disparás el análisis y
> me llega el estado de ese instante. Para scalping de 5m alcanza de sobra (tenés la vela
> entera para decidir). El semáforo corre local y continuo; Claude entra por pedido.

**Modo veto** (sección 2.7): si el fundamental del día desaconseja operar, o estás fuera del
horario, el medidor se pone **gris con cartel** para que ninguna confluencia te tiente en mal día.

**El semáforo también se entrena**: se guarda cuántas veces estuvo en "verde alto" y qué pasó
después, para medir en demo si tu propio semáforo predice bien.

---

## 3. Stack tecnológico

| Capa | Tecnología | Por qué |
|---|---|---|
| **App de escritorio** | **Electron** | Ya lo conocés. Corre nativo en tu PC, guarda archivos local, mete React adentro sin fricción. |
| **Interfaz** | **React + Vite + Tailwind** | Tu combo de siempre. Cero tecnología nueva. |
| **Gráficos** | **lightweight-charts** (TradingView, gratis/open source) | Velas + EMAs + indicadores con look tipo Bybit. La app dibuja sus propios gráficos. |
| **Base de datos local** | **SQLite** | Un archivo en tu PC. Perfecto para "dame todos los trades con confluencia X y calculá winrate". Local, tuyo, liviano. |
| **Backend interno** | **Node.js (main process de Electron)** | NO es un servidor externo. Es la parte Node de Electron. Ahí viven Bybit, la API de Claude y SQLite. |
| **Datos de mercado** | **API pública de Bybit** | WebSocket (precio en vivo) + REST (velas históricas). Gratis. |
| **Cálculo de indicadores** | librería **technicalindicators** (JS) | EMA, DMI/ADX, RSI, Fibonacci calculados en código propio. |
| **IA / análisis** | **API de Claude** | Análisis técnico (lee datos + capturas con visión) y fundamental. |
| **Lenguaje** | **JavaScript** (no TypeScript) | Tu convención. |

### 3.1 Punto crítico de seguridad 🔒

La **API key de Claude NUNCA va en el frontend** (el código de la ventana React). Va en el
**main process de Node**, protegida. Si la ponés en el renderer, queda expuesta. Toda llamada
a Claude y a Bybit pasa por el proceso Node, no por la ventana.

### 3.2 Arquitectura de los dos procesos de Electron

```
┌─────────────────────────────────────────────────┐
│  MAIN PROCESS (Node.js) — "el backend interno"    │
│  • Conexión WebSocket + REST a Bybit              │
│  • Llamadas a la API de Claude (API key acá)      │
│  • Acceso a SQLite (lee/escribe trades)           │
│  • Cálculo de indicadores                         │
└───────────────▲───────────────────────┬───────────┘
                │  IPC (mensajes)        │
┌───────────────┴───────────────────────▼───────────┐
│  RENDERER (React + Vite + Tailwind) — la ventana   │
│  • Gráfico con lightweight-charts                  │
│  • Panel de señales / tablero de confluencia       │
│  • Botón "Analizar" + registro de operaciones      │
│  • Dashboard de estadísticas (winrate, etc.)       │
└────────────────────────────────────────────────────┘
```

### 3.3 Disparo del análisis con Claude

**Modo automático + botón manual** (las dos cosas):
- **Automático**: cuando la app detecta que se cumplen las condiciones del tablero, dispara
  el análisis y te avisa "che, mirá que se está armando un setup".
- **Manual**: botón "Analizar ahora" para pedir lectura cuando vos quieras.

### 3.4 Gráficos: propios + captura

**Las dos cosas**: la app dibuja el gráfico con lightweight-charts (EMAs, etc.) Y mantiene
la opción de mandarle una captura a Claude para que la lea con visión (útil para confirmar
estructura/patrones que el dato crudo no captura).

---

## 4. Esquema de datos (SQLite)

Cada operación guarda el **estado completo de las señales** al momento de entrar — sin esto
no se puede calcular qué confluencias funcionan.

### Tabla `trades`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | INTEGER PK | — |
| `fecha_hora` | TEXT | Timestamp de la entrada |
| `modo` | TEXT | `demo` / `real` |
| `estrategia` | TEXT | `tendencia_cruce` / `rebote_fib` |
| `direccion` | TEXT | `long` / `short` |
| `timeframe_entrada` | TEXT | ej. `5m` |
| `timeframe_sesgo` | TEXT | ej. `30m` |
| `sesgo_ema200` | TEXT | `a_favor` / `en_contra` / `neutro` |
| `cruce_12_21` | INTEGER | 1 / 0 (¿hubo cruce a favor?) |
| `dmi_confirma` | INTEGER | 1 / 0 (+DI/-DI a favor) |
| `adx_valor` | REAL | valor del ADX al entrar |
| `rsi_valor` | REAL | valor del RSI al entrar |
| `rsi_en_extremo` | INTEGER | 1 / 0 |
| `cierre_confirmado_ema12` | INTEGER | 1 / 0 ⭐ (¿esperé el cierre o me adelanté?) |
| `score_confluencia` | REAL | % del medidor al momento de entrar (ej. 67) |
| `semaforos_verdes` | INTEGER | cuántos de los 6 filtros estaban en verde |
| `estado_semaforos` | TEXT | JSON con el color de cada filtro al entrar |
| `precio_entrada` | REAL | — |
| `precio_stop` | REAL | — |
| `precio_target` | REAL | — |
| `ratio_rb` | REAL | ej. 2.0 |
| `apalancamiento` | INTEGER | ej. 20 |
| `monto_usdt` | REAL | tamaño de la posición |
| `resultado` | TEXT | `ganada` / `perdida` / `breakeven` / `abierta` |
| `pnl_usdt` | REAL | ganancia/pérdida real |
| `fundamental_veto` | INTEGER | 1 / 0 (¿había noticia que desaconsejaba?) |
| `notas` | TEXT | observaciones libres |
| `captura_path` | TEXT | ruta a la screenshot guardada (opcional) |

### Tabla `config_pesos` *(para la confluencia ponderada)*
Guarda el peso actual de cada señal, ajustable con la data. Arranca todo en peso 1.

### Reportes que vas a poder sacar
- Winrate global y por estrategia.
- Winrate por confluencia (ej. "cierre confirmado SÍ vs NO").
- Mejores 3 setups por rendimiento.
- "¿Cuánto me cuesta adelantarme al cierre de la EMA 12?"
- Días con veto fundamental: ¿acerté al no operar?

---

## 5. Estructura de carpetas del proyecto

```
scalpcraft/
├── package.json
├── electron/
│   ├── main.js              → main process (arranque, ventana)
│   ├── preload.js           → puente seguro IPC main↔renderer
│   └── services/
│       ├── bybit.js         → WebSocket + REST de Bybit
│       ├── claude.js        → llamadas a la API de Claude (API key acá)
│       ├── indicators.js    → EMA, DMI/ADX, RSI, Fibonacci
│       └── db.js            → acceso a SQLite
├── src/                     → renderer (React + Vite)
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── Chart.jsx          → lightweight-charts (velas + EMAs)
│   │   ├── ProbabilityMeter.jsx → medidor de confluencia (% + barra)
│   │   ├── SemaphorePanel.jsx → los 6 semáforos (rojo/amarillo/verde)
│   │   ├── SemaphoreLight.jsx → un filtro individual (reutilizable)
│   │   ├── ClaudePanel.jsx    → lectura de Claude
│   │   ├── VetoBanner.jsx     → modo veto (gris + cartel)
│   │   ├── TradeForm.jsx      → registrar operación
│   │   ├── AnalyzeButton.jsx  → analizar / mandar captura
│   │   └── Stats.jsx          → dashboard winrate / reportes
│   ├── styles/
│   │   └── global.css       → Tailwind + variables CSS
│   └── lib/
│       └── ipc.js           → wrapper de llamadas al main process
├── data/
│   └── scalpcraft.db             → SQLite (tu historial, local)
└── .env                     → API key de Claude (NO subir a git)
```

---

## 6. Roadmap por fases

**Fase 0 — Setup** *(base del proyecto)*
- Electron + Vite + React + Tailwind andando, ventana en blanco que abre.
- Conexión a SQLite, crear las tablas.

**Fase 1 — Datos y gráfico**
- WebSocket de Bybit trayendo precio en vivo.
- Gráfico con lightweight-charts + EMAs (12, 21, 200), DMI, RSI dibujados.
- Cálculo de indicadores propio funcionando.

**Fase 2 — El Semáforo de Confluencia** ⭐
- Los 6 SemaphoreLight con lógica rojo/amarillo/verde en vivo.
- ProbabilityMeter (score ponderado) actualizándose solo.
- Detección automática de cuándo se calienta + alerta sonora/notificación.
- VetoBanner (modo gris por horario / fundamental).

**Fase 3 — Registro y estadísticas**
- TradeForm para cargar operaciones (manual al principio).
- Dashboard de winrate y reportes básicos.

**Fase 4 — Integración con Claude**
- Botón "Analizar" + modo automático.
- Claude lee datos + captura y da su lectura según el cerebro.

**Fase 5 — Pulido del cerebro (continuo)**
- Incorporar Fibonacci / Estrategia 2.
- Ajustar pesos de confluencia con la data real de la demo.
- Iterar reglas hasta winrate sólido → recién ahí, evaluar paso a real.

---

## 7. Decisiones pendientes / a validar en demo
- [ ] Ratio 2:1 vs 3:1 — cuál rinde mejor en 5m.
- [ ] Timeframe de sesgo: 30m vs 1h.
- [ ] Bybit vs BingX para operar (recomendación inicial: **Bybit**, mejor API/testnet/liquidez).
- [ ] EMA 12/21: confirmar exponenciales (reaccionan más rápido); EMA 200 dejar como SMA.
- [ ] Cuánto tiempo mínimo en demo antes de evaluar real (criterio: winrate sólido, sin apuro).
