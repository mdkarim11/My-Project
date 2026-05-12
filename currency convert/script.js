document.addEventListener('DOMContentLoaded', function() {
    const amountInput = document.getElementById('amount');
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const convertBtn = document.getElementById('convert-btn');
    const resultDiv = document.getElementById('result');

    let exchangeRates = {};

    // Currency information with flags and names
    const currencies = {
        USD: { flag: '🇺🇸', name: 'USD' },
        EUR: { flag: '🇪🇺', name: 'EUR' },
        GBP: { flag: '🇬🇧', name: 'GBP' },
        JPY: { flag: '🇯🇵', name: 'JPY' },
        CAD: { flag: '🇨🇦', name: 'CAD' },
        AUD: { flag: '🇦🇺', name: 'AUD' },
        CHF: { flag: '🇨🇭', name: 'CHF' },
        CNY: { flag: '🇨🇳', name: 'CNY' },
        INR: { flag: '🇮🇳', name: 'INR' }
    };

    // Fetch exchange rates from API
    async function fetchRates() {
        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await response.json();
            exchangeRates = data.rates;
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            resultDiv.textContent = 'Error loading exchange rates. Please try again later.';
        }
    }

    // Convert currency
    function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (isNaN(amount) || amount <= 0) {
            resultDiv.textContent = 'Please enter a valid amount.';
            return;
        }

        if (from === to) {
            resultDiv.textContent = `${currencies[from].flag} ${amount} ${from} = ${currencies[to].flag} ${amount} ${to}`;
            return;
        }

        // Convert to USD first, then to target currency
        const amountInUSD = amount / exchangeRates[from];
        const convertedAmount = amountInUSD * exchangeRates[to];

        resultDiv.textContent = `${currencies[from].flag} ${amount} ${from} = ${currencies[to].flag} ${convertedAmount.toFixed(2)} ${to}`;
    }

    // Event listeners
    convertBtn.addEventListener('click', convertCurrency);
    amountInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            convertCurrency();
        }
    });

    // Fetch rates on load
    fetchRates();
});