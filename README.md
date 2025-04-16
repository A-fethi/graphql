# GraphQL Dashboard

A modern, responsive dashboard for visualizing user XP data from the Zone01 Oujda platform. This dashboard allows users to log in, view their personal information, and explore their XP progression and distribution across projects using interactive charts.

---

## Features

- **User Authentication:** Secure login using JWT tokens.
- **User Information:** Displays user ID, login, email, audit ratio, and total XP.
- **XP Progression Chart:** Interactive line chart showing cumulative XP over time.
- **XP by Project Pie Chart:** pie chart visualizing XP distribution across projects.
- **Responsive Design:** Works seamlessly on desktop and mobile devices.
- **Tooltips:** Hover over chart elements to see detailed information.
- **Notifications:** Success and error messages for user actions.

---

## Getting Started

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/A-fethi/graphql
    cd graphql
    ```

2. **Serve the files locally:**
    - Simply open `index.html` directly in your browser.

---

## Usage

1. Open the dashboard in your browser.
2. Log in using your Zone01 Oujda credentials.
3. View your user information, XP progression, and XP by project.
4. Hover over chart elements for more details.
5. Click "Logout" to end your session.

---

## Project Structure
```
│
├── index.html                              # Main HTML file for the dashboard UI
├── README.md                               # Project documentation
├── static │   ├── main.js                  # Main JavaScript logic (auth, data fetching, UI)
│   ├── styles │
│   │      └── style.css │                  # CSS styles for layout and components    
│   └── components │
│       ├── linechart.js                    # Renders the XP progression line chart (SVG)
│       └── circlechart.js                  # Renders the XP by project pie chart (SVG)
        └── utils.js                        # Utility functions (color, formatting, notifications)
```
---

## Technical Details

- **Frontend:** Vanilla JavaScript, HTML5, CSS3 (no frameworks)
- **Charts:** Rendered using SVG for scalability and interactivity
- **Authentication:** JWT-based, stored in `localStorage`
- **Responsive Design:** CSS Grid and media queries

---

## Customization

- **Colors & Theme:** Easily changeable via CSS variables in `static/styles/style.css`.
- **API Endpoint:** Update the API URLs in `static/main.js` if needed.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)

---

## Acknowledgments

- [Zone01 Oujda](https://learn.zone01oujda.ma/) for the API and platform.
- [Google Fonts - Inter](https://fonts.google.com/specimen/Inter) for typography.
