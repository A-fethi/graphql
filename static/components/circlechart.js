import { getExtension } from "./utils.js"

const getColor = () => {
    let value = "#"
    const hex = "0123456789ABCDEF"
    for (let i = 0; i < 6; i++) {
        value += hex[Math.floor(Math.random(i) * hex.length)]
    }
    return value
}

// export const circleChart = (projects) => {
//     const svg = document.getElementById("xpPieChart");
//         const totalXP = projects.reduce((sum, p) => sum + p.amount, 0);
//         console.log(totalXP);
//         console.log(Math.PI);

//         let startAngle = 0;

//         projects.forEach((project) => {
//             const sliceAngle = (project.amount / totalXP) * 2 * Math.PI;
//             console.log(project.amount);

//             const x1 = 100 * Math.cos(startAngle);
//             const y1 = 100 * Math.sin(startAngle);
//             const x2 = 100 * Math.cos(startAngle + sliceAngle);
//             const y2 = 100 * Math.sin(startAngle + sliceAngle);
//             const largeArc = sliceAngle > Math.PI ? 1 : 0;

//             const pathData = `M0,0 L${x1},${y1} A100,100 0 ${largeArc},1 ${x2},${y2} Z`;
//             const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
//             path.setAttribute("d", pathData);
//             path.setAttribute("fill", getColor());

//             const percentage = ((project.amount / totalXP) * 100).toFixed(1);

//             path.addEventListener("mouseover", (e) => {
//                 const tooltip = document.getElementById("tooltip");
//                 tooltip.innerHTML = `
//                 <strong>Project:</strong> ${project.path.split('/').pop()}<br>
//                 <strong>XP:</strong> ${getExtension(project.amount)}<br>
//                 <strong>Percentage:</strong> ${percentage}%
//                 `;
//                 tooltip.style.display = "block";
//                 tooltip.style.left = `${e.pageX + 10}px`;
//                 tooltip.style.top = `${e.pageY + 10}px`;
//             });

//             path.addEventListener("mouseout", () => {
//                 document.getElementById("tooltip").style.display = "none";
//             });

//             svg.appendChild(path);
//             startAngle += sliceAngle;
//         });
// }

export const circleChart = (projects) => {
    const svg = document.getElementById("xpPieChart");
    const totalXP = projects.reduce((sum, p) => sum + p.amount, 0);
    let offset = 0;

    projects.forEach((project) => {
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

        circle.addEventListener("mouseover", (e) => {
            const tooltip = document.getElementById("tooltip");
            tooltip.innerHTML = `
                <strong>Project:</strong> ${project.path.split('/').pop()}<br>
                <strong>XP:</strong> ${getExtension(project.amount)}<br>
                <strong>Percentage:</strong> ${(percentage*100).toFixed(2)}%
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
