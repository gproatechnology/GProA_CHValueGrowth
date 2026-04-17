"""
Utilities para exportar datos - CHValueGrowth
Soporte para PDF y Excel.
"""

import json
from datetime import datetime


def export_to_json(data, filename=None):
    """Exporta datos a JSON."""
    if filename is None:
        filename = f"export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2, default=str)
    
    return filename


def export_to_csv(data, filename=None, headers=None):
    """Exporta datos a CSV."""
    if not data:
        return None
    
    if filename is None:
        filename = f"export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    
    # Obtener encabezados si no se proveen
    if headers is None:
        if isinstance(data[0], dict):
            headers = list(data[0].keys())
        else:
            return None
    
    with open(filename, 'w', encoding='utf-8') as f:
        # Escribir encabezados
        f.write(','.join(headers) + '\n')
        
        # Escribir datos
        for row in data:
            if isinstance(row, dict):
                values = [str(row.get(h, '')) for h in headers]
            else:
                values = [str(v) for v in row]
            f.write(','.join(values) + '\n')
    
    return filename


def generate_simple_html_report(data, title="Reporte"):
    """Genera un reporte HTML simple que puede imprimirse a PDF."""
    html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{title}</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; }}
        h1 {{ color: #1E90FF; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
        th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
        th {{ background-color: #1E90FF; color: white; }}
        .footer {{ margin-top: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <h1>{title}</h1>
    <p>Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
    <table>
        <thead>
            <tr>
                {''.join(f'<th>{h}</th>' for h in data[0].keys())}
            </tr>
        </thead>
        <tbody>
            {''.join(f'<tr>{"".join(f"<td>{v}</td>" for v in row.values())}</tr>' for row in data)}
        </tbody>
    </table>
    <div class="footer">Generado por NeumatiQ - CHValueGrowth</div>
    <script>window.print()</script>
</body>
</html>
"""
    return html


class DataExporter:
    """Clase para exportar datos en multiple."""
    
    def __init__(self, data):
        self.data = data
    
    def to_json(self, filename=None):
        return export_to_json(self.data, filename)
    
    def to_csv(self, filename=None):
        return export_to_csv(self.data, filename)
    
    def to_html_report(self, filename=None):
        if filename is None:
            filename = f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
        
        html = generate_simple_html_report(self.data, "Reporte NeumatiQ")
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html)
        
        return filename
    
    def all_formats(self):
        """Exporta en todos los formatos."""
        files = []
        files.append(self.to_json())
        files.append(self.to_csv())
        files.append(self.to_html_report())
        return files