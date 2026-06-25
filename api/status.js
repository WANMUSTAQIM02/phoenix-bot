const axios = require('axios');

module.exports = async (req, res) => {
    // Membenarkan website WAN TECH untuk mengambil data (CORS Bypass)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

    // Jika pelayan membuat pre-flight check, benarkan terus
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Tarik data terus dari API sebenar Phoenix
        const response = await axios.get('https://phoenixservicetool.com/api/v1/status', {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://phoenixservicetool.com/',
                'X-Requested-With': 'XMLHttpRequest', // Paling penting untuk elak data kosong []
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin'
            }
        });

        // Hantar balik data JSON yang bersih ke website WAN TECH bos
        res.status(200).json({ 
            success: true, 
            data: response.data 
        });

    } catch (error) {
        // Hantar mesej ralat jika gagal ditarik
        res.status(500).json({ 
            success: false, 
            error: "Gagal tarik API: " + error.message 
        });
    }
};
