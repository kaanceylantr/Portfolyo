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
  },
  ach: {
    unlocked: 'Başarım kazanıldı',
    items: {
      explorer: 'Kâşif — kaydırmaya başladın',
      student: 'Hızlı Öğrenen — eğitimi bitirdin',
    },
  },
  soon: {
    title: 'Sıradaki seviye yükleniyor…',
    text: 'Sonraki bölümler hazırlanıyor. Yakında tekrar gel.',
  },
}
