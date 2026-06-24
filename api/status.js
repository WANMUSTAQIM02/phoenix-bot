const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // API Key ScraperAPI bos
    const API_KEY = '22ee181cf8792b5fbf9c95433d76d364'; 

    try {
        // Kita hantar request melalui ScraperAPI supaya Cloudflare tak detect
        const url = `http://api.scraperapi.com?api_key=${API_KEY}&url=https://phoenixservicetool.com/`;
        const response = await axios.get(url);

        const $ = cheerio.load(response.data);
        const results = [];

        // Phoenix mungkin gunakan class .server-item atau id lain
        // Jika data kosong, saya akan tunjukkan cara tukar class selepas ini
        $('.server-item').each((i, el) => {
            results.push({
                name: $(el).find('.service-name').text().trim(),
                status: $(el).find('.status-text').text().trim()
            });
        });

        res.status(200).json({ success: true, data: results });

    } catch (error) {
        res.status(500).json({ success: false, error: "ScraperAPI gagal: " + error.message });
    }
};
