document.getElementById('calculateBtn').addEventListener('click', function() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const setupFee = parseFloat(document.getElementById('setupFee').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;

    const totalLoanAmount = loanAmount + setupFee;

    const loanTerm10Years = 10 * 12;
    const monthlyPayment10 = Math.round((totalLoanAmount * interestRate / 12) / (1 - Math.pow(1 + interestRate / 12, -loanTerm10Years)));
    const annualPayment10 = monthlyPayment10 * 12;

    const loanTerm20Years = 20 * 12;
    const monthlyPayment20 = Math.round((totalLoanAmount * interestRate / 12) / (1 - Math.pow(1 + interestRate / 12, -loanTerm20Years)));
    const annualPayment20 = monthlyPayment20 * 12;

    const reserveThreeYears10 = annualPayment10 * 3;
    const availableAmount10 = loanAmount - reserveThreeYears10;

    const reserveThreeYears20 = annualPayment20 * 3;
    const availableAmount20 = loanAmount - reserveThreeYears20;

    // 計算利息支出
    const interestExpense10 = (loanAmount * interestRate * 3);
    const totalRepayment10 = loanAmount + interestExpense10;

    const interestExpense20 = (loanAmount * interestRate * 3);
    const totalRepayment20 = loanAmount + interestExpense20;

    const formatCurrency = (amount) => amount.toLocaleString('en-US');

    document.getElementById('result10').innerHTML = `
        <h3>10 年期限</h3>
        每月還款：${formatCurrency(monthlyPayment10)}元<br>
        每年還款：${formatCurrency(annualPayment10)}元<br>
        預留三年款：${formatCurrency(reserveThreeYears10)}元<br>
        可用金額：${formatCurrency(availableAmount10)}元<br>
        總還款+利息：${formatCurrency(totalRepayment10)}元
    `;

    document.getElementById('result20').innerHTML = `
        <h3>20 年期限</h3>
        每月還款：${formatCurrency(monthlyPayment20)}元<br>
        每年還款：${formatCurrency(annualPayment20)}元<br>
        預留三年款：${formatCurrency(reserveThreeYears20)}元<br>
        可用金額：${formatCurrency(availableAmount20)}元<br>
        總還款+利息：${formatCurrency(totalRepayment20)}元
    `;
});

// ETF 計算
document.getElementById('calculateEtfBtn').addEventListener('click', function() {
    const etfPrice = parseFloat(document.getElementById('etfPrice').value);
    const etfDividend = parseFloat(document.getElementById('etfDividend').value);

    if (etfPrice <= 0 || etfDividend < 0) {
        document.getElementById('etfResult').innerHTML = '請輸入有效的價格和配息。';
        return;
    }

    const availableAmount10 = parseFloat(document.getElementById('result10').innerText.match(/可用金額：([\d,]+)/)[1].replace(/,/g, ''));
    const availableAmount20 = parseFloat(document.getElementById('result20').innerText.match(/可用金額：([\d,]+)/)[1].replace(/,/g, ''));

    const etfShares10 = Math.floor(availableAmount10 / etfPrice);
    const etfShares20 = Math.floor(availableAmount20 / etfPrice);

    const monthlyDividend10 = Math.floor(etfDividend * etfShares10);
    const annualDividend10 = monthlyDividend10 * 12;

    const monthlyDividend20 = Math.floor(etfDividend * etfShares20);
    const annualDividend20 = monthlyDividend20 * 12;

    const formatCurrency = (amount) => amount.toLocaleString('en-US');

    // 每月可購買股數的計算
    let monthlyShares10 = [];
    let monthlyMarketValue10 = [];
    let netProfit10 = [];
    let monthlyShares20 = [];
    let monthlyMarketValue20 = [];
    let netProfit20 = [];
    
    for (let month = 0; month < 36; month++) {  // 更新為 36 個月
        if (month === 0) {
            monthlyShares10.push(etfShares10);
            monthlyMarketValue10.push(Math.round(etfShares10 * etfPrice));
            netProfit10.push(monthlyMarketValue10[month] - availableAmount10);
            monthlyShares20.push(etfShares20);
            monthlyMarketValue20.push(Math.round(etfShares20 * etfPrice));
            netProfit20.push(monthlyMarketValue20[month] - availableAmount20);
        } else {
            const additionalShares10 = Math.floor(monthlyDividend10 / etfPrice);
            const additionalShares20 = Math.floor(monthlyDividend20 / etfPrice);
            
            monthlyShares10.push(monthlyShares10[month - 1] + additionalShares10);
            monthlyMarketValue10.push(Math.round(monthlyShares10[month] * etfPrice));
            netProfit10.push(monthlyMarketValue10[month] - availableAmount10);
            monthlyShares20.push(monthlyShares20[month - 1] + additionalShares20);
            monthlyMarketValue20.push(Math.round(monthlyShares20[month] * etfPrice));
            netProfit20.push(monthlyMarketValue20[month] - availableAmount20);
        }
    }

    // 顯示 ETF 計算結果
    let monthlyShareDisplay10 = '<table><tr><th>月份</th><th>目前股數</th><th>目前市價</th><th>淨利</th></tr>';
    let monthlyShareDisplay20 = '<table><tr><th>月份</th><th>目前股數</th><th>目前市價</th><th>淨利</th></tr>';
    
    for (let month = 0; month < 36; month++) {  // 更新為 36 個月
        monthlyShareDisplay10 += `<tr><td>${month + 1}月</td><td>${monthlyShares10[month]}</td><td>${formatCurrency(monthlyMarketValue10[month])}元</td><td>${formatCurrency(netProfit10[month])}元</td></tr>`;
        monthlyShareDisplay20 += `<tr><td>${month + 1}月</td><td>${monthlyShares20[month]}</td><td>${formatCurrency(monthlyMarketValue20[month])}元</td><td>${formatCurrency(netProfit20[month])}元</td></tr>`;
    }
    
    monthlyShareDisplay10 += '</table>';
    monthlyShareDisplay20 += '</table>';

    document.getElementById('etfResult').innerHTML = `
        <div style="display: flex; justify-content: space-between;">
            <div>
                <h3>10 年期限</h3>
                可購買股數：${etfShares10}<br>
                每月配息總額：${formatCurrency(monthlyDividend10)}元<br>
                每年配息總額：${formatCurrency(annualDividend10)}元<br>
                <h4>每月可購買股數：</h4>
                ${monthlyShareDisplay10}
            </div>
            <div>
                <h3>20 年期限</h3>
                可購買股數：${etfShares20}<br>
                每月配息總額：${formatCurrency(monthlyDividend20)}元<br>
                每年配息總額：${formatCurrency(annualDividend20)}元<br>
                <h4>每月可購買股數：</h4>
                ${monthlyShareDisplay20}
            </div>
        </div>
    `;
});
