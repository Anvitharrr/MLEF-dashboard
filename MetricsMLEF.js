// JavaScript for the Business Units Weekly Metrics Dashboard

document.addEventListener("DOMContentLoaded", () => {
    const metricDropdown = document.getElementById("metric");
    const tableBody = document.getElementById("tableBody");
    const ssiContent = document.getElementById("ssiContent");
    const metricsChart = document.getElementById("metricsChart").getContext("2d");
    let activeMetric = metricDropdown.value;
    
    // Sample data (replace with actual data later)
    const data = {
        Mobile: { CTU: [60, 70, 65], RR: [150, 140, 130] },
        "Large Appliances": { CTU: [45, 55, 50], RR: [120, 110, 105] },
        "Emerging Electronics": { CTU: [30, 35, 32], RR: [90, 85, 80] },
        "Core Electronics": { CTU: [20, 25, 23], RR: [80, 75, 70] },
        Furniture: { CTU: [10, 15, 12], RR: [60, 55, 50] }
    };

    // Populate table
    function populateTable() {
        tableBody.innerHTML = "";
        for (const [bu, metrics] of Object.entries(data)) {
            metrics[activeMetric].forEach((value, index) => {
                tableBody.innerHTML += `
                    <tr>
                        <td class="border px-4 py-2">${bu}</td>
                        <td class="border px-4 py-2">May</td>
                        <td class="border px-4 py-2">Week ${index + 1}</td>
                        <td class="border px-4 py-2">${activeMetric}</td>
                        <td class="border px-4 py-2">${value}</td>
                    </tr>
                `;
            });
        }
    }

    // Initialize chart
    let chart = new Chart(metricsChart, {
        type: "line",
        data: {
            labels: ["Week 1", "Week 2", "Week 3"],
            datasets: []
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // Populate chart
    function populateChart() {
        const datasets = Object.keys(data).map(bu => ({
            label: bu,
            data: data[bu][activeMetric],
            borderColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
            fill: false
        }));
        chart.data.datasets = datasets;
        chart.update();
    }

    // Populate SSI view (only for CTU and RR)
    function populateSSIView() {
        ssiContent.innerHTML = "";
        if (activeMetric === "CTU" || activeMetric === "RR") {
            for (const [bu, metrics] of Object.entries(data)) {
                const totalResponses = metrics[activeMetric].reduce((a, b) => a + b, 0);
                const metricTotal = metrics[activeMetric][0]; // taking first week as example
                const remainder = totalResponses - metricTotal;
                const breakdown = `
                    <div class="mb-4">
                        <h3 class="font-semibold">${bu}</h3>
                        <p>Metric Total: ${metricTotal}</p>
                        <p>Remaining Responses: ${remainder}</p>
                        <ul>
                            <li>Return Requested: ${remainder * 0.83} (83%)</li>
                            <li>Cancel Return: ${remainder * 0.17} (17%)</li>
                            <li>Total Responses: ${totalResponses}</li>
                        </ul>
                    </div>
                `;
                ssiContent.innerHTML += breakdown;
            }
        } else {
            ssiContent.innerHTML = "<p class='text-gray-500'>SSI view is only available for CTU and RR.</p>";
        }
    }

    // Event listeners
    metricDropdown.addEventListener("change", () => {
        activeMetric = metricDropdown.value;
        populateTable();
        populateChart();
        populateSSIView();
    });

    // Initial population
    populateTable();
    populateChart();
    populateSSIView();
});

// Page switching
function showPage(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(page).classList.add("active");
}
