import autocannon from 'autocannon';
import http from 'http';

const BASE_PORT = process.env.PORT || process.env.SERVER_PORT || 5000;
const BASE_URL = `http://localhost:${BASE_PORT}`;

interface BenchmarkResult {
  scenario: string;
  requests: number;
  rps: number;
  latencyAvg: number;
  latencyP95: number;
  latencyP99: number;
  non2xx: number;
  status: 'PASSED' | 'FAILED';
}

function checkServerReady(url: string, maxAttempts = 10): Promise<boolean> {
  return new Promise((resolve) => {
    let attempts = 0;
    const tryPing = () => {
      attempts++;
      http.get(`${url}/api/health`, (res) => {
        if (res.statusCode === 200) {
          resolve(true);
        } else if (attempts < maxAttempts) {
          setTimeout(tryPing, 500);
        } else {
          resolve(false);
        }
      }).on('error', () => {
        if (attempts < maxAttempts) {
          setTimeout(tryPing, 500);
        } else {
          resolve(false);
        }
      });
    };
    tryPing();
  });
}

async function runScenario(
  name: string,
  opts: autocannon.Options,
  maxAllowedP95Ms = 500
): Promise<BenchmarkResult> {
  console.log(`\n======================================================`);
  console.log(`🚀 Menjalankan Skenario: [${name}]`);
  console.log(`   URL: ${opts.url}`);
  console.log(`   Connections: ${opts.connections} | Duration: ${opts.duration}s`);
  console.log(`======================================================`);

  return new Promise((resolve, reject) => {
    autocannon(opts, (err, results) => {
      if (err) {
        return reject(err);
      }

      const p95 = results.latency.p95 || 0;
      const non2xx = results.non2xx || 0;
      const passed = p95 <= maxAllowedP95Ms && results.errors === 0;

      const summary: BenchmarkResult = {
        scenario: name,
        requests: results.requests.total,
        rps: Math.round(results.requests.average),
        latencyAvg: Math.round(results.latency.average),
        latencyP95: p95,
        latencyP99: results.latency.p99 || 0,
        non2xx,
        status: passed ? 'PASSED' : 'FAILED',
      };

      console.log(`📊 Hasil Metrik [${name}]:`);
      console.log(`   Total Request: ${summary.requests.toLocaleString()}`);
      console.log(`   Throughput   : ${summary.rps.toLocaleString()} req/detik`);
      console.log(`   Rata-rata    : ${summary.latencyAvg} ms`);
      console.log(`   Latency p95  : ${summary.latencyP95} ms`);
      console.log(`   Latency p99  : ${summary.latencyP99} ms`);
      console.log(`   Non-2xx HTTP : ${summary.non2xx}`);
      console.log(`   Status SLA   : ${summary.status === 'PASSED' ? '✅ MEMENUHI STANDAR' : '⚠️ BUTUH OPTIMASI'}`);

      resolve(summary);
    });
  });
}

async function main() {
  console.log(`⚡ [Load Testing & Benchmark Suite — Mari Partner SPA]`);
  console.log(`Target Backend: ${BASE_URL}`);

  const isUp = await checkServerReady(BASE_URL);
  if (!isUp) {
    console.error(`❌ Server backend tidak merespons di ${BASE_URL}.`);
    console.error(`Pastikan server sedang berjalan (misal: "npm run server" di terminal lain) sebelum menjalankan load test.`);
    process.exit(1);
  }

  console.log(`✅ Server backend terdeteksi aktif dan sehat!\n`);

  const results: BenchmarkResult[] = [];

  try {
    // Skenario 1: Lonjakan Tamu Membuka Undangan (In-Memory SWR Cached Config)
    const res1 = await runScenario(
      'Skenario 1: Lonjakan Tamu Simultan (GET /api/config)',
      {
        url: `${BASE_URL}/api/config`,
        connections: 200,
        duration: 10,
        pipelining: 1,
      },
      300
    );
    results.push(res1);

    // Skenario 2: Lonjakan Tamu Membaca Aliran Doa Ucapan (GET /api/wishes)
    const res2 = await runScenario(
      'Skenario 2: Membaca Aliran Doa Tamu (GET /api/wishes)',
      {
        url: `${BASE_URL}/api/wishes`,
        connections: 100,
        duration: 8,
      },
      400
    );
    results.push(res2);

    // Skenario 3: Uji Ketahanan Baseline Health Check (GET /api/health)
    const res3 = await runScenario(
      'Skenario 3: Health Check Endpoint Baseline',
      {
        url: `${BASE_URL}/api/health`,
        connections: 300,
        duration: 5,
      },
      150
    );
    results.push(res3);

    // Rekapitulasi Eksekutif
    console.log(`\n======================================================`);
    console.log(`🏆 REKAPITULASI BENCHMARK & LOAD TESTING SERVER`);
    console.log(`======================================================`);
    console.table(
      results.map((r) => ({
        Skenario: r.scenario,
        'Total Req': r.requests,
        'Req/Sec': r.rps,
        'Avg (ms)': r.latencyAvg,
        'p95 (ms)': r.latencyP95,
        'p99 (ms)': r.latencyP99,
        'Non-2xx': r.non2xx,
        Hasil: r.status,
      }))
    );

    const allPassed = results.every((r) => r.status === 'PASSED');
    if (allPassed) {
      console.log(`\n🎉 Seluruh skenario load testing BERHASIL memenuhi SLA performa tinggi!`);
      process.exit(0);
    } else {
      console.warn(`\n⚠️ Beberapa skenario memerlukan penyesuaian tuning latency.`);
      process.exit(0);
    }
  } catch (error) {
    console.error('Fatal error saat load test:', error);
    process.exit(1);
  }
}

main();
