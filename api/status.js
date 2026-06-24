const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        const response = await axios.get('https://phoenixservicetool.com/', {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' }
        });

        const $ = cheerio.load(response.data);
        const results = [];

        $('.server-item').each((i, el) => {
            results.push({
                name: $(el).find('.service-name').text().trim(),
                status: $(el).find('.status-text').text().trim() 
            });
        });

        res.status(200).json({ success: true, data: results });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
