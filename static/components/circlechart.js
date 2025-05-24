import { getExtension, getColor } from "./utils.js"


export const circleChart = (projects) => {
    const svg = document.getElementById("xpPieChart");
    const projectSums = {};
    projects.forEach(project => {
        const name = project.path.split('/').pop();
        projectSums[name] = (projectSums[name] || 0) + project.amount;
    });

    const filteredProjects = Object.entries(projectSums)
        .filter(([name, amount]) => amount > 0)
        .map(([name, amount]) => ({
            name,
            amount
        }));

    const totalXP = filteredProjects.reduce((sum, p) => sum + p.amount, 0);
    let offset = 0;

    filteredProjects.forEach((project) => {
        const percentage = project.amount / totalXP;
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        circle.setAttribute("r", "100");
        circle.setAttribute("cx", "0");
        circle.setAttribute("cy", "0");
        circle.setAttribute("fill", "transparent");
        circle.setAttribute("stroke", getColor());
        circle.setAttribute("stroke-width", "100");
        circle.setAttribute("stroke-dasharray", `${percentage * 628} 628`);
        circle.setAttribute("stroke-dashoffset", offset);

        circle.addEventListener("mousemove", (e) => {
            const tooltip = document.getElementById("tooltip");
            tooltip.innerHTML = `
                <strong>Project:</strong> ${project.name}<br>
                <strong>XP:</strong> ${getExtension(project.amount)}<br>
                <strong>Percentage:</strong> ${(percentage * 100).toFixed(2)}%
            `;
            tooltip.style.display = "block";
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        });

        circle.addEventListener("mouseout", () => {
            document.getElementById("tooltip").style.display = "none";
        });

        svg.appendChild(circle);
        offset -= percentage * 628;
    });
};
