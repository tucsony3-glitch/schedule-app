import sharp from 'sharp'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <!-- 背景 -->
  <rect width="512" height="512" rx="100" fill="#4285f4"/>

  <!-- カレンダー本体 -->
  <rect x="80" y="120" width="352" height="300" rx="28" fill="white"/>

  <!-- ヘッダー（青帯） -->
  <rect x="80" y="120" width="352" height="90" rx="28" fill="#1a73e8"/>
  <rect x="80" y="165" width="352" height="45" fill="#1a73e8"/>

  <!-- リングの棒（上から飛び出す） -->
  <rect x="168" y="88" width="28" height="72" rx="14" fill="#e8f0fe"/>
  <rect x="316" y="88" width="28" height="72" rx="14" fill="#e8f0fe"/>

  <!-- ヘッダーテキスト -->
  <text x="256" y="186" font-family="Arial,sans-serif" font-size="44" font-weight="bold" fill="white" text-anchor="middle">5月</text>

  <!-- 曜日ラベル -->
  <text x="120" y="256" font-family="Arial,sans-serif" font-size="26" fill="#e53935" text-anchor="middle">日</text>
  <text x="170" y="256" font-family="Arial,sans-serif" font-size="26" fill="#555" text-anchor="middle">月</text>
  <text x="220" y="256" font-family="Arial,sans-serif" font-size="26" fill="#555" text-anchor="middle">火</text>
  <text x="270" y="256" font-family="Arial,sans-serif" font-size="26" fill="#555" text-anchor="middle">水</text>
  <text x="320" y="256" font-family="Arial,sans-serif" font-size="26" fill="#555" text-anchor="middle">木</text>
  <text x="370" y="256" font-family="Arial,sans-serif" font-size="26" fill="#555" text-anchor="middle">金</text>
  <text x="420" y="256" font-family="Arial,sans-serif" font-size="26" fill="#1565c0" text-anchor="middle">土</text>

  <!-- 日付 row1 -->
  <text x="120" y="306" font-family="Arial,sans-serif" font-size="30" fill="#e53935" text-anchor="middle">1</text>
  <text x="170" y="306" font-family="Arial,sans-serif" font-size="30" fill="#555" text-anchor="middle">2</text>
  <text x="220" y="306" font-family="Arial,sans-serif" font-size="30" fill="#555" text-anchor="middle">3</text>
  <text x="270" y="306" font-family="Arial,sans-serif" font-size="30" fill="#555" text-anchor="middle">4</text>
  <text x="320" y="306" font-family="Arial,sans-serif" font-size="30" fill="#555" text-anchor="middle">5</text>
  <text x="370" y="306" font-family="Arial,sans-serif" font-size="30" fill="#555" text-anchor="middle">6</text>
  <text x="420" y="306" font-family="Arial,sans-serif" font-size="30" fill="#1565c0" text-anchor="middle">7</text>

  <!-- 日付 row2 -->
  <text x="120" y="356" font-family="Arial,sans-serif" font-size="30" fill="#e53935" text-anchor="middle">8</text>
  <text x="170" y="356" font-family="Arial,sans-serif" font-size="30" fill="#555" text-anchor="middle">9</text>
  <text x="220" y="356" font-family="Arial,sans-serif" font-size="30" fill="#555" text-anchor="middle">10</text>

  <!-- 今日マーク（強調）-->
  <circle cx="270" cy="344" r="22" fill="#4285f4"/>
  <text x="270" y="356" font-family="Arial,sans-serif" font-size="30" font-weight="bold" fill="white" text-anchor="middle">11</text>

  <text x="320" y="356" font-family="Arial,sans-serif" font-size="30" fill="#555" text-anchor="middle">12</text>
  <text x="370" y="356" font-family="Arial,sans-serif" font-size="30" fill="#555" text-anchor="middle">13</text>
  <text x="420" y="356" font-family="Arial,sans-serif" font-size="30" fill="#1565c0" text-anchor="middle">14</text>

  <!-- 日付 row3 -->
  <text x="120" y="406" font-family="Arial,sans-serif" font-size="30" fill="#e53935" text-anchor="middle">15</text>
  <text x="170" y="406" font-family="Arial,sans-serif" font-size="30" fill="#555" text-anchor="middle">16</text>
  <text x="220" y="406" font-family="Arial,sans-serif" font-size="30" fill="#555" text-anchor="middle">17</text>
  <text x="270" y="406" font-family="Arial,sans-serif" font-size="30" fill="#555" text-anchor="middle">18</text>
  <text x="320" y="406" font-family="Arial,sans-serif" font-size="30" fill="#555" text-anchor="middle">19</text>
  <text x="370" y="406" font-family="Arial,sans-serif" font-size="30" fill="#555" text-anchor="middle">20</text>
  <text x="420" y="406" font-family="Arial,sans-serif" font-size="30" fill="#1565c0" text-anchor="middle">21</text>
</svg>`

const svgBuf = Buffer.from(svg)

await sharp(svgBuf).resize(512, 512).png().toFile('public/icons/icon-512.png')
await sharp(svgBuf).resize(192, 192).png().toFile('public/icons/icon-192.png')

console.log('アイコン生成完了！')
