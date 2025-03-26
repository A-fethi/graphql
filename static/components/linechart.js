export const lineChart = (data) => {
    if (!data || data.length === 0) {
        console.error("No data available for the chart");
        return;
    }
    let cumulativeXP = 0;
        const dataWithCumulativeXP = data.map(item => {
            cumulativeXP += item.amount;
            return {
                ...item,
                totalXP: cumulativeXP
            };
        });

        const svg = document.getElementById("xpGraph");
        const tooltip = document.getElementById("tooltip");
        const width = 800, height = 400, margin = 50;
        const maxXP = dataWithCumulativeXP[dataWithCumulativeXP.length - 1].totalXP;

        const minDate = new Date(dataWithCumulativeXP[0].createdAt).getTime();
        const maxDate = new Date(dataWithCumulativeXP[dataWithCumulativeXP.length - 1].createdAt).getTime();

        function scaleX(timestamp) {
            return margin + ((timestamp - minDate) / (maxDate - minDate)) * (width - 2 * margin);
        }

        function scaleY(xp) {
            return height - margin - (xp / maxXP) * (height - 2 * margin);
        }

        let path = `M${scaleX(new Date(dataWithCumulativeXP[0].createdAt).getTime())},${scaleY(dataWithCumulativeXP[0].totalXP)} `;
        for (let i = 1; i < dataWithCumulativeXP.length; i++) {
            let x = scaleX(new Date(dataWithCumulativeXP[i].createdAt).getTime());
            let y = scaleY(dataWithCumulativeXP[i].totalXP);
            path += `L${x},${y} `;
        }

        const progPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        progPath.setAttribute("d", path);
        progPath.setAttribute("stroke", "purple");
        progPath.setAttribute("fill", "none");
        progPath.setAttribute("stroke-width", "2");
        svg.appendChild(progPath);

        dataWithCumulativeXP.forEach((d, i) => {
            let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            const timestamp = new Date(d.createdAt).getTime();
            circle.setAttribute("cx", scaleX(timestamp));
            circle.setAttribute("cy", scaleY(d.totalXP));
            circle.setAttribute("r", "2");
            circle.setAttribute("fill", "white");
            circle.style.cursor = "pointer";

            circle.addEventListener("mouseover", (e) => {
                tooltip.innerHTML = `
                    <strong>Module:</strong> ${d.path.split('/').pop()}<br>
                    <strong>Date:</strong> ${new Date(d.createdAt).toLocaleDateString()}<br>
                    <strong>XP Earned:</strong> ${d.amount}<br>
                    <strong>Total XP:</strong> ${d.totalXP}
                `;
                tooltip.style.display = "block";
                tooltip.style.left = `${e.pageX + 10}px`;
                tooltip.style.top = `${e.pageY + 10}px`;
            });

            circle.addEventListener("mouseout", () => {
                tooltip.style.display = "none";
            });

            svg.appendChild(circle);
        });
}