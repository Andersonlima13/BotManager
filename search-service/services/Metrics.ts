// metrics.ts  ← crie este arquivo separado
import client from 'prom-client'

// Coleta métricas padrão do Node.js (CPU, memória, event loop, GC...)
client.collectDefaultMetrics()

// Contador de ciclos executados
export const fetchCyclesTotal = new client.Counter({
  name: 'kwai_fetch_cycles_total',
  help: 'Total de ciclos fetchAndPublish executados',
  labelNames: ['status'] // status: success | skipped | error
})

// Contador de vídeos publicados
export const videosPublishedTotal = new client.Counter({
  name: 'kwai_videos_published_total',
  help: 'Total de vídeos enviados para a fila RabbitMQ'
})

// Histograma de duração de cada ciclo
export const fetchDuration = new client.Histogram({
  name: 'kwai_fetch_duration_seconds',
  help: 'Duração de cada ciclo fetchAndPublish',
  buckets: [0.5, 1, 2, 5, 10, 20, 30]
})

// Gauge indicando se há um ciclo em execução
export const cycleRunning = new client.Gauge({
  name: 'kwai_cycle_running',
  help: '1 se um ciclo está em execução, 0 caso contrário'
})

export const register = client.register
