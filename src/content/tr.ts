import type { Dict } from './types'

export const tr: Dict = {
  nav: { chapter: 'Bölüm', sound: 'Ses' },
  hero: {
    role: 'Oyun Tasarımcısı & Bilgisayar Mühendisi',
    tagline: 'Bulmacaları, ekonomiyi ve oyun hissini tasarlarım — sonra da kodlarım.',
    scroll: 'Oynamak için kaydır',
  },
  about: {
    title: 'Eğitim',
    stepLabel: 'Adım',
    steps: [
      {
        k: 'Kim',
        t: 'Mühendis aklı, tasarımcı kalbi.',
        d: 'Ticari mobil oyunlar, sistem tasarımı ve algoritmik oyun mekanikleri alanında uçtan uca üretim tecrübesi olan Bilgisayar Mühendisi ve Oyun Tasarımcısıyım.',
      },
      {
        k: 'Yaptı',
        t: 'Sıfırdan Google Play’e tek bir oyun.',
        d: 'Prime Path, tek başıma geliştirdiğim mobil bulmaca oyunum: üretim GDD’si, her seviyenin çözülebilirliğini garanti eden çözücü ve hibrit ekonomi. Şu an canlı playtest’te.',
      },
      {
        k: 'Zanaat',
        t: 'Tempo, denge ve bilişsel tuzaklar.',
        d: 'Seviye temposu, savaş dengesi, eğitim müfredatı ve dokunsal geri bildirim: bir oyunu doğru hissettiren görünmez şeyler.',
      },
      {
        k: 'Stüdyo',
        t: 'Gnarly Game Studio.',
        d: 'Seviye tasarımı, boss mekaniği önerileri, rakip araştırması, playable reklam analizi ve canlı bir cover-shooter’da denge çalışması.',
      },
      {
        k: 'Veri',
        t: 'Oyuncuyu dinleyen tasarım.',
        d: 'Seviye hunisi telemetrisi, kayıp noktası takibi ve Remote Config ile ayar: kararlar oyuncuların gerçekte yaptığından gelir.',
      },
    ],
  },
  chapters: {
    hero: 'Açılış',
    about: 'Eğitim',
    prime: 'Prime Path',
  },
  ach: {
    unlocked: 'Başarım kazanıldı',
    items: {
      explorer: 'Kâşif — kaydırmaya başladın',
      student: 'Hızlı Öğrenen — eğitimi bitirdin',
      solver: 'Bulmaca Çözücü — bir Prime Path seviyesini çözdün',
    },
  },
  prime: {
    title: 'Prime Path',
    sub: 'Matematiksel bir mantık bulmacası: tasarladım, geliştirdim ve tek başıma yayına aldım.',
    chip: 'Google Play’de canlı · playtest',
    facts: [
      { n: '290', l: 'satırlık üretim GDD’si' },
      { n: '2×2 → 5×5', l: 'tahtalar, her seviye kanıtlanmış çözülebilir' },
      { n: '1–10', l: 'otomatik zorluk puanı' },
      { n: '13', l: 'aşamalı eğitim müfredatı' },
    ],
    trapsTitle: 'Bilişsel tuzaklar',
    traps: [
      { t: 'Çatal / açgözlülük', d: 'Cazip görünen ama çıkmaza giden yol.' },
      { t: 'Kapalı geçit', d: 'Görüp de geçemediğin hücreler.' },
      { t: 'Ayna', d: 'Cevap hakkında yalan söyleyen simetri.' },
      { t: 'Merkez çekişmesi', d: 'Bütün yollar aynı hücreyi ister.' },
    ],
    shotsTitle: 'Mağazadan',
    shotSoon: 'Ekran görüntüsü yeri',
    stack: 'React 19 · TypeScript · Capacitor · Supabase · Firebase',
  },
  demo: {
    title: 'Dene',
    level: 'Seviye',
    rule: 'Komşu bir hücreye geç. Arasından geçtiğin iki sayının toplamı asal olmalı. Hedefe ulaş.',
    start: 'başla',
    goal: 'hedef',
    idle: 'Komşu bir hücreye dokun. Geri almak için son hücreye tekrar dokun, ceza yok.',
    win: 'Çözdün! Tek yol buydu, çözücü doğruladı.',
    stuck: 'Çıkmaz sokak. Geri Al’a bas, eğitimde ceza yok.',
    undo: 'Geri Al',
    reset: 'Sıfırla',
    solver: 'Çözücüyü göster',
    errors: {
      blocked: 'Bu hücre kapalı.',
      visited: 'Bu hücreden zaten geçtin.',
      far: 'Sadece komşu hücreler.',
      sum: 'Bu iki sayının toplamı asal değil.',
    },
    stats: (s, d, n, df) =>
      `Çözücü: ${s} çözüm · ${d} çıkmaz · ${n} durum tarandı · zorluk ${df}/10`,
  },
  soon: {
    title: 'Sıradaki seviye yükleniyor…',
    text: 'Sonraki bölümler hazırlanıyor. Yakında tekrar gel.',
  },
}
