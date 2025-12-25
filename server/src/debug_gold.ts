import axios from 'axios';

const API_KEY = '3b7cc43274f8fc75faa69bcac746bfd9';

async function testGoldHistory() {
    console.log('Testing MetalpriceAPi Timeframe endpoint...');

    // Calculate dates
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    const url = 'https://api.metalpriceapi.com/v1/timeframe';
    const params = {
        api_key: API_KEY,
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        base: 'USD',
        currencies: 'XAU'
    };

    console.log(`URL: ${url}`);
    console.log(`Params: ${JSON.stringify(params)}`);

    try {
        const response = await axios.get(url, { params });
        console.log('Success!');
        console.log('Status:', response.status);
        console.log('Data Preview:', JSON.stringify(response.data).substring(0, 200));
    } catch (error: any) {
        console.error('FAILED');
        if (axios.isAxiosError(error)) {
            console.error('Status:', error.response?.status);
            console.error('Status Text:', error.response?.statusText);
            console.error('Data:', JSON.stringify(error.response?.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

testGoldHistory();
