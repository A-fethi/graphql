import { getColor } from "./utils.js";
import { getExtension } from "./utils.js";

export const circleChart = (projects) => {
    if (!projects || projects.length === 0) {
        console.error("No project data available for the pie chart");
        return;
    }

    const svg = document.getElementById("xpPieChart");
    if (!svg) {
        console.error("SVG element with id 'xpPieChart' not found");
        return;
    }
    svg.innerHTML = "";
    const totalXP = projects.reduce((sum, p) => sum + p.amount, 0);
    let startAngle = 0;

    projects.forEach((project, i) => {
        const sliceAngle = (project.amount / totalXP) * 2 * Math.PI;
        const x1 = 100 * Math.cos(startAngle);
        const y1 = 100 * Math.sin(startAngle);
        const x2 = 100 * Math.cos(startAngle + sliceAngle);
        const y2 = 100 * Math.sin(startAngle + sliceAngle);
        const largeArc = sliceAngle > Math.PI ? 1 : 0;

        const pathData = `M0,0 L${x1},${y1} A100,100 0 ${largeArc},1 ${x2},${y2} Z`;
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("fill", getColor());

        const percentage = ((project.amount / totalXP) * 100).toFixed(1);

        path.addEventListener("mouseover", (e) => {
            const tooltip = document.getElementById("tooltip");
            tooltip.innerHTML = `
                <strong>Project:</strong> ${project.path.split('/').pop()}<br>
                <strong>XP:</strong> ${getExtension(project.amount)}<br>
                <strong>Percentage:</strong> ${percentage}%
                `;
            tooltip.style.display = "block";
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });

        path.addEventListener("mouseout", () => {
            document.getElementById("tooltip").style.display = "none";
        });

        svg.appendChild(path);
        startAngle += sliceAngle;
    });
}