# Kshetram Cricket Academy ERP – Dashboard UI

Flask + Jinja + vanilla JS. Runs on sample data held in the browser (a refresh resets it).

## Run in VS Code

1. Open this folder in VS Code (File > Open Folder).
2. Open the terminal (Ctrl+`) and create a virtual environment:
   - Windows: `python -m venv .venv` then `.venv\Scripts\activate`
   - macOS/Linux: `python3 -m venv .venv` then `source .venv/bin/activate`
3. Install Flask: `pip install -r requirements.txt`
4. Start the app: `python app.py`
5. Open http://127.0.0.1:5000

## Files

- `app.py` – Flask app, one route that renders the dashboard
- `templates/index.html` – page layout (header, sidebar, dialog)
- `static/css/style.css` – all styling (cricket-green theme, light/dark, responsive)
- `static/js/app.js` – screens, sample data, charts, forms, receipts

## Using it in KshetramCA_ERP

Copy `static/css/style.css` and `static/js/app.js` into your project's `static/` folder and the markup from `templates/index.html` into a Jinja template. Replace the sample data at the top of `app.js` with data from your routes.
