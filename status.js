const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    // 1. Buka pintu (CORS) supaya website WAN TECH bos boleh baca data ini
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Boleh tukar '*' ke domain website bos nanti untuk lebih selamat
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // 2. Bot menyamar sebagai manusia dan masuk ke website Phoenix
        const response = await axios.get('https://phoenixservicetool.com/#server-status', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });

        // 3. Bot kaji kod HTML Phoenix
        const html = response.data;
        const $ = cheerio.load(html);

        // NOTA: Buat masa ni, bot akan hantar separuh daripada kod HTML mereka
        // supaya saya (Gemini) boleh kaji nama Class sebenar mereka nanti.
        const snippet = html.substring(0, 1000); 

        // 4. Hantar laporan balik ke website bos
        res.status(200).json({ 
            success: true, 
            message: "Bot berjaya tembus Phoenix!",
            html_sample: snippet
        });

    } catch (error) {
        // Jika Cloudflare sekat, kita akan tahu
        res.status(500).json({ 
            success: false, 
            message: "Gagal melepasi Phoenix",
            error: error.message 
        });
    }
};