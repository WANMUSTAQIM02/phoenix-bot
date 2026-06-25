const axios = require('axios');

module.exports = async (req, res) => {
    // Membenarkan website WAN TECH untuk mengambil data (CORS)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Tarik data terus dari API sebenar Phoenix
        // Axios akan secara automatik melakukan 'decompress' data Gzip
        const response = await axios.get('https://phoenixservicetool.com/api/v1/status', {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Referer': 'https://phoenixservicetool.com/'
            }
        });

        // Hantar balik data JSON yang bersih ke website WAN TECH bos
        res.status(200).json({ 
            success: true, 
            data: response.data 
        });

    } catch (error) {
        // Hantar mesej ralat jika gagal
        res.status(500).json({ 
            success: false, 
            error: "Gagal tarik API: " + error.message 
        });
    }
};
