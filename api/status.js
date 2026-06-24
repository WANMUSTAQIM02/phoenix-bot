const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    // 1. Benarkan akses dari website bos (CORS Bypass)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Jika pelayan (browser) cuba periksa sambungan, benarkan terus
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // 2. Akses halaman Phoenix dengan menyamar sebagai Chrome biasa
        const response = await axios.get('https://phoenixservicetool.com/', {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
            }
        });

        // 3. Muat HTML untuk dikaji menggunakan Cheerio
        const $ = cheerio.load(response.data);
        const results = [];

        // 4. Cari elemen status di dalam HTML
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

        // 5. Hantar balik data JSON ke website bos
        res.status(200).json({ success: true, data: results });

    } catch (error) {
        // Jika gagal ditarik atau dihalang Cloudflare
        res.status(500).json({ success: false, error: error.message });
    }
};
