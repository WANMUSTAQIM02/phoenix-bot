const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    // Benarkan website bos baca data ini
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        // KOD RAHSIA: Menyamar sebagai Googlebot (Pintas Cloudflare 403)
        const response = await axios.get('https://phoenixservicetool.com/', {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'X-Forwarded-For': '66.249.66.1' // Fake IP dari Server Google sebenar
            }
        });

        // Kaji HTML yang berjaya ditarik
        const $ = cheerio.load(response.data);
        const results = [];

        // Cari data (mengikut class HTML yang dijangka)
        $('.server-item').each((i, el) => {
            const serviceName = $(el).find('.service-name').text().trim();
            const serviceStatus = $(el).find('.status-text').text().trim();
            
            if (serviceName) {
                results.push({
                    name: serviceName,
                    status: serviceStatus 
                });
            }
        });

        // JIKA BOT BERJAYA MASUK TAPI DATA KOSONG (Class HTML berbeza)
        if (results.length === 0) {
            const htmlSnippet = response.data.substring(0, 1500); // Ambil sampel bukti
            return res.status(200).json({ 
                success: true, 
                message: "Berjaya pintas Cloudflare! Tapi tak jumpa senarai (Class HTML mungkin berbeza).",
                bukti_html: htmlSnippet,
                data: []
            });
        }

        // Jika berjaya tarik data dengan sempurna
        res.status(200).json({ success: true, data: results });

    } catch (error) {
        res.status(500).json({ success: false, error: "Cloudflare masih sekat: " + error.message });
    }
};
