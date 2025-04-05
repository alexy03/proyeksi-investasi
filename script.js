// script.js
function formatRupiah(element) {
    let value = element.value.replace(/[^0-9]/g, '');
    element.value = new Intl.NumberFormat("id-ID").format(value);
}

function calculateProjection() {
    let amount = parseFloat(document.getElementById("amount").value.replace(/\./g, ""));
    let monthly = parseFloat(document.getElementById("monthly").value.replace(/\./g, ""));
    let rate = parseFloat(document.getElementById("rate").value) / 100;
    let inflation = parseFloat(document.getElementById("inflation").value) / 100;
    let years = parseInt(document.getElementById("years").value);

    let labels = [], normal = [], invest = [];
    let noInvest = amount, withInvest = amount;

    for (let i = 0; i <= years; i++) {
        labels.push(i + " Tahun");
        normal.push(noInvest);
        invest.push(withInvest);

        for (let j = 0; j < 12; j++) {
            noInvest += monthly;
            noInvest -= noInvest * (inflation / 12);
            withInvest += withInvest * (rate / 12 - inflation / 12) + monthly;
        }
    }

    let totalNormal = normal[years].toFixed(0);
    let totalInvest = invest[years].toFixed(0);
    let selisih = (totalInvest - totalNormal).toFixed(0);

    document.getElementById("summary").innerHTML = `
        <p>Total Tabungan Normal: Rp ${new Intl.NumberFormat("id-ID").format(totalNormal)}</p>
        <p>Total Investasi: Rp ${new Intl.NumberFormat("id-ID").format(totalInvest)}</p>
        <p>Selisih Keuntungan: <span class="bold">Rp ${new Intl.NumberFormat("id-ID").format(selisih)}</span></p>
    `;

    let ctx = document.getElementById("investmentChart").getContext("2d");
    if (window.investmentChart instanceof Chart) {
        window.investmentChart.destroy();
    }
    window.investmentChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Normal (Tanpa Investasi)",
                    data: normal,
                    borderColor: "#dc3545",
                    fill: true,
                    backgroundColor: "rgba(220, 53, 69, 0.2)"
                },
                {
                    label: "Berinvestasi",
                    data: invest,
                    borderColor: "#007BFF",
                    fill: true,
                    backgroundColor: "rgba(0, 123, 255, 0.2)"
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    ticks: {
                        callback: value => "Rp " + value.toLocaleString("id-ID")
                    }
                }
            }
        }
    });
}

